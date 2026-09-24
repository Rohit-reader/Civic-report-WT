import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, Button, Badge } from '../../components/ui';
import { issuesAPI } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { MOCK_ISSUES } from '../../lib/mockData';
import { 
  Clock, CheckCircle, AlertTriangle, MapPin, 
  Loader2, ShieldAlert, Sparkles, Filter, 
  CheckCircle2, ArrowRight, Eye, Radio
} from 'lucide-react';
import { Link } from 'react-router';
import { IssueDetailModal } from '../../components/IssueDetailModal';

export default function Dashboard() {
  const { user } = useAuth();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [filterPriority, setFilterPriority] = useState('All');

  const fetchAssigned = async () => {
    try {
      setLoading(true);
      const res = await issuesAPI.getAssigned();
      if (res.success && res.data) {
        setIssues(res.data);
      } else {
        setIssues(MOCK_ISSUES.filter(i => i.assignedTo === "Jane Smith" || i.assignedTo === "Unassigned"));
      }
    } catch (err) {
      console.warn('Using fallback data for officer dashboard:', err?.message);
      setIssues(MOCK_ISSUES.filter(i => i.assignedTo === "Jane Smith" || i.assignedTo === "Unassigned"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssigned();
  }, []);

  const handleStatusToggle = async (e, issue) => {
    e.stopPropagation();
    const issueId = issue._id || issue.id;
    const nextStatus = issue.status === 'Resolved' ? 'In Progress' : issue.status === 'In Progress' ? 'Resolved' : 'In Progress';
    try {
      setUpdatingId(issueId);
      await issuesAPI.update(issueId, { status: nextStatus });
      await fetchAssigned();
    } catch (err) {
      console.error('Failed to update status:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  const pending = issues.filter(i => i.status !== 'Resolved').length;
  const criticalCount = issues.filter(i => i.priority === 'Critical' || i.priority === 'High').length;
  const resolvedCount = issues.filter(i => i.status === 'Resolved').length;

  const filtered = issues.filter(i => filterPriority === 'All' || i.priority === filterPriority);

  return (
    <div className="space-y-6 font-sans">
      {/* Officer Command Header */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white shadow-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold mb-2">
            <Radio className="w-3.5 h-3.5 animate-pulse text-blue-400" />
            Field Ops Unit • {user?.department || 'Public Works Division'}
          </div>
          <h1 className="text-2xl font-black tracking-tight">Officer Dispatch Center</h1>
          <p className="text-sm text-slate-300 mt-1">Officer {user?.name || 'Jane Smith'} — Active Duty in Sector Alpha</p>
        </div>
        <Link to="/officer/issues">
          <Button className="font-bold bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-500/25">
            <MapPin className="w-4 h-4 mr-2" /> Open Incident Map
          </Button>
        </Link>
      </div>

      {/* KPI Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="enterprise-card p-5 rounded-2xl">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Assigned Tasks</p>
            <div className="p-2.5 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 rounded-xl">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <h3 className="text-3xl font-black text-slate-900 dark:text-white">{pending}</h3>
            <span className="text-xs font-bold text-slate-400">pending response</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Active queue</p>
        </div>

        <div className="enterprise-card p-5 rounded-2xl">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Urgent / Critical</p>
            <div className="p-2.5 bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 rounded-xl">
              <ShieldAlert className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <h3 className="text-3xl font-black text-rose-600 dark:text-rose-400">{criticalCount}</h3>
            <span className="text-xs font-bold text-rose-500">high priority</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Requires immediate inspection</p>
        </div>

        <div className="enterprise-card p-5 rounded-2xl">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Resolved Today</p>
            <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-xl">
              <CheckCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <h3 className="text-3xl font-black text-emerald-600 dark:text-emerald-400">{resolvedCount}</h3>
            <span className="text-xs font-bold text-emerald-600">tickets verified</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">98.4% SLA Compliance</p>
        </div>
      </div>

      {/* Incident Queue */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Dispatch Incident Queue</CardTitle>
            <p className="text-xs text-slate-500 mt-0.5">Click any ticket to inspect evidence and submit audit remarks</p>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="h-9 text-xs font-semibold rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900 px-3 dark:text-slate-200"
            >
              <option value="All">All Priorities</option>
              <option value="Critical">Critical Only</option>
              <option value="High">High Only</option>
              <option value="Medium">Medium</option>
            </select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-12 flex justify-center text-slate-400">
                <Loader2 className="w-6 h-6 animate-spin mr-2" /> Synchronizing dispatch queue...
              </div>
            ) : filtered.length === 0 ? (
              <div className="p-12 text-center text-slate-500">
                No active incidents in your queue right now.
              </div>
            ) : (
              <table className="w-full text-sm text-left">
                <thead className="text-[11px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50/50 dark:bg-slate-950/40 border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="px-6 py-3.5">Ticket ID</th>
                    <th className="px-6 py-3.5">Incident Details</th>
                    <th className="px-6 py-3.5">Priority</th>
                    <th className="px-6 py-3.5">Status</th>
                    <th className="px-6 py-3.5 text-right">Rapid Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filtered.map((issue) => (
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
                        <Button 
                          size="sm" 
                          variant={issue.status === 'Resolved' ? 'secondary' : 'default'}
                          isLoading={updatingId === (issue._id || issue.id)}
                          onClick={(e) => handleStatusToggle(e, issue)}
                          className="font-bold text-xs shadow-xs"
                        >
                          {issue.status === 'Resolved' ? 'Re-open' : issue.status === 'In Progress' ? 'Mark Resolved' : 'Claim & Start'}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Ticket Details Modal */}
      <IssueDetailModal 
        issue={selectedIssue} 
        isOpen={!!selectedIssue} 
        onClose={() => setSelectedIssue(null)}
        onUpdated={fetchAssigned}
        role="officer"
      />
    </div>
  );
}
