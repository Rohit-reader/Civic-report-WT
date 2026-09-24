import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, Button } from '../../components/ui';
import { issuesAPI } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { MOCK_ISSUES } from '../../lib/mockData';
import { Clock, CheckCircle, AlertTriangle, MapPin, Loader2 } from 'lucide-react';
import { Link } from 'react-router';

export default function Dashboard() {
  const { user } = useAuth();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchAssigned = async () => {
    try {
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

  const handleStatusToggle = async (issue) => {
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
  const highPriority = issues.filter(i => i.priority === 'High' || i.priority === 'Critical').length;
  const resolvedCount = issues.filter(i => i.status === 'Resolved').length;

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Officer Dashboard</h1>
          <p className="text-slate-500 mt-1">Welcome back, Officer {user?.name || 'Jane Smith'}.</p>
        </div>
        <Link to="/officer/issues">
          <Button><MapPin className="w-4 h-4 mr-2" /> View Map</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6 pt-6 flex items-center space-x-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-full dark:bg-blue-900/50 dark:text-blue-400">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Pending Tasks</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{pending}</h3>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 pt-6 flex items-center space-x-4">
            <div className="p-3 bg-red-100 text-red-600 rounded-full dark:bg-red-900/50 dark:text-red-400">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">High Priority</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                {highPriority}
              </h3>
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
          <CardTitle>My Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-8 flex justify-center text-slate-400">
                <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading assigned tasks...
              </div>
            ) : issues.length === 0 ? (
              <div className="p-8 text-center text-slate-500">
                No tasks currently assigned.
              </div>
            ) : (
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-900/50 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="px-6 py-4 font-medium">Issue ID</th>
                    <th className="px-6 py-4 font-medium">Details</th>
                    <th className="px-6 py-4 font-medium">Priority</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {issues.map((issue) => (
                    <tr key={issue._id || issue.id} className="bg-white border-b border-slate-100 dark:bg-slate-950 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-900 dark:text-white whitespace-nowrap">
                        {issue.issueId || issue.id}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-900 dark:text-white mb-1">{issue.title}</div>
                        <div className="text-slate-500 text-xs">{issue.location}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                          issue.priority === 'Critical' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                          issue.priority === 'High' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400' :
                          'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                        }`}>
                          {issue.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`font-medium px-2 py-0.5 rounded text-xs ${
                          issue.status === 'Resolved' ? 'bg-green-100 text-green-700 dark:bg-green-900/30' :
                          issue.status === 'In Progress' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30' :
                          'bg-amber-100 text-amber-700 dark:bg-amber-900/30'
                        }`}>
                          {issue.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button 
                          size="sm" 
                          variant="secondary"
                          isLoading={updatingId === (issue._id || issue.id)}
                          onClick={() => handleStatusToggle(issue)}
                        >
                          {issue.status === 'Resolved' ? 'Reopen' : issue.status === 'In Progress' ? 'Mark Resolved' : 'Start Working'}
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
    </div>
  );
}
