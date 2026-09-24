import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { AppLayout } from './components/layout';
import { Loader } from './components/ui';
import { ThemeProvider } from './components/ThemeProvider';
import { AuthProvider } from './context/AuthContext';

// Lazy loading pages
const Landing = React.lazy(() => import('./pages/Landing'));
const Login = React.lazy(() => import('./pages/Login'));
const Register = React.lazy(() => import('./pages/Register'));
const CitizenDashboard = React.lazy(() => import('./pages/citizen/Dashboard'));
const ReportIssue = React.lazy(() => import('./pages/citizen/ReportIssue'));
const MyReports = React.lazy(() => import('./pages/citizen/MyReports'));
const Profile = React.lazy(() => import('./pages/citizen/Profile'));

const OfficerDashboard = React.lazy(() => import('./pages/officer/Dashboard'));
const OfficerIssues = React.lazy(() => import('./pages/officer/Issues'));

const AdminDashboard = React.lazy(() => import('./pages/admin/Dashboard'));
const AdminUsers = React.lazy(() => import('./pages/admin/Users'));
const AdminIssues = React.lazy(() => import('./pages/admin/Issues'));
const AdminDepartments = React.lazy(() => import('./pages/admin/Departments'));

const Settings = React.lazy(() => import('./pages/Settings'));

const NotFound = React.lazy(() => import('./pages/NotFound'));

function App() {
  return (
    <ThemeProvider defaultTheme="light">
      <AuthProvider>
        <BrowserRouter>
          <Suspense fallback={<div className="h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-slate-950"><Loader size={32} /></div>}>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              <Route element={<AppLayout />}>
                {/* Citizen Routes */}
                <Route path="/dashboard" element={<CitizenDashboard />} />
                <Route path="/report" element={<ReportIssue />} />
                <Route path="/my-reports" element={<MyReports />} />
                <Route path="/profile" element={<Profile />} />

                {/* Officer Routes */}
                <Route path="/officer" element={<OfficerDashboard />} />
                <Route path="/officer/issues" element={<OfficerIssues />} />

                {/* Admin Routes */}
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/users" element={<AdminUsers />} />
                <Route path="/admin/issues" element={<AdminIssues />} />
                <Route path="/admin/departments" element={<AdminDepartments />} />
                
                {/* Shared Routes */}
                <Route path="/settings" element={<Settings />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
