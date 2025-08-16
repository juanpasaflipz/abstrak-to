'use client';

import { useAccount } from 'wagmi';
import { useState, useEffect } from 'react';
import { getActiveSession, revokeSession, createSessionKey } from '@/lib/sessionKeys';
import { 
  KeyIcon,
  ClockIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  XMarkIcon,
  PlusIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { 
  CheckCircleIcon as CheckCircleIconSolid,
  ExclamationTriangleIcon as ExclamationTriangleIconSolid,
  SparklesIcon
} from '@heroicons/react/24/solid';

export function SessionBadge(): JSX.Element {
  const { address } = useAccount();
  const [session, setSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (address) {
      checkSessionStatus();
    }
  }, [address]);

  const checkSessionStatus = () => {
    if (!address) return;
    
    const activeSession = getActiveSession(address);
    setSession(activeSession);
  };

  const handleRevokeSession = async () => {
    if (!address) return;
    
    setIsLoading(true);
    try {
      const success = revokeSession(address);
      if (success) {
        setSession(null);
        console.log('Session revoked successfully');
      }
    } catch (error) {
      console.error('Failed to revoke session:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!address) {
    return (
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-slate-100 
                      border border-gray-200/50 rounded-2xl p-6 text-center transition-all duration-300">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-500/5 to-slate-500/5" />
        <div className="absolute -top-6 -right-6 w-20 h-20 bg-gradient-to-br from-gray-400/10 to-slate-400/10 
                        rounded-full blur-xl" />
        
        <div className="relative z-10">
          <div className="w-12 h-12 bg-gradient-to-br from-gray-400 to-slate-500 rounded-2xl 
                          flex items-center justify-center mx-auto mb-4 opacity-60">
            <KeyIcon className="w-6 h-6 text-white" />
          </div>
          <p className="text-sm font-medium text-gray-600">
            Connect wallet to view session
          </p>
        </div>
      </div>
    );
  }

  const handleCreateSession = async () => {
    if (!address) return;
    
    setIsLoading(true);
    try {
      const sessionPrivateKey = await createSessionKey(address);
      
      if (sessionPrivateKey) {
        // Refresh session status after creation
        checkSessionStatus();
        console.log('Session created successfully');
      }
    } catch (error) {
      console.error('Failed to create session:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!session) {
    return (
      <div className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 
                      border border-amber-200/50 rounded-2xl p-6 transition-all duration-300">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-yellow-500/5 to-orange-500/5" />
        <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-amber-400/10 to-orange-400/10 
                        rounded-full blur-xl" />
        
        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl 
                            flex items-center justify-center shadow-lg">
              <ExclamationTriangleIconSolid className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">No Active Session</h3>
              <p className="text-sm text-gray-600">Create a session for one-click actions</p>
            </div>
          </div>
          
          {/* Content */}
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/40 mb-4">
            <div className="flex items-start space-x-3">
              <SparklesIcon className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900 mb-1">
                  What are session keys?
                </p>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Session keys enable gasless, one-click transactions without signing each one individually. 
                  They're temporary, secure, and have built-in spending limits.
                </p>
              </div>
            </div>
          </div>
          
          {/* Action Button */}
          <button
            onClick={handleCreateSession}
            disabled={isLoading}
            className="group w-full relative overflow-hidden bg-gradient-to-r from-amber-500 to-orange-600 
                       hover:from-amber-600 hover:to-orange-700 text-white font-semibold py-3 px-4 
                       rounded-xl shadow-lg shadow-amber-500/25 hover:shadow-xl hover:shadow-amber-500/30 
                       transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {/* Button background animation */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 
                            translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            
            <div className="relative flex items-center justify-center space-x-2">
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Creating Session...</span>
                </>
              ) : (
                <>
                  <PlusIcon className="w-4 h-4" />
                  <span>Create Session Key</span>
                </>
              )}
            </div>
          </button>
          
          {/* Features */}
          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-gray-600">
            <div className="flex items-center space-x-1">
              <ShieldCheckIcon className="w-3 h-3 text-amber-500" />
              <span>Secure & Limited</span>
            </div>
            <div className="flex items-center space-x-1">
              <ClockIcon className="w-3 h-3 text-orange-500" />
              <span>Time-bound</span>
            </div>
            <div className="flex items-center space-x-1">
              <CurrencyDollarIcon className="w-3 h-3 text-yellow-600" />
              <span>Spending Limits</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const isExpiringSoon = session.expiration - Math.floor(Date.now() / 1000) < 300; // 5 minutes
  const timeRemaining = Math.max(0, session.expiration - Math.floor(Date.now() / 1000));

  return (
    <div className="space-y-4">
      {/* Session Status Card */}
      <div className={`relative overflow-hidden rounded-2xl p-6 transition-all duration-300 ${
        isExpiringSoon 
          ? 'bg-gradient-to-br from-red-50 via-rose-50 to-pink-50 border border-red-200/50' 
          : 'bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 border border-green-200/50'
      }`}>
        {/* Background decoration */}
        <div className={`absolute inset-0 ${
          isExpiringSoon 
            ? 'bg-gradient-to-br from-red-500/5 via-rose-500/5 to-pink-500/5' 
            : 'bg-gradient-to-br from-green-500/5 via-emerald-500/5 to-teal-500/5'
        }`} />
        <div className={`absolute -top-6 -right-6 w-24 h-24 rounded-full blur-xl ${
          isExpiringSoon 
            ? 'bg-gradient-to-br from-red-400/10 to-rose-400/10' 
            : 'bg-gradient-to-br from-green-400/10 to-emerald-400/10'
        }`} />
        
        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg ${
                isExpiringSoon 
                  ? 'bg-gradient-to-br from-red-500 to-rose-600' 
                  : 'bg-gradient-to-br from-green-500 to-emerald-600'
              }`}>
                {isExpiringSoon ? (
                  <ExclamationTriangleIconSolid className="w-6 h-6 text-white" />
                ) : (
                  <CheckCircleIconSolid className="w-6 h-6 text-white" />
                )}
              </div>
              <div>
                <h3 className={`font-semibold ${
                  isExpiringSoon ? 'text-red-900' : 'text-green-900'
                }`}>
                  {isExpiringSoon ? 'Session Expiring Soon' : 'Session Active'}
                </h3>
                <p className="text-sm text-gray-600">
                  Expires in {Math.floor(timeRemaining / 60)}m {timeRemaining % 60}s
                </p>
              </div>
            </div>
            
            <button
              onClick={handleRevokeSession}
              disabled={isLoading}
              className="group flex items-center space-x-1 px-3 py-2 text-sm font-medium 
                         text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 
                         border border-red-200 hover:border-red-300 rounded-xl 
                         transition-all duration-200 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="w-3 h-3 border border-red-600 border-t-transparent rounded-full animate-spin" />
                  <span>Revoking...</span>
                </>
              ) : (
                <>
                  <XMarkIcon className="w-4 h-4" />
                  <span>Revoke</span>
                </>
              )}
            </button>
          </div>
          
          {/* Timer Bar */}
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 border border-white/40">
            <div className="flex items-center space-x-3">
              <ClockIcon className={`w-4 h-4 ${
                isExpiringSoon ? 'text-red-600' : 'text-green-600'
              }`} />
              <div className="flex-1">
                <div className="flex items-center justify-between text-xs font-medium text-gray-700 mb-1">
                  <span>Session Time</span>
                  <span>{Math.floor(timeRemaining / 60)}:{String(timeRemaining % 60).padStart(2, '0')}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div 
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      isExpiringSoon 
                        ? 'bg-gradient-to-r from-red-500 to-rose-600' 
                        : 'bg-gradient-to-r from-green-500 to-emerald-600'
                    }`}
                    style={{ width: `${Math.max(5, (timeRemaining / 1800) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Session Details Card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 
                      border border-blue-200/50 rounded-2xl p-6 transition-all duration-300">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-indigo-500/5 to-purple-500/5" />
        <div className="absolute -top-6 -right-6 w-20 h-20 bg-gradient-to-br from-blue-400/10 to-purple-400/10 
                        rounded-full blur-xl" />
        
        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg 
                            flex items-center justify-center">
              <CurrencyDollarIcon className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-semibold text-blue-900">Spending Limits</h3>
          </div>
          
          {/* Spending Info */}
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/40">
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Daily Limit</span>
                <span className="text-sm font-medium text-gray-900">{session.spendingLimit} ETH</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Daily Spent</span>
                <span className="text-sm font-medium text-gray-900">{session.dailySpent} ETH</span>
              </div>
              <div className="flex items-center justify-between border-t border-gray-200 pt-2">
                <span className="text-sm font-medium text-gray-700">Remaining</span>
                <span className="text-sm font-bold text-blue-700">
                  {(parseFloat(session.spendingLimit) - parseFloat(session.dailySpent)).toFixed(4)} ETH
                </span>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                <span>Usage</span>
                <span>{((parseFloat(session.dailySpent) / parseFloat(session.spendingLimit)) * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="h-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, (parseFloat(session.dailySpent) / parseFloat(session.spendingLimit)) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Permissions Card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 
                      border border-slate-200/50 rounded-2xl p-6 transition-all duration-300">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-500/5 via-gray-500/5 to-zinc-500/5" />
        <div className="absolute -top-6 -right-6 w-20 h-20 bg-gradient-to-br from-slate-400/10 to-gray-400/10 
                        rounded-full blur-xl" />
        
        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-slate-500 to-gray-600 rounded-lg 
                            flex items-center justify-center">
              <ShieldCheckIcon className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-semibold text-slate-900">Permissions</h3>
          </div>
          
          {/* Permissions Info */}
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/40">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-700 mb-1">
                  {session.allowedContracts.length}
                </div>
                <div className="text-xs text-gray-600 flex items-center justify-center space-x-1">
                  <DocumentTextIcon className="w-3 h-3" />
                  <span>Contracts</span>
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-700 mb-1">
                  {session.allowedMethods.length}
                </div>
                <div className="text-xs text-gray-600 flex items-center justify-center space-x-1">
                  <KeyIcon className="w-3 h-3" />
                  <span>Methods</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
