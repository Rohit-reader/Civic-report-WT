import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui';
import { MOCK_STATS } from '../../lib/mockData';
import { statsAPI } from '../../lib/api';
import { BarChart3, Users, FileText, CheckCircle, Loader2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const defaultCategoryDataMap = {
  all: [
    { name: 'Infrastructure', value: 400 },
    { name: 'Sanitation', value: 300 },
    { name: 'Traffic', value: 200 },
    { name: 'Utilities', value: 278 },
    { name: 'Other', value: 189 },
  ],
  critical: [
    { name: 'Infrastructure', value: 150 },
    { name: 'Sanitation', value: 45 },
    { name: 'Traffic', value: 90 },
    { name: 'Utilities', value: 120 },
    { name: 'Other', value: 25 },
  ]
};

const defaultTrendDataMap = {
  '7d': [
    { name: 'Mon', resolved: 12, reported: 15 },
    { name: 'Tue', resolved: 19, reported: 22 },
    { name: 'Wed', resolved: 15, reported: 18 },
    { name: 'Thu', resolved: 22, reported: 25 },
    { name: 'Fri', resolved: 28, reported: 20 },
    { name: 'Sat', resolved: 10, reported: 12 },
    { name: 'Sun', resolved: 14, reported: 10 },
  ],
  '1m': [
    { name: 'Week 1', resolved: 50, reported: 60 },
    { name: 'Week 2', resolved: 70, reported: 65 },
    { name: 'Week 3', resolved: 85, reported: 80 },
    { name: 'Week 4', resolved: 95, reported: 90 },
  ],
  '1y': [
    { name: 'Jan', resolved: 40, reported: 60 },
    { name: 'Feb', resolved: 55, reported: 70 },
    { name: 'Mar', resolved: 75, reported: 65 },
    { name: 'Apr', resolved: 90, reported: 85 },
    { name: 'May', resolved: 110, reported: 90 },
    { name: 'Jun', resolved: 145, reported: 120 },
    { name: 'Jul', resolved: 170, reported: 150 },
  ]
};

export default function Dashboard() {
  const [stats, setStats] = useState(MOCK_STATS);
  const [categoryDataMap, setCategoryDataMap] = useState(defaultCategoryDataMap);
  const [trendDataMap, setTrendDataMap] = useState(defaultTrendDataMap);
  const [trendRange, setTrendRange] = useState('1y');
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    const loadStats = async () => {
      try {
        const res = await statsAPI.getOverview();
        if (res.success) {
          if (res.stats) setStats(res.stats);
          if (res.categories) setCategoryDataMap(res.categories);
          if (res.trends) setTrendDataMap(res.trends);
        }
      } catch (err) {
        console.warn('Using default statistics fallback:', err?.message);
      }
    };
    loadStats();
  }, []);

  const currentTrendData = trendDataMap[trendRange];
  const currentCategoryData = categoryDataMap[categoryFilter];
  return (
    <div className="space-y-6 font-sans">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Admin Overview</h1>
        <p className="text-slate-500 mt-1">System wide statistics and reports.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Issues", value: stats.totalIssues, icon: FileText, color: "text-blue-600", bg: "bg-blue-100 dark:bg-blue-900/50" },
          { label: "Resolved", value: stats.resolvedIssues, icon: CheckCircle, color: "text-green-600", bg: "bg-green-100 dark:bg-green-900/50" },
          { label: "Pending", value: stats.pendingIssues, icon: BarChart3, color: "text-orange-600", bg: "bg-orange-100 dark:bg-orange-900/50" },
          { label: "Avg Resolution", value: stats.avgResolutionTime, icon: Users, color: "text-purple-600", bg: "bg-purple-100 dark:bg-purple-900/50" }
        ].map((stat, i) => (
          <Card key={i}>
            <CardContent className="p-6 pt-6 flex items-center space-x-4">
              <div className={`p-3 rounded-full ${stat.bg} ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.label}</p>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</h3>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle>Issues by Category</CardTitle>
            <select 
              value={categoryFilter} 
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="text-sm bg-slate-50 border border-slate-200 rounded-md px-2 py-1 text-slate-700 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="all">All Priorities</option>
              <option value="critical">Critical Only</option>
            </select>
          </CardHeader>
          <CardContent className="h-72 mx-2 mb-2 pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={currentCategoryData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip cursor={{fill: 'rgba(241, 245, 249, 0.5)'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle>Resolution Trend</CardTitle>
            <select 
              value={trendRange} 
              onChange={(e) => setTrendRange(e.target.value)}
              className="text-sm bg-slate-50 border border-slate-200 rounded-md px-2 py-1 text-slate-700 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="7d">Last 7 Days</option>
              <option value="1m">This Month</option>
              <option value="1y">This Year</option>
            </select>
          </CardHeader>
          <CardContent className="h-72 mx-2 mb-2 pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={currentTrendData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorReported" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Area type="monotone" dataKey="reported" stroke="#3b82f6" fillOpacity={1} fill="url(#colorReported)" name="Reported" />
                <Area type="monotone" dataKey="resolved" stroke="#22c55e" fillOpacity={1} fill="url(#colorResolved)" name="Resolved" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
