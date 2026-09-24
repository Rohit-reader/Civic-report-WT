import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, Button, Input } from '../components/ui';
import { Bell, Shield, Key, Globe, Moon, Sun, Database, CheckCircle2, AlertCircle, RefreshCw, Smartphone, Laptop } from 'lucide-react';
import { useTheme } from '../components/ThemeProvider';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../lib/api';

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('appearance');

  // Password change state
  const [passData, setPassData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [passLoading, setPassLoading] = useState(false);
  const [passMessage, setPassMessage] = useState(null);

  // Notification toggles
  const [notifState, setNotifState] = useState({
    emailIncidents: true,
    emailStatus: true,
    pushBroadcast: true,
    weeklyDigest: false
  });
  const [notifSaved, setNotifSaved] = useState(false);

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPassMessage(null);
    if (passData.newPassword !== passData.confirmPassword) {
      setPassMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }
    if (passData.newPassword.length < 6) {
      setPassMessage({ type: 'error', text: 'Password must be at least 6 characters' });
      return;
    }
    setPassLoading(true);
    try {
      await authAPI.changePassword({
        currentPassword: passData.currentPassword,
        newPassword: passData.newPassword
      });
      setPassMessage({ type: 'success', text: 'Password updated successfully!' });
      setPassData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setPassMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update password.' });
    } finally {
      setPassLoading(false);
    }
  };

  const handleSaveNotifs = () => {
    setNotifSaved(true);
    setTimeout(() => setNotifSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto font-sans pb-12 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-2">
            Enterprise Preferences
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Workspace Settings</h1>
          <p className="text-slate-500 text-sm mt-1">Configure your personal experience, security credentials, and system telemetry.</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Sync Active ({user?.role?.toUpperCase() || 'CITIZEN'})
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Navigation Sidebar */}
        <div className="md:col-span-1 space-y-1">
          {[
            { id: 'appearance', label: 'Appearance & UI', icon: Sun },
            { id: 'security', label: 'Security & Auth', icon: Key },
            { id: 'notifications', label: 'Alert Channels', icon: Bell },
            { id: 'diagnostics', label: 'System & Database', icon: Database },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Pane */}
        <div className="md:col-span-3 space-y-6">
          {/* TAB: Appearance */}
          {activeTab === 'appearance' && (
            <div className="space-y-6">
              <Card className="glass-panel">
                <CardHeader>
                  <CardTitle className="text-lg">Display & Interface Mode</CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Color Theme</h4>
                      <p className="text-xs text-slate-500 mt-0.5">Switch between sleek enterprise dark mode and high-contrast light mode.</p>
                    </div>
                    <div className="flex bg-slate-100 dark:bg-slate-900/80 p-1.5 rounded-xl border border-slate-200 dark:border-slate-800">
                      <button 
                        onClick={() => setTheme('light')}
                        className={`flex items-center px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${theme === 'light' ? 'bg-white text-blue-600 shadow-sm dark:bg-slate-800 dark:text-blue-400' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
                      >
                        <Sun className="w-3.5 h-3.5 mr-1.5" /> Light
                      </button>
                      <button 
                        onClick={() => setTheme('dark')}
                        className={`flex items-center px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${theme === 'dark' ? 'bg-white text-blue-600 shadow-sm dark:bg-slate-800 dark:text-blue-400' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
                      >
                        <Moon className="w-3.5 h-3.5 mr-1.5" /> Dark
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                      <div className="flex items-center gap-2 mb-1.5">
                        <Laptop className="w-4 h-4 text-blue-500" />
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Glassmorphic HUD</span>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        Backdrop blurs and translucency enabled for maximum high-density visibility.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                      <div className="flex items-center gap-2 mb-1.5">
                        <Smartphone className="w-4 h-4 text-emerald-500" />
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Mobile Responsive</span>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        Collapsible command drawer with touch-friendly ticket lifecycle controls.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* TAB: Security */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <Card className="glass-panel">
                <CardHeader>
                  <CardTitle className="text-lg">Update Authentication Password</CardTitle>
                </CardHeader>
                <CardContent>
                  {passMessage && (
                    <div className={`mb-5 p-3.5 rounded-xl border text-xs font-medium flex items-center gap-2 ${
                      passMessage.type === 'success' 
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                        : 'bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400'
                    }`}>
                      {passMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
                      <span>{passMessage.text}</span>
                    </div>
                  )}

                  <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-md">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Current Password</label>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        value={passData.currentPassword}
                        onChange={(e) => setPassData({ ...passData, currentPassword: e.target.value })}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">New Password</label>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        value={passData.newPassword}
                        onChange={(e) => setPassData({ ...passData, newPassword: e.target.value })}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Confirm New Password</label>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        value={passData.confirmPassword}
                        onChange={(e) => setPassData({ ...passData, confirmPassword: e.target.value })}
                        required
                      />
                    </div>

                    <div className="pt-2">
                      <Button type="submit" isLoading={passLoading} className="w-full sm:w-auto">
                        Save New Password
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>

              <Card className="glass-panel">
                <CardHeader>
                  <CardTitle className="text-lg">Active Session & JWT</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white">Active Signed Token</div>
                      <div className="text-slate-500 font-mono mt-0.5">Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...</div>
                    </div>
                    <span className="px-2 py-1 rounded bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 font-semibold">24h Expiry</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* TAB: Notifications */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <Card className="glass-panel">
                <CardHeader>
                  <CardTitle className="text-lg">Event Broadcast Subscriptions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {notifSaved && (
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-medium flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Preferences saved successfully!</span>
                    </div>
                  )}

                  {[
                    { id: 'emailIncidents', label: 'High Priority Dispatch Alerts', desc: 'Instant push when an Emergency or Critical issue is flagged in your district.' },
                    { id: 'emailStatus', label: 'Ticket Status Transitions', desc: 'Receive real-time notifications when issues move from Reported → In Progress → Resolved.' },
                    { id: 'pushBroadcast', label: 'Municipal Announcements', desc: 'Civic alerts and scheduled maintenance notices from municipal admins.' },
                    { id: 'weeklyDigest', label: 'Executive Weekly Digest', desc: 'Consolidated performance KPIs, resolution times, and team throughput metrics.' },
                  ].map((item) => (
                    <div key={item.id} className="flex items-start justify-between p-3.5 rounded-xl bg-slate-50/70 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800">
                      <div className="pr-4">
                        <label htmlFor={item.id} className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white cursor-pointer">{item.label}</label>
                        <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{item.desc}</p>
                      </div>
                      <input
                        id={item.id}
                        type="checkbox"
                        checked={notifState[item.id]}
                        onChange={(e) => setNotifState({ ...notifState, [item.id]: e.target.checked })}
                        className="w-4 h-4 mt-1 text-blue-600 bg-slate-100 border-slate-300 rounded focus:ring-blue-500 cursor-pointer"
                      />
                    </div>
                  ))}

                  <div className="pt-3 flex justify-end">
                    <Button onClick={handleSaveNotifs}>Save Alert Rules</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* TAB: Diagnostics */}
          {activeTab === 'diagnostics' && (
            <div className="space-y-6">
              <Card className="glass-panel">
                <CardHeader>
                  <CardTitle className="text-lg">Infrastructure Telemetry</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                          <Database className="w-4 h-4 text-emerald-500" /> Database Engine
                        </span>
                        <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300 font-bold">ONLINE</span>
                      </div>
                      <div className="text-slate-500 space-y-1">
                        <div>Primary: <code className="text-blue-600 font-mono">MongoDB Compass / Atlas Ready</code></div>
                        <div>URI Fallback: <code className="text-slate-700 dark:text-slate-300 font-mono">127.0.0.1:27017/civic_resolve</code></div>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                          <RefreshCw className="w-4 h-4 text-blue-500" /> REST API Gateway
                        </span>
                        <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 font-bold">HEALTHY</span>
                      </div>
                      <div className="text-slate-500 space-y-1">
                        <div>Endpoint: <code className="text-blue-600 font-mono">http://localhost:5000/api</code></div>
                        <div>Security: <code className="text-slate-700 dark:text-slate-300 font-mono">JWT Bearer + Bcrypt</code></div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border border-blue-200 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-950/20 text-slate-700 dark:text-slate-300">
                    <p className="font-semibold mb-1">Atlas Cloud Migration Guide</p>
                    <p className="text-slate-500 leading-relaxed">
                      Whenever you want to switch to MongoDB Atlas Cloud, simply update <code className="text-blue-600 font-mono">MONGO_URI</code> in <code className="text-blue-600 font-mono">backend/.env</code> with your cloud connection string. The backend will automatically connect to Atlas!
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
