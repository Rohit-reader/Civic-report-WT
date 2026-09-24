import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { Shield, AlertCircle } from 'lucide-react';
import { Button, Input } from '../components/ui';
import { AuthLayout } from '../components/layout';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [serverError, setServerError] = useState('');

  const onSubmit = async (data) => {
    setServerError('');
    const res = await login(data.email, data.password);
    if (res.success) {
      if (res.user.role === 'admin') navigate('/admin');
      else if (res.user.role === 'officer') navigate('/officer');
      else navigate('/dashboard');
    } else {
      setServerError(res.message || 'Login failed. Please check your credentials or ensure backend is running.');
    }
  };

  return (
    <AuthLayout 
      title="Empowering Our Community" 
      subtitle="Join thousands of citizens making our city a better place to live, work, and thrive."
    >
      <div className="mb-10 text-center sm:text-left">
        <div className="inline-flex items-center justify-center p-3 bg-blue-50 text-blue-600 rounded-2xl mb-6">
          <Shield className="w-8 h-8" />
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Welcome back</h2>
        <p className="text-sm text-slate-500">
          Don't have an account? <Link to="/register" className="font-semibold text-blue-600 hover:text-blue-500 transition-colors">Sign up for free</Link>
        </p>
      </div>
      
      {serverError && (
        <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{serverError}</span>
        </div>
      )}

      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Email address</label>
          <Input 
            type="email" 
            autoComplete="email"
            placeholder="john@example.com"
            {...register("email", { required: "Email is required" })}
            error={errors.email?.message}
            className="h-12 bg-slate-50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
          <Input 
            type="password" 
            autoComplete="current-password"
            placeholder="••••••••"
            {...register("password", { required: "Password is required" })}
            error={errors.password?.message}
            className="h-12 bg-slate-50"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded cursor-pointer" />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-600 cursor-pointer">
              Remember me
            </label>
          </div>
          <div className="text-sm">
            <a href="#" className="font-semibold text-blue-600 hover:text-blue-500">Forgot password?</a>
          </div>
        </div>

        <Button type="submit" className="w-full h-12 text-base font-semibold" isLoading={isSubmitting}>
          Sign in to your account
        </Button>
      </form>

      <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
         <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 text-sm text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800">
           <div className="flex items-center justify-between mb-3">
             <p className="font-semibold text-slate-900 dark:text-slate-200">1-Click Quick Demo Login</p>
             <span className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 font-mono px-2 py-0.5 rounded">password123</span>
           </div>
           <div className="grid grid-cols-3 gap-2">
             <button
               type="button"
               onClick={() => {
                 login('admin@example.com', 'password123').then(res => {
                   if (res.success) navigate('/admin');
                 });
               }}
               className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 dark:hover:bg-indigo-900/60 border border-indigo-200 dark:border-indigo-800/50 transition-colors"
             >
               👑 Admin
             </button>
             <button
               type="button"
               onClick={() => {
                 login('officer@example.com', 'password123').then(res => {
                   if (res.success) navigate('/officer');
                 });
               }}
               className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 dark:hover:bg-amber-900/60 border border-amber-200 dark:border-amber-800/50 transition-colors"
             >
               🛡️ Officer
             </button>
             <button
               type="button"
               onClick={() => {
                 login('citizen@example.com', 'password123').then(res => {
                   if (res.success) navigate('/dashboard');
                 });
               }}
               className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800/50 transition-colors"
             >
               🏙️ Citizen
             </button>
           </div>
         </div>
      </div>
    </AuthLayout>
  );
}
