import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { FileText, Clock, CheckCircle, Plus, Loader2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Button } from '../../components/ui';
import { issuesAPI } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { MOCK_ISSUES } from '../../lib/mockData';

export default function Dashboard() {
  const { user } = useAuth();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    fetchIssues();
  }, []);

  const pendingCount = issues.filter(i => i.status !== 'Resolved').length;
  const resolvedCount = issues.filter(i => i.status === 'Resolved').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Welcome back, {user?.name || 'Citizen'}!
        </h1>
        <Link to="/report">
          <Button><Plus className="w-4 h-4 mr-2" /> Report Issue</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6 pt-6 flex items-center space-x-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-full dark:bg-blue-900/50 dark:text-blue-400">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Reports</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{issues.length}</h3>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 pt-6 flex items-center space-x-4">
            <div className="p-3 bg-orange-100 text-orange-600 rounded-full dark:bg-orange-900/50 dark:text-orange-400">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">In Progress</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{pendingCount}</h3>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 pt-6 flex items-center space-x-4">
            <div className="p-3 bg-green-100 text-green-600 rounded-full dark:bg-green-900/50 dark:text-green-400">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Resolved</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{resolvedCount}</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Reports</CardTitle>
            <Link to="/my-reports" className="text-sm font-medium text-blue-600 hover:text-blue-500">View all</Link>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-8 flex justify-center text-slate-400">
              <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading reports...
            </div>
          ) : issues.length === 0 ? (
            <div className="py-8 text-center text-slate-500">
              <p>No issues reported yet.</p>
              <Link to="/report" className="text-blue-600 font-medium text-sm mt-2 inline-block">
                Report your first issue
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {issues.slice(0, 3).map((issue) => (
                <div key={issue._id || issue.id} className="flex items-center justify-between p-4 rounded-lg border border-slate-100 bg-slate-50 dark:bg-slate-900 dark:border-slate-800">
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white">{issue.title}</h4>
                    <p className="text-sm text-slate-500 mt-1">{issue.location} • {new Date(issue.createdAt).toLocaleDateString()}</p>
                  </div>
                  <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                    issue.status === 'Resolved' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                    issue.status === 'In Progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                    'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400'
                  }`}>
                    {issue.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
