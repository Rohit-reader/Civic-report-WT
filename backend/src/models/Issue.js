import mongoose from 'mongoose';

const activityLogSchema = new mongoose.Schema({
  action: { type: String, required: true },
  performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  performedByName: { type: String, default: 'System' },
  notes: { type: String, default: '' },
  timestamp: { type: Date, default: Date.now },
});

const issueSchema = new mongoose.Schema(
  {
    issueId: {
      type: String,
      unique: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Please provide an issue title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide a detailed description'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Infrastructure', 'Utilities', 'Environment', 'Sanitation', 'Traffic', 'Other'],
      default: 'Infrastructure',
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
    },
    coordinates: {
      lat: { type: Number, default: 40.7128 },
      lng: { type: Number, default: -74.006 },
    },
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Resolved', 'Rejected'],
      default: 'Pending',
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Medium',
    },
    img: {
      type: String,
      default: '',
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    reportedByName: {
      type: String,
      default: 'Citizen',
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    assignedToName: {
      type: String,
      default: 'Unassigned',
    },
    department: {
      type: String,
      default: 'Public Works',
    },
    resolutionNotes: {
      type: String,
      default: '',
    },
    resolvedAt: {
      type: Date,
      default: null,
    },
    activityLog: [activityLogSchema],
  },
  {
    timestamps: true,
  }
);

// Generate human-friendly issue ID (ISS-1001 etc) before saving
issueSchema.pre('save', async function (next) {
  if (!this.issueId) {
    const count = await mongoose.model('Issue').countDocuments();
    this.issueId = `ISS-${1001 + count}`;
  }
  next();
});

export const Issue = mongoose.model('Issue', issueSchema);
