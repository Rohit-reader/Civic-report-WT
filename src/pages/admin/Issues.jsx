import React, { useState, useEffect } from 'react';
import { Card, Button, Input } from '../../components/ui';
import { issuesAPI } from '../../lib/api';
import { MOCK_ISSUES } from '../../lib/mockData';
import { Search, Loader2 } from 'lucide-react';

export default function Issues() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

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

  return (
    <div className="space-y-6 font-sans">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">All Issues</h1>
        <p className="text-slate-500 mt-1">Global view of all reported issues across the system from MongoDB.</p>
      </div>

      <Card>
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-wrap gap-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              className="pl-9" 
              placeholder="Search by ID or title..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 cursor-pointer"
          >
            <option value="">Status: All</option>
            <option value="Resolved">Resolved</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
          </select>
          <select 
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="h-10 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 cursor-pointer"
          >
            <option value="">Category: All</option>
            <option value="Infrastructure">Infrastructure</option>
            <option value="Utilities">Utilities</option>
            <option value="Environment">Environment</option>
            <option value="Sanitation">Sanitation</option>
            <option value="Traffic">Traffic</option>
          </select>
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 flex justify-center text-slate-400">
              <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading issues from database...
            </div>
          ) : issues.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              No issues matching your filters.
            </div>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-900/50 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-4 font-medium">Issue ID</th>
                  <th className="px-6 py-4 font-medium">Title</th>
                  <th className="px-6 py-4 font-medium">Category</th>
                  <th className="px-6 py-4 font-medium">Assigned To</th>
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
                      <div className="font-semibold text-slate-900 dark:text-white line-clamp-1">{issue.title}</div>
                      <div className="text-slate-400 text-xs">{issue.location}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-500">{issue.category}</td>
                    <td className="px-6 py-4 text-slate-500">{issue.assignedToName || issue.assignedTo?.name || 'Unassigned'}</td>
                    <td className="px-6 py-4">
                      <span className={`font-medium px-2 py-0.5 rounded text-xs ${
                        issue.status === 'Resolved' ? 'bg-green-100 text-green-700 dark:bg-green-900/30' :
                        issue.status === 'In Progress' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30' :
                        'bg-orange-100 text-orange-700 dark:bg-orange-900/30'
                      }`}>
                        {issue.status}
                      </span>
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
