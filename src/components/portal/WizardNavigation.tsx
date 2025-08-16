'use client';

import { useRouter } from 'next/navigation';
import { ChevronLeftIcon, SparklesIcon } from '@heroicons/react/24/outline';

export function WizardNavigation() {
  const router = useRouter();

  return (
    <nav className="bg-white/80 backdrop-blur-sm shadow-xl border-b border-gray-200/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div className="flex items-center space-x-6">
            <button
              onClick={() => router.push('/dashboard')}
              className="group w-10 h-10 bg-gray-100/80 backdrop-blur-sm hover:bg-gray-200 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 border border-gray-200/50"
            >
              <ChevronLeftIcon className="w-5 h-5 text-gray-600 group-hover:text-gray-900 group-hover:-translate-x-0.5 transition-all duration-300" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <SparklesIcon className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Developer Portal
              </span>
            </div>
          </div>
          
          <div className="absolute left-1/2 -translate-x-1/2">
            <div className="bg-gradient-to-r from-blue-100 to-purple-100 border border-blue-200/50 rounded-xl px-6 py-2">
              <h1 className="text-lg font-bold bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent">
                Configuration Wizard
              </h1>
            </div>
          </div>
          
          <div className="w-32 flex justify-end">
            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              Active
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}