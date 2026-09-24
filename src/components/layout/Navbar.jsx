import React, { useState } from 'react';
import { Menu, Search, User, Shield, Activity } from 'lucide-react';
import { Link } from 'react-router';
import { ThemeToggle } from '../ThemeToggle';
import { useAuth } from '../../context/AuthContext';
import { NotificationCenter } from '../NotificationCenter';
import { CommandPalette } from '../CommandPalette';
import { Badge } from '../ui';

export const Navbar = ({ onMenuClick }) => {
  const { user } = useAuth();
  const [isCommandOpen, setIsCommandOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white/90 backdrop-blur-md px-4 sm:px-6 dark:border-slate-800/80 dark:bg-slate-900/90 transition-colors">
        {/* Brand & Menu */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="text-slate-500 hover:text-slate-700 focus:outline-none lg:hidden dark:text-slate-400 dark:hover:text-slate-300 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <Menu className="h-5 w-5" />
          </button>
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-lg shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              CR
            </div>
            <div className="flex flex-col">
              <span className="text-base font-extrabold tracking-tight text-slate-900 dark:text-white leading-none">
                Civic<span className="text-blue-600 dark:text-blue-400">Resolve</span>
              </span>
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 tracking-wider uppercase mt-0.5">Enterprise Suite</span>
            </div>
          </Link>

          {/* Live System Status Pill */}
          <div className="hidden md:flex items-center gap-1.5 ml-4 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/40 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Systems Online</span>
          </div>
        </div>

        {/* Global Search / Command Bar Trigger */}
        <div className="hidden sm:flex flex-1 max-w-md mx-6">
          <button
            onClick={() => setIsCommandOpen(true)}
            className="w-full flex items-center justify-between h-9 px-3 text-xs text-slate-400 bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-xl hover:border-blue-400 dark:hover:border-blue-500/50 transition-all text-left"
          >
            <span className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5" />
              Quick search tickets, commands, records...
            </span>
            <kbd className="text-[10px] px-1.5 py-0.5 font-mono bg-white dark:bg-slate-900 text-slate-500 rounded border border-slate-200 dark:border-slate-700">
              Ctrl+K
            </kbd>
          </button>
        </div>

        {/* Right Action Icons */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <ThemeToggle />
          <NotificationCenter />

          {/* User Profile Pill */}
          <Link 
            to="/profile" 
            className="flex items-center gap-2.5 pl-2 py-1 pr-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all"
          >
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-xs">
              {user?.name ? user.name.charAt(0).toUpperCase() : <User className="h-4 w-4" />}
            </div>
            {user && (
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-xs font-bold text-slate-900 dark:text-white leading-tight truncate max-w-[120px]">
                  {user.name}
                </span>
                <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                  {user.role}
                </span>
              </div>
            )}
          </Link>
        </div>
      </header>

      {/* Command Palette Modal */}
      <CommandPalette isOpen={isCommandOpen} onClose={() => setIsCommandOpen(false)} />
    </>
  );
};
