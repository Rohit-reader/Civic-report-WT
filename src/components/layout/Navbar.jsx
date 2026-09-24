import React from 'react';
import { Menu, Bell, User } from 'lucide-react';
import { Link } from 'react-router';
import { ThemeToggle } from '../ThemeToggle';
import { useAuth } from '../../context/AuthContext';

export const Navbar = ({ onMenuClick }) => {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center">
        <button
          onClick={onMenuClick}
          className="mr-4 text-slate-500 hover:text-slate-700 focus:outline-none lg:hidden dark:text-slate-400 dark:hover:text-slate-300"
        >
          <Menu className="h-6 w-6" />
        </button>
        <Link to="/" className="flex items-center">
          <span className="text-xl font-bold text-blue-600 dark:text-blue-500">CivicResolve</span>
        </Link>
      </div>
      <div className="flex items-center space-x-3 sm:space-x-4">
        <ThemeToggle />
        <Link to="/settings" className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300 p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          <Bell className="h-5 w-5" />
        </Link>
        <Link to="/profile" className="flex items-center space-x-2 pl-2 border-l border-slate-200 dark:border-slate-800 hover:opacity-80 transition-opacity">
          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 dark:bg-blue-900 dark:text-blue-300 font-bold text-sm">
            {user?.name ? user.name.charAt(0).toUpperCase() : <User className="h-4 w-4" />}
          </div>
          {user && (
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-semibold text-slate-900 dark:text-white leading-tight">{user.name}</span>
              <span className="text-[10px] uppercase font-bold text-blue-600 dark:text-blue-400">{user.role}</span>
            </div>
          )}
        </Link>
      </div>
    </header>
  );
};
