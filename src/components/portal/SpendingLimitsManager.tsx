'use client';

import { useState, useEffect } from 'react';
import {
  ChartBarIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  CurrencyDollarIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  RefreshIcon
} from '@heroicons/react/24/outline';
import { ShieldExclamationIcon } from '@heroicons/react/24/solid';

interface SpendingLimit {
  id: string;
  type: 'project' | 'user_session';
  dailyLimit: string; // in wei
  monthlyLimit?: string; // in wei
  dailySpent: string;
  monthlySpent: string;
  lastDailyReset: string;
  lastMonthlyReset: string;
  isActive: boolean;
}

interface SpendingLimitsManagerProps {
  projectId?: string;
  onSave?: (limits: SpendingLimit[]) => void;
}

export function SpendingLimitsManager({
  projectId,
  onSave
}: SpendingLimitsManagerProps) {
  const [limits, setLimits] = useState<SpendingLimit[]>([
    {
      id: '1',
      type: 'project',
      dailyLimit: '5000000000000000000', // 5 ETH
      monthlyLimit: '100000000000000000000', // 100 ETH
      dailySpent: '1200000000000000000', // 1.2 ETH
      monthlySpent: '15000000000000000000', // 15 ETH
      lastDailyReset: new Date().toISOString(),
      lastMonthlyReset: new Date().toISOString(),
      isActive: true
    },
    {
      id: '2',
      type: 'user_session',
      dailyLimit: '100000000000000000', // 0.1 ETH
      dailySpent: '25000000000000000', // 0.025 ETH
      monthlySpent: '350000000000000000', // 0.35 ETH
      lastDailyReset: new Date().toISOString(),
      lastMonthlyReset: new Date().toISOString(),
      isActive: true
    }
  ]);
  
  const [editingLimit, setEditingLimit] = useState<SpendingLimit | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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

  const getUsagePercentage = (spent: string, limit: string) => {
    try {
      const spentNum = Number(spent);
      const limitNum = Number(limit);
      if (limitNum === 0) return 0;
      return Math.min((spentNum / limitNum) * 100, 100);
    } catch {
      return 0;
    }
  };

  const getUsageStatus = (percentage: number) => {
    if (percentage >= 90) return { color: 'red', text: 'Critical', icon: XCircleIcon };
    if (percentage >= 75) return { color: 'yellow', text: 'Warning', icon: ExclamationTriangleIcon };
    if (percentage >= 50) return { color: 'blue', text: 'Moderate', icon: InformationCircleIcon };
    return { color: 'green', text: 'Good', icon: CheckCircleIcon };
  };

  const resetSpending = async (limitId: string, type: 'daily' | 'monthly') => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setLimits(prev => prev.map(limit => {
        if (limit.id === limitId) {
          if (type === 'daily') {
            return {
              ...limit,
              dailySpent: '0',
              lastDailyReset: new Date().toISOString()
            };
          } else {
            return {
              ...limit,
              monthlySpent: '0',
              lastMonthlyReset: new Date().toISOString()
            };
          }
        }
        return limit;
      }));
    } catch (error) {
      console.error('Failed to reset spending:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveLimit = async (limit: SpendingLimit) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (editingLimit) {
        setLimits(prev => prev.map(l => l.id === limit.id ? limit : l));
      } else {
        setLimits(prev => [...prev, { ...limit, id: Date.now().toString() }]);
      }
      
      setEditingLimit(null);
      setShowCreateForm(false);
    } catch (error) {
      console.error('Failed to save limit:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteLimit = async (limitId: string) => {
    if (!confirm('Are you sure you want to delete this spending limit?')) return;
    
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setLimits(prev => prev.filter(l => l.id !== limitId));
    } catch (error) {
      console.error('Failed to delete limit:', error);
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
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
              <ChartBarIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Spending Limits
              </h1>
              <p className="text-gray-600 font-medium">Monitor and control gas spending across your project</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Daily Spent */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <CurrencyDollarIcon className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-blue-600">
                {formatEther(limits.reduce((sum, limit) => sum + Number(limit.dailySpent), 0).toString())} ETH
              </span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Today's Spending</h3>
            <p className="text-sm text-gray-600">Across all limits</p>
          </div>

          {/* Monthly Total */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                <ClockIcon className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-purple-600">
                {formatEther(limits.reduce((sum, limit) => sum + Number(limit.monthlySpent), 0).toString())} ETH
              </span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Monthly Spending</h3>
            <p className="text-sm text-gray-600">This month's total</p>
          </div>

          {/* Active Limits */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                <ShieldExclamationIcon className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-green-600">
                {limits.filter(l => l.isActive).length}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Active Limits</h3>
            <p className="text-sm text-gray-600">Currently enforced</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Spending Limits</h2>
          <button
            onClick={() => setShowCreateForm(true)}
            className="group px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2"
          >
            <PlusIcon className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
            <span>New Limit</span>
          </button>
        </div>

        {/* Spending Limits List */}
        <div className="space-y-6">
          {limits.map((limit) => {
            const dailyPercentage = getUsagePercentage(limit.dailySpent, limit.dailyLimit);
            const monthlyPercentage = limit.monthlyLimit ? getUsagePercentage(limit.monthlySpent, limit.monthlyLimit) : 0;
            const dailyStatus = getUsageStatus(dailyPercentage);
            const monthlyStatus = getUsageStatus(monthlyPercentage);

            return (
              <div key={limit.id} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-gray-200/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        limit.type === 'project' 
                          ? 'bg-gradient-to-br from-blue-500 to-blue-600' 
                          : 'bg-gradient-to-br from-purple-500 to-purple-600'
                      }`}>
                        {limit.type === 'project' ? (
                          <ChartBarIcon className="h-6 w-6 text-white" />
                        ) : (
                          <CurrencyDollarIcon className="h-6 w-6 text-white" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          {limit.type === 'project' ? 'Project-Wide Limit' : 'User Session Limit'}
                        </h3>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${limit.isActive ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                          <span className={`text-sm font-medium ${limit.isActive ? 'text-green-600' : 'text-gray-500'}`}>
                            {limit.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingLimit(limit)}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => deleteLimit(limit.id)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Usage Stats */}
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Daily Usage */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-gray-900">Daily Usage</h4>
                        <div className="flex items-center gap-2">
                          <dailyStatus.icon className={`h-4 w-4 text-${dailyStatus.color}-600`} />
                          <span className={`text-sm font-medium text-${dailyStatus.color}-600`}>
                            {dailyStatus.text}
                          </span>
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                          <span>{formatEther(limit.dailySpent)} ETH spent</span>
                          <span>{formatEther(limit.dailyLimit)} ETH limit</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div 
                            className={`h-3 rounded-full transition-all duration-300 ${
                              dailyPercentage >= 90 ? 'bg-red-500' :
                              dailyPercentage >= 75 ? 'bg-yellow-500' :
                              dailyPercentage >= 50 ? 'bg-blue-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${dailyPercentage}%` }}
                          ></div>
                        </div>
                        <div className="text-right text-xs text-gray-500 mt-1">
                          {dailyPercentage.toFixed(1)}% used
                        </div>
                      </div>
                      
                      <button
                        onClick={() => resetSpending(limit.id, 'daily')}
                        disabled={isLoading}
                        className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 transition-colors"
                      >
                        <RefreshIcon className="h-4 w-4" />
                        Reset Daily
                      </button>
                    </div>

                    {/* Monthly Usage */}
                    {limit.monthlyLimit && (
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold text-gray-900">Monthly Usage</h4>
                          <div className="flex items-center gap-2">
                            <monthlyStatus.icon className={`h-4 w-4 text-${monthlyStatus.color}-600`} />
                            <span className={`text-sm font-medium text-${monthlyStatus.color}-600`}>
                              {monthlyStatus.text}
                            </span>
                          </div>
                        </div>
                        
                        <div className="mb-3">
                          <div className="flex justify-between text-sm text-gray-600 mb-1">
                            <span>{formatEther(limit.monthlySpent)} ETH spent</span>
                            <span>{formatEther(limit.monthlyLimit)} ETH limit</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div 
                              className={`h-3 rounded-full transition-all duration-300 ${
                                monthlyPercentage >= 90 ? 'bg-red-500' :
                                monthlyPercentage >= 75 ? 'bg-yellow-500' :
                                monthlyPercentage >= 50 ? 'bg-blue-500' : 'bg-green-500'
                              }`}
                              style={{ width: `${monthlyPercentage}%` }}
                            ></div>
                          </div>
                          <div className="text-right text-xs text-gray-500 mt-1">
                            {monthlyPercentage.toFixed(1)}% used
                          </div>
                        </div>
                        
                        <button
                          onClick={() => resetSpending(limit.id, 'monthly')}
                          disabled={isLoading}
                          className="flex items-center gap-2 text-sm text-purple-600 hover:text-purple-700 transition-colors"
                        >
                          <RefreshIcon className="h-4 w-4" />
                          Reset Monthly
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Alert Thresholds */}
                  {(dailyPercentage >= 75 || monthlyPercentage >= 75) && (
                    <div className="mt-6 p-4 bg-yellow-50/80 backdrop-blur-sm border border-yellow-200/50 rounded-xl">
                      <div className="flex items-start gap-2">
                        <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                        <div className="text-sm text-yellow-800">
                          <strong>Spending Alert:</strong> You're approaching your spending limits. 
                          Consider reviewing your gas usage or increasing limits if needed.
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Create/Edit Form Modal */}
        {(showCreateForm || editingLimit) && (
          <SpendingLimitForm
            limit={editingLimit}
            onSave={saveLimit}
            onCancel={() => {
              setShowCreateForm(false);
              setEditingLimit(null);
            }}
            isLoading={isLoading}
          />
        )}
      </div>
    </div>
  );
}

// Spending Limit Form Component
interface SpendingLimitFormProps {
  limit?: SpendingLimit | null;
  onSave: (limit: SpendingLimit) => void;
  onCancel: () => void;
  isLoading: boolean;
}

function SpendingLimitForm({ limit, onSave, onCancel, isLoading }: SpendingLimitFormProps) {
  const [formData, setFormData] = useState({
    type: limit?.type || 'project' as 'project' | 'user_session',
    dailyLimit: limit ? (Number(limit.dailyLimit) / 1e18).toString() : '1',
    monthlyLimit: limit?.monthlyLimit ? (Number(limit.monthlyLimit) / 1e18).toString() : '10',
    hasMonthlyLimit: Boolean(limit?.monthlyLimit),
    isActive: limit?.isActive ?? true
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.dailyLimit || parseFloat(formData.dailyLimit) <= 0) {
      newErrors.dailyLimit = 'Daily limit must be greater than 0';
    }
    
    if (formData.hasMonthlyLimit) {
      if (!formData.monthlyLimit || parseFloat(formData.monthlyLimit) <= 0) {
        newErrors.monthlyLimit = 'Monthly limit must be greater than 0';
      } else if (parseFloat(formData.monthlyLimit) < parseFloat(formData.dailyLimit)) {
        newErrors.monthlyLimit = 'Monthly limit should be greater than daily limit';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    
    const newLimit: SpendingLimit = {
      id: limit?.id || '',
      type: formData.type,
      dailyLimit: (parseFloat(formData.dailyLimit) * 1e18).toString(),
      monthlyLimit: formData.hasMonthlyLimit ? (parseFloat(formData.monthlyLimit) * 1e18).toString() : undefined,
      dailySpent: limit?.dailySpent || '0',
      monthlySpent: limit?.monthlySpent || '0',
      lastDailyReset: limit?.lastDailyReset || new Date().toISOString(),
      lastMonthlyReset: limit?.lastMonthlyReset || new Date().toISOString(),
      isActive: formData.isActive
    };
    
    onSave(newLimit);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-200/50 w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-orange-600 to-red-600 p-6 text-white">
          <h2 className="text-2xl font-bold">
            {limit ? 'Edit Spending Limit' : 'Create Spending Limit'}
          </h2>
          <p className="text-orange-100 mt-1">Set up gas spending controls</p>
        </div>
        
        {/* Form */}
        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Limit Type
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-200 focus:outline-none transition-all duration-300"
            >
              <option value="project">Project-Wide Limit</option>
              <option value="user_session">User Session Limit</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Daily Limit (ETH) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              step="0.001"
              value={formData.dailyLimit}
              onChange={(e) => setFormData(prev => ({ ...prev, dailyLimit: e.target.value }))}
              className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-300 ${
                errors.dailyLimit 
                  ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-200' 
                  : 'border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-200'
              }`}
              placeholder="1.0"
            />
            {errors.dailyLimit && (
              <p className="mt-2 text-sm text-red-600">{errors.dailyLimit}</p>
            )}
          </div>
          
          <div>
            <label className="flex items-center gap-2 cursor-pointer mb-3">
              <input
                type="checkbox"
                checked={formData.hasMonthlyLimit}
                onChange={(e) => setFormData(prev => ({ ...prev, hasMonthlyLimit: e.target.checked }))}
                className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <span className="text-sm font-semibold text-gray-900">Set Monthly Limit</span>
            </label>
            
            {formData.hasMonthlyLimit && (
              <input
                type="number"
                step="0.001"
                value={formData.monthlyLimit}
                onChange={(e) => setFormData(prev => ({ ...prev, monthlyLimit: e.target.value }))}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-300 ${
                  errors.monthlyLimit 
                    ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-200' 
                    : 'border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-200'
                }`}
                placeholder="10.0"
              />
            )}
            {errors.monthlyLimit && (
              <p className="mt-2 text-sm text-red-600">{errors.monthlyLimit}</p>
            )}
          </div>
          
          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                className="w-5 h-5 text-green-600 rounded border-gray-300 focus:ring-green-500"
              />
              <span className="text-sm font-semibold text-gray-900">Active Limit</span>
            </label>
          </div>
        </div>
        
        {/* Actions */}
        <div className="p-6 bg-gray-50/80 backdrop-blur-sm border-t border-gray-200/50 flex gap-4">
          <button
            onClick={onCancel}
            className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-all duration-300 font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 text-white px-6 py-3 rounded-xl hover:from-orange-700 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-semibold shadow-lg hover:shadow-xl hover:scale-105 disabled:hover:scale-100 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <CheckCircleIcon className="h-5 w-5" />
                <span>{limit ? 'Update' : 'Create'} Limit</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}