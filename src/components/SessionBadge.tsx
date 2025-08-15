'use client';

import { useAccount } from 'wagmi';
import { useState, useEffect } from 'react';
import { getActiveSession, revokeSession, createSessionKey } from '@/lib/sessionKeys';

export function SessionBadge() {
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
      <div className="p-3 bg-gray-100 rounded-lg text-center">
        <p className="text-sm text-gray-600">Connect wallet to view session</p>
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
      <div className="p-3 bg-yellow-50 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-yellow-700">No active session</p>
            <p className="text-xs text-yellow-600 mt-1">
              Create a session to enable one-click actions
            </p>
          </div>
          <button
            onClick={handleCreateSession}
            disabled={isLoading}
            className="px-3 py-1 text-sm text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Creating...' : 'Create Session'}
          </button>
        </div>
      </div>
    );
  }

  const isExpiringSoon = session.expiration - Math.floor(Date.now() / 1000) < 300; // 5 minutes
  const timeRemaining = Math.max(0, session.expiration - Math.floor(Date.now() / 1000));

  return (
    <div className="space-y-3">
      <div className={`p-3 rounded-lg ${
        isExpiringSoon ? 'bg-red-50' : 'bg-green-50'
      }`}>
        <div className="flex items-center justify-between">
          <div>
            <p className={`text-sm font-medium ${
              isExpiringSoon ? 'text-red-700' : 'text-green-700'
            }`}>
              {isExpiringSoon ? '⚠️ Session Expiring Soon' : '✅ Session Active'}
            </p>
            <p className="text-xs text-gray-600 mt-1">
              Expires in {Math.floor(timeRemaining / 60)}m {timeRemaining % 60}s
            </p>
          </div>
          <button
            onClick={handleRevokeSession}
            disabled={isLoading}
            className="px-2 py-1 text-xs text-red-600 border border-red-300 rounded hover:bg-red-50 disabled:opacity-50"
          >
            {isLoading ? 'Revoking...' : 'Revoke'}
          </button>
        </div>
      </div>

      <div className="p-3 bg-blue-50 rounded-lg">
        <p className="text-sm font-medium text-blue-700">Session Details</p>
        <div className="mt-2 space-y-1 text-xs text-blue-600">
          <p>Daily Limit: {session.spendingLimit} ETH</p>
          <p>Daily Spent: {session.dailySpent} ETH</p>
          <p>Remaining: {(
            parseFloat(session.spendingLimit) - parseFloat(session.dailySpent)
          ).toFixed(4)} ETH</p>
        </div>
      </div>

      <div className="p-3 bg-gray-50 rounded-lg">
        <p className="text-sm font-medium text-gray-700">Permissions</p>
        <div className="mt-2 space-y-1 text-xs text-gray-600">
          <p>Allowed Contracts: {session.allowedContracts.length}</p>
          <p>Allowed Methods: {session.allowedMethods.length}</p>
        </div>
      </div>
    </div>
  );
}
