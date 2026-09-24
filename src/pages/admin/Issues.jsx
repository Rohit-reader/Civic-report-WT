import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Badge } from '../../components/ui';
import { issuesAPI } from '../../lib/api';
import { MOCK_ISSUES } from '../../lib/mockData';
import { 
  Search, Loader2, Download, Eye, Trash2, 
  MapPin, Filter, AlertTriangle, ShieldCheck 
} from 'lucide-react';
import { IssueDetailModal } from '../../components/IssueDetailModal';
import { ExportReportModal } from '../../components/ExportReportModal';

export default function Issues() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const fetchIssues = async () => {
    try {
      setLoading(true);
      const res = await issuesAPI.getAll({
        search,
        status: statusFilter,
        category: categoryFilter,
      });
      if (res.success && res.data) {
        setIssues(res.data);
      } else {
        setIssues(MOCK_ISSUES);
      }
    } catch (err) {
      console.warn('Using fallback issues for admin table:', err?.message);
      setIssues(MOCK_ISSUES);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchIssues();
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [search, statusFilter, categoryFilter]);

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this issue record from the city database?')) return;
    try {
      setDeletingId(id);
      await issuesAPI.delete(id);
      await fetchIssues();
    } catch (err) {
      console.error('Failed to delete issue:', err);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Global Incident Directory</h1>
          <p className="text-sm text-slate-500 mt-0.5">Centralized master database of all municipal tickets and emergency reports.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="secondary" 
            className="font-bold text-xs"
            onClick={() => setIsExportOpen(true)}
          >
            <Download className="w-4 h-4 mr-2" /> Export CSV / JSON
          </Button>
        </div>
      </div>

      <Card>
        {/* Filters & Search Toolbar */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              className="pl-10 h-10 bg-slate-50 dark:bg-slate-950" 
              placeholder="Search by ID, title, address, or reporter..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 rounded-xl border border-slate-300 bg-slate-50 dark:border-slate-800 dark:bg-slate-950 px-3 text-xs font-semibold dark:text-slate-200 cursor-pointer"
          >
            <option value="">Status: All</option>
            <option value="Resolved">Resolved</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Rejected">Rejected</option>
          </select>

          <select 
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="h-10 rounded-xl border border-slate-300 bg-slate-50 dark:border-slate-800 dark:bg-slate-950 px-3 text-xs font-semibold dark:text-slate-200 cursor-pointer"
          >
            <option value="">Category: All</option>
            <option value="Infrastructure">Infrastructure</option>
            <option value="Utilities">Utilities</option>
            <option value="Environment">Environment</option>
            <option value="Sanitation">Sanitation</option>
            <option value="Traffic">Traffic</option>
          </select>
        </div>

        {/* Data Grid */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-16 flex justify-center text-slate-400">
              <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading global tickets...
            </div>
          ) : issues.length === 0 ? (
            <div className="p-16 text-center text-slate-500">
              <p className="text-sm font-semibold">No records match your active filters.</p>
            </div>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="text-[11px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50/50 dark:bg-slate-950/40 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-3.5">Ticket ID</th>
                  <th className="px-6 py-3.5">Incident Title & Location</th>
                  <th className="px-6 py-3.5">Category</th>
                  <th className="px-6 py-3.5">Assigned Officer</th>
                  <th className="px-6 py-3.5">Priority</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {issues.map((issue) => (
                  <tr 
                    key={issue._id || issue.id} 
                    onClick={() => setSelectedIssue(issue)}
                    className="bg-white dark:bg-slate-900/60 hover:bg-blue-50/40 dark:hover:bg-blue-950/20 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4 font-mono font-bold text-xs text-blue-600 dark:text-blue-400 whitespace-nowrap">
                      {issue.issueId || issue.id}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900 dark:text-white leading-tight">{issue.title}</div>
                      <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" /> {issue.location}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {issue.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-slate-600 dark:text-slate-300">
                      {issue.assignedToName || issue.assignedTo?.name || 'Unassigned'}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={issue.priority === 'Critical' ? 'danger' : issue.priority === 'High' ? 'warning' : 'default'}>
                        {issue.priority}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <Badge 
                        variant={
                          issue.status === 'Resolved' ? 'success' :
                          issue.status === 'In Progress' ? 'primary' :
                          'warning'
                        }
                        dot
                      >
                        {issue.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => setSelectedIssue(issue)}
                          className="h-8 px-2"
                        >
                          <Eye className="w-4 h-4 text-blue-500" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          isLoading={deletingId === (issue._id || issue.id)}
                          onClick={(e) => handleDelete(e, issue._id || issue.id)}
                          className="h-8 px-2 text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
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

      {/* Ticket Inspector Modal */}
      <IssueDetailModal 
        issue={selectedIssue} 
        isOpen={!!selectedIssue} 
        onClose={() => setSelectedIssue(null)}
        onUpdated={fetchIssues}
        role="admin"
      />

      {/* Export Datasets Modal */}
      <ExportReportModal 
        isOpen={isExportOpen} 
        onClose={() => setIsExportOpen(false)} 
        data={issues}
        title="Admin Incident Archive"
      />
    </div>
  );
}
