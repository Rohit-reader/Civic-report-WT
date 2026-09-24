import React, { useState, useEffect } from 'react';
import { Card, CardContent, Button, Input, Modal, Textarea, Badge } from '../../components/ui';
import { departmentsAPI } from '../../lib/api';
import { MOCK_DEPARTMENTS } from '../../lib/mockData';
import { 
  Building2, Users, AlertCircle, Percent, 
  Plus, Loader2, ShieldCheck, Zap, Sparkles 
} from 'lucide-react';
import { useForm } from 'react-hook-form';

export default function Departments() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [actionError, setActionError] = useState('');

  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const res = await departmentsAPI.getAll();
      if (res.success && res.data) {
        setDepartments(res.data);
      } else {
        setDepartments(MOCK_DEPARTMENTS);
      }
    } catch (err) {
      console.warn('Using fallback departments:', err?.message);
      setDepartments(MOCK_DEPARTMENTS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const onAddDepartment = async (data) => {
    try {
      setActionError('');
      const res = await departmentsAPI.create(data);
      if (res.success) {
        setIsAddOpen(false);
        reset();
        await fetchDepartments();
      }
    } catch (err) {
      setActionError(err.response?.data?.message || err.message || 'Failed to create department.');
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Municipal Department Directory</h1>
          <p className="text-sm text-slate-500 mt-0.5">Workload allocation, staffing capacity, and SLA efficiency metrics.</p>
        </div>
        <Button 
          className="font-bold shadow-md shadow-blue-500/20"
          onClick={() => { reset(); setActionError(''); setIsAddOpen(true); }}
        >
          <Plus className="w-4 h-4 mr-2" /> Add Department
        </Button>
      </div>

      {loading ? (
        <div className="p-16 flex justify-center text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin mr-2" /> Loading municipal departments...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {departments.map((dept) => (
            <div 
              key={dept._id || dept.id} 
              className="enterprise-card p-6 rounded-2xl flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3.5">
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-xl shadow-sm">
                      <Building2 className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-base text-slate-900 dark:text-white">{dept.name}</h3>
                      <p className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">Code: {dept.code || dept.id}</p>
                    </div>
                  </div>
                  <Badge variant="success">Operational</Badge>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 mt-3.5 leading-relaxed">
                  {dept.description || 'Responsible for maintenance, emergency response, and municipal service dispatch.'}
                </p>
              </div>
              
              {/* Metric Highlights */}
              <div className="grid grid-cols-3 gap-3 border-t border-slate-100 dark:border-slate-800 pt-4 mt-5">
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800">
                  <div className="flex items-center text-slate-400 mb-1 text-[11px] font-bold">
                    <Users className="w-3.5 h-3.5 mr-1 text-blue-500" /> Active Staff
                  </div>
                  <p className="font-black text-lg text-slate-900 dark:text-white">{dept.officerCount}</p>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800">
                  <div className="flex items-center text-slate-400 mb-1 text-[11px] font-bold">
                    <AlertCircle className="w-3.5 h-3.5 mr-1 text-amber-500" /> Open Tickets
                  </div>
                  <p className="font-black text-lg text-amber-600 dark:text-amber-400">{dept.openIssues}</p>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800">
                  <div className="flex items-center text-slate-400 mb-1 text-[11px] font-bold">
                    <Percent className="w-3.5 h-3.5 mr-1 text-emerald-500" /> SLA Velocity
                  </div>
                  <p className="font-black text-lg text-emerald-600 dark:text-emerald-400">{dept.efficiency || '92%'}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Department Modal */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Add Municipal Department"
        subtitle="Configure a new department and allocate officer staff."
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSubmit(onAddDepartment)} className="space-y-4 font-sans">
          {actionError && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{actionError}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">Department Name</label>
            <Input placeholder="e.g., Environmental Health & Sanitation" {...register('name', { required: true })} className="h-10 text-xs" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">Code</label>
              <Input placeholder="D-5" {...register('code')} className="h-10 text-xs" />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">Efficiency Target</label>
              <Input placeholder="95%" {...register('efficiency')} className="h-10 text-xs" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">Jurisdiction Description</label>
            <Textarea placeholder="Core responsibilities and zone coverage..." rows={3} {...register('description')} className="text-xs" />
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
            <Button type="button" variant="ghost" size="sm" onClick={() => setIsAddOpen(false)}>Cancel</Button>
            <Button type="submit" size="sm" isLoading={isSubmitting}>Create Department</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
