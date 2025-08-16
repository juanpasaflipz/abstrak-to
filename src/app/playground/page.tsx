'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRightIcon, CommandLineIcon } from '@heroicons/react/24/outline';
import { RocketLaunchIcon } from '@heroicons/react/24/solid';

export default function PlaygroundPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the API playground
    router.push('/api-playground');
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 
                    flex items-center justify-center">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-indigo-500/5 to-purple-500/5" />
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-indigo-400/10 
                      rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-gradient-to-br from-indigo-400/10 to-purple-400/10 
                      rounded-full blur-3xl" />
      
      <div className="relative z-10 text-center">
        <div className="relative overflow-hidden bg-gradient-to-br from-white to-blue-50 
                        border border-blue-200/50 rounded-3xl p-12 shadow-2xl shadow-blue-200/50 
                        max-w-md mx-auto">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5" />
          <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-blue-400/10 to-indigo-400/10 
                          rounded-full blur-xl" />
          
          <div className="relative z-10">
            {/* Animated Icon */}
            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl 
                            flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-500/25 
                            animate-bounce-gentle">
              <RocketLaunchIcon className="w-10 h-10 text-white" />
            </div>
            
            {/* Loading Animation */}
            <div className="flex items-center justify-center space-x-1 mb-6">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Redirecting...
              </span>
            </h1>
            
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              Taking you to the interactive API Playground
            </p>
            
            {/* Progress Indicator */}
            <div className="flex items-center justify-center space-x-3 text-sm text-gray-500">
              <CommandLineIcon className="w-5 h-5 text-blue-500" />
              <span>Loading API Playground</span>
              <ArrowRightIcon className="w-4 h-4 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
