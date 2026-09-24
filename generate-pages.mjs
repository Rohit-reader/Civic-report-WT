import fs from 'fs';
import path from 'path';

const pages = [
  'Landing.jsx',
  'Login.jsx',
  'Register.jsx',
  'citizen/Dashboard.jsx',
  'citizen/ReportIssue.jsx',
  'citizen/MyReports.jsx',
  'citizen/Profile.jsx',
  'officer/Dashboard.jsx',
  'officer/Issues.jsx',
  'admin/Dashboard.jsx',
  'admin/Users.jsx',
  'admin/Issues.jsx',
  'admin/Departments.jsx',
  'NotFound.jsx'
];

pages.forEach(p => {
  const fullPath = path.join(process.cwd(), 'src', 'pages', p);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  
  const componentName = path.basename(p, '.jsx');
  fs.writeFileSync(fullPath, `import React from 'react';\n\nexport default function ${componentName}() {\n  return (\n    <div className="p-6 bg-white rounded-xl shadow-sm dark:bg-slate-900 border border-slate-200 dark:border-slate-800">\n      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">${componentName} Page</h1>\n      <p className="text-slate-500 mt-2 dark:text-slate-400">This is a placeholder page.</p>\n    </div>\n  );\n}\n`);
});
