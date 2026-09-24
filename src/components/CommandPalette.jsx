import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Search, Home, FileText, AlertTriangle, Users, Building2, Settings, User, Plus, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const CommandPalette = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { role } = useAuth();

  const actions = [
    { label: 'Citizen Dashboard', path: '/dashboard', icon: Home, roles: ['citizen', 'officer', 'admin'] },
    { label: 'Report New Civic Issue', path: '/report', icon: Plus, roles: ['citizen', 'officer', 'admin'] },
    { label: 'My Submitted Reports', path: '/my-reports', icon: FileText, roles: ['citizen', 'officer', 'admin'] },
    { label: 'Officer Dashboard & Tasks', path: '/officer', icon: Home, roles: ['officer', 'admin'] },
    { label: 'Interactive Issues Map', path: '/officer/issues', icon: AlertTriangle, roles: ['officer', 'admin'] },
    { label: 'Admin Intelligence & Analytics', path: '/admin', icon: Home, roles: ['admin'] },
    { label: 'Manage All Issues', path: '/admin/issues', icon: FileText, roles: ['admin'] },
    { label: 'User Directory & Roles', path: '/admin/users', icon: Users, roles: ['admin'] },
    { label: 'Departments & Resource Allocation', path: '/admin/departments', icon: Building2, roles: ['admin'] },
    { label: 'User Profile Settings', path: '/profile', icon: User, roles: ['citizen', 'officer', 'admin'] },
    { label: 'System Preferences & Appearance', path: '/settings', icon: Settings, roles: ['citizen', 'officer', 'admin'] },
  ];

  const filtered = actions.filter(action => 
    action.roles.includes(role) &&
    action.label.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    const handleKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        onClose(); // toggle
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 p-4">
      <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center px-4 border-b border-slate-100 dark:border-slate-800">
          <Search className="w-5 h-5 text-slate-400 mr-3" />
          <input
            type="text"
            placeholder="Search commands, pages, or issues... (Type to filter)"
            className="w-full h-14 bg-transparent text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 text-xs text-slate-400 bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
            ESC
          </kbd>
        </div>

        <div className="p-2 max-h-80 overflow-y-auto">
          {filtered.length === 0 ? (
            <p className="p-6 text-center text-xs text-slate-400">No actions matching your search query.</p>
          ) : (
            filtered.map((item, idx) => {
              const Icon = item.icon;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    navigate(item.path);
                    onClose();
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span>{item.label}</span>
                </button>
              );
            })
          )}
        </div>

        <div className="p-3 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 flex justify-between text-[11px] text-slate-400 px-4">
          <span>Tip: Press <kbd className="font-mono bg-slate-200 dark:bg-slate-800 px-1 py-0.5 rounded">Ctrl+K</kbd> anywhere</span>
          <span>Civic Command Intelligence</span>
        </div>
      </div>
    </div>
  );
};
