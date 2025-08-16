'use client';

import { useAccount } from 'wagmi';
import { useState } from 'react';
import { executeOneClickAction } from '@/app/actions/oneClick';
import { getActiveSession } from '@/lib/sessionKeys';
import { CONTRACT_CALLS, CONTRACT_INFO, type ContractCall } from '@/lib/contracts';
import { 
  BoltIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  LinkIcon,
  CurrencyDollarIcon,
  FireIcon,
  SparklesIcon as SparklesIconOutline
} from '@heroicons/react/24/outline';
import { 
  CheckCircleIcon as CheckCircleIconSolid,
  ExclamationCircleIcon as ExclamationCircleIconSolid,
  SparklesIcon
} from '@heroicons/react/24/solid';

interface TxButtonProps {
  action: ContractCall;
  label: string;
  className?: string;
}

export function TxButton({ action, label, className = '' }: TxButtonProps): JSX.Element {
  // Validate that the action exists in CONTRACT_CALLS
  if (!CONTRACT_CALLS[action]) {
    console.error(`Invalid action: ${action}. Valid actions are:`, Object.keys(CONTRACT_CALLS));
    return (
      <div className={`${className} relative overflow-hidden bg-gradient-to-br from-red-50 via-rose-50 to-pink-50 
                       border border-red-200/50 rounded-2xl p-6`}>
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-rose-500/5 to-pink-500/5" />
        <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-red-400/10 to-rose-400/10 
                        rounded-full blur-xl" />
        
        <div className="relative z-10 text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-rose-600 rounded-2xl 
                          flex items-center justify-center mx-auto mb-4">
            <ExclamationCircleIconSolid className="w-6 h-6 text-white" />
          </div>
          <p className="text-red-700 text-sm font-medium">
            Invalid action: {action}. Please check the component configuration.
          </p>
        </div>
      </div>
    );
  }

  const { address } = useAccount();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    error?: string;
    txHash?: string;
    sponsored?: boolean;
    gasUsed?: string;
  } | null>(null);

  const handleClick = async () => {
    if (!address) {
      setResult({
        success: false,
        error: 'Please connect your wallet first',
      });
      return;
    }

    // Check if user has an active session
    const session = getActiveSession(address);
    if (!session) {
      setResult({
        success: false,
        error: 'No active session. Please create a session first.',
      });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const response = await executeOneClickAction(action, address);
      
      if (response.success) {
        setResult({
          success: true,
          txHash: response.txHash,
          sponsored: response.sponsored,
          gasUsed: response.gasUsed,
        });
      } else {
        setResult({
          success: false,
          error: response.error,
        });
      }
    } catch (error) {
      setResult({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getButtonStyles = () => {
    if (isLoading) {
      return 'bg-gradient-to-r from-gray-400 to-gray-500 cursor-not-allowed';
    }
    if (action === 'mintTokens') {
      return 'bg-gradient-to-r from-purple-600 to-violet-700 hover:from-purple-700 hover:to-violet-800 shadow-purple-500/25 hover:shadow-purple-500/40';
    }
    if (action === 'mintNFT') {
      return 'bg-gradient-to-r from-pink-600 to-rose-700 hover:from-pink-700 hover:to-rose-800 shadow-pink-500/25 hover:shadow-pink-500/40';
    }
    if (action === 'incrementCounter') {
      return 'bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 shadow-green-500/25 hover:shadow-green-500/40';
    }
    return 'bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 shadow-blue-500/25 hover:shadow-blue-500/40';
  };

  const getActionIcon = () => {
    if (action === 'mintTokens') return <CurrencyDollarIcon className="w-5 h-5" />;
    if (action === 'mintNFT') return <SparklesIconOutline className="w-5 h-5" />;
    if (action === 'incrementCounter') return <FireIcon className="w-5 h-5" />;
    return <BoltIcon className="w-5 h-5" />;
  };

  const getActionColor = () => {
    if (action === 'mintTokens') return 'purple';
    if (action === 'mintNFT') return 'pink';
    if (action === 'incrementCounter') return 'green';
    return 'blue';
  };

  const actionColor = getActionColor();

  return (
    <div className={`${className} space-y-4`}>
      {/* Main Action Button */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-50 to-gray-100 
                      border border-slate-200/50 rounded-2xl p-6 transition-all duration-300 
                      hover:shadow-lg hover:shadow-slate-200/50">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-500/5 to-gray-500/5" />
        <div className={`absolute -top-6 -right-6 w-24 h-24 rounded-full blur-xl 
                         ${actionColor === 'purple' ? 'bg-gradient-to-br from-purple-400/10 to-violet-400/10' : 
                           actionColor === 'pink' ? 'bg-gradient-to-br from-pink-400/10 to-rose-400/10' : 
                           actionColor === 'green' ? 'bg-gradient-to-br from-green-400/10 to-emerald-400/10' : 
                           'bg-gradient-to-br from-blue-400/10 to-indigo-400/10'}`} />
        
        <div className="relative z-10">
          {/* Action Info */}
          <div className="flex items-center space-x-3 mb-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg 
                             ${actionColor === 'purple' ? 'bg-gradient-to-br from-purple-500 to-violet-600' : 
                               actionColor === 'pink' ? 'bg-gradient-to-br from-pink-500 to-rose-600' : 
                               actionColor === 'green' ? 'bg-gradient-to-br from-green-500 to-emerald-600' : 
                               'bg-gradient-to-br from-blue-500 to-indigo-600'}`}>
              <div className="text-white">
                {getActionIcon()}
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{label}</h3>
              <p className="text-sm text-gray-600">
                {CONTRACT_CALLS[action]?.description || 'Action description not available'}
              </p>
            </div>
          </div>
          
          {/* Action Button */}
          <button
            onClick={handleClick}
            disabled={isLoading}
            className={`group w-full relative overflow-hidden text-white font-semibold py-4 px-6 
                       rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 
                       disabled:opacity-50 disabled:cursor-not-allowed ${getButtonStyles()}`}
          >
            {/* Button background animation */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 
                            translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            
            <div className="relative flex items-center justify-center space-x-3">
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Processing Transaction...</span>
                </>
              ) : (
                <>
                  {getActionIcon()}
                  <span>{label}</span>
                  <BoltIcon className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                </>
              )}
            </div>
          </button>
        </div>
      </div>

      {/* Result Display */}
      {result && (
        <div className={`relative overflow-hidden rounded-2xl p-6 transition-all duration-300 animate-slide-up
                         ${result.success 
                           ? 'bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 border border-green-200/50' 
                           : 'bg-gradient-to-br from-red-50 via-rose-50 to-pink-50 border border-red-200/50'}`}>
          {/* Background decoration */}
          <div className={`absolute inset-0 
                           ${result.success 
                             ? 'bg-gradient-to-br from-green-500/5 via-emerald-500/5 to-teal-500/5' 
                             : 'bg-gradient-to-br from-red-500/5 via-rose-500/5 to-pink-500/5'}`} />
          <div className={`absolute -top-6 -right-6 w-24 h-24 rounded-full blur-xl 
                           ${result.success 
                             ? 'bg-gradient-to-br from-green-400/10 to-emerald-400/10' 
                             : 'bg-gradient-to-br from-red-400/10 to-rose-400/10'}`} />
          
          <div className="relative z-10">
            {/* Result Header */}
            <div className="flex items-center space-x-3 mb-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg 
                               ${result.success 
                                 ? 'bg-gradient-to-br from-green-500 to-emerald-600' 
                                 : 'bg-gradient-to-br from-red-500 to-rose-600'}`}>
                {result.success ? (
                  <CheckCircleIconSolid className="w-6 h-6 text-white" />
                ) : (
                  <ExclamationCircleIconSolid className="w-6 h-6 text-white" />
                )}
              </div>
              <div>
                <h3 className={`font-semibold 
                                ${result.success ? 'text-green-900' : 'text-red-900'}`}>
                  {result.success ? 'Transaction Successful!' : 'Transaction Failed'}
                </h3>
                <p className={`text-sm 
                               ${result.success ? 'text-green-700' : 'text-red-700'}`}>
                  {result.success ? `Successfully executed ${action} action` : result.error}
                </p>
              </div>
            </div>
            
            {/* Transaction Details */}
            {result.success && result.txHash && (
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/40">
                <div className="space-y-3">
                  {/* Transaction Hash */}
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <LinkIcon className="w-4 h-4 text-green-600" />
                      <span className="text-xs font-medium text-green-700">Transaction Hash</span>
                    </div>
                    <div className="bg-gray-900 rounded-lg p-3">
                      <p className="font-mono text-xs text-green-400 break-all">
                        {result.txHash}
                      </p>
                    </div>
                  </div>
                  
                  {/* Transaction Features */}
                  <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-green-200/50">
                    {result.sponsored && (
                      <div className="flex items-center space-x-2 px-3 py-1 bg-green-100 rounded-full">
                        <CheckCircleIcon className="w-3 h-3 text-green-600" />
                        <span className="text-xs font-medium text-green-700">Gas Sponsored</span>
                      </div>
                    )}
                    {result.gasUsed && (
                      <div className="flex items-center space-x-2 px-3 py-1 bg-blue-100 rounded-full">
                        <CurrencyDollarIcon className="w-3 h-3 text-blue-600" />
                        <span className="text-xs font-medium text-blue-700">Gas: {result.gasUsed} ETH</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
