import React from 'react';
import { motion } from 'framer-motion';

export function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="min-h-screen bg-white flex font-sans">
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:flex-none lg:w-1/2 xl:w-[45%] lg:px-20 xl:px-24">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto w-full max-w-md lg:w-[400px]"
        >
          {children}
        </motion.div>
      </div>
      
      <div className="hidden lg:block relative w-full flex-1">
        <div className="absolute inset-0 bg-blue-600">
          <img 
            src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?q=80&w=2070&auto=format&fit=crop" 
            alt="City overview" 
            className="absolute inset-0 h-full w-full object-cover mix-blend-overlay opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-blue-900/90 via-blue-900/40 to-transparent" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-16 text-white">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-4xl font-extrabold mb-4"
          >
            {title}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-xl text-blue-100 max-w-lg leading-relaxed"
          >
            {subtitle}
          </motion.p>
        </div>
      </div>
    </div>
  );
}
