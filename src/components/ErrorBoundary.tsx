'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { 
  ExclamationTriangleIcon,
  ArrowPathIcon,
  PlayIcon,
  InformationCircleIcon,
  WrenchScrewdriverIcon
} from '@heroicons/react/24/outline';
import { ExclamationTriangleIcon as ExclamationTriangleIconSolid } from '@heroicons/react/24/solid';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-rose-50 to-pink-50">
          {/* Background decorations */}
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-rose-500/5 to-pink-500/5" />
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-gradient-to-br from-red-400/10 to-rose-400/10 
                          rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-gradient-to-br from-rose-400/10 to-pink-400/10 
                          rounded-full blur-3xl" />
          
          <div className="relative z-10 max-w-lg w-full mx-4">
            <div className="relative overflow-hidden bg-gradient-to-br from-white to-red-50 
                            border border-red-200/50 rounded-3xl p-8 shadow-2xl shadow-red-200/50">
              {/* Background decoration */}
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-rose-500/5" />
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-red-400/10 to-rose-400/10 
                              rounded-full blur-xl" />
              
              <div className="relative z-10">
                {/* Error Icon */}
                <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-500 to-rose-600 
                                rounded-3xl mx-auto mb-6 shadow-xl shadow-red-500/25 animate-bounce-gentle">
                  <ExclamationTriangleIconSolid className="w-10 h-10 text-white" />
                </div>
                
                {/* Error Message */}
                <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">
                  Oops! Something went wrong
                </h2>
                
                <p className="text-lg text-gray-600 text-center mb-6 leading-relaxed">
                  We encountered an unexpected error. This might be related to wallet connectivity or network issues.
                </p>

                {/* Error Details */}
                {this.state.error && (
                  <div className="mb-6 bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/40">
                    <details className="group">
                      <summary className="flex items-center space-x-2 cursor-pointer font-medium text-gray-700 
                                         hover:text-gray-900 transition-colors duration-200">
                        <InformationCircleIcon className="w-5 h-5 text-red-500" />
                        <span>Error Details</span>
                        <span className="ml-auto text-xs text-gray-500 group-open:hidden">Click to expand</span>
                      </summary>
                      <div className="mt-3 p-3 bg-gray-900 rounded-xl border border-gray-800">
                        <pre className="text-green-400 font-mono text-xs overflow-auto leading-relaxed">
                          {this.state.error.message}
                        </pre>
                      </div>
                    </details>
                  </div>
                )}
                
                {/* Action Buttons */}
                <div className="space-y-3 mb-6">
                  <button
                    onClick={() => window.location.reload()}
                    className="group w-full relative overflow-hidden bg-gradient-to-r from-red-600 to-rose-600 
                               hover:from-red-700 hover:to-rose-700 text-white font-semibold py-4 px-6 
                               rounded-xl shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/30 
                               transition-all duration-300"
                  >
                    {/* Button background animation */}
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 
                                    translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                    
                    <div className="relative flex items-center justify-center space-x-3">
                      <ArrowPathIcon className="w-5 h-5 group-hover:rotate-180 transition-transform duration-300" />
                      <span>Reload Page</span>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => this.setState({ hasError: false, error: undefined })}
                    className="group w-full flex items-center justify-center space-x-3 py-3 px-6 
                               bg-white/60 backdrop-blur-sm hover:bg-white/80 text-gray-700 hover:text-gray-900 
                               font-medium rounded-xl border border-white/40 hover:border-gray-300 
                               transition-all duration-200 hover:shadow-md"
                  >
                    <PlayIcon className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                    <span>Try Again</span>
                  </button>
                </div>

                {/* Troubleshooting Section */}
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/40">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl 
                                    flex items-center justify-center">
                      <WrenchScrewdriverIcon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900">Troubleshooting Tips</h3>
                  </div>
                  <ul className="space-y-3">
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-sm text-gray-700">Make sure your wallet extension is installed and unlocked</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-sm text-gray-700">Try switching to Base Sepolia network</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-sm text-gray-700">Disable other wallet extensions temporarily</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-sm text-gray-700">Clear browser cache and cookies</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}