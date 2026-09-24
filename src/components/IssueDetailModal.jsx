import React, { useState, useEffect } from 'react';
import { Modal, Badge, Button, Input, Textarea } from './ui';
import { 
  MapPin, Clock, CheckCircle2, User, Building2, 
  Send, AlertTriangle, ShieldCheck, Tag, Calendar, 
  History, ArrowRight, Check
} from 'lucide-react';
import { issuesAPI, usersAPI } from '../lib/api';

export const IssueDetailModal = ({ issue, isOpen, onClose, onUpdated, role = 'citizen' }) => {
  const [currentIssue, setCurrentIssue] = useState(issue);
  const [officers, setOfficers] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState(issue?.status || 'Pending');
  const [selectedPriority, setSelectedPriority] = useState(issue?.priority || 'Medium');
  const [selectedOfficer, setSelectedOfficer] = useState(issue?.assignedTo?._id || issue?.assignedTo || '');
  const [resolutionNote, setResolutionNote] = useState('');
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    setCurrentIssue(issue);
    setSelectedStatus(issue?.status || 'Pending');
    setSelectedPriority(issue?.priority || 'Medium');
    setSelectedOfficer(issue?.assignedTo?._id || issue?.assignedTo || '');
  }, [issue]);

  useEffect(() => {
    if (isOpen && (role === 'admin' || role === 'officer')) {
      usersAPI.getOfficers().then((res) => {
        if (res.success && res.data) setOfficers(res.data);
      }).catch(() => {});
    }
  }, [isOpen, role]);

  if (!issue) return null;

  const handleUpdate = async () => {
    try {
      setSaving(true);
      const res = await issuesAPI.update(issue._id || issue.id, {
        status: selectedStatus,
        priority: selectedPriority,
        assignedTo: selectedOfficer || null,
        resolutionNotes: resolutionNote,
      });

      if (res.success) {
        setCurrentIssue(res.data);
        setResolutionNote('');
        if (onUpdated) onUpdated(res.data);
      }
    } catch (err) {
      console.error('Failed to update issue:', err);
    } finally {
      setSaving(false);
    }
  };

  const stages = [
    { label: 'Reported', completed: true, current: currentIssue.status === 'Pending' },
    { label: 'Assigned', completed: currentIssue.assignedToName !== 'Unassigned' || currentIssue.status !== 'Pending', current: currentIssue.status === 'In Progress' && !currentIssue.assignedTo },
    { label: 'In Progress', completed: currentIssue.status === 'In Progress' || currentIssue.status === 'Resolved', current: currentIssue.status === 'In Progress' },
    { label: 'Resolved', completed: currentIssue.status === 'Resolved', current: currentIssue.status === 'Resolved' }
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={currentIssue.title}
      subtitle={`Ticket ID: ${currentIssue.issueId || currentIssue.id || 'ISS-AUTO'} • Created ${new Date(currentIssue.createdAt || Date.now()).toLocaleString()}`}
      maxWidth="max-w-4xl"
    >
      <div className="space-y-6 font-sans">
        {/* Enterprise Stage Progress Tracker */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Resolution Lifecycle</p>
          <div className="grid grid-cols-4 gap-2 relative">
            {stages.map((stage, idx) => (
              <div key={idx} className="flex flex-col items-center text-center relative z-10">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  stage.completed
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20 ring-4 ring-blue-100 dark:ring-blue-950'
                    : 'bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                }`}>
                  {stage.completed ? <Check className="w-4 h-4" /> : idx + 1}
                </div>
                <span className={`text-xs mt-1.5 font-medium ${stage.completed ? 'text-slate-900 dark:text-white font-semibold' : 'text-slate-400'}`}>
                  {stage.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-3 px-4 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === 'overview'
                ? 'border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400'
            }`}
          >
            Overview & Details
          </button>
          <button
            onClick={() => setActiveTab('timeline')}
            className={`pb-3 px-4 text-sm font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'timeline'
                ? 'border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400'
            }`}
          >
            <History className="w-4 h-4" />
            Audit Trail ({currentIssue.activityLog?.length || 1})
          </button>
        </div>

        {activeTab === 'overview' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Issue Content & Media */}
            <div className="lg:col-span-2 space-y-5">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Description</h4>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {currentIssue.description}
                </div>
              </div>

              {currentIssue.img && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Photo Evidence</h4>
                  <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 relative max-h-72 bg-slate-900 group">
                    <img 
                      src={currentIssue.img.startsWith('http') ? currentIssue.img : `http://localhost:5000${currentIssue.img}`} 
                      alt="Evidence" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </div>
              )}

              {/* Location Card */}
              <div className="p-4 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-900/40 flex items-start gap-3">
                <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-blue-900 dark:text-blue-300">Incident Location</p>
                  <p className="text-sm text-slate-700 dark:text-slate-300 mt-0.5">{currentIssue.location}</p>
                </div>
              </div>
            </div>

            {/* Right 1 Col: Metadata & Action Controls */}
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-3.5">
                <div>
                  <span className="text-xs text-slate-500">Status</span>
                  <div className="mt-1">
                    <Badge 
                      variant={
                        currentIssue.status === 'Resolved' ? 'success' :
                        currentIssue.status === 'In Progress' ? 'primary' :
                        'warning'
                      }
                      dot
                    >
                      {currentIssue.status}
                    </Badge>
                  </div>
                </div>

                <div>
                  <span className="text-xs text-slate-500">Priority Level</span>
                  <div className="mt-1">
                    <Badge 
                      variant={
                        currentIssue.priority === 'Critical' ? 'danger' :
                        currentIssue.priority === 'High' ? 'warning' :
                        'default'
                      }
                    >
                      {currentIssue.priority} Priority
                    </Badge>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800">
                  <span className="text-xs text-slate-500">Department</span>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white mt-0.5">{currentIssue.department || 'Public Works'}</p>
                </div>

                <div>
                  <span className="text-xs text-slate-500">Assigned Officer</span>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white mt-0.5">{currentIssue.assignedToName || 'Unassigned'}</p>
                </div>

                <div>
                  <span className="text-xs text-slate-500">Reported By</span>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white mt-0.5">{currentIssue.reportedByName || 'Citizen User'}</p>
                </div>
              </div>

              {/* Administrative Update Controls (Admin & Officer) */}
              {(role === 'admin' || role === 'officer') && (
                <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-900/60 shadow-sm space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">Manage Ticket</h4>
                  
                  <div>
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Update Status</label>
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="w-full text-xs font-semibold h-9 rounded-lg border border-slate-300 bg-slate-50 dark:bg-slate-950 dark:border-slate-800 px-2 py-1 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>

                  {role === 'admin' && (
                    <>
                      <div>
                        <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Set Priority</label>
                        <select
                          value={selectedPriority}
                          onChange={(e) => setSelectedPriority(e.target.value)}
                          className="w-full text-xs font-semibold h-9 rounded-lg border border-slate-300 bg-slate-50 dark:bg-slate-950 dark:border-slate-800 px-2 py-1 text-slate-800 dark:text-slate-200"
                        >
                          <option value="Low">Low</option>
                          <option value="Medium">Medium</option>
                          <option value="High">High</option>
                          <option value="Critical">Critical</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Assign Officer</label>
                        <select
                          value={selectedOfficer}
                          onChange={(e) => setSelectedOfficer(e.target.value)}
                          className="w-full text-xs font-semibold h-9 rounded-lg border border-slate-300 bg-slate-50 dark:bg-slate-950 dark:border-slate-800 px-2 py-1 text-slate-800 dark:text-slate-200"
                        >
                          <option value="">Unassigned</option>
                          {officers.map(off => (
                            <option key={off._id} value={off._id}>{off.name} ({off.department || 'Officer'})</option>
                          ))}
                        </select>
                      </div>
                    </>
                  )}

                  <div>
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Resolution Note / Remarks</label>
                    <Textarea 
                      placeholder="Add note for activity log..." 
                      rows={2} 
                      className="text-xs"
                      value={resolutionNote}
                      onChange={(e) => setResolutionNote(e.target.value)}
                    />
                  </div>

                  <Button 
                    size="sm" 
                    className="w-full" 
                    isLoading={saving}
                    onClick={handleUpdate}
                  >
                    Apply Changes
                  </Button>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Timeline Audit Trail */
          <div className="space-y-4 py-2">
            {currentIssue.activityLog && currentIssue.activityLog.length > 0 ? (
              <div className="relative pl-6 border-l-2 border-slate-200 dark:border-slate-800 space-y-6">
                {currentIssue.activityLog.map((log, i) => (
                  <div key={i} className="relative">
                    <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-blue-600 ring-4 ring-white dark:ring-slate-900" />
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold text-slate-900 dark:text-white">{log.action}</p>
                      <span className="text-xs text-slate-400">{new Date(log.timestamp).toLocaleString()}</span>
                    </div>
                    <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mt-0.5">By {log.performedByName || 'System'}</p>
                    {log.notes && (
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 bg-slate-50 dark:bg-slate-950 p-2.5 rounded-lg border border-slate-200/60 dark:border-slate-800">
                        {log.notes}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500 text-center py-6">No audit records found for this issue.</p>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};
