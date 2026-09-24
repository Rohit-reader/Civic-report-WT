import React, { useEffect, useState } from 'react';
import { Card } from '../../components/ui';
import { issuesAPI } from '../../lib/api';
import { MOCK_ISSUES } from '../../lib/mockData';
import { CheckCircle, Clock, AlertCircle, Loader2 } from 'lucide-react';

export default function MyReports() {
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
        console.warn('Using fallback data in MyReports:', err?.message);
        setIssues(MOCK_ISSUES.filter(i => i.reportedBy === "John Doe"));
      } finally {
        setLoading(false);
      }
    };
    fetchIssues();
  }, []);

  const getStatusIcon = (status) => {
    if (status === 'Resolved') return <CheckCircle className="w-4 h-4 mr-1.5 text-green-600 dark:text-green-400" />;
    if (status === 'In Progress') return <Clock className="w-4 h-4 mr-1.5 text-blue-600 dark:text-blue-400" />;
    return <AlertCircle className="w-4 h-4 mr-1.5 text-orange-600 dark:text-orange-400" />;
  };

  return (
    <div className="space-y-6 font-sans">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Reports</h1>
        <p className="text-slate-500 mt-1">Track the status of your reported issues.</p>
      </div>

      <Card>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 flex justify-center text-slate-400">
              <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading reports...
            </div>
          ) : issues.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              No reports found. Create your first civic report!
            </div>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-900/50 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-4 font-medium">Issue ID</th>
                  <th className="px-6 py-4 font-medium">Title & Location</th>
                  <th className="px-6 py-4 font-medium">Category</th>
                  <th className="px-6 py-4 font-medium">Date Reported</th>
                  <th className="px-6 py-4 font-medium">Status</th>
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
                      <span className="bg-slate-100 text-slate-800 text-xs font-medium px-2.5 py-1 rounded dark:bg-slate-800 dark:text-slate-300">
                        {issue.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {new Date(issue.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {getStatusIcon(issue.status)}
                        <span className="font-medium">{issue.status}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Card>
    </div>
  );
}
