'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useDisconnect } from 'wagmi';
import { useState } from 'react';
import { getSmartAccountAddress } from '@/lib/aa';

export function ConnectCard() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [smartAccountAddress, setSmartAccountAddress] = useState<string>('');

  const handleCreateSmartAccount = async () => {
    if (!address) return;
    
    setIsCreatingAccount(true);
    try {
      const smartAddress = await getSmartAccountAddress(address);
      setSmartAccountAddress(smartAddress);
      localStorage.setItem('smartAccountAddress', smartAddress);
    } catch (error) {
      console.error('Failed to create smart account:', error);
    } finally {
      setIsCreatingAccount(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="text-center">
        <ConnectButton />
        <p className="text-sm text-gray-600 mt-2">
          Connect your wallet to get started
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">Connected Address:</p>
          <p className="font-mono text-sm text-gray-900 break-all">
            {address}
          </p>
        </div>
        <button
          onClick={() => disconnect()}
          className="px-3 py-1 text-sm text-red-600 border border-red-300 rounded hover:bg-red-50"
        >
          Disconnect
        </button>
      </div>

      {!smartAccountAddress && (
        <button
          onClick={handleCreateSmartAccount}
          disabled={isCreatingAccount}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isCreatingAccount ? 'Creating Smart Account...' : 'Create Smart Account'}
        </button>
      )}

      {smartAccountAddress && (
        <div className="p-3 bg-green-50 rounded-lg">
          <p className="text-sm text-green-700">
            ✅ Smart Account Created Successfully!
          </p>
        </div>
      )}
    </div>
  );
}
