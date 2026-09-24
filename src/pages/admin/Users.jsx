import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Modal, Badge } from '../../components/ui';
import { usersAPI } from '../../lib/api';
import { MOCK_USERS } from '../../lib/mockData';
import { 
  Search, Plus, Loader2, UserPlus, Shield, 
  Trash2, Edit, CheckCircle2, AlertCircle, Building2 
} from 'lucide-react';
import { useForm } from 'react-hook-form';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [actionError, setActionError] = useState('');

  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();
  const { register: editRegister, handleSubmit: handleEditSubmit, setValue: setEditValue, formState: { isSubmitting: isEditSubmitting } } = useForm();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await usersAPI.getAll({ search, role: roleFilter });
      if (res.success && res.data) {
        setUsers(res.data);
      } else {
        setUsers(MOCK_USERS);
      }
    } catch (err) {
      console.warn('Using fallback users:', err?.message);
      setUsers(MOCK_USERS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchUsers();
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [search, roleFilter]);

  const onAddUser = async (data) => {
    try {
      setActionError('');
      const res = await usersAPI.create(data);
      if (res.success) {
        setIsAddModalOpen(false);
        reset();
        await fetchUsers();
      }
    } catch (err) {
      setActionError(err.response?.data?.message || err.message || 'Failed to create user.');
    }
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setEditValue('name', user.name);
    setEditValue('role', user.role);
    setEditValue('department', user.department || '');
    setEditValue('status', user.status || 'Active');
  };

  const onUpdateUser = async (data) => {
    try {
      setActionError('');
      const res = await usersAPI.update(editingUser._id || editingUser.id, data);
      if (res.success) {
        setEditingUser(null);
        await fetchUsers();
      }
    } catch (err) {
      setActionError(err.response?.data?.message || err.message || 'Failed to update user.');
    }
  };

  const onDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await usersAPI.delete(id);
      await fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete user.');
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Enterprise User Directory</h1>
          <p className="text-sm text-slate-500 mt-0.5">Manage citizens, field officers, and administrators with role-based access control.</p>
        </div>
        <Button 
          className="font-bold shadow-md shadow-blue-500/20"
          onClick={() => { reset(); setActionError(''); setIsAddModalOpen(true); }}
        >
          <UserPlus className="w-4 h-4 mr-2" /> Add Personnel
        </Button>
      </div>

      <Card>
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              className="pl-10 h-10 bg-slate-50 dark:bg-slate-950" 
              placeholder="Search by name, email, department..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select 
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="h-10 rounded-xl border border-slate-300 bg-slate-50 dark:border-slate-800 dark:bg-slate-950 px-3 text-xs font-semibold dark:text-slate-200 cursor-pointer"
          >
            <option value="">All Roles</option>
            <option value="citizen">Citizen</option>
            <option value="officer">Field Officer</option>
            <option value="admin">System Admin</option>
          </select>
        </div>

        {/* User Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-16 flex justify-center text-slate-400">
              <Loader2 className="w-6 h-6 animate-spin mr-2" /> Synchronizing personnel directory...
            </div>
          ) : users.length === 0 ? (
            <div className="p-16 text-center text-slate-500">
              No personnel match your search filters.
            </div>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="text-[11px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50/50 dark:bg-slate-950/40 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-3.5">Personnel Name</th>
                  <th className="px-6 py-3.5">Email Contact</th>
                  <th className="px-6 py-3.5">System Role</th>
                  <th className="px-6 py-3.5">Department</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {users.map((user) => (
                  <tr key={user._id || user.id} className="bg-white dark:bg-slate-900/60 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center font-bold text-xs text-blue-600 dark:text-blue-400">
                          {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <span className="font-bold text-slate-900 dark:text-white">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs font-mono text-slate-500">{user.email}</td>
                    <td className="px-6 py-4">
                      <Badge variant={user.role === 'admin' ? 'purple' : user.role === 'officer' ? 'primary' : 'default'}>
                        {user.role}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-600 dark:text-slate-300 font-medium">
                      {user.department || 'General Public'}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={user.status === 'Active' ? 'success' : 'danger'} dot>
                        {user.status || 'Active'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button size="sm" variant="ghost" className="h-8 px-2" onClick={() => openEditModal(user)}>
                          <Edit className="w-4 h-4 text-slate-500" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-8 px-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                          onClick={() => onDeleteUser(user._id || user.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Card>

      {/* Add User Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Personnel"
        subtitle="Create a new citizen, officer, or administrator account."
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSubmit(onAddUser)} className="space-y-4 font-sans">
          {actionError && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{actionError}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">Full Name</label>
            <Input placeholder="Jane Doe" {...register('name', { required: true })} className="h-10 text-xs" />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">Email Address</label>
            <Input type="email" placeholder="jane@civic.gov" {...register('email', { required: true })} className="h-10 text-xs" />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">Password</label>
            <Input type="password" placeholder="••••••••" {...register('password', { required: true })} className="h-10 text-xs" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">System Role</label>
              <select {...register('role')} className="w-full h-10 rounded-xl border border-slate-300 bg-slate-50 dark:bg-slate-950 dark:border-slate-800 text-xs px-2.5 font-semibold dark:text-slate-200">
                <option value="citizen">Citizen</option>
                <option value="officer">Field Officer</option>
                <option value="admin">Administrator</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">Department</label>
              <select {...register('department')} className="w-full h-10 rounded-xl border border-slate-300 bg-slate-50 dark:bg-slate-950 dark:border-slate-800 text-xs px-2.5 font-semibold dark:text-slate-200">
                <option value="">None / Citizen</option>
                <option value="Public Works">Public Works</option>
                <option value="Water & Power">Water & Power</option>
                <option value="Parks & Recreation">Parks & Recreation</option>
                <option value="Transportation">Transportation</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
            <Button type="button" variant="ghost" size="sm" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
            <Button type="submit" size="sm" isLoading={isSubmitting}>Create Account</Button>
          </div>
        </form>
      </Modal>

      {/* Edit User Modal */}
      <Modal
        isOpen={!!editingUser}
        onClose={() => setEditingUser(null)}
        title="Edit Personnel Role & Status"
        subtitle={`Updating profile for ${editingUser?.name}`}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleEditSubmit(onUpdateUser)} className="space-y-4 font-sans">
          {actionError && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{actionError}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">Full Name</label>
            <Input {...editRegister('name')} className="h-10 text-xs" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">System Role</label>
              <select {...editRegister('role')} className="w-full h-10 rounded-xl border border-slate-300 bg-slate-50 dark:bg-slate-950 dark:border-slate-800 text-xs px-2.5 font-semibold dark:text-slate-200">
                <option value="citizen">Citizen</option>
                <option value="officer">Field Officer</option>
                <option value="admin">Administrator</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">Status</label>
              <select {...editRegister('status')} className="w-full h-10 rounded-xl border border-slate-300 bg-slate-50 dark:bg-slate-950 dark:border-slate-800 text-xs px-2.5 font-semibold dark:text-slate-200">
                <option value="Active">Active</option>
                <option value="Inactive">Inactive / Suspended</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">Department</label>
            <select {...editRegister('department')} className="w-full h-10 rounded-xl border border-slate-300 bg-slate-50 dark:bg-slate-950 dark:border-slate-800 text-xs px-2.5 font-semibold dark:text-slate-200">
              <option value="">None / Citizen</option>
              <option value="Public Works">Public Works</option>
              <option value="Water & Power">Water & Power</option>
              <option value="Parks & Recreation">Parks & Recreation</option>
              <option value="Transportation">Transportation</option>
            </select>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
            <Button type="button" variant="ghost" size="sm" onClick={() => setEditingUser(null)}>Cancel</Button>
            <Button type="submit" size="sm" isLoading={isEditSubmitting}>Save Changes</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
