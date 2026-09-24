import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui';
import { MOCK_ISSUES } from '../../lib/mockData';
import { MapPin } from 'lucide-react';

export default function Issues() {
  return (
    <div className="space-y-6 font-sans h-[calc(100vh-8rem)] flex flex-col">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Issue Map</h1>
        <p className="text-slate-500 mt-1">Geographic overview of all assigned issues in your jurisdiction.</p>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map View Mock */}
        <Card className="lg:col-span-2 overflow-hidden flex flex-col">
          <div className="flex-1 bg-slate-200 dark:bg-slate-800 relative flex items-center justify-center">
            {/* Fake Map Background */}
            <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")' }}></div>
            <div className="text-center z-10 p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-xl border border-slate-300 dark:border-slate-700">
              <MapPin className="w-12 h-12 text-blue-600 mx-auto mb-2" />
              <h3 className="text-lg font-bold">Interactive Map Module</h3>
              <p className="text-sm text-slate-500">Google Maps / Mapbox integration goes here.</p>
            </div>
            
            {/* Mock Pins */}
            <div className="absolute top-1/4 left-1/3 w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-lg animate-bounce"></div>
            <div className="absolute top-1/2 left-2/3 w-4 h-4 bg-orange-500 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
            <div className="absolute bottom-1/3 right-1/4 w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg"></div>
          </div>
        </Card>

        {/* Sidebar List */}
        <Card className="flex flex-col h-full overflow-hidden">
          <CardHeader className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
            <CardTitle>Nearby Issues</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto p-0">
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {MOCK_ISSUES.map(issue => (
                <div key={issue.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-900/50 cursor-pointer transition-colors">
                  <h4 className="font-semibold text-slate-900 dark:text-white line-clamp-1">{issue.title}</h4>
                  <div className="flex items-center text-xs text-slate-500 mt-1">
                    <MapPin className="w-3.5 h-3.5 mr-1" /> {issue.location}
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className={`px-2 py-0.5 text-[10px] uppercase font-bold rounded-sm ${
                      issue.status === 'Resolved' ? 'bg-green-100 text-green-700 dark:bg-green-900/30' :
                      'bg-orange-100 text-orange-700 dark:bg-orange-900/30'
                    }`}>
                      {issue.status}
                    </span>
                    <span className="text-xs text-slate-400">{issue.id}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
