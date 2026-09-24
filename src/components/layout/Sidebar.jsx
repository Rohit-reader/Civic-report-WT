import React from 'react';
import { NavLink, useNavigate } from 'react-router';
import { Home, AlertTriangle, FileText, User, Settings, Users, Building2, Map, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Sidebar = ({ isOpen, onClose, role = 'citizen' }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const citizenLinks = [
    { to: '/dashboard', icon: Home, label: 'Dashboard' },
    { to: '/report', icon: AlertTriangle, label: 'Report Issue' },
    { to: '/my-reports', icon: FileText, label: 'My Reports' },
    { to: '/profile', icon: User, label: 'Profile' },
    { to: '/settings', icon: Settings, label: 'Settings' },
  ];

  const officerLinks = [
    { to: '/officer', icon: Home, label: 'Dashboard' },
    { to: '/officer/issues', icon: Map, label: 'Map Issues' },
    { to: '/settings', icon: Settings, label: 'Settings' },
  ];

  const adminLinks = [
    { to: '/admin', icon: Home, label: 'Dashboard' },
    { to: '/admin/users', icon: Users, label: 'Users' },
    { to: '/admin/issues', icon: FileText, label: 'All Issues' },
    { to: '/admin/departments', icon: Building2, label: 'Departments' },
    { to: '/settings', icon: Settings, label: 'Settings' },
  ];

  const links = role === 'admin' ? adminLinks : role === 'officer' ? officerLinks : citizenLinks;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-slate-900/50 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-20 w-64 transform border-r border-slate-200 bg-white transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 dark:border-slate-800 dark:bg-slate-900 ${
          isOpen ? 'translate-x-0 mt-16' : '-translate-x-full lg:mt-0'
        }`}
      >
        <div className="flex h-full flex-col overflow-y-auto pt-5 pb-4 lg:pt-0">
          <nav className="mt-5 flex-1 space-y-1 px-2">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end
                  className={({ isActive }) =>
                    `group flex items-center rounded-md px-2 py-2 text-sm font-medium ${
                      isActive
                        ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-50'
                    }`
                  }
                  onClick={() => {
                    if (window.innerWidth < 1024) onClose();
                  }}
                >
                  <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                  {link.label}
                </NavLink>
              );
            })}
          </nav>
          
          <div className="mt-auto px-2 border-t border-slate-200 dark:border-slate-800 pt-4 mb-4">
            <button
              onClick={handleLogout}
              className="group flex w-full items-center rounded-md px-2 py-2 text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 dark:text-slate-400 dark:hover:bg-red-900/30 dark:hover:text-red-400 transition-colors"
            >
              <LogOut className="mr-3 h-5 w-5 flex-shrink-0" />
              Logout
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
