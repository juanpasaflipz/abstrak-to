'use client';

import { useAccount } from 'wagmi';
import { useState } from 'react';
import { executeOneClickAction } from '@/app/actions/oneClick';
import { getActiveSession } from '@/lib/sessionKeys';

import { CONTRACT_CALLS, CONTRACT_INFO, type ContractCall } from '@/lib/contracts';

interface TxButtonProps {
  action: ContractCall;
  label: string;
  className?: string;
}

export function TxButton({ action, label, className = '' }: TxButtonProps) {
  // Validate that the action exists in CONTRACT_CALLS
  if (!CONTRACT_CALLS[action]) {
    console.error(`Invalid action: ${action}. Valid actions are:`, Object.keys(CONTRACT_CALLS));
    return (
      <div className={`${className} p-4 border border-red-200 bg-red-50 rounded-lg`}>
        <p className="text-red-700 text-sm">
          Invalid action: {action}. Please check the component configuration.
        </p>
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

  const getButtonColor = () => {
    if (isLoading) return 'bg-gray-400 cursor-not-allowed';
    if (action === 'mintTokens') return 'bg-purple-600 hover:bg-purple-700';
    if (action === 'mintNFT') return 'bg-pink-600 hover:bg-pink-700';
    if (action === 'incrementCounter') return 'bg-green-600 hover:bg-green-700';
    return 'bg-blue-600 hover:bg-blue-700';
  };

  const getActionIcon = () => {
    if (action === 'mintTokens') return '🪙';
    if (action === 'mintNFT') return '🎨';
    if (action === 'incrementCounter') return '🔢';
    return '⚡';
  };

  return (
    <div className={className}>
      <button
        onClick={handleClick}
        disabled={isLoading}
        className={`w-full px-4 py-3 text-white font-medium rounded-lg transition-colors ${getButtonColor()}`}
      >
        {isLoading ? (
          <div className="flex items-center justify-center space-x-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Processing...</span>
          </div>
        ) : (
          <div className="flex items-center justify-center space-x-2">
            <span>{getActionIcon()}</span>
            <span>{label}</span>
          </div>
        )}
      </button>

      {result && (
        <div className={`mt-3 p-3 rounded-lg ${
          result.success ? 'bg-green-50' : 'bg-red-50'
        }`}>
          <p className={`text-sm ${
            result.success ? 'text-green-700' : 'text-red-700'
          }`}>
            {result.success ? `Successfully executed ${action} action` : result.error}
          </p>
          
          {result.success && result.txHash && (
            <div className="mt-2">
              <p className="text-xs text-green-600">Transaction Hash:</p>
              <p className="text-xs font-mono text-green-700 break-all">
                {result.txHash}
              </p>
              {result.sponsored && (
                <p className="text-xs text-green-600 mt-1">
                  ✅ Gas sponsored
                </p>
              )}
              {result.gasUsed && (
                <p className="text-xs text-green-600 mt-1">
                  Gas used: {result.gasUsed} ETH
                </p>
              )}
            </div>
          )}
        </div>
      )}

      <div className="mt-2 text-xs text-gray-500 text-center">
        {CONTRACT_CALLS[action]?.description || 'Action description not available'}
      </div>
    </div>
  );
}
