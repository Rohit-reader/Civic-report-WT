import React, { useState, useEffect, useRef } from 'react';
import { Bell, Check, Trash2, ExternalLink, ShieldAlert, CheckCircle2, Clock } from 'lucide-react';
import { Badge } from './ui';

export const NotificationCenter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Issue Status Updated',
      message: 'Your report "Massive Pothole on 5th Ave" was marked as Resolved.',
      type: 'resolved',
      time: '10m ago',
      read: false,
    },
    {
      id: 2,
      title: 'Priority Escalation',
      message: 'Fallen Tree on Westside Park Rd flagged as Critical.',
      type: 'alert',
      time: '1h ago',
      read: false,
    },
    {
      id: 3,
      title: 'Task Assigned',
      message: 'New utility inspection assigned to Public Works.',
      type: 'assigned',
      time: '3h ago',
      read: true,
    }
  ]);

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const getIcon = (type) => {
    if (type === 'resolved') return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
    if (type === 'alert') return <ShieldAlert className="w-4 h-4 text-rose-500" />;
    return <Clock className="w-4 h-4 text-blue-500" />;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white ring-2 ring-white dark:ring-slate-900 animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">Notifications</h4>
              {unreadCount > 0 && (
                <Badge variant="danger">{unreadCount} new</Badge>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs">
              <button 
                onClick={markAllAsRead} 
                className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                <Check className="w-3.5 h-3.5" /> Read all
              </button>
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
            {notifications.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                No notifications right now.
              </div>
            ) : (
              notifications.map((notif) => (
                <div 
                  key={notif.id}
                  className={`p-3.5 flex items-start gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer ${
                    !notif.read ? 'bg-blue-50/40 dark:bg-blue-950/20' : ''
                  }`}
                  onClick={() => {
                    setNotifications(notifications.map(n => n.id === notif.id ? { ...n, read: true } : n));
                  }}
                >
                  <div className="mt-0.5 p-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs">
                    {getIcon(notif.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{notif.title}</p>
                      <span className="text-[10px] text-slate-400 ml-2 whitespace-nowrap">{notif.time}</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">{notif.message}</p>
                  </div>
                  {!notif.read && (
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                  )}
                </div>
              ))
            )}
          </div>

          {notifications.length > 0 && (
            <div className="p-2.5 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs text-slate-500 px-4">
              <span>Civic Intelligence Dispatch</span>
              <button 
                onClick={clearAll}
                className="text-slate-400 hover:text-rose-500 flex items-center gap-1 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" /> Clear all
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
