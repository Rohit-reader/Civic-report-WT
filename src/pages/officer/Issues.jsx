import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, Button, Badge } from '../../components/ui';
import { issuesAPI } from '../../lib/api';
import { MOCK_ISSUES } from '../../lib/mockData';
import { 
  MapPin, Layers, Navigation, Compass, AlertCircle, 
  ShieldAlert, Eye, CheckCircle2, Loader2, Radio, Filter
} from 'lucide-react';
import { IssueDetailModal } from '../../components/IssueDetailModal';

export const OfficerIssues = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [activePin, setActivePin] = useState(null);
  const [mapMode, setMapMode] = useState('satellite'); // 'streets' or 'satellite'
  const [filterCategory, setFilterCategory] = useState('All');

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const res = await issuesAPI.getAll();
        if (res.success && res.data) {
          setIssues(res.data);
          setActivePin(res.data[0]);
        } else {
          setIssues(MOCK_ISSUES);
          setActivePin(MOCK_ISSUES[0]);
        }
      } catch (err) {
        console.warn('Using fallback data for map:', err?.message);
        setIssues(MOCK_ISSUES);
        setActivePin(MOCK_ISSUES[0]);
      } finally {
        setLoading(false);
      }
    };
    fetchIssues();
  }, []);

  const filteredIssues = issues.filter(i => filterCategory === 'All' || i.category === filterCategory);

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 text-xs font-bold mb-1.5">
            <Radio className="w-3.5 h-3.5 animate-pulse text-blue-500" /> Live GIS Dispatch Radar
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Geographic Incident Map</h1>
          <p className="text-xs text-slate-500">Real-time geolocation pins and jurisdiction zoning.</p>
        </div>

        {/* Map Mode Controls */}
        <div className="flex items-center gap-2">
          <div className="flex p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setMapMode('streets')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                mapMode === 'streets' ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-xs' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Terrain Map
            </button>
            <button
              onClick={() => setMapMode('satellite')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                mapMode === 'satellite' ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-xs' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Satellite Live
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[620px]">
        {/* Interactive Map Visualizer */}
        <Card className="lg:col-span-2 overflow-hidden flex flex-col relative border-slate-200 dark:border-slate-800 shadow-lg">
          <div className={`flex-1 relative flex items-center justify-center overflow-hidden ${
            mapMode === 'satellite' 
              ? 'bg-slate-950 text-white' 
              : 'bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white'
          }`}>
            {/* Grid Pattern Overlay */}
            <div 
              className="absolute inset-0 opacity-20" 
              style={{ 
                backgroundImage: 'radial-gradient(circle, #3b82f6 1px, transparent 1px)', 
                backgroundSize: '30px 30px' 
              }} 
            />

            {/* Live Radar Sweep Animation */}
            <div className="absolute w-[500px] h-[500px] rounded-full border border-blue-500/20 animate-ping pointer-events-none opacity-40" />
            <div className="absolute w-[300px] h-[300px] rounded-full border border-blue-500/30 pointer-events-none" />
            <div className="absolute w-[150px] h-[150px] rounded-full border border-blue-500/40 pointer-events-none" />

            {/* Interactive Pins */}
            {filteredIssues.map((issue, idx) => {
              const leftPercent = 25 + (idx * 16) % 60;
              const topPercent = 20 + (idx * 18) % 60;
              const isSelected = activePin?._id === issue._id || activePin?.id === issue.id;

              return (
                <div
                  key={issue._id || issue.id}
                  style={{ left: `${leftPercent}%`, top: `${topPercent}%` }}
                  className="absolute cursor-pointer -translate-x-1/2 -translate-y-1/2 z-20 group"
                  onClick={() => {
                    setActivePin(issue);
                  }}
                >
                  <div className={`relative flex items-center justify-center transition-transform ${
                    isSelected ? 'scale-125 z-30' : 'hover:scale-110'
                  }`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white shadow-lg ring-4 ${
                      issue.priority === 'Critical' ? 'bg-rose-600 ring-rose-500/30 animate-bounce' :
                      issue.priority === 'High' ? 'bg-amber-500 ring-amber-400/30' :
                      'bg-blue-600 ring-blue-500/30'
                    }`}>
                      <MapPin className="w-4 h-4" />
                    </div>

                    {/* Tooltip on pin hover */}
                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block bg-slate-900 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg whitespace-nowrap shadow-xl border border-slate-700 pointer-events-none z-40">
                      {issue.title}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Map Center Coordinates Pill */}
            <div className="absolute top-4 left-4 z-20 p-2.5 rounded-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 text-xs shadow-md">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="font-mono font-bold text-slate-700 dark:text-slate-200">
                  Sector Alpha (40.7128° N, 74.0060° W)
                </span>
              </div>
            </div>

            {/* Map Legend Overlay */}
            <div className="absolute bottom-4 left-4 z-20 p-3 rounded-xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-800 text-[11px] shadow-md flex items-center gap-4">
              <span className="font-bold text-slate-400">PRIORITY:</span>
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Critical</div>
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> High</div>
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Medium/Low</div>
            </div>
          </div>
        </Card>

        {/* Sidebar Pin Inspector */}
        <Card className="flex flex-col h-full overflow-hidden border-slate-200 dark:border-slate-800 shadow-lg">
          <CardHeader className="bg-slate-50 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 py-3.5">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-bold">Incident Radar Queue</CardTitle>
              <Badge variant="primary">{filteredIssues.length} Pins</Badge>
            </div>
          </CardHeader>
          
          <CardContent className="flex-1 overflow-y-auto p-0 divide-y divide-slate-100 dark:divide-slate-800">
            {filteredIssues.map((issue) => {
              const isSelected = activePin?._id === issue._id || activePin?.id === issue.id;
              return (
                <div 
                  key={issue._id || issue.id}
                  onClick={() => setActivePin(issue)}
                  className={`p-4 cursor-pointer transition-all ${
                    isSelected 
                      ? 'bg-blue-50/70 dark:bg-blue-950/30 border-l-4 border-l-blue-600 dark:border-l-blue-400' 
                      : 'hover:bg-slate-50 dark:hover:bg-slate-900/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-slate-400">{issue.issueId || issue.id}</span>
                    <Badge variant={issue.priority === 'Critical' ? 'danger' : issue.priority === 'High' ? 'warning' : 'default'}>
                      {issue.priority}
                    </Badge>
                  </div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white mt-1.5 line-clamp-1">{issue.title}</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                    <MapPin className="w-3 h-3 flex-shrink-0" /> <span className="truncate">{issue.location}</span>
                  </p>
                  
                  {isSelected && (
                    <div className="mt-3 pt-3 border-t border-slate-200/60 dark:border-slate-800/80 flex items-center justify-between">
                      <Badge variant={issue.status === 'Resolved' ? 'success' : 'primary'} dot>
                        {issue.status}
                      </Badge>
                      <Button size="sm" onClick={() => setSelectedIssue(issue)} className="text-xs font-bold">
                        <Eye className="w-3.5 h-3.5 mr-1" /> Inspect Ticket
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Ticket Details Modal */}
      <IssueDetailModal 
        issue={selectedIssue} 
        isOpen={!!selectedIssue} 
        onClose={() => setSelectedIssue(null)}
        role="officer"
      />
    </div>
  );
};

export default OfficerIssues;
