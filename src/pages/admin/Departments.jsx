import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../../components/ui';
import { departmentsAPI } from '../../lib/api';
import { MOCK_DEPARTMENTS } from '../../lib/mockData';
import { Building2, Users, AlertCircle, Percent, Loader2 } from 'lucide-react';

export default function Departments() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await departmentsAPI.getAll();
        if (res.success && res.data) {
          setDepartments(res.data);
        } else {
          setDepartments(MOCK_DEPARTMENTS);
        }
      } catch (err) {
        console.warn('Using fallback departments:', err?.message);
        setDepartments(MOCK_DEPARTMENTS);
      } finally {
        setLoading(false);
      }
    };
    fetchDepartments();
  }, []);

  return (
    <div className="space-y-6 font-sans">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Departments</h1>
        <p className="text-slate-500 mt-1">Manage government departments and view performance metrics.</p>
      </div>

      {loading ? (
        <div className="p-12 flex justify-center text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin mr-2" /> Loading departments...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {departments.map((dept) => (
            <Card key={dept._id || dept.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2.5 bg-blue-100 text-blue-600 rounded-lg dark:bg-blue-900/50 dark:text-blue-400">
                      <Building2 className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-slate-900 dark:text-white">{dept.name}</h3>
                      <p className="text-sm text-slate-500">Code: {dept.code || dept.id}</p>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 border-t border-slate-100 dark:border-slate-800 pt-4">
                  <div>
                    <div className="flex items-center text-slate-500 mb-2 text-sm">
                      <Users className="w-4 h-4 mr-1.5" /> Staff
                    </div>
                    <p className="font-semibold text-slate-900 dark:text-white">{dept.officerCount}</p>
                  </div>
                  <div>
                    <div className="flex items-center text-slate-500 mb-2 text-sm">
                      <AlertCircle className="w-4 h-4 mr-1.5 text-orange-500" /> Open Issues
                    </div>
                    <p className="font-semibold text-slate-900 dark:text-white">{dept.openIssues}</p>
                  </div>
                  <div>
                    <div className="flex items-center text-slate-500 mb-2 text-sm">
                      <Percent className="w-4 h-4 mr-1.5 text-green-500" /> Efficiency
                    </div>
                    <p className="font-semibold text-slate-900 dark:text-white">{dept.efficiency}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
