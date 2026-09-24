import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { Shield, AlertCircle } from 'lucide-react';
import { Button, Input } from '../components/ui';
import { AuthLayout } from '../components/layout';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register: registerField, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const navigate = useNavigate();
  const { register: authRegister } = useAuth();
  const [serverError, setServerError] = useState('');

  const onSubmit = async (data) => {
    setServerError('');
    const res = await authRegister({
      name: data.name,
      email: data.email,
      password: data.password,
    });

    if (res.success) {
      navigate('/dashboard');
    } else {
      setServerError(res.message || 'Registration failed.');
    }
  };

  return (
    <AuthLayout 
      title="Build a Better City Together" 
      subtitle="Report issues, track progress, and contribute to the well-being of your neighborhood."
    >
      <div className="mb-10 text-center sm:text-left">
        <div className="inline-flex items-center justify-center p-3 bg-blue-50 text-blue-600 rounded-2xl mb-6">
          <Shield className="w-8 h-8" />
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Create an account</h2>
        <p className="text-sm text-slate-500">
          Already have an account? <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-500 transition-colors">Sign in here</Link>
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
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
          <Input 
            type="text" 
            placeholder="John Doe"
            {...registerField("name", { required: "Name is required" })}
            error={errors.name?.message}
            className="h-12 bg-slate-50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Email address</label>
          <Input 
            type="email" 
            autoComplete="email"
            placeholder="john@example.com"
            {...registerField("email", { required: "Email is required" })}
            error={errors.email?.message}
            className="h-12 bg-slate-50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
          <Input 
            type="password" 
            autoComplete="new-password"
            placeholder="••••••••"
            {...registerField("password", { required: "Password is required", minLength: { value: 6, message: "Min 6 characters" } })}
            error={errors.password?.message}
            className="h-12 bg-slate-50"
          />
        </div>

        <Button type="submit" className="w-full h-12 text-base font-semibold mt-8" isLoading={isSubmitting}>
          Create account
        </Button>
      </form>
    </AuthLayout>
  );
}
