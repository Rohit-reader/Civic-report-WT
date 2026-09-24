import React from 'react';
import { NavLink, useNavigate } from 'react-router';
import { 
  Home, AlertTriangle, FileText, User, Settings, 
  Users, Building2, Map, LogOut, BarChart3, ShieldCheck, 
  HelpCircle, ChevronRight, Layers
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Badge } from '../ui';

export const Sidebar = ({ isOpen, onClose, role = 'citizen' }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const citizenSections = [
    {
      heading: 'Citizen Services',
      items: [
        { to: '/dashboard', icon: Home, label: 'Dashboard' },
        { to: '/report', icon: AlertTriangle, label: 'Report Issue', badge: 'New' },
        { to: '/my-reports', icon: FileText, label: 'My Reports' },
      ]
    },
    {
      heading: 'Account',
      items: [
        { to: '/profile', icon: User, label: 'My Profile' },
        { to: '/settings', icon: Settings, label: 'Preferences' },
      ]
    }
  ];

  const officerSections = [
    {
      heading: 'Field Operations',
      items: [
        { to: '/officer', icon: Home, label: 'Dispatch Center' },
        { to: '/officer/issues', icon: Map, label: 'Geo-Radar Map', badge: 'Live' },
      ]
    },
    {
      heading: 'Citizen Link',
      items: [
        { to: '/report', icon: AlertTriangle, label: 'Report Issue' },
        { to: '/my-reports', icon: FileText, label: 'My Reports' },
      ]
    },
    {
      heading: 'Officer Suite',
      items: [
        { to: '/profile', icon: User, label: 'Officer Profile' },
        { to: '/settings', icon: Settings, label: 'Settings' },
      ]
    }
  ];

  const adminSections = [
    {
      heading: 'Command & Analytics',
      items: [
        { to: '/admin', icon: BarChart3, label: 'Executive BI' },
        { to: '/admin/issues', icon: FileText, label: 'Ticket Directory' },
      ]
    },
    {
      heading: 'Resource Management',
      items: [
        { to: '/admin/users', icon: Users, label: 'User Directory' },
        { to: '/admin/departments', icon: Building2, label: 'Departments' },
        { to: '/officer/issues', icon: Map, label: 'Incident Radar' },
      ]
    },
    {
      heading: 'System',
      items: [
        { to: '/profile', icon: User, label: 'Admin Profile' },
        { to: '/settings', icon: Settings, label: 'Configuration' },
      ]
    }
  ];

  const sections = role === 'admin' ? adminSections : role === 'officer' ? officerSections : citizenSections;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-slate-950/60 backdrop-blur-xs lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-20 w-64 transform border-r border-slate-200/80 bg-white dark:border-slate-800/80 dark:bg-slate-900 transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0 mt-16' : '-translate-x-full lg:mt-0'
        }`}
      >
        <div className="flex h-full flex-col overflow-y-auto px-3 py-5">
          {/* Active Workspace / Role Banner */}
          <div className="mb-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400">Jurisdiction</span>
              <Badge variant={role === 'admin' ? 'purple' : role === 'officer' ? 'primary' : 'success'}>
                {role.toUpperCase()}
              </Badge>
            </div>
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-1">Metropolitan City Zone 1</p>
          </div>

          {/* Navigation Sections */}
          <nav className="flex-1 space-y-6">
            {sections.map((sec, sIdx) => (
              <div key={sIdx}>
                <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                  {sec.heading}
                </p>
                <div className="space-y-1">
                  {sec.items.map((link) => {
                    const Icon = link.icon;
                    return (
                      <NavLink
                        key={link.to}
                        to={link.to}
                        end
                        className={({ isActive }) =>
                          `group flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition-all ${
                            isActive
                              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20 font-bold'
                              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-white'
                          }`
                        }
                        onClick={() => {
                          if (window.innerWidth < 1024) onClose();
                        }}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className="h-4 w-4 flex-shrink-0" />
                          <span>{link.label}</span>
                        </div>
                        {link.badge && (
                          <span className="px-1.5 py-0.5 text-[9px] font-bold rounded-md bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200">
                            {link.badge}
                          </span>
                        )}
                      </NavLink>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          {/* Bottom Logout Button */}
          <div className="mt-auto pt-4 border-t border-slate-200/80 dark:border-slate-800/80">
            <button
              onClick={handleLogout}
              className="group flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-600 hover:bg-rose-50 hover:text-rose-600 dark:text-slate-400 dark:hover:bg-rose-950/30 dark:hover:text-rose-400 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
