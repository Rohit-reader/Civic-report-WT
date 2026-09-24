import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, Button } from '../components/ui';
import { Bell, Shield, Key, Globe, Moon, Sun } from 'lucide-react';
import { useTheme } from '../components/ThemeProvider';

export default function Settings() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="space-y-6 max-w-4xl mx-auto font-sans">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Settings</h1>
        <p className="text-slate-500 mt-1">Manage your account preferences and application settings.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-2">
          <nav className="flex flex-col space-y-1">
            <a href="#" className="bg-blue-50 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400 px-3 py-2 rounded-md text-sm font-medium flex items-center">
              <Shield className="w-4 h-4 mr-2" /> Account
            </a>
            <a href="#" className="text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-900 px-3 py-2 rounded-md text-sm font-medium flex items-center transition-colors">
              <Bell className="w-4 h-4 mr-2" /> Notifications
            </a>
            <a href="#" className="text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-900 px-3 py-2 rounded-md text-sm font-medium flex items-center transition-colors">
              <Key className="w-4 h-4 mr-2" /> Security
            </a>
            <a href="#" className="text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-900 px-3 py-2 rounded-md text-sm font-medium flex items-center transition-colors">
              <Globe className="w-4 h-4 mr-2" /> Preferences
            </a>
          </nav>
        </div>

        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-slate-900 dark:text-white">Theme</h4>
                  <p className="text-sm text-slate-500">Customize how the application looks on your device.</p>
                </div>
                <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-lg">
                  <button 
                    onClick={() => setTheme('light')}
                    className={`flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${theme === 'light' ? 'bg-white text-blue-600 shadow-sm dark:bg-slate-800 dark:text-blue-400' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
                  >
                    <Sun className="w-4 h-4 mr-2" /> Light
                  </button>
                  <button 
                    onClick={() => setTheme('dark')}
                    className={`flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${theme === 'dark' ? 'bg-white text-blue-600 shadow-sm dark:bg-slate-800 dark:text-blue-400' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
                  >
                    <Moon className="w-4 h-4 mr-2" /> Dark
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Email Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { id: 'marketing', label: 'Marketing Emails', desc: 'Receive emails about new features and updates.' },
                { id: 'security', label: 'Security Alerts', desc: 'Get notified about unusual activity on your account.', checked: true },
                { id: 'updates', label: 'Issue Updates', desc: 'Receive notifications when your reported issues change status.', checked: true }
              ].map(item => (
                <div key={item.id} className="flex items-start justify-between">
                  <div className="flex flex-col">
                    <label htmlFor={item.id} className="text-sm font-medium text-slate-900 dark:text-white cursor-pointer">{item.label}</label>
                    <p className="text-sm text-slate-500">{item.desc}</p>
                  </div>
                  <div className="flex items-center h-5">
                    <input
                      id={item.id}
                      type="checkbox"
                      defaultChecked={item.checked}
                      className="w-4 h-4 text-blue-600 bg-slate-100 border-slate-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-slate-800 focus:ring-2 dark:bg-slate-700 dark:border-slate-600 cursor-pointer"
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            <Button variant="secondary">Cancel</Button>
            <Button>Save Changes</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
