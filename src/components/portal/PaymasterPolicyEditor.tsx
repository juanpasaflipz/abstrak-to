'use client';

import { useState, useEffect } from 'react';
import {
  CurrencyDollarIcon,
  ShieldCheckIcon,
  PlusIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  BoltIcon,
  ClockIcon,
  CheckCircleIcon,
  TrashIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import { SparklesIcon } from '@heroicons/react/24/solid';

interface PaymasterPolicy {
  id: string;
  name: string;
  mode: 'sponsor_all' | 'allowlist' | 'user_pays';
  dailyBudget: string; // in wei
  perTxLimit: string; // in wei
  allowedMethods: string[];
  allowedContracts: string[];
  isActive: boolean;
}

interface PaymasterPolicyEditorProps {
  projectId?: string;
  onSave?: (policy: PaymasterPolicy) => void;
  onCancel?: () => void;
  existingPolicy?: PaymasterPolicy | null;
}

export function PaymasterPolicyEditor({
  projectId,
  onSave,
  onCancel,
  existingPolicy
}: PaymasterPolicyEditorProps) {
  const [policy, setPolicy] = useState<PaymasterPolicy>({
    id: existingPolicy?.id || '',
    name: existingPolicy?.name || '',
    mode: existingPolicy?.mode || 'allowlist',
    dailyBudget: existingPolicy?.dailyBudget || '1000000000000000000', // 1 ETH
    perTxLimit: existingPolicy?.perTxLimit || '100000000000000000', // 0.1 ETH
    allowedMethods: existingPolicy?.allowedMethods || [],
    allowedContracts: existingPolicy?.allowedContracts || [],
    isActive: existingPolicy?.isActive ?? true
  });

  const [newMethod, setNewMethod] = useState('');
  const [newContract, setNewContract] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Common method signatures for quick selection
  const commonMethods = [
    { signature: '0xd09de08a', name: 'increment()', description: 'Counter increment' },
    { signature: '0xa9059cbb', name: 'transfer(address,uint256)', description: 'ERC-20 transfer' },
    { signature: '0x095ea7b3', name: 'approve(address,uint256)', description: 'ERC-20 approve' },
    { signature: '0x42842e0e', name: 'safeTransferFrom(address,address,uint256)', description: 'ERC-721 transfer' },
    { signature: '0x40c10f19', name: 'mint(address,uint256)', description: 'Mint tokens' },
    { signature: '0x6a627842', name: 'mint(address)', description: 'Mint NFT' }
  ];

  const validatePolicy = () => {
    const newErrors: Record<string, string> = {};
    
    if (!policy.name.trim()) {
      newErrors.name = 'Policy name is required';
    }
    
    if (policy.mode === 'allowlist' && policy.allowedContracts.length === 0) {
      newErrors.contracts = 'At least one contract must be allowed for allowlist mode';
    }
    
    try {
      const dailyBudgetBN = BigInt(policy.dailyBudget);
      const perTxLimitBN = BigInt(policy.perTxLimit);
      
      if (dailyBudgetBN <= 0) {
        newErrors.dailyBudget = 'Daily budget must be greater than 0';
      }
      
      if (perTxLimitBN <= 0) {
        newErrors.perTxLimit = 'Per transaction limit must be greater than 0';
      }
      
      if (perTxLimitBN > dailyBudgetBN) {
        newErrors.perTxLimit = 'Per transaction limit cannot exceed daily budget';
      }
    } catch {
      newErrors.dailyBudget = 'Invalid daily budget value';
      newErrors.perTxLimit = 'Invalid per transaction limit value';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const formatEther = (wei: string) => {
    try {
      return (Number(wei) / 1e18).toFixed(4);
    } catch {
      return '0';
    }
  };

  const parseEther = (ether: string) => {
    try {
      return (parseFloat(ether) * 1e18).toString();
    } catch {
      return '0';
    }
  };

  const addMethod = (signature?: string) => {
    const methodToAdd = signature || newMethod.trim();
    if (methodToAdd && !policy.allowedMethods.includes(methodToAdd)) {
      setPolicy(prev => ({
        ...prev,
        allowedMethods: [...prev.allowedMethods, methodToAdd]
      }));
      setNewMethod('');
    }
  };

  const removeMethod = (signature: string) => {
    setPolicy(prev => ({
      ...prev,
      allowedMethods: prev.allowedMethods.filter(m => m !== signature)
    }));
  };

  const addContract = () => {
    const contract = newContract.trim();
    if (contract && !policy.allowedContracts.includes(contract)) {
      // Basic address validation
      if (!/^0x[a-fA-F0-9]{40}$/.test(contract)) {
        setErrors(prev => ({ ...prev, newContract: 'Invalid contract address format' }));
        return;
      }
      
      setPolicy(prev => ({
        ...prev,
        allowedContracts: [...prev.allowedContracts, contract]
      }));
      setNewContract('');
      setErrors(prev => ({ ...prev, newContract: '' }));
    }
  };

  const removeContract = (address: string) => {
    setPolicy(prev => ({
      ...prev,
      allowedContracts: prev.allowedContracts.filter(c => c !== address)
    }));
  };

  const handleSave = async () => {
    if (!validatePolicy()) return;
    
    setIsLoading(true);
    try {
      // Here you would typically call your API to save the policy
      // For now, we'll just simulate a save
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onSave?.(policy);
    } catch (error) {
      console.error('Failed to save policy:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 py-8">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
              <CurrencyDollarIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Paymaster Policy Editor
              </h1>
              <p className="text-gray-600 font-medium">Configure gas sponsorship rules and spending limits</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden">
          
          {/* Policy Basic Info */}
          <div className="p-8 border-b border-gray-200/50">
            <div className="flex items-center gap-3 mb-6">
              <DocumentTextIcon className="h-6 w-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">Basic Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Policy Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={policy.name}
                  onChange={(e) => setPolicy(prev => ({ ...prev, name: e.target.value }))}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-300 ${
                    errors.name 
                      ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-200' 
                      : 'border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-200'
                  }`}
                  placeholder="e.g., Production Gas Policy"
                />
                {errors.name && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <ExclamationTriangleIcon className="h-4 w-4" />
                    {errors.name}
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Sponsorship Mode
                </label>
                <select
                  value={policy.mode}
                  onChange={(e) => setPolicy(prev => ({ ...prev, mode: e.target.value as any }))}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-200 focus:outline-none transition-all duration-300"
                >
                  <option value="sponsor_all">🟢 Sponsor All Transactions</option>
                  <option value="allowlist">🟡 Allowlist Mode (Recommended)</option>
                  <option value="user_pays">🔴 User Pays Gas</option>
                </select>
              </div>
            </div>
            
            {/* Mode Description */}
            <div className="mt-4 p-4 bg-blue-50/80 backdrop-blur-sm border border-blue-200/50 rounded-xl">
              <div className="flex items-start gap-2">
                <InformationCircleIcon className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                  {policy.mode === 'sponsor_all' && (
                    <span><strong>Sponsor All:</strong> All transactions will be sponsored. Use with caution as this can lead to high gas costs.</span>
                  )}
                  {policy.mode === 'allowlist' && (
                    <span><strong>Allowlist Mode:</strong> Only transactions to specified contracts and methods will be sponsored. Recommended for production.</span>
                  )}
                  {policy.mode === 'user_pays' && (
                    <span><strong>User Pays:</strong> Users will pay their own gas fees. Useful for premium features or when budget is exhausted.</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Budget Configuration */}
          <div className="p-8 border-b border-gray-200/50">
            <div className="flex items-center gap-3 mb-6">
              <BoltIcon className="h-6 w-6 text-yellow-600" />
              <h2 className="text-2xl font-bold text-gray-900">Budget Limits</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Daily Budget (ETH) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.001"
                  value={formatEther(policy.dailyBudget)}
                  onChange={(e) => setPolicy(prev => ({ ...prev, dailyBudget: parseEther(e.target.value) }))}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-300 ${
                    errors.dailyBudget 
                      ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-200' 
                      : 'border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-200'
                  }`}
                  placeholder="1.0"
                />
                {errors.dailyBudget && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <ExclamationTriangleIcon className="h-4 w-4" />
                    {errors.dailyBudget}
                  </p>
                )}
                <p className="mt-2 text-sm text-gray-600">
                  Maximum ETH to spend on gas per day
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Per Transaction Limit (ETH) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.001"
                  value={formatEther(policy.perTxLimit)}
                  onChange={(e) => setPolicy(prev => ({ ...prev, perTxLimit: parseEther(e.target.value) }))}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-300 ${
                    errors.perTxLimit 
                      ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-200' 
                      : 'border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-200'
                  }`}
                  placeholder="0.1"
                />
                {errors.perTxLimit && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <ExclamationTriangleIcon className="h-4 w-4" />
                    {errors.perTxLimit}
                  </p>
                )}
                <p className="mt-2 text-sm text-gray-600">
                  Maximum ETH to spend per transaction
                </p>
              </div>
            </div>
          </div>

          {/* Allowlist Configuration */}
          {policy.mode === 'allowlist' && (
            <div className="p-8 border-b border-gray-200/50">
              <div className="flex items-center gap-3 mb-6">
                <ShieldCheckIcon className="h-6 w-6 text-green-600" />
                <h2 className="text-2xl font-bold text-gray-900">Allowlist Configuration</h2>
              </div>
              
              {/* Allowed Contracts */}
              <div className="mb-8">
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Allowed Contracts <span className="text-red-500">*</span>
                </label>
                
                <div className="flex gap-3 mb-4">
                  <input
                    type="text"
                    value={newContract}
                    onChange={(e) => setNewContract(e.target.value)}
                    className={`flex-1 px-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-300 ${
                      errors.newContract 
                        ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-200' 
                        : 'border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-200'
                    }`}
                    placeholder="0x742d35Cc6434C0532925a3b8c5481a3d3E7Cc4A7"
                  />
                  <button
                    onClick={addContract}
                    className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all duration-300 font-semibold flex items-center gap-2"
                  >
                    <PlusIcon className="h-4 w-4" />
                    Add
                  </button>
                </div>
                
                {errors.newContract && (
                  <p className="mb-4 text-sm text-red-600 flex items-center gap-1">
                    <ExclamationTriangleIcon className="h-4 w-4" />
                    {errors.newContract}
                  </p>
                )}
                
                {errors.contracts && (
                  <p className="mb-4 text-sm text-red-600 flex items-center gap-1">
                    <ExclamationTriangleIcon className="h-4 w-4" />
                    {errors.contracts}
                  </p>
                )}
                
                <div className="space-y-2">
                  {policy.allowedContracts.map((contract, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-green-50/80 backdrop-blur-sm border border-green-200/50 rounded-xl">
                      <span className="font-mono text-sm text-green-800">{contract}</span>
                      <button
                        onClick={() => removeContract(contract)}
                        className="p-1 text-red-500 hover:text-red-700 transition-colors"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Allowed Methods */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Allowed Methods (Optional)
                </label>
                <p className="text-sm text-gray-600 mb-4">
                  Leave empty to allow all methods on the specified contracts
                </p>
                
                {/* Common Methods Quick Add */}
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Quick Add Common Methods:</p>
                  <div className="flex flex-wrap gap-2">
                    {commonMethods.map((method) => (
                      <button
                        key={method.signature}
                        onClick={() => addMethod(method.signature)}
                        disabled={policy.allowedMethods.includes(method.signature)}
                        className="px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                        title={method.description}
                      >
                        {method.name}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="flex gap-3 mb-4">
                  <input
                    type="text"
                    value={newMethod}
                    onChange={(e) => setNewMethod(e.target.value)}
                    className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-200 focus:outline-none transition-all duration-300"
                    placeholder="0xd09de08a (method signature)"
                  />
                  <button
                    onClick={() => addMethod()}
                    className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-300 font-semibold flex items-center gap-2"
                  >
                    <PlusIcon className="h-4 w-4" />
                    Add
                  </button>
                </div>
                
                <div className="space-y-2">
                  {policy.allowedMethods.map((method, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-blue-50/80 backdrop-blur-sm border border-blue-200/50 rounded-xl">
                      <span className="font-mono text-sm text-blue-800">{method}</span>
                      <button
                        onClick={() => removeMethod(method)}
                        className="p-1 text-red-500 hover:text-red-700 transition-colors"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="p-8 bg-gray-50/80 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={policy.isActive}
                    onChange={(e) => setPolicy(prev => ({ ...prev, isActive: e.target.checked }))}
                    className="w-5 h-5 text-green-600 rounded border-gray-300 focus:ring-green-500"
                  />
                  <span className="text-sm font-medium text-gray-900">Active Policy</span>
                </label>
              </div>
              
              <div className="flex gap-4">
                <button
                  onClick={onCancel}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-all duration-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-semibold shadow-lg hover:shadow-xl hover:scale-105 disabled:hover:scale-100 flex items-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircleIcon className="h-5 w-5" />
                      <span>Save Policy</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}