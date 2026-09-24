import React from 'react';
import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { ArrowRight, AlertTriangle, ShieldCheck, Clock, MapPin, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui';
import { MOCK_ISSUES } from '../lib/mockData';
import { ThemeToggle } from '../components/ThemeToggle';

export default function Landing() {
  const recentIssues = MOCK_ISSUES.filter(issue => issue.status === 'Resolved').slice(0, 3);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 font-sans transition-colors duration-200">
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle className="bg-white/50 backdrop-blur-md shadow-sm dark:bg-slate-900/50" />
      </div>
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-32">
        <div className="absolute inset-0 bg-blue-50/50 dark:bg-blue-950/20 -z-10" />
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3">
          <div className="w-96 h-96 bg-blue-400/20 rounded-full blur-3xl opacity-50 dark:opacity-20" />
        </div>
        <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3">
          <div className="w-96 h-96 bg-green-400/20 rounded-full blur-3xl opacity-50 dark:opacity-20" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.h1 
            className="text-5xl md:text-7xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Empowering Citizens, <br className="hidden md:block" />
            <span className="text-blue-600 dark:text-blue-500">Transforming Cities</span>
          </motion.h1>
          
          <motion.p 
            className="mt-6 text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Report civic issues instantly, track resolution progress in real-time, and collaborate with local authorities to build a better community for everyone.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Link to="/report">
              <Button size="lg" className="w-full sm:w-auto group">
                Report an Issue
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                View Dashboard
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">How CivicResolve Works</h2>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">A streamlined process from reporting to resolution.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                icon: AlertTriangle,
                title: "1. Report Issue",
                description: "Spot a pothole, broken streetlight, or garbage dump? Snap a photo and report it in seconds.",
                color: "text-orange-500",
                bg: "bg-orange-100 dark:bg-orange-500/10"
              },
              {
                icon: Clock,
                title: "2. Track Progress",
                description: "Stay updated with real-time status changes as local authorities review and assign your report.",
                color: "text-blue-500",
                bg: "bg-blue-100 dark:bg-blue-500/10"
              },
              {
                icon: ShieldCheck,
                title: "3. Issue Resolved",
                description: "Get notified the moment the issue is fixed. Verify the work and help maintain community standards.",
                color: "text-green-500",
                bg: "bg-green-100 dark:bg-green-500/10"
              }
            ].map((feature, index) => (
              <motion.div 
                key={index}
                className="relative flex flex-col items-center text-center p-8 rounded-3xl bg-slate-50 dark:bg-slate-800/50 transition-shadow hover:shadow-lg dark:hover:shadow-slate-800/50 border border-slate-100 dark:border-slate-800"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className={`p-4 rounded-2xl ${feature.bg} ${feature.color} mb-6`}>
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{feature.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Impact Section (Static Data) */}
      <section className="py-24 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">Recent Resolutions</h2>
              <p className="text-lg text-slate-600 dark:text-slate-400">See how your neighbors are making a difference.</p>
            </div>
            <Link to="/dashboard" className="hidden md:flex items-center text-blue-600 hover:text-blue-700 font-medium">
              View all issues <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentIssues.map((issue, i) => (
              <motion.div 
                key={issue.id}
                className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 group"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <div className="h-56 w-full overflow-hidden relative">
                  <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors z-10" />
                  <img src={issue.img} alt={issue.title} className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-700 ease-in-out" />
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                      {issue.category}
                    </span>
                    <span className="flex items-center text-xs text-green-600 dark:text-green-400 font-bold bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-md">
                      <CheckCircle className="w-3.5 h-3.5 mr-1" /> Resolved
                    </span>
                  </div>
                  <h4 className="font-bold text-xl text-slate-900 dark:text-white mb-2 line-clamp-1">{issue.title}</h4>
                  <div className="flex items-center text-slate-500 dark:text-slate-400 text-sm mb-4">
                    <MapPin className="w-4 h-4 mr-1.5 flex-shrink-0" /> <span className="line-clamp-1">{issue.location}</span>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-xs font-medium text-slate-400 dark:text-slate-500">Reported by {issue.reportedBy}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="mt-10 flex justify-center md:hidden">
            <Link to="/dashboard">
              <Button variant="secondary">View all issues</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-24 bg-blue-600 dark:bg-blue-700">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6 tracking-tight">Ready to improve your neighborhood?</h2>
          <p className="text-blue-100 mb-10 text-xl font-light">Join thousands of active citizens reporting and resolving issues every day.</p>
          <Link to="/register">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-slate-50 focus:ring-white h-14 px-8 text-lg rounded-full shadow-lg hover:shadow-xl transition-all">
              Create Free Account
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
