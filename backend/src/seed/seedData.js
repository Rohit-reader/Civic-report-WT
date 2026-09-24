import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { User } from '../models/User.js';
import { Issue } from '../models/Issue.js';
import { Department } from '../models/Department.js';
import { Notification } from '../models/Notification.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../.env') });

const seedDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/civic_resolve';
    console.log(`Connecting to MongoDB at: ${mongoUri}`);
    await mongoose.connect(mongoUri);
    console.log('[MongoDB Connected Successfully]');

    // Clear existing data
    console.log('Clearing existing database collections...');
    await User.deleteMany();
    await Issue.deleteMany();
    await Department.deleteMany();
    await Notification.deleteMany();

    console.log('Seeding Departments...');
    const departments = await Department.create([
      {
        name: 'Public Works',
        code: 'D-1',
        officerCount: 45,
        openIssues: 82,
        efficiency: '94%',
        description: 'Roads, bridges, streetlights, and urban structural maintenance.',
      },
      {
        name: 'Water & Power',
        code: 'D-2',
        officerCount: 30,
        openIssues: 15,
        efficiency: '98%',
        description: 'Municipal water distribution, hydrant safety, and electrical grid maintenance.',
      },
      {
        name: 'Parks & Recreation',
        code: 'D-3',
        officerCount: 20,
        openIssues: 25,
        efficiency: '88%',
        description: 'Park care, fallen tree clearing, trail maintenance, and playground safety.',
      },
      {
        name: 'Transportation',
        code: 'D-4',
        officerCount: 55,
        openIssues: 143,
        efficiency: '85%',
        description: 'Traffic signals, bus lanes, road signs, and pedestrian safety.',
      },
    ]);

    console.log('Seeding Users...');
    // Citizen 1
    const citizen1 = await User.create({
      name: 'John Doe',
      email: 'citizen@example.com',
      password: 'password123',
      role: 'citizen',
      phone: '+1 (555) 123-4567',
      status: 'Active',
    });

    // Citizen 2
    const citizen2 = await User.create({
      name: 'Alice Johnson',
      email: 'alice@example.com',
      password: 'password123',
      role: 'citizen',
      phone: '+1 (555) 234-5678',
      status: 'Active',
    });

    // Officer 1
    const officer1 = await User.create({
      name: 'Jane Smith',
      email: 'officer@example.com',
      password: 'password123',
      role: 'officer',
      department: 'Public Works',
      phone: '+1 (555) 345-6789',
      status: 'Active',
    });

    // Officer 2
    const officer2 = await User.create({
      name: 'Bob Builder',
      email: 'bob.b@civic.gov',
      password: 'password123',
      role: 'officer',
      department: 'Parks & Recreation',
      phone: '+1 (555) 456-7890',
      status: 'Active',
    });

    // Admin
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'password123',
      role: 'admin',
      phone: '+1 (555) 999-0000',
      status: 'Active',
    });

    console.log('Seeding Issues...');
    await Issue.create([
      {
        issueId: 'ISS-1001',
        title: 'Massive Pothole on 5th Ave',
        description: 'Deep pothole causing traffic slowdowns and potential vehicle damage near the intersection.',
        category: 'Infrastructure',
        location: '5th Ave & Main St, Downtown',
        coordinates: { lat: 40.7128, lng: -74.006 },
        status: 'Resolved',
        priority: 'High',
        department: 'Public Works',
        reportedBy: citizen1._id,
        reportedByName: citizen1.name,
        assignedTo: officer1._id,
        assignedToName: officer1.name,
        img: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=400',
        resolvedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        activityLog: [
          {
            action: 'Issue Reported',
            performedBy: citizen1._id,
            performedByName: citizen1.name,
            notes: 'Citizen submitted photo and geolocation.',
            timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          },
          {
            action: 'Assigned to Jane Smith',
            performedBy: admin._id,
            performedByName: admin.name,
            notes: 'Assigned to Public Works rapid response squad.',
            timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
          },
          {
            action: 'Status changed to Resolved',
            performedBy: officer1._id,
            performedByName: officer1.name,
            notes: 'Asphalt patching complete. Road reopened.',
            timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          },
        ],
      },
      {
        issueId: 'ISS-1002',
        title: 'Fallen Tree blocking Road',
        description: "Large oak tree fell across the two-lane road during last night's storm.",
        category: 'Environment',
        location: 'Westside Park Rd',
        coordinates: { lat: 40.7188, lng: -74.012 },
        status: 'In Progress',
        priority: 'Critical',
        department: 'Parks & Recreation',
        reportedBy: citizen2._id,
        reportedByName: citizen2.name,
        assignedTo: officer2._id,
        assignedToName: officer2.name,
        img: 'https://images.unsplash.com/photo-1595274458315-7489cb9c02ff?auto=format&fit=crop&q=80&w=400',
        activityLog: [
          {
            action: 'Issue Reported',
            performedBy: citizen2._id,
            performedByName: citizen2.name,
            notes: 'Emergency report logged.',
            timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          },
          {
            action: 'Assigned to Bob Builder',
            performedBy: admin._id,
            performedByName: admin.name,
            notes: 'Crew dispatched with chain-saws and wood chipper.',
            timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
          },
        ],
      },
      {
        issueId: 'ISS-1003',
        title: 'Broken Streetlights',
        description: 'Entire block is pitch black. 4 consecutive streetlights are out.',
        category: 'Utilities',
        location: 'North Avenue, Block 4',
        coordinates: { lat: 40.7258, lng: -73.998 },
        status: 'Pending',
        priority: 'Medium',
        department: 'Water & Power',
        reportedBy: citizen1._id,
        reportedByName: citizen1.name,
        assignedTo: null,
        assignedToName: 'Unassigned',
        img: 'https://images.unsplash.com/photo-1494247545934-802521f1d137?auto=format&fit=crop&q=80&w=400',
        activityLog: [
          {
            action: 'Issue Reported',
            performedBy: citizen1._id,
            performedByName: citizen1.name,
            notes: 'Queued for electrical review.',
            timestamp: new Date(),
          },
        ],
      },
      {
        issueId: 'ISS-1004',
        title: 'Water Leak from Hydrant',
        description: 'Fire hydrant is slowly leaking water into the street.',
        category: 'Utilities',
        location: 'Elm Street & 2nd',
        coordinates: { lat: 40.7098, lng: -74.002 },
        status: 'Resolved',
        priority: 'Low',
        department: 'Water & Power',
        reportedBy: citizen2._id,
        reportedByName: citizen2.name,
        assignedTo: officer1._id,
        assignedToName: officer1.name,
        img: 'https://images.unsplash.com/photo-1541888049752-1678129037c8?auto=format&fit=crop&q=80&w=400',
        resolvedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        activityLog: [
          {
            action: 'Issue Reported',
            performedBy: citizen2._id,
            performedByName: citizen2.name,
            notes: 'Submitted via citizen app.',
            timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
          },
          {
            action: 'Status changed to Resolved',
            performedBy: officer1._id,
            performedByName: officer1.name,
            notes: 'Valve tightened and inspected.',
            timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        ],
      },
      {
        issueId: 'ISS-1005',
        title: 'Overflowing Public Trash Bin',
        description: 'Trash container on corner is completely overflowing onto the sidewalk.',
        category: 'Sanitation',
        location: 'Market St & 7th',
        coordinates: { lat: 40.7155, lng: -74.009 },
        status: 'In Progress',
        priority: 'Medium',
        department: 'Public Works',
        reportedBy: citizen1._id,
        reportedByName: citizen1.name,
        assignedTo: officer1._id,
        assignedToName: officer1.name,
        img: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80&w=400',
        activityLog: [
          {
            action: 'Issue Reported',
            performedBy: citizen1._id,
            performedByName: citizen1.name,
            notes: 'Citizen report.',
            timestamp: new Date(),
          },
        ],
      },
    ]);

    console.log('Seeding Sample Notifications...');
    await Notification.create([
      {
        recipient: citizen1._id,
        title: 'Issue Status Updated',
        message: 'Your reported issue "Massive Pothole on 5th Ave" has been marked as Resolved.',
        type: 'status_update',
      },
      {
        recipient: officer1._id,
        title: 'New Assignment',
        message: 'You have been assigned to investigate "Overflowing Public Trash Bin".',
        type: 'assignment',
      },
    ]);

    console.log('\n======================================================');
    console.log('✅ DATABASE SEEDING COMPLETED SUCCESSFULLY!');
    console.log('======================================================');
    console.log('Default Accounts Created (Password for all: password123):');
    console.log('1. Admin:   admin@example.com');
    console.log('2. Officer: officer@example.com (Jane Smith)');
    console.log('3. Citizen: citizen@example.com (John Doe)');
    console.log('======================================================\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Database Seeding Failed:', error);
    process.exit(1);
  }
};

seedDB();
