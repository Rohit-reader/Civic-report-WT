import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { 
  FileText, Clock, CheckCircle, Plus, AlertTriangle, 
  MapPin, ArrowUpRight, Shield, Zap, Sparkles, Loader2 
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Button, Badge } from '../../components/ui';
import { issuesAPI } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { MOCK_ISSUES } from '../../lib/mockData';
import { IssueDetailModal } from '../../components/IssueDetailModal';

export default function Dashboard() {
  const { user } = useAuth();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIssue, setSelectedIssue] = useState(null);

  const fetchIssues = async () => {
    try {
      const res = await issuesAPI.getMy();
      if (res.success && res.data) {
        setIssues(res.data);
      } else {
        setIssues(MOCK_ISSUES.filter(i => i.reportedBy === "John Doe"));
      }
    } catch (err) {
      console.warn('Using fallback data:', err?.message);
      setIssues(MOCK_ISSUES.filter(i => i.reportedBy === "John Doe"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  const pendingCount = issues.filter(i => i.status !== 'Resolved').length;
  const resolvedCount = issues.filter(i => i.status === 'Resolved').length;
  const resolutionRate = issues.length > 0 ? Math.round((resolvedCount / issues.length) * 100) : 100;

  const quickCategories = [
    { name: 'Pothole / Road', icon: AlertTriangle, category: 'Infrastructure', color: 'from-amber-500 to-orange-500' },
    { name: 'Streetlight / Power', icon: Zap, category: 'Utilities', color: 'from-blue-500 to-cyan-500' },
    { name: 'Fallen Tree / Park', icon: Shield, category: 'Environment', color: 'from-emerald-500 to-teal-500' },
    { name: 'Waste Cleanup', icon: Sparkles, category: 'Sanitation', color: 'from-purple-500 to-pink-500' },
  ];

  return (
    <div className="space-y-6 font-sans">
      {/* Enterprise City Bulletin Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white shadow-lg relative overflow-hidden flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-200 text-xs font-semibold mb-2">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            Metropolitan Civic Network Active
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            Welcome back, {user?.name || 'Citizen'}!
          </h1>
          <p className="text-sm text-blue-200/80 mt-1 max-w-xl">
            You are actively improving your neighborhood. 24/7 emergency civic response teams are on standby across all 4 districts.
          </p>
        </div>
        <Link to="/report" className="flex-shrink-0">
          <Button className="h-11 px-5 bg-white text-slate-900 hover:bg-blue-50 font-bold shadow-md shadow-white/10">
            <Plus className="w-4 h-4 mr-2" /> Report Civic Issue
          </Button>
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="enterprise-card p-5 rounded-2xl">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Submissions</p>
            <div className="p-2.5 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 rounded-xl">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <h3 className="text-3xl font-black text-slate-900 dark:text-white">{issues.length}</h3>
            <span className="text-xs font-bold text-slate-400">tickets</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Tracked in city records</p>
        </div>

        <div className="enterprise-card p-5 rounded-2xl">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">In Progress / Review</p>
            <div className="p-2.5 bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 rounded-xl">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <h3 className="text-3xl font-black text-amber-600 dark:text-amber-400">{pendingCount}</h3>
            <span className="text-xs font-bold text-slate-400">active</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Dispatched to field units</p>
        </div>

        <div className="enterprise-card p-5 rounded-2xl">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Resolution Rate</p>
            <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-xl">
              <CheckCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <h3 className="text-3xl font-black text-emerald-600 dark:text-emerald-400">{resolutionRate}%</h3>
            <span className="text-xs font-bold text-emerald-600">({resolvedCount} resolved)</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Average SLA: 48 Hours</p>
        </div>
      </div>

      {/* Quick Category Action Cards */}
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
          Quick Incident Reporting
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          {quickCategories.map((qc, i) => {
            const Icon = qc.icon;
            return (
              <Link
                key={i}
                to={`/report?category=${qc.category}`}
                className="group enterprise-card p-4 rounded-2xl hover:border-blue-500 dark:hover:border-blue-500/50 transition-all flex items-center gap-3.5"
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${qc.color} flex items-center justify-center text-white shadow-sm flex-shrink-0 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">{qc.name}</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                    Direct Report <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Reports List with interactive Modal */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>My Recent Reports</CardTitle>
              <p className="text-xs text-slate-500 mt-0.5">Click any ticket to inspect lifecycle and audit records</p>
            </div>
            <Link to="/my-reports" className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">
              View All ({issues.length})
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-12 flex justify-center text-slate-400">
              <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading recent submissions...
            </div>
          ) : issues.length === 0 ? (
            <div className="py-12 text-center text-slate-500">
              <p className="text-sm font-semibold">No issues submitted yet.</p>
              <Link to="/report" className="text-blue-600 font-bold text-xs mt-2 inline-block hover:underline">
                + Report your first civic issue
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {issues.slice(0, 4).map((issue) => (
                <div 
                  key={issue._id || issue.id}
                  onClick={() => setSelectedIssue(issue)}
                  className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/60 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:border-blue-300 dark:hover:border-blue-800 transition-all cursor-pointer flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="mt-1 p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-slate-400">
                          {issue.issueId || issue.id}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                          {issue.title}
                        </h4>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        {issue.location} • Reported {new Date(issue.createdAt || Date.now()).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <Badge variant={issue.priority === 'Critical' ? 'danger' : issue.priority === 'High' ? 'warning' : 'default'}>
                      {issue.priority}
                    </Badge>
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
                </div>
              ))}
            </div>
          )}
        </CardContent>
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
