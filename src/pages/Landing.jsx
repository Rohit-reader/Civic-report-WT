import React from 'react';
import { Link, useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import { 
  ArrowRight, AlertTriangle, ShieldCheck, Clock, 
  MapPin, CheckCircle, Sparkles, Building2, Zap, 
  Users, Activity, Lock, ChevronRight, Compass, Radio
} from 'lucide-react';
import { Button, Badge } from '../components/ui';
import { ThemeToggle } from '../components/ThemeToggle';
import { useAuth } from '../context/AuthContext';

export default function Landing() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleQuickLogin = async (email, rolePath) => {
    const res = await login(email, 'password123');
    if (res.success) {
      navigate(rolePath);
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-[#070b14] font-sans text-slate-900 dark:text-white transition-colors duration-200">
      {/* Top Enterprise Nav */}
      <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white/80 backdrop-blur-md px-4 sm:px-8 dark:border-slate-800/80 dark:bg-[#070b14]/80">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-lg shadow-md shadow-blue-500/20">
            CR
          </div>
          <span className="text-lg font-black tracking-tight">
            Civic<span className="text-blue-600 dark:text-blue-400">Resolve</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link to="/login">
            <Button variant="ghost" size="sm" className="font-bold text-xs">
              Sign In
            </Button>
          </Link>
          <Link to="/register">
            <Button size="sm" className="font-bold text-xs shadow-md shadow-blue-500/20">
              Get Started <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-28">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-600/15 via-transparent to-transparent pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-bold mb-6"
          >
            <Sparkles className="w-3.5 h-3.5" /> Next-Generation Civic Intelligence & Urban Operations
          </motion.div>

          <motion.h1 
            className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight mb-6 leading-none"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Empowering Citizens. <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-400 bg-clip-text text-transparent">
              Transforming Municipalities.
            </span>
          </motion.h1>
          
          <motion.p 
            className="mt-6 text-base sm:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed font-normal"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            An enterprise-grade civic issue reporting and dispatch platform. Real-time GIS maps, automated department workload distribution, and SLA-backed resolution tracking.
          </motion.p>
          
          {/* Main CTAs */}
          <motion.div 
            className="flex flex-col sm:flex-row items-center justify-center gap-3.5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Link to="/report">
              <Button size="lg" className="w-full sm:w-auto h-12 px-8 font-bold text-sm shadow-xl shadow-blue-500/25">
                <AlertTriangle className="w-4 h-4 mr-2" /> Report Incident Now
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto h-12 px-8 font-bold text-sm">
                Open Command Portal
              </Button>
            </Link>
          </motion.div>

          {/* Quick Demo Test-Drive Badges */}
          <div className="mt-12 pt-8 border-t border-slate-200/80 dark:border-slate-800/80 max-w-xl mx-auto">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              One-Click Role Test-Drive
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              <button
                onClick={() => handleQuickLogin('citizen@example.com', '/dashboard')}
                className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950/50 dark:hover:text-blue-300 border border-slate-200 dark:border-slate-700 text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <span>👤 Citizen View</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
              <button
                onClick={() => handleQuickLogin('officer@example.com', '/officer')}
                className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950/50 dark:hover:text-blue-300 border border-slate-200 dark:border-slate-700 text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <span>🛡️ Field Officer View</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
              <button
                onClick={() => handleQuickLogin('admin@example.com', '/admin')}
                className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-purple-50 hover:text-purple-600 dark:hover:bg-purple-950/50 dark:hover:text-purple-300 border border-slate-200 dark:border-slate-700 text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <span>⚡ Admin Command BI</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Live Impact Stats Bar */}
      <section className="py-10 bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-3xl sm:text-4xl font-black text-blue-600 dark:text-blue-400">98.4%</p>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mt-1">SLA Compliance Rate</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-black text-emerald-600 dark:text-emerald-400">48 hrs</p>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mt-1">Avg Resolution Velocity</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-black text-indigo-600 dark:text-indigo-400">4 Sectors</p>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mt-1">Active GIS Zoning</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-black text-purple-600 dark:text-purple-400">24/7</p>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mt-1">Emergency Dispatch</p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Enterprise Architecture */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge variant="primary">Architectural Pillars</Badge>
          <h2 className="text-3xl sm:text-4xl font-black mt-3">Engineered for Metropolitan Governance</h2>
          <p className="mt-2 text-sm text-slate-500 max-w-xl mx-auto">Seamless synchronization between citizen mobile reporting and municipal response crews.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: AlertTriangle,
              title: "AI-Augmented Incident Intake",
              desc: "Citizens submit photos with automatic GPS pinpointing and smart severity categorization.",
              color: "from-amber-500 to-orange-500",
            },
            {
              icon: Radio,
              title: "Real-Time Field Dispatch",
              desc: "Field officers receive prioritized tickets with geo-radar clustering and one-click status transitions.",
              color: "from-blue-500 to-indigo-600",
            },
            {
              icon: Building2,
              title: "Department Resource Allocation",
              desc: "Executive BI dashboards monitor open bottlenecks, department staff capacity, and SLA adherence.",
              color: "from-purple-500 to-pink-600",
            }
          ].map((card, i) => {
            const Icon = card.icon;
            return (
              <div key={i} className="enterprise-card p-8 rounded-3xl flex flex-col justify-between">
                <div>
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${card.color} text-white flex items-center justify-center shadow-md mb-6`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{card.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{card.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-8 bg-white dark:bg-[#070b14] border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-400">
        <p>© 2026 CivicResolve Enterprise Platform. Powered by Node.js, Express & MongoDB.</p>
      </footer>
    </div>
  );
}
