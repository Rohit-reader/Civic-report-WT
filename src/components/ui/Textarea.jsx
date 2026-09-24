import React from 'react';

export const Textarea = React.forwardRef(({ className = '', error, ...props }, ref) => {
  const baseStyles = "flex min-h-[80px] w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:ring-blue-500";
  const errorStyles = error ? "border-red-500 focus:ring-red-500" : "";
  
  return (
    <div className="w-full">
      <textarea ref={ref} className={`${baseStyles} ${errorStyles} ${className}`} {...props} />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
});
Textarea.displayName = 'Textarea';
