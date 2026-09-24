import { Department } from '../models/Department.js';
import { User } from '../models/User.js';
import { Issue } from '../models/Issue.js';

// @desc    Get all departments with calculated live metrics
// @route   GET /api/departments
// @access  Public / Protected
export const getDepartments = async (req, res, next) => {
  try {
    const departments = await Department.find().sort({ name: 1 });

    // Calculate dynamic staff and open issue metrics
    const deptsWithStats = await Promise.all(
      departments.map(async (dept) => {
        const staffCount = await User.countDocuments({
          department: dept.name,
          role: 'officer',
          status: 'Active',
        });

        const openCount = await Issue.countDocuments({
          department: dept.name,
          status: { $in: ['Pending', 'In Progress'] },
        });

        return {
          id: dept.code || dept._id,
          _id: dept._id,
          name: dept.name,
          code: dept.code,
          officerCount: staffCount > 0 ? staffCount : dept.officerCount,
          openIssues: openCount > 0 ? openCount : dept.openIssues,
          efficiency: dept.efficiency || '92%',
          description: dept.description,
        };
      })
    );

    res.json({
      success: true,
      data: deptsWithStats,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a department
// @route   POST /api/departments
// @access  Private (Admin only)
export const createDepartment = async (req, res, next) => {
  try {
    const { name, code, description, efficiency } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Department name is required' });
    }

    const deptExists = await Department.findOne({ name });
    if (deptExists) {
      return res.status(400).json({ success: false, message: 'Department already exists' });
    }

    const count = await Department.countDocuments();
    const dept = await Department.create({
      name,
      code: code || `D-${count + 1}`,
      description: description || '',
      efficiency: efficiency || '90%',
    });

    res.status(201).json({
      success: true,
      message: 'Department created successfully',
      data: dept,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a department
// @route   PUT /api/departments/:id
// @access  Private (Admin only)
export const updateDepartment = async (req, res, next) => {
  try {
    const dept = await Department.findById(req.params.id);

    if (!dept) {
      return res.status(404).json({ success: false, message: 'Department not found' });
    }

    dept.name = req.body.name || dept.name;
    dept.code = req.body.code || dept.code;
    dept.description = req.body.description !== undefined ? req.body.description : dept.description;
    dept.efficiency = req.body.efficiency || dept.efficiency;

    const updated = await dept.save();

    res.json({
      success: true,
      message: 'Department updated successfully',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a department
// @route   DELETE /api/departments/:id
// @access  Private (Admin only)
export const deleteDepartment = async (req, res, next) => {
  try {
    const dept = await Department.findById(req.params.id);
    if (!dept) {
      return res.status(404).json({ success: false, message: 'Department not found' });
    }

    await dept.deleteOne();
    res.json({ success: true, message: 'Department deleted successfully' });
  } catch (error) {
    next(error);
  }
};
