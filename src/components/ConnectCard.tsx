'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useDisconnect } from 'wagmi';
import { useState } from 'react';
import { getSmartAccountAddress } from '@/lib/aa';
import { 
  WalletIcon, 
  LinkIcon, 
  CheckCircleIcon, 
  XMarkIcon,
  SparklesIcon,
  ShieldCheckIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import { 
  CheckCircleIcon as CheckCircleIconSolid,
  SparklesIcon as SparklesIconSolid 
} from '@heroicons/react/24/solid';

export function ConnectCard(): JSX.Element {
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
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 
                      border border-blue-200/50 rounded-2xl p-8 transition-all duration-300 
                      hover:shadow-lg hover:shadow-blue-100/50">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-indigo-600/5 to-purple-600/5" />
        <div className="absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-purple-400/10 
                        rounded-full blur-xl" />
        <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-gradient-to-br from-indigo-400/10 to-blue-400/10 
                        rounded-full blur-xl" />
        
        <div className="relative z-10 text-center">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-16 h-16 
                          bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-6 
                          shadow-lg shadow-blue-500/25 group-hover:shadow-xl group-hover:shadow-blue-500/30 
                          transition-all duration-300">
            <WalletIcon className="w-8 h-8 text-white" />
          </div>
          
          {/* Content */}
          <h3 className="text-xl font-bold text-gray-900 mb-3">
            Connect Your Wallet
          </h3>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Connect your wallet to create a smart account and experience 
            <span className="font-semibold text-indigo-600"> gasless transactions</span>
          </p>
          
          {/* Connect Button */}
          <div className="flex flex-col items-center space-y-4">
            <ConnectButton />
            
            {/* Features */}
            <div className="flex items-center space-x-6 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <ShieldCheckIcon className="w-4 h-4 text-green-500" />
                <span>Secure</span>
              </div>
              <div className="flex items-center space-x-2">
                <SparklesIcon className="w-4 h-4 text-purple-500" />
                <span>Gasless</span>
              </div>
              <div className="flex items-center space-x-2">
                <LinkIcon className="w-4 h-4 text-blue-500" />
                <span>Connected</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Connected Wallet Card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 
                      border border-green-200/50 rounded-2xl p-6 transition-all duration-300">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-emerald-500/5 to-teal-500/5" />
        <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-green-400/10 to-emerald-400/10 
                        rounded-full blur-xl" />
        
        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl 
                              flex items-center justify-center shadow-lg">
                <CheckCircleIconSolid className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Wallet Connected</h3>
                <p className="text-sm text-gray-600">Ready to create smart account</p>
              </div>
            </div>
            <button
              onClick={() => disconnect()}
              className="group flex items-center space-x-1 px-3 py-2 text-sm font-medium 
                         text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 
                         border border-red-200 hover:border-red-300 rounded-xl 
                         transition-all duration-200"
            >
              <XMarkIcon className="w-4 h-4" />
              <span>Disconnect</span>
            </button>
          </div>
          
          {/* Address */}
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 border border-white/40">
            <p className="text-xs font-medium text-gray-500 mb-1">Connected Address</p>
            <p className="font-mono text-sm text-gray-900 break-all">
              {address}
            </p>
          </div>
        </div>
      </div>

      {/* Smart Account Creation */}
      {!smartAccountAddress && (
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 
                        border border-blue-200/50 rounded-2xl p-6 transition-all duration-300">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-indigo-500/5 to-purple-500/5" />
          <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-blue-400/10 to-purple-400/10 
                          rounded-full blur-xl" />
          
          <div className="relative z-10">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl 
                              flex items-center justify-center shadow-lg">
                <SparklesIconSolid className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Create Smart Account</h3>
                <p className="text-sm text-gray-600">Enable gasless transactions</p>
              </div>
            </div>
            
            <button
              onClick={handleCreateSmartAccount}
              disabled={isCreatingAccount}
              className="group w-full relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 
                         hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-4 px-6 
                         rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 
                         transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed 
                         disabled:hover:shadow-lg disabled:hover:from-blue-600 disabled:hover:to-indigo-600"
            >
              {/* Button background animation */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 
                              translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              
              <div className="relative flex items-center justify-center space-x-3">
                {isCreatingAccount ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Creating Smart Account...</span>
                  </>
                ) : (
                  <>
                    <SparklesIcon className="w-5 h-5" />
                    <span>Create Smart Account</span>
                    <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                  </>
                )}
              </div>
            </button>
            
            {/* Features */}
            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <ShieldCheckIcon className="w-4 h-4 text-blue-500" />
                <span>Secure & Non-custodial</span>
              </div>
              <div className="flex items-center space-x-2">
                <SparklesIcon className="w-4 h-4 text-purple-500" />
                <span>Gasless transactions</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success State */}
      {smartAccountAddress && (
        <div className="relative overflow-hidden bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 
                        border border-green-200/50 rounded-2xl p-6 transition-all duration-300 
                        animate-pulse-gentle">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-emerald-500/5 to-teal-500/5" />
          <div className="absolute -top-6 -right-6 w-32 h-32 bg-gradient-to-br from-green-400/10 to-emerald-400/10 
                          rounded-full blur-xl" />
          <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-gradient-to-br from-emerald-400/10 to-teal-400/10 
                          rounded-full blur-xl" />
          
          <div className="relative z-10">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl 
                              flex items-center justify-center shadow-lg shadow-green-500/25 
                              animate-bounce-gentle">
                <CheckCircleIconSolid className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Smart Account Created!</h3>
                <p className="text-sm text-gray-600">You're ready for gasless transactions</p>
              </div>
            </div>
            
            {/* Success message */}
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/40">
              <div className="flex items-center space-x-3">
                <CheckCircleIconSolid className="w-5 h-5 text-green-600 flex-shrink-0" />
                <p className="text-sm font-medium text-green-800">
                  Your smart account is ready! You can now create session keys and enjoy gasless transactions.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
