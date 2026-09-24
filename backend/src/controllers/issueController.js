import { Issue } from '../models/Issue.js';
import { User } from '../models/User.js';
import { Notification } from '../models/Notification.js';

// @desc    Get all issues (supports search, filter by status, category, priority, department)
// @route   GET /api/issues
// @access  Public / Protected
export const getIssues = async (req, res, next) => {
  try {
    const { status, category, priority, department, search, assignedTo, limit = 50, page = 1 } = req.query;

    const query = {};

    if (status && status !== 'All') {
      query.status = status;
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    if (priority && priority !== 'All') {
      query.priority = priority;
    }

    if (department && department !== 'All') {
      query.department = department;
    }

    if (assignedTo) {
      query.assignedTo = assignedTo;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { issueId: { $regex: search, $options: 'i' } },
      ];
    }

    const pageSize = Number(limit);
    const currentPage = Number(page);
    const skip = (currentPage - 1) * pageSize;

    const total = await Issue.countDocuments(query);
    const issues = await Issue.find(query)
      .populate('reportedBy', 'name email')
      .populate('assignedTo', 'name email department')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize);

    res.json({
      success: true,
      count: issues.length,
      total,
      page: currentPage,
      pages: Math.ceil(total / pageSize),
      data: issues,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get issues reported by logged-in citizen
// @route   GET /api/issues/my
// @access  Private
export const getMyIssues = async (req, res, next) => {
  try {
    const issues = await Issue.find({ reportedBy: req.user._id })
      .populate('assignedTo', 'name department')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: issues.length,
      data: issues,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get issues assigned to logged-in officer
// @route   GET /api/issues/assigned
// @access  Private (Officer/Admin)
export const getAssignedIssues = async (req, res, next) => {
  try {
    let query = {};
    if (req.user.role === 'officer') {
      query = {
        $or: [
          { assignedTo: req.user._id },
          { assignedTo: null, department: req.user.department },
          { assignedToName: 'Unassigned' },
        ],
      };
    }

    const issues = await Issue.find(query)
      .populate('reportedBy', 'name email phone')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: issues.length,
      data: issues,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single issue by ID or issueId
// @route   GET /api/issues/:id
// @access  Public / Protected
export const getIssueById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let issue;

    if (id.startsWith('ISS-')) {
      issue = await Issue.findOne({ issueId: id })
        .populate('reportedBy', 'name email phone')
        .populate('assignedTo', 'name email department');
    } else {
      issue = await Issue.findById(id)
        .populate('reportedBy', 'name email phone')
        .populate('assignedTo', 'name email department');
    }

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Issue not found',
      });
    }

    res.json({
      success: true,
      data: issue,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new issue
// @route   POST /api/issues
// @access  Private (Citizen/Officer/Admin)
export const createIssue = async (req, res, next) => {
  try {
    const { title, description, category, location, priority, img, coordinates } = req.body;

    if (!title || !description || !location) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, description and location',
      });
    }

    // Determine default department based on category
    let department = 'Public Works';
    if (category === 'Utilities' || category === 'Water') department = 'Water & Power';
    else if (category === 'Environment') department = 'Parks & Recreation';
    else if (category === 'Traffic') department = 'Transportation';

    const count = await Issue.countDocuments();
    const issueId = `ISS-${1001 + count}`;

    const newIssue = new Issue({
      issueId,
      title,
      description,
      category: category || 'Infrastructure',
      location,
      priority: priority || 'Medium',
      department,
      img: img || req.file ? `/uploads/${req.file.filename}` : '',
      coordinates: coordinates || { lat: 40.7128 + (Math.random() - 0.5) * 0.05, lng: -74.006 + (Math.random() - 0.5) * 0.05 },
      reportedBy: req.user._id,
      reportedByName: req.user.name,
      activityLog: [
        {
          action: 'Issue Reported',
          performedBy: req.user._id,
          performedByName: req.user.name,
          notes: 'Civic issue report created and submitted to queue.',
          timestamp: new Date(),
        },
      ],
    });

    const savedIssue = await newIssue.save();

    res.status(201).json({
      success: true,
      message: 'Issue reported successfully',
      data: savedIssue,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update issue status, priority, or assignment
// @route   PUT /api/issues/:id
// @access  Private (Officer/Admin)
export const updateIssue = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, priority, assignedTo, resolutionNotes, department } = req.body;

    const issue = await Issue.findById(id);

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Issue not found',
      });
    }

    let logAction = 'Updated details';
    let logNote = '';

    if (status && status !== issue.status) {
      logAction = `Status changed to ${status}`;
      logNote = resolutionNotes || `Status updated by ${req.user.name}`;
      issue.status = status;
      if (status === 'Resolved') {
        issue.resolvedAt = new Date();
      }
    }

    if (priority) issue.priority = priority;
    if (department) issue.department = department;
    if (resolutionNotes) issue.resolutionNotes = resolutionNotes;

    if (assignedTo !== undefined) {
      if (assignedTo) {
        const officer = await User.findById(assignedTo);
        issue.assignedTo = assignedTo;
        issue.assignedToName = officer ? officer.name : 'Officer';
        logAction = `Assigned to ${issue.assignedToName}`;
      } else {
        issue.assignedTo = null;
        issue.assignedToName = 'Unassigned';
      }
    }

    // Add to activity log
    issue.activityLog.push({
      action: logAction,
      performedBy: req.user._id,
      performedByName: req.user.name,
      notes: logNote || `Update performed by ${req.user.role}`,
      timestamp: new Date(),
    });

    const updatedIssue = await issue.save();

    // Trigger in-app notification to the reporter
    if (issue.reportedBy) {
      await Notification.create({
        recipient: issue.reportedBy,
        title: `Issue Update: ${issue.title}`,
        message: `Your reported issue status has been updated to "${issue.status}".`,
        type: 'status_update',
        issue: issue._id,
      });
    }

    res.json({
      success: true,
      message: 'Issue updated successfully',
      data: updatedIssue,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete an issue
// @route   DELETE /api/issues/:id
// @access  Private (Admin only)
export const deleteIssue = async (req, res, next) => {
  try {
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Issue not found',
      });
    }

    await issue.deleteOne();

    res.json({
      success: true,
      message: 'Issue removed successfully',
    });
  } catch (error) {
    next(error);
  }
};
