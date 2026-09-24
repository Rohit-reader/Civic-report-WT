import React from 'react';
import { Loader2 } from 'lucide-react';

export const Loader = ({ className = '', size = 24 }) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Loader2 className="animate-spin text-blue-600 dark:text-blue-500" size={size} />
    </div>
  );
};
