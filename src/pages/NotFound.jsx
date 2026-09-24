import React from 'react';
import { Link } from 'react-router';
import { Button } from '../components/ui';
import { AlertCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4 font-sans">
      <div className="bg-red-50 text-red-500 p-6 rounded-full mb-6 dark:bg-red-900/20">
        <AlertCircle className="w-16 h-16" />
      </div>
      <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-2">404</h1>
      <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-300 mb-4">Page Not Found</h2>
      <p className="text-slate-500 mb-8 max-w-md">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link to="/">
        <Button size="lg">Return to Home</Button>
      </Link>
    </div>
  );
}
