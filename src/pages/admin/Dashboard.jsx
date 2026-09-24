import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, Button, Badge } from '../../components/ui';
import { MOCK_STATS } from '../../lib/mockData';
import { statsAPI, issuesAPI } from '../../lib/api';
import { 
  BarChart3, Users, FileText, CheckCircle, Loader2, 
  Download, Sparkles, TrendingUp, ShieldCheck, Activity,
  Layers, ArrowUpRight, Clock
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { ExportReportModal } from '../../components/ExportReportModal';

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
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [allIssues, setAllIssues] = useState([]);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [statsRes, issuesRes] = await Promise.all([
          statsAPI.getOverview(),
          issuesAPI.getAll()
        ]);
        if (statsRes.success) {
          if (statsRes.stats) setStats(statsRes.stats);
          if (statsRes.categories) setCategoryDataMap(statsRes.categories);
          if (statsRes.trends) setTrendDataMap(statsRes.trends);
        }
        if (issuesRes.success && issuesRes.data) {
          setAllIssues(issuesRes.data);
        }
      } catch (err) {
        console.warn('Using default statistics fallback:', err?.message);
      }
    };
    loadStats();
  }, []);

  const currentTrendData = trendDataMap[trendRange] || trendDataMap['1y'];
  const currentCategoryData = categoryDataMap[categoryFilter] || categoryDataMap['all'];

  return (
    <div className="space-y-6 font-sans">
      {/* Executive Command Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-xs font-bold mb-1.5">
            <ShieldCheck className="w-3.5 h-3.5" /> Executive BI & City Governance
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Admin Intelligence Overview</h1>
          <p className="text-sm text-slate-500">Cross-departmental performance, SLA metrics, and issue resolution trends.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="secondary" 
            className="font-bold text-xs"
            onClick={() => setIsExportOpen(true)}
          >
            <Download className="w-4 h-4 mr-2" /> Export Datasets
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { 
            label: "Total Civic Incidents", 
            value: stats.totalIssues, 
            icon: FileText, 
            color: "text-blue-600 dark:text-blue-400", 
            bg: "bg-blue-50 dark:bg-blue-950/60",
            trend: "+12% this month",
            trendColor: "text-blue-500"
          },
          { 
            label: "Resolved Incidents", 
            value: stats.resolvedIssues, 
            icon: CheckCircle, 
            color: "text-emerald-600 dark:text-emerald-400", 
            bg: "bg-emerald-50 dark:bg-emerald-950/60",
            trend: "94.2% SLA verified",
            trendColor: "text-emerald-500"
          },
          { 
            label: "Active Queue", 
            value: stats.pendingIssues, 
            icon: Clock, 
            color: "text-amber-600 dark:text-amber-400", 
            bg: "bg-amber-50 dark:bg-amber-950/60",
            trend: "Average 18 hrs open",
            trendColor: "text-amber-500"
          },
          { 
            label: "Avg Resolution Velocity", 
            value: stats.avgResolutionTime, 
            icon: TrendingUp, 
            color: "text-purple-600 dark:text-purple-400", 
            bg: "bg-purple-50 dark:bg-purple-950/60",
            trend: "14% faster than target",
            trendColor: "text-purple-500"
          }
        ].map((stat, i) => (
          <div key={i} className="enterprise-card p-5 rounded-2xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{stat.label}</span>
              <div className={`p-2.5 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <h3 className="text-3xl font-black text-slate-900 dark:text-white">{stat.value}</h3>
            </div>
            <p className={`text-xs font-semibold ${stat.trendColor} mt-2 flex items-center gap-1`}>
              <ArrowUpRight className="w-3 h-3" /> {stat.trend}
            </p>
          </div>
        ))}
      </div>

      {/* BI Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <div>
              <CardTitle className="text-sm font-bold">Issues by Municipal Category</CardTitle>
              <p className="text-xs text-slate-400">Distribution across city service categories</p>
            </div>
            <select 
              value={categoryFilter} 
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1 text-slate-700 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300 focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="all">All Priorities</option>
              <option value="critical">Critical Only</option>
            </select>
          </CardHeader>
          <CardContent className="h-72 mx-2 mb-2 pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={currentCategoryData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#33415520" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11, fontWeight: 600}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11}} />
                <Tooltip 
                  cursor={{fill: 'rgba(59, 130, 246, 0.05)'}} 
                  contentStyle={{borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: '#0f172a', color: '#fff', fontSize: '12px'}} 
                />
                <Bar dataKey="value" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Resolution Trend */}
        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <div>
              <CardTitle className="text-sm font-bold">Resolution Velocity vs Inflow</CardTitle>
              <p className="text-xs text-slate-400">Reported vs resolved incidents timeline</p>
            </div>
            <select 
              value={trendRange} 
              onChange={(e) => setTrendRange(e.target.value)}
              className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1 text-slate-700 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300 focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="7d">Last 7 Days</option>
              <option value="1m">This Month</option>
              <option value="1y">This Year</option>
            </select>
          </CardHeader>
          <CardContent className="h-72 mx-2 mb-2 pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={currentTrendData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorReported" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#33415520" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11, fontWeight: 600}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11}} />
                <Tooltip 
                  contentStyle={{borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: '#0f172a', color: '#fff', fontSize: '12px'}} 
                />
                <Area type="monotone" dataKey="reported" stroke="#3b82f6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorReported)" name="Reported" />
                <Area type="monotone" dataKey="resolved" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorResolved)" name="Resolved" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Export Datasets Modal */}
      <ExportReportModal 
        isOpen={isExportOpen} 
        onClose={() => setIsExportOpen(false)} 
        data={allIssues}
        title="Comprehensive Civic Issues Export"
      />
    </div>
  );
}
