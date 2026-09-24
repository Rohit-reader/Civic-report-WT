export const MOCK_ISSUES = [
  {
    id: "ISS-1001",
    title: "Massive Pothole on 5th Ave",
    description: "Deep pothole causing traffic slowdowns and potential vehicle damage near the intersection.",
    category: "Infrastructure",
    location: "5th Ave & Main St, Downtown",
    status: "Resolved",
    priority: "High",
    reportedBy: "John Doe",
    assignedTo: "Jane Smith",
    createdAt: "2026-07-25T10:00:00Z",
    updatedAt: "2026-07-30T08:00:00Z",
    img: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: "ISS-1002",
    title: "Fallen Tree blocking Road",
    description: "Large oak tree fell across the two-lane road during last night's storm.",
    category: "Environment",
    location: "Westside Park Rd",
    status: "In Progress",
    priority: "Critical",
    reportedBy: "Alice Johnson",
    assignedTo: "Bob Builder",
    createdAt: "2026-07-29T06:30:00Z",
    updatedAt: "2026-07-30T09:00:00Z",
    img: "https://images.unsplash.com/photo-1595274458315-7489cb9c02ff?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: "ISS-1003",
    title: "Broken Streetlights",
    description: "Entire block is pitch black. 4 consecutive streetlights are out.",
    category: "Utilities",
    location: "North Avenue, Block 4",
    status: "Pending",
    priority: "Medium",
    reportedBy: "Michael Brown",
    assignedTo: "Unassigned",
    createdAt: "2026-07-30T01:15:00Z",
    updatedAt: "2026-07-30T01:15:00Z",
    img: "https://images.unsplash.com/photo-1494247545934-802521f1d137?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: "ISS-1004",
    title: "Water Leak from Hydrant",
    description: "Fire hydrant is slowly leaking water into the street.",
    category: "Water",
    location: "Elm Street & 2nd",
    status: "Resolved",
    priority: "Low",
    reportedBy: "Sarah Davis",
    assignedTo: "Plumber Team Alpha",
    createdAt: "2026-07-15T14:20:00Z",
    updatedAt: "2026-07-16T10:00:00Z",
    img: "https://images.unsplash.com/photo-1541888049752-1678129037c8?auto=format&fit=crop&q=80&w=400"
  }
];

export const MOCK_USERS = [
  { id: "U-1", name: "John Doe", role: "citizen", email: "john@example.com", status: "Active" },
  { id: "U-2", name: "Alice Johnson", role: "citizen", email: "alice@example.com", status: "Active" },
  { id: "U-3", name: "Jane Smith", role: "officer", email: "jane.smith@civic.gov", status: "Active", department: "Public Works" },
  { id: "U-4", name: "Bob Builder", role: "officer", email: "bob.b@civic.gov", status: "Active", department: "Parks & Rec" },
  { id: "U-5", name: "Admin User", role: "admin", email: "admin@civic.gov", status: "Active" }
];

export const MOCK_STATS = {
  totalIssues: 1245,
  resolvedIssues: 980,
  pendingIssues: 145,
  inProgressIssues: 120,
  avgResolutionTime: "2.4 Days"
};

export const MOCK_DEPARTMENTS = [
  { id: "D-1", name: "Public Works", officerCount: 45, openIssues: 82, efficiency: "94%" },
  { id: "D-2", name: "Water & Power", officerCount: 30, openIssues: 15, efficiency: "98%" },
  { id: "D-3", name: "Parks & Recreation", officerCount: 20, openIssues: 25, efficiency: "88%" },
  { id: "D-4", name: "Transportation", officerCount: 55, openIssues: 143, efficiency: "85%" }
];
