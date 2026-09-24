import React, { useState } from 'react';
import { User, CheckCircle2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Input, Button } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name || 'John Doe');
  const [phone, setPhone] = useState(user?.phone || '+1 (555) 000-0000');
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);
    const res = await updateProfile({ name, phone });
    setSaving(false);
    if (res.success) {
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 font-sans">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Profile Settings</h1>
        <p className="text-slate-500 mt-1">Manage your account information in MongoDB.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-6 mb-8">
            <div className="h-20 w-20 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 dark:bg-blue-900/50 text-2xl font-bold">
              {user?.name ? user.name.charAt(0).toUpperCase() : <User className="h-10 w-10" />}
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-lg">{user?.name || 'User'}</h3>
              <p className="text-sm text-slate-500 capitalize">{user?.role || 'Citizen'} • {user?.department || 'Community Member'}</p>
            </div>
          </div>

          {savedSuccess && (
            <div className="mb-6 p-4 rounded-lg bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 text-sm flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
              <span>Profile updated successfully!</span>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                <Input value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                <Input value={user?.email || 'user@example.com'} type="email" disabled className="bg-slate-100 dark:bg-slate-900 text-slate-500 cursor-not-allowed" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Phone Number</label>
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Role</label>
                <Input value={user?.role || 'citizen'} disabled className="bg-slate-100 dark:bg-slate-900 text-slate-500 capitalize cursor-not-allowed" />
              </div>
            </div>
            
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end mt-6">
              <Button type="submit" isLoading={saving}>Save Changes</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
