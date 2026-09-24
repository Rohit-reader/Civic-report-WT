import React, { useEffect, useState } from 'react';
import { Card, Button, Input, Badge } from '../../components/ui';
import { issuesAPI } from '../../lib/api';
import { MOCK_ISSUES } from '../../lib/mockData';
import { 
  CheckCircle, Clock, AlertCircle, Loader2, Search, 
  Filter, LayoutGrid, Table as TableIcon, MapPin, Eye, Plus 
} from 'lucide-react';
import { Link } from 'react-router';
import { IssueDetailModal } from '../../components/IssueDetailModal';

export default function MyReports() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'
  const [selectedIssue, setSelectedIssue] = useState(null);

  const fetchIssues = async () => {
    try {
      setLoading(true);
      const res = await issuesAPI.getMy();
      if (res.success && res.data) {
        setIssues(res.data);
      } else {
        setIssues(MOCK_ISSUES.filter(i => i.reportedBy === "John Doe"));
      }
    } catch (err) {
      console.warn('Using fallback data in MyReports:', err?.message);
      setIssues(MOCK_ISSUES.filter(i => i.reportedBy === "John Doe"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  const filteredIssues = issues.filter((issue) => {
    const matchesSearch = 
      (issue.title || '').toLowerCase().includes(search.toLowerCase()) ||
      (issue.location || '').toLowerCase().includes(search.toLowerCase()) ||
      (issue.issueId || '').toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !statusFilter || issue.status === statusFilter;
    const matchesCategory = !categoryFilter || issue.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">My Incident Reports</h1>
          <p className="text-sm text-slate-500 mt-1">Live tracking and status verification for all your municipal tickets.</p>
        </div>
        <Link to="/report">
          <Button className="font-bold shadow-md shadow-blue-500/20">
            <Plus className="w-4 h-4 mr-2" /> Report New Issue
          </Button>
        </Link>
      </div>

      {/* Filter & View Toolbar */}
      <Card>
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input 
                className="pl-10 h-10 bg-slate-50 dark:bg-slate-950" 
                placeholder="Search by ticket ID, title, address..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 rounded-xl border border-slate-300 bg-slate-50 dark:border-slate-800 dark:bg-slate-950 px-3 text-xs font-semibold dark:text-slate-200"
            >
              <option value="">Status: All</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="h-10 rounded-xl border border-slate-300 bg-slate-50 dark:border-slate-800 dark:bg-slate-950 px-3 text-xs font-semibold dark:text-slate-200"
            >
              <option value="">Category: All</option>
              <option value="Infrastructure">Infrastructure</option>
              <option value="Utilities">Utilities</option>
              <option value="Environment">Environment</option>
              <option value="Sanitation">Sanitation</option>
              <option value="Traffic">Traffic</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'table' ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-xs' : 'text-slate-400 hover:text-slate-700'
              }`}
              title="Table View"
            >
              <TableIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'grid' ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-xs' : 'text-slate-400 hover:text-slate-700'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content View */}
        <div className="p-0">
          {loading ? (
            <div className="py-16 flex justify-center text-slate-400">
              <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading reports from city database...
            </div>
          ) : filteredIssues.length === 0 ? (
            <div className="py-16 text-center text-slate-500">
              <p className="text-sm font-semibold">No records match your active filters.</p>
              <Button 
                variant="ghost" 
                size="sm" 
                className="mt-2 text-blue-600 font-bold" 
                onClick={() => { setSearch(''); setStatusFilter(''); setCategoryFilter(''); }}
              >
                Reset Filters
              </Button>
            </div>
          ) : viewMode === 'table' ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-[11px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50/50 dark:bg-slate-950/40 border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="px-6 py-3.5">Ticket ID</th>
                    <th className="px-6 py-3.5">Incident Title & Location</th>
                    <th className="px-6 py-3.5">Category</th>
                    <th className="px-6 py-3.5">Priority</th>
                    <th className="px-6 py-3.5">Status</th>
                    <th className="px-6 py-3.5 text-right">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredIssues.map((issue) => (
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
                          <MapPin className="w-3 h-3" /> {issue.location}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {issue.category}
                        </span>
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
                      <td className="px-6 py-4 text-right">
                        <Button size="sm" variant="ghost">
                          <Eye className="w-4 h-4 mr-1.5" /> View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            /* Grid View */
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredIssues.map((issue) => (
                <div 
                  key={issue._id || issue.id}
                  onClick={() => setSelectedIssue(issue)}
                  className="enterprise-card p-4 rounded-2xl cursor-pointer hover:border-blue-500 transition-all flex flex-col justify-between space-y-4"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">
                        {issue.issueId || issue.id}
                      </span>
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
                    </div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white mt-2 line-clamp-2">
                      {issue.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <span className="truncate">{issue.location}</span>
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-400">{issue.category}</span>
                    <Badge variant={issue.priority === 'Critical' ? 'danger' : issue.priority === 'High' ? 'warning' : 'default'}>
                      {issue.priority}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* Ticket Details Modal */}
      <IssueDetailModal 
        issue={selectedIssue} 
        isOpen={!!selectedIssue} 
        onClose={() => setSelectedIssue(null)}
        role="citizen"
      />
    </div>
  );
}
