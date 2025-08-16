'use client';

import { useState, useCallback, memo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { saveSessionPolicyAction } from '@/app/actions/session-policies';
import { CheckIcon, ChevronRightIcon, PlusIcon, XMarkIcon, ShieldCheckIcon, ClockIcon, CurrencyDollarIcon, CodeBracketIcon, GlobeAltIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { SparklesIcon, BoltIcon, LockClosedIcon } from '@heroicons/react/24/solid';

interface SessionPolicy {
  name: string;
  description: string;
  permissions: {
    contracts: {
      address: string;
      name: string;
      methods: string[];
    }[];
    spendingLimits: {
      dailyLimit: string;
      perTxLimit: string;
      monthlyLimit: string;
    };
    timeRestrictions: {
      expiresAt?: string;
      validFrom?: string;
      timezone: string;
    };
    ipWhitelist: string[];
  };
  isActive: boolean;
}

interface Contract {
  address: string;
  name: string;
  abi?: any[];
  methods: string[];
}

const COMMON_CONTRACTS = [
  {
    address: '0x1234567890123456789012345678901234567890',
    name: 'Counter Contract',
    methods: ['increment', 'decrement', 'getValue', 'setValue']
  },
  {
    address: '0x2345678901234567890123456789012345678901',
    name: 'ERC-20 Token',
    methods: ['transfer', 'approve', 'transferFrom', 'balanceOf']
  },
  {
    address: '0x3456789012345678901234567890123456789012',
    name: 'NFT Marketplace',
    methods: ['createListing', 'buyItem', 'cancelListing', 'updatePrice']
  }
];

const ERC20_METHODS = [
  'transfer', 'approve', 'transferFrom', 'mint', 'burn', 'increaseAllowance', 'decreaseAllowance'
];

const ERC721_METHODS = [
  'transferFrom', 'safeTransferFrom', 'approve', 'setApprovalForAll', 'mint', 'burn'
];

const DEFI_METHODS = [
  'swap', 'addLiquidity', 'removeLiquidity', 'stake', 'unstake', 'claim', 'harvest'
];

// Enhanced Step Component with animations and modern design
function StepWrapper({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);
  
  return (
    <div className={`transition-all duration-700 ease-out transform ${
      isVisible ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'
    } ${className}`}>
      {children}
    </div>
  );
}

// Step 1: Basic Info Component - Enhanced with beautiful design
function BasicInfoStep({ 
  policy,
  updatePolicy,
  onNext 
}: { 
  policy: SessionPolicy;
  updatePolicy: (updates: Partial<SessionPolicy>) => void;
  onNext: () => void; 
}) {
  const [nameError, setNameError] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleNameChange = (value: string) => {
    setIsTyping(true);
    updatePolicy({ name: value });
    if (value.trim()) {
      setNameError('');
    }
    setTimeout(() => setIsTyping(false), 1000);
  };

  const handleContinue = () => {
    if (!policy.name.trim()) {
      setNameError('Policy name is required');
      return;
    }
    onNext();
  };

  return (
    <StepWrapper>
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="text-center relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 blur-3xl -z-10" />
          <div className="relative">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-6 shadow-lg">
              <SparklesIcon className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-3">
              Create Your Session Policy
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Design a secure, flexible policy that defines exactly what your session keys can do. 
              <span className="text-blue-600 font-medium">Start with the basics.</span>
            </p>
          </div>
        </div>

        <div className="max-w-2xl mx-auto space-y-8">
          {/* Policy Name Input */}
          <div className="group">
            <label className="block text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <CodeBracketIcon className="h-4 w-4 text-blue-600" />
              Policy Name
              <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={policy.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g., DeFi Trading Session, Gaming Actions, NFT Marketplace"
                className={`w-full px-4 py-4 text-lg border-2 rounded-xl transition-all duration-300 bg-white/50 backdrop-blur-sm
                  ${nameError 
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                    : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200 group-hover:border-gray-300'
                  } focus:ring-4 focus:outline-none shadow-sm hover:shadow-md`}
              />
              {isTyping && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                </div>
              )}
            </div>
            {nameError && (
              <p className="text-red-600 text-sm mt-2 flex items-center gap-1 animate-in slide-in-from-left-1">
                <InformationCircleIcon className="h-4 w-4" />
                {nameError}
              </p>
            )}
          </div>

          {/* Description Input */}
          <div className="group">
            <label className="block text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <InformationCircleIcon className="h-4 w-4 text-purple-600" />
              Description
              <span className="text-gray-400 text-xs font-normal">(Optional)</span>
            </label>
            <textarea
              value={policy.description}
              onChange={(e) => updatePolicy({ description: e.target.value })}
              placeholder="Describe the purpose and scope of this session policy. For example: 'Allows users to interact with DeFi protocols for swapping tokens and providing liquidity with restricted spending limits.'"
              rows={4}
              className="w-full px-4 py-4 text-base border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-200 focus:outline-none transition-all duration-300 bg-white/50 backdrop-blur-sm group-hover:border-gray-300 shadow-sm hover:shadow-md resize-none"
            />
            <div className="flex justify-between mt-2 text-xs text-gray-500">
              <span>Help users understand what this policy enables</span>
              <span>{policy.description.length}/500</span>
            </div>
          </div>

          {/* Enhanced Tips Section */}
          <div className="relative bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200/50 rounded-2xl p-6 shadow-sm">
            <div className="absolute top-4 left-4">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <BoltIcon className="h-4 w-4 text-white" />
              </div>
            </div>
            <div className="ml-12">
              <h3 className="font-semibold text-blue-900 mb-3 text-lg">Pro Tips for Better Policies</h3>
              <div className="space-y-3">
                {[
                  { icon: "🎯", text: "Be specific about your use case", detail: "Gaming, DeFi, NFTs, etc." },
                  { icon: "👥", text: "Consider your target users", detail: "Developers, end users, or both" },
                  { icon: "🔒", text: "Think security first", detail: "Start restrictive, expand as needed" }
                ].map((tip, index) => (
                  <div key={index} className="flex items-start gap-3 text-blue-800">
                    <span className="text-lg">{tip.icon}</span>
                    <div>
                      <p className="font-medium">{tip.text}</p>
                      <p className="text-sm text-blue-600">{tip.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end pt-6">
          <button
            onClick={handleContinue}
            disabled={!policy.name.trim()}
            className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 disabled:hover:scale-100 flex items-center gap-2"
          >
            <span>Continue to Permissions</span>
            <ChevronRightIcon className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-800 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
          </button>
        </div>
      </div>
    </StepWrapper>
  );
}

export function SessionPolicyBuilder({ projectId, onComplete }: { projectId?: string; onComplete?: () => void }) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [policy, setPolicy] = useState<SessionPolicy>({
    name: '',
    description: '',
    permissions: {
      contracts: [],
      spendingLimits: {
        dailyLimit: '1',
        perTxLimit: '0.1',
        monthlyLimit: '10'
      },
      timeRestrictions: {
        timezone: 'UTC'
      },
      ipWhitelist: []
    },
    isActive: true
  });

  const [customContract, setCustomContract] = useState({
    address: '',
    name: '',
    methods: [] as string[]
  });

  const [customMethod, setCustomMethod] = useState('');
  const [customIp, setCustomIp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);

  const steps = [
    { id: 'basic', title: 'Basic Info', description: 'Name and description' },
    { id: 'contracts', title: 'Contract Permissions', description: 'Allowed contracts and methods' },
    { id: 'limits', title: 'Spending Limits', description: 'Financial and time restrictions' },
    { id: 'security', title: 'Security Settings', description: 'IP whitelist and additional security' },
    { id: 'review', title: 'Review', description: 'Review and create policy' }
  ];

  const updatePolicy = useCallback((updates: Partial<SessionPolicy>) => {
    setPolicy(prev => ({ ...prev, ...updates }));
  }, []);

  const handleNext = useCallback(() => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  }, [currentStep, steps.length]);

  const handleBack = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);


  const addContract = (contract: Contract) => {
    const newContracts = [...policy.permissions.contracts, {
      address: contract.address,
      name: contract.name,
      methods: contract.methods
    }];
    updatePolicy({
      permissions: {
        ...policy.permissions,
        contracts: newContracts
      }
    });
  };

  const removeContract = (address: string) => {
    const newContracts = policy.permissions.contracts.filter(c => c.address !== address);
    updatePolicy({
      permissions: {
        ...policy.permissions,
        contracts: newContracts
      }
    });
  };

  const addCustomContract = () => {
    if (customContract.address && customContract.name && customContract.methods.length > 0) {
      addContract(customContract);
      setCustomContract({ address: '', name: '', methods: [] });
    }
  };

  const addMethodToCustomContract = () => {
    if (customMethod && !customContract.methods.includes(customMethod)) {
      setCustomContract(prev => ({
        ...prev,
        methods: [...prev.methods, customMethod]
      }));
      setCustomMethod('');
    }
  };

  const removeMethodFromCustomContract = (method: string) => {
    setCustomContract(prev => ({
      ...prev,
      methods: prev.methods.filter(m => m !== method)
    }));
  };

  const addIpToWhitelist = () => {
    if (customIp && !policy.permissions.ipWhitelist.includes(customIp)) {
      updatePolicy({
        permissions: {
          ...policy.permissions,
          ipWhitelist: [...policy.permissions.ipWhitelist, customIp]
        }
      });
      setCustomIp('');
    }
  };

  const removeIpFromWhitelist = (ip: string) => {
    updatePolicy({
      permissions: {
        ...policy.permissions,
        ipWhitelist: policy.permissions.ipWhitelist.filter(i => i !== ip)
      }
    });
  };


  // Step 2: Contract Permissions - Enhanced with beautiful interactions
  const ContractPermissionsStep = () => (
    <StepWrapper>
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="text-center relative">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 to-blue-600/20 blur-3xl -z-10" />
          <div className="relative">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-2xl mb-6 shadow-lg">
              <ShieldCheckIcon className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-3">
              Contract Permissions
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Choose which smart contracts your session keys can interact with.
              <span className="text-emerald-600 font-medium"> More contracts = more power, but consider security.</span>
            </p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto">
          {/* Selected Contracts */}
          {policy.permissions.contracts.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-6">
                <CheckIcon className="h-6 w-6 text-emerald-600" />
                <h3 className="text-xl font-bold text-gray-900">Selected Contracts</h3>
                <span className="bg-emerald-100 text-emerald-800 text-sm font-medium px-3 py-1 rounded-full">
                  {policy.permissions.contracts.length} contract{policy.permissions.contracts.length !== 1 ? 's' : ''}
                </span>
              </div>
              <div className="grid gap-4">
                {policy.permissions.contracts.map((contract, index) => (
                  <div key={index} className="group relative bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                    <div className="absolute -top-2 -right-2">
                      <button
                        onClick={() => removeContract(contract.address)}
                        className="w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0">
                        <CodeBracketIcon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-lg font-bold text-emerald-900 mb-1">{contract.name}</h4>
                        <p className="text-sm text-emerald-700 font-mono bg-emerald-100 px-3 py-1 rounded-lg inline-block break-all">
                          {contract.address}
                        </p>
                        <div className="mt-4">
                          <p className="text-sm font-medium text-gray-700 mb-2">Allowed methods:</p>
                          <div className="flex flex-wrap gap-2">
                            {contract.methods.map((method) => (
                              <span key={method} className="text-xs bg-white text-emerald-800 px-3 py-1 rounded-full border border-emerald-200 font-medium">
                                {method}()
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Common Contracts */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <BoltIcon className="h-6 w-6 text-blue-600" />
              <h3 className="text-xl font-bold text-gray-900">Popular Contracts</h3>
              <span className="text-sm text-gray-500">Pre-configured and ready to use</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {COMMON_CONTRACTS.map((contract) => {
                const isSelected = policy.permissions.contracts.some(c => c.address === contract.address);
                return (
                  <div key={contract.address} className={`group relative border-2 rounded-2xl p-6 transition-all duration-300 cursor-pointer
                    ${isSelected 
                      ? 'border-emerald-300 bg-emerald-50 shadow-lg scale-105' 
                      : 'border-gray-200 hover:border-blue-300 hover:shadow-lg hover:scale-105'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                        <CheckIcon className="h-4 w-4 text-white" />
                      </div>
                    )}
                    <div className="flex items-start gap-4 mb-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors
                        ${isSelected ? 'bg-emerald-500' : 'bg-blue-500 group-hover:bg-blue-600'}`}>
                        <CodeBracketIcon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-gray-900 mb-1 text-lg">{contract.name}</h4>
                        <p className="text-xs text-gray-500 font-mono bg-gray-100 px-2 py-1 rounded break-all">
                          {contract.address.slice(0, 10)}...{contract.address.slice(-8)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-6">
                      <p className="text-sm font-medium text-gray-700">Available methods:</p>
                      <div className="space-y-1">
                        {contract.methods.slice(0, 3).map((method) => (
                          <div key={method} className="flex items-center gap-2 text-sm text-gray-600">
                            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                            <code className="text-xs">{method}()</code>
                          </div>
                        ))}
                        {contract.methods.length > 3 && (
                          <div className="text-xs text-gray-500 font-medium">+{contract.methods.length - 3} more methods</div>
                        )}
                      </div>
                    </div>
                    
                    <button
                      onClick={() => isSelected ? removeContract(contract.address) : addContract(contract)}
                      className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2
                        ${isSelected 
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                          : 'bg-blue-600 hover:bg-blue-700 text-white hover:scale-105'
                        }`}
                    >
                      {isSelected ? (
                        <>
                          <CheckIcon className="h-4 w-4" />
                          Added
                        </>
                      ) : (
                        <>
                          <PlusIcon className="h-4 w-4" />
                          Add Contract
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Custom Contract */}
          <div className="relative bg-gradient-to-br from-gray-50 to-blue-50 border-2 border-dashed border-gray-300 rounded-2xl p-8 hover:border-blue-400 transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                <PlusIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Add Custom Contract</h3>
                <p className="text-sm text-gray-600">Deploy your own contract or add any contract address</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <GlobeAltIcon className="h-4 w-4 text-purple-600" />
                  Contract Address
                </label>
                <input
                  type="text"
                  value={customContract.address}
                  onChange={(e) => setCustomContract(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="0x1234567890123456789012345678901234567890"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-200 focus:outline-none transition-all duration-300 bg-white font-mono text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <CodeBracketIcon className="h-4 w-4 text-purple-600" />
                  Contract Name
                </label>
                <input
                  type="text"
                  value={customContract.name}
                  onChange={(e) => setCustomContract(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="My Awesome Contract"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-200 focus:outline-none transition-all duration-300 bg-white"
                />
              </div>
            </div>

            {/* Method Management */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Allowed Methods
              </label>
              <div className="flex gap-3 mb-4">
                <input
                  type="text"
                  value={customMethod}
                  onChange={(e) => setCustomMethod(e.target.value)}
                  placeholder="transfer, approve, mint..."
                  className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-200 focus:outline-none transition-all duration-300 bg-white font-mono"
                  onKeyPress={(e) => e.key === 'Enter' && addMethodToCustomContract()}
                />
                <button
                  onClick={addMethodToCustomContract}
                  disabled={!customMethod.trim()}
                  className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 flex items-center gap-2 font-medium"
                >
                  <PlusIcon className="h-4 w-4" />
                  Add
                </button>
              </div>
              
              {/* Quick Method Templates */}
              <div className="space-y-3">
                <p className="text-sm font-medium text-gray-700">Quick templates:</p>
                <div className="flex flex-wrap gap-3">
                  {[
                    { name: 'ERC-20', methods: ERC20_METHODS, color: 'bg-blue-100 text-blue-700 hover:bg-blue-200' },
                    { name: 'ERC-721', methods: ERC721_METHODS, color: 'bg-green-100 text-green-700 hover:bg-green-200' },
                    { name: 'DeFi', methods: DEFI_METHODS, color: 'bg-purple-100 text-purple-700 hover:bg-purple-200' }
                  ].map((template) => (
                    <button
                      key={template.name}
                      onClick={() => setCustomContract(prev => ({
                        ...prev,
                        methods: [...new Set([...prev.methods, ...template.methods])]
                      }))}
                      className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 hover:scale-105 ${template.color}`}
                    >
                      + {template.name} ({template.methods.length})
                    </button>
                  ))}
                </div>
              </div>

              
              {customContract.methods.length > 0 && (
                <div className="mt-4 p-4 bg-white rounded-xl border border-gray-200">
                  <p className="text-sm font-medium text-gray-700 mb-3">Selected methods ({customContract.methods.length}):</p>
                  <div className="flex flex-wrap gap-2">
                    {customContract.methods.map((method) => (
                      <span key={method} className="group inline-flex items-center gap-2 text-sm bg-purple-100 text-purple-800 px-3 py-2 rounded-lg font-medium hover:bg-purple-200 transition-colors">
                        <code>{method}()</code>
                        <button
                          onClick={() => removeMethodFromCustomContract(method)}
                          className="w-4 h-4 text-purple-600 hover:text-red-600 transition-colors"
                        >
                          <XMarkIcon className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={addCustomContract}
              disabled={!customContract.address || !customContract.name || customContract.methods.length === 0}
              className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-4 rounded-xl hover:from-purple-700 hover:to-purple-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 disabled:hover:scale-100 font-semibold text-lg flex items-center justify-center gap-2 shadow-lg"
            >
              <PlusIcon className="h-5 w-5" />
              Add Custom Contract
            </button>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center pt-8">
          <button
            onClick={() => setCurrentStep(0)}
            className="group flex items-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-all duration-300 font-medium"
          >
            <ChevronRightIcon className="h-4 w-4 rotate-180 group-hover:-translate-x-1 transition-transform duration-300" />
            Back to Basics
          </button>
          <button
            onClick={() => setCurrentStep(2)}
            disabled={policy.permissions.contracts.length === 0}
            className="group flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 disabled:hover:scale-100 font-semibold shadow-lg"
          >
            Continue to Limits
            <ChevronRightIcon className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </div>
      </div>
    </StepWrapper>
  );

  // Step 3: Spending Limits - Enhanced with beautiful controls
  const SpendingLimitsStep = () => (
    <StepWrapper>
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="text-center relative">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-600/20 to-orange-600/20 blur-3xl -z-10" />
          <div className="relative">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl mb-6 shadow-lg">
              <CurrencyDollarIcon className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-3">
              Spending Limits & Time Controls
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Set smart boundaries to protect your assets while enabling smooth user experiences.
              <span className="text-amber-600 font-medium"> Balance security with usability.</span>
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Spending Limits */}
          <div className="relative bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/50 rounded-2xl p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center">
                <CurrencyDollarIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Spending Limits</h3>
                <p className="text-sm text-gray-600">Set maximum ETH amounts to prevent overspending</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="group">
                <label className="block text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <BoltIcon className="h-4 w-4 text-amber-600" />
                  Per Transaction
                  <span className="text-xs text-gray-500 font-normal">(ETH)</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.001"
                    min="0"
                    value={policy.permissions.spendingLimits.perTxLimit}
                    onChange={(e) => updatePolicy({
                      permissions: {
                        ...policy.permissions,
                        spendingLimits: {
                          ...policy.permissions.spendingLimits,
                          perTxLimit: e.target.value
                        }
                      }
                    })}
                    className="w-full px-4 py-4 text-lg font-mono border-2 border-amber-200 rounded-xl focus:border-amber-500 focus:ring-4 focus:ring-amber-200 focus:outline-none transition-all duration-300 bg-white group-hover:border-amber-300 pr-12"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-amber-600 font-medium">ETH</span>
                </div>
                <p className="text-xs text-gray-600 mt-2">Maximum per single transaction</p>
              </div>
              
              <div className="group">
                <label className="block text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <ClockIcon className="h-4 w-4 text-orange-600" />
                  Daily Limit
                  <span className="text-xs text-gray-500 font-normal">(24h)</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={policy.permissions.spendingLimits.dailyLimit}
                    onChange={(e) => updatePolicy({
                      permissions: {
                        ...policy.permissions,
                        spendingLimits: {
                          ...policy.permissions.spendingLimits,
                          dailyLimit: e.target.value
                        }
                      }
                    })}
                    className="w-full px-4 py-4 text-lg font-mono border-2 border-orange-200 rounded-xl focus:border-orange-500 focus:ring-4 focus:ring-orange-200 focus:outline-none transition-all duration-300 bg-white group-hover:border-orange-300 pr-12"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-orange-600 font-medium">ETH</span>
                </div>
                <p className="text-xs text-gray-600 mt-2">Total per 24-hour period</p>
              </div>
              
              <div className="group">
                <label className="block text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <CurrencyDollarIcon className="h-4 w-4 text-red-600" />
                  Monthly Limit
                  <span className="text-xs text-gray-500 font-normal">(30d)</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={policy.permissions.spendingLimits.monthlyLimit}
                    onChange={(e) => updatePolicy({
                      permissions: {
                        ...policy.permissions,
                        spendingLimits: {
                          ...policy.permissions.spendingLimits,
                          monthlyLimit: e.target.value
                        }
                      }
                    })}
                    className="w-full px-4 py-4 text-lg font-mono border-2 border-red-200 rounded-xl focus:border-red-500 focus:ring-4 focus:ring-red-200 focus:outline-none transition-all duration-300 bg-white group-hover:border-red-300 pr-12"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-red-600 font-medium">ETH</span>
                </div>
                <p className="text-xs text-gray-600 mt-2">Maximum over 30 days</p>
              </div>
            </div>
            
            {/* Quick Preset Buttons */}
            <div className="mt-6 p-4 bg-white rounded-xl border border-amber-200">
              <p className="text-sm font-medium text-gray-700 mb-3">Quick presets:</p>
              <div className="flex flex-wrap gap-2">
                {[
                  { name: 'Conservative', per: '0.01', daily: '0.1', monthly: '1' },
                  { name: 'Moderate', per: '0.1', daily: '1', monthly: '10' },
                  { name: 'Liberal', per: '1', daily: '10', monthly: '100' }
                ].map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => updatePolicy({
                      permissions: {
                        ...policy.permissions,
                        spendingLimits: {
                          perTxLimit: preset.per,
                          dailyLimit: preset.daily,
                          monthlyLimit: preset.monthly
                        }
                      }
                    })}
                    className="px-4 py-2 bg-amber-100 text-amber-800 rounded-lg hover:bg-amber-200 transition-all duration-200 text-sm font-medium hover:scale-105"
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Time Restrictions */}
          <div className="relative bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200/50 rounded-2xl p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                <ClockIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Time Restrictions</h3>
                <p className="text-sm text-gray-600">Control when this policy is active</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <ClockIcon className="h-4 w-4 text-green-600" />
                  Valid From
                  <span className="text-xs text-gray-500 font-normal">(Optional)</span>
                </label>
                <input
                  type="datetime-local"
                  value={policy.permissions.timeRestrictions.validFrom || ''}
                  onChange={(e) => updatePolicy({
                    permissions: {
                      ...policy.permissions,
                      timeRestrictions: {
                        ...policy.permissions.timeRestrictions,
                        validFrom: e.target.value || undefined
                      }
                    }
                  })}
                  className="w-full px-4 py-4 border-2 border-blue-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-200 focus:outline-none transition-all duration-300 bg-white hover:border-blue-300 font-mono"
                />
                <p className="text-xs text-gray-600 mt-2">When policy becomes active</p>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <ClockIcon className="h-4 w-4 text-red-600" />
                  Expires At
                  <span className="text-xs text-gray-500 font-normal">(Optional)</span>
                </label>
                <input
                  type="datetime-local"
                  value={policy.permissions.timeRestrictions.expiresAt || ''}
                  onChange={(e) => updatePolicy({
                    permissions: {
                      ...policy.permissions,
                      timeRestrictions: {
                        ...policy.permissions.timeRestrictions,
                        expiresAt: e.target.value || undefined
                      }
                    }
                  })}
                  className="w-full px-4 py-4 border-2 border-blue-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-200 focus:outline-none transition-all duration-300 bg-white hover:border-blue-300 font-mono"
                />
                <p className="text-xs text-gray-600 mt-2">When policy expires</p>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <GlobeAltIcon className="h-4 w-4 text-blue-600" />
                Timezone
              </label>
              <select
                value={policy.permissions.timeRestrictions.timezone}
                onChange={(e) => updatePolicy({
                  permissions: {
                    ...policy.permissions,
                    timeRestrictions: {
                      ...policy.permissions.timeRestrictions,
                      timezone: e.target.value
                    }
                  }
                })}
                className="w-full px-4 py-4 border-2 border-blue-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-200 focus:outline-none transition-all duration-300 bg-white hover:border-blue-300 font-medium"
              >
                <option value="UTC">🌍 UTC (Coordinated Universal Time)</option>
                <option value="America/New_York">🇺🇸 Eastern Time (New York)</option>
                <option value="America/Chicago">🇺🇸 Central Time (Chicago)</option>
                <option value="America/Denver">🇺🇸 Mountain Time (Denver)</option>
                <option value="America/Los_Angeles">🇺🇸 Pacific Time (Los Angeles)</option>
                <option value="Europe/London">🇬🇧 London Time</option>
                <option value="Europe/Paris">🇫🇷 Paris Time</option>
                <option value="Asia/Tokyo">🇯🇵 Tokyo Time</option>
                <option value="Asia/Shanghai">🇨🇳 Shanghai Time</option>
              </select>
            </div>
            
            {/* Quick Time Presets */}
            <div className="mt-6 p-4 bg-white rounded-xl border border-blue-200">
              <p className="text-sm font-medium text-gray-700 mb-3">Quick time settings:</p>
              <div className="flex flex-wrap gap-2">
                {[
                  { name: 'Active Now', action: 'clear' },
                  { name: '1 Hour', hours: 1 },
                  { name: '24 Hours', hours: 24 },
                  { name: '7 Days', hours: 168 },
                  { name: '30 Days', hours: 720 }
                ].map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => {
                      if (preset.action === 'clear') {
                        updatePolicy({
                          permissions: {
                            ...policy.permissions,
                            timeRestrictions: {
                              ...policy.permissions.timeRestrictions,
                              validFrom: undefined,
                              expiresAt: undefined
                            }
                          }
                        });
                      } else {
                        const now = new Date();
                        const expiry = new Date(now.getTime() + (preset.hours! * 60 * 60 * 1000));
                        updatePolicy({
                          permissions: {
                            ...policy.permissions,
                            timeRestrictions: {
                              ...policy.permissions.timeRestrictions,
                              validFrom: now.toISOString().slice(0, 16),
                              expiresAt: expiry.toISOString().slice(0, 16)
                            }
                          }
                        });
                      }
                    }}
                    className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-all duration-200 text-sm font-medium hover:scale-105"
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center pt-8">
          <button
            onClick={() => setCurrentStep(1)}
            className="group flex items-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-all duration-300 font-medium"
          >
            <ChevronRightIcon className="h-4 w-4 rotate-180 group-hover:-translate-x-1 transition-transform duration-300" />
            Back to Permissions
          </button>
          <button
            onClick={() => setCurrentStep(3)}
            className="group flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 hover:scale-105 font-semibold shadow-lg"
          >
            Continue to Security
            <ChevronRightIcon className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </div>
      </div>
    </StepWrapper>
  );

  // Step 4: Security Settings - Enhanced with premium security controls
  const SecuritySettingsStep = () => (
    <StepWrapper>
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="text-center relative">
          <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-purple-600/20 blur-3xl -z-10" />
          <div className="relative">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-500 to-purple-600 rounded-2xl mb-6 shadow-lg">
              <LockClosedIcon className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-3">
              Security & Access Control
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Add layers of protection to ensure your session keys are used safely.
              <span className="text-red-600 font-medium"> Security is your responsibility.</span>
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* IP Whitelist */}
          <div className="relative bg-gradient-to-br from-red-50 to-pink-50 border border-red-200/50 rounded-2xl p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center">
                <GlobeAltIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">IP Address Whitelist</h3>
                <p className="text-sm text-gray-600">Restrict access to specific IP addresses for enhanced security</p>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl border border-red-200 mb-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <InformationCircleIcon className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-700 font-medium mb-1">IP Whitelist Behavior</p>
                  <p className="text-xs text-gray-600">
                    • Leave empty to allow all IP addresses (less secure)
                    • Add specific IPs or CIDR blocks to restrict access
                    • Session keys will only work from whitelisted addresses
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 mb-6">
              <input
                type="text"
                value={customIp}
                onChange={(e) => setCustomIp(e.target.value)}
                placeholder="192.168.1.1, 10.0.0.0/24, or your office IP"
                className="flex-1 px-4 py-4 border-2 border-red-200 rounded-xl focus:border-red-500 focus:ring-4 focus:ring-red-200 focus:outline-none transition-all duration-300 bg-white hover:border-red-300 font-mono"
                onKeyPress={(e) => e.key === 'Enter' && addIpToWhitelist()}
              />
              <button
                onClick={addIpToWhitelist}
                disabled={!customIp.trim()}
                className="px-6 py-4 bg-red-600 text-white rounded-xl hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 flex items-center gap-2 font-semibold"
              >
                <PlusIcon className="h-4 w-4" />
                Add IP
              </button>
            </div>

            {policy.permissions.ipWhitelist.length > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <CheckIcon className="h-5 w-5 text-green-600" />
                  <span className="font-medium text-gray-900">Whitelisted IP Addresses</span>
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                    {policy.permissions.ipWhitelist.length} address{policy.permissions.ipWhitelist.length !== 1 ? 'es' : ''}
                  </span>
                </div>
                <div className="grid gap-3">
                  {policy.permissions.ipWhitelist.map((ip, index) => (
                    <div key={ip} className="group flex items-center justify-between bg-green-50 border border-green-200 rounded-xl p-4 hover:bg-green-100 transition-all duration-200">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold text-xs">{index + 1}</span>
                        </div>
                        <code className="font-mono text-green-800 font-medium">{ip}</code>
                      </div>
                      <button
                        onClick={() => removeIpFromWhitelist(ip)}
                        className="w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110 opacity-0 group-hover:opacity-100"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-xl">
                <GlobeAltIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 font-medium">No IP restrictions</p>
                <p className="text-sm text-gray-500">Session keys can be used from any IP address</p>
              </div>
            )}

            {/* IP Examples */}
            <div className="mt-6 p-4 bg-white rounded-xl border border-red-200">
              <p className="text-sm font-medium text-gray-700 mb-3">Common IP patterns:</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                {[
                  { pattern: '192.168.1.100', desc: 'Single IP address' },
                  { pattern: '192.168.1.0/24', desc: 'Local subnet (256 IPs)' },
                  { pattern: '10.0.0.0/8', desc: 'Private network range' }
                ].map((example) => (
                  <div key={example.pattern} className="bg-gray-50 p-3 rounded-lg">
                    <code className="font-mono text-red-700 font-medium block mb-1">{example.pattern}</code>
                    <p className="text-gray-600">{example.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Policy Status */}
          <div className="relative bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200/50 rounded-2xl p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center">
                <BoltIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Policy Activation</h3>
                <p className="text-sm text-gray-600">Control when this policy becomes active</p>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl border border-emerald-200">
              <div className="flex items-start gap-4">
                <div className="flex items-center mt-1">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={policy.isActive}
                    onChange={(e) => updatePolicy({ isActive: e.target.checked })}
                    className="w-5 h-5 text-emerald-600 bg-gray-100 border-gray-300 rounded focus:ring-emerald-500 focus:ring-2"
                  />
                </div>
                <div className="flex-1">
                  <label htmlFor="isActive" className="text-lg font-semibold text-gray-900 cursor-pointer">
                    Activate policy immediately
                  </label>
                  <p className="text-sm text-gray-600 mt-1">
                    When enabled, this policy will be active as soon as it's created. 
                    You can always enable or disable policies later from the dashboard.
                  </p>
                  <div className={`mt-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    policy.isActive 
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                      : 'bg-gray-100 text-gray-600 border border-gray-200'
                  }`}>
                    Status: {policy.isActive ? '✅ Will be activated' : '⏸️ Will be created as inactive'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Security Best Practices */}
          <div className="relative bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200/50 rounded-2xl p-8 shadow-sm">
            <div className="absolute top-6 left-6">
              <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center">
                <ShieldCheckIcon className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="ml-16">
              <h4 className="text-xl font-bold text-amber-900 mb-3">Security Best Practices</h4>
              <div className="grid gap-4">
                {[
                  { 
                    icon: '💰', 
                    title: 'Conservative Spending Limits', 
                    desc: 'Start with lower limits for production environments. You can increase them later.' 
                  },
                  { 
                    icon: '🎯', 
                    title: 'Minimal Contract Access', 
                    desc: 'Only whitelist contracts and methods that are absolutely necessary.' 
                  },
                  { 
                    icon: '🌐', 
                    title: 'IP Restrictions', 
                    desc: 'Consider IP whitelisting for sensitive operations or high-value transactions.' 
                  },
                  { 
                    icon: '⏰', 
                    title: 'Time Boundaries', 
                    desc: 'Set expiration times for temporary access or testing scenarios.' 
                  }
                ].map((tip, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 bg-white rounded-xl border border-amber-200">
                    <span className="text-2xl flex-shrink-0">{tip.icon}</span>
                    <div>
                      <h5 className="font-semibold text-amber-900 mb-1">{tip.title}</h5>
                      <p className="text-sm text-amber-800">{tip.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center pt-8">
          <button
            onClick={() => setCurrentStep(2)}
            className="group flex items-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-all duration-300 font-medium"
          >
            <ChevronRightIcon className="h-4 w-4 rotate-180 group-hover:-translate-x-1 transition-transform duration-300" />
            Back to Limits
          </button>
          <button
            onClick={() => setCurrentStep(4)}
            className="group flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-300 hover:scale-105 font-semibold shadow-lg"
          >
            Review & Create
            <ChevronRightIcon className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </div>
      </div>
    </StepWrapper>
  );

  // Step 5: Review - Enhanced with beautiful summary and creation flow
  const ReviewStep = () => (
    <StepWrapper>
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="text-center relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 blur-3xl -z-10" />
          <div className="relative">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl mb-6 shadow-lg">
              <CheckIcon className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-3">
              Review & Create Policy
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Everything looks good? Let's create your session policy and start building amazing experiences.
              <span className="text-purple-600 font-medium"> One click away from launch!</span>
            </p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto space-y-8">
          {/* Policy Overview */}
          <div className="relative bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200/50 rounded-2xl p-8 shadow-sm">
            <div className="flex items-start gap-6">
              <div className="w-16 h-16 bg-purple-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                <SparklesIcon className="h-8 w-8 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{policy.name}</h3>
                    <div className="flex items-center gap-3">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                        policy.isActive 
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                          : 'bg-gray-100 text-gray-600 border border-gray-200'
                      }`}>
                        {policy.isActive ? (
                          <>
                            <BoltIcon className="h-3 w-3" />
                            Will be Active
                          </>
                        ) : (
                          <>
                            <span className="w-2 h-2 bg-gray-400 rounded-full" />
                            Will be Inactive
                          </>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
                {policy.description && (
                  <div className="bg-white p-4 rounded-xl border border-purple-200">
                    <p className="text-gray-700 leading-relaxed">{policy.description}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Contract Permissions */}
          <div className="bg-gradient-to-br from-emerald-50 to-blue-50 border border-emerald-200/50 rounded-2xl p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center">
                <ShieldCheckIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Contract Permissions
                </h3>
                <p className="text-sm text-gray-600">
                  {policy.permissions.contracts.length} contract{policy.permissions.contracts.length !== 1 ? 's' : ''} authorized
                </p>
              </div>
            </div>
            
            <div className="grid gap-4">
              {policy.permissions.contracts.map((contract, index) => (
                <div key={index} className="bg-white border border-emerald-200 rounded-xl p-6 hover:shadow-md transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-sm">{index + 1}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-900 text-lg mb-1">{contract.name}</h4>
                      <p className="text-sm text-gray-600 font-mono bg-gray-100 px-3 py-1 rounded-lg inline-block break-all mb-3">
                        {contract.address}
                      </p>
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">
                          Allowed methods ({contract.methods.length}):
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {contract.methods.map((method) => (
                            <span key={method} className="text-xs bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full font-medium border border-emerald-200">
                              {method}()
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Spending Limits */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/50 rounded-2xl p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center">
                <CurrencyDollarIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Spending Limits</h3>
                <p className="text-sm text-gray-600">Financial boundaries for safe transactions</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl border border-amber-200">
                <div className="flex items-center gap-3 mb-2">
                  <BoltIcon className="h-5 w-5 text-amber-600" />
                  <span className="text-sm font-semibold text-gray-700">Per Transaction</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{policy.permissions.spendingLimits.perTxLimit} <span className="text-lg text-amber-600">ETH</span></p>
              </div>
              <div className="bg-white p-6 rounded-xl border border-orange-200">
                <div className="flex items-center gap-3 mb-2">
                  <ClockIcon className="h-5 w-5 text-orange-600" />
                  <span className="text-sm font-semibold text-gray-700">Daily Limit</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{policy.permissions.spendingLimits.dailyLimit} <span className="text-lg text-orange-600">ETH</span></p>
              </div>
              <div className="bg-white p-6 rounded-xl border border-red-200">
                <div className="flex items-center gap-3 mb-2">
                  <CurrencyDollarIcon className="h-5 w-5 text-red-600" />
                  <span className="text-sm font-semibold text-gray-700">Monthly Limit</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{policy.permissions.spendingLimits.monthlyLimit} <span className="text-lg text-red-600">ETH</span></p>
              </div>
            </div>
          </div>

          {/* Time & Security */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200/50 rounded-2xl p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                <LockClosedIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Time & Security Settings</h3>
                <p className="text-sm text-gray-600">Access controls and temporal restrictions</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl border border-blue-200">
                  <div className="flex items-center gap-3 mb-3">
                    <ClockIcon className="h-5 w-5 text-green-600" />
                    <span className="font-semibold text-gray-900">Valid From</span>
                  </div>
                  <p className="text-gray-700 font-medium">
                    {policy.permissions.timeRestrictions.validFrom 
                      ? new Date(policy.permissions.timeRestrictions.validFrom).toLocaleString()
                      : 'Immediately upon creation'
                    }
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-xl border border-blue-200">
                  <div className="flex items-center gap-3 mb-3">
                    <ClockIcon className="h-5 w-5 text-red-600" />
                    <span className="font-semibold text-gray-900">Expires At</span>
                  </div>
                  <p className="text-gray-700 font-medium">
                    {policy.permissions.timeRestrictions.expiresAt 
                      ? new Date(policy.permissions.timeRestrictions.expiresAt).toLocaleString()
                      : 'Never expires'
                    }
                  </p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl border border-blue-200">
                  <div className="flex items-center gap-3 mb-3">
                    <GlobeAltIcon className="h-5 w-5 text-blue-600" />
                    <span className="font-semibold text-gray-900">Timezone</span>
                  </div>
                  <p className="text-gray-700 font-medium">{policy.permissions.timeRestrictions.timezone}</p>
                </div>
                
                <div className="bg-white p-6 rounded-xl border border-blue-200">
                  <div className="flex items-center gap-3 mb-3">
                    <GlobeAltIcon className="h-5 w-5 text-purple-600" />
                    <span className="font-semibold text-gray-900">IP Access</span>
                  </div>
                  <p className="text-gray-700 font-medium">
                    {policy.permissions.ipWhitelist.length > 0 
                      ? `${policy.permissions.ipWhitelist.length} IP address${policy.permissions.ipWhitelist.length !== 1 ? 'es' : ''} whitelisted`
                      : 'All IP addresses allowed'
                    }
                  </p>
                  {policy.permissions.ipWhitelist.length > 0 && (
                    <div className="mt-3 space-y-1">
                      {policy.permissions.ipWhitelist.map((ip) => (
                        <code key={ip} className="block text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded font-mono">
                          {ip}
                        </code>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Final Actions */}
        <div className="flex justify-between items-center pt-8">
          <button
            onClick={() => setCurrentStep(3)}
            className="group flex items-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-all duration-300 font-medium"
          >
            <ChevronRightIcon className="h-4 w-4 rotate-180 group-hover:-translate-x-1 transition-transform duration-300" />
            Back to Security
          </button>
          
          <button
            onClick={async () => {
              if (!projectId) {
                console.error('No project ID provided');
                return;
              }

              setIsLoading(true);
              
              try {
                const result = await saveSessionPolicyAction({
                  projectId,
                  name: policy.name,
                  description: policy.description,
                  permissions: policy.permissions,
                  isActive: policy.isActive,
                });

                if (result.success) {
                  setShowSuccessAnimation(true);
                  
                  // Wait for animation
                  setTimeout(() => {
                    if (onComplete) {
                      onComplete();
                    } else {
                      router.push('/dashboard?session-policy=created');
                    }
                  }, 2000);
                } else {
                  console.error('Failed to save session policy:', result.error);
                  alert('Failed to save session policy. Please try again.');
                  setIsLoading(false);
                }
              } catch (error) {
                console.error('Failed to save session policy:', error);
                alert('Failed to save session policy. Please try again.');
                setIsLoading(false);
              }
            }}
            disabled={isLoading}
            className={`group relative px-12 py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-xl flex items-center gap-3 overflow-hidden ${
              showSuccessAnimation 
                ? 'bg-emerald-500 hover:bg-emerald-600 text-white scale-110' 
                : 'bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white hover:scale-105'
            } disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100`}
          >
            <div className={`absolute inset-0 bg-gradient-to-r from-emerald-600 to-green-700 opacity-0 transition-opacity duration-300 ${
              isLoading ? 'opacity-100' : 'group-hover:opacity-100'
            }`} />
            
            <div className="relative flex items-center gap-3">
              {showSuccessAnimation ? (
                <>
                  <CheckIcon className="h-6 w-6 animate-bounce" />
                  <span>Policy Created Successfully!</span>
                </>
              ) : isLoading ? (
                <>
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Creating Policy...</span>
                </>
              ) : (
                <>
                  <SparklesIcon className="h-6 w-6 group-hover:rotate-12 transition-transform duration-300" />
                  <span>Create Session Policy</span>
                </>
              )}
            </div>
          </button>
        </div>
      </div>
    </StepWrapper>
  );

  const StepComponent = () => {
    switch (currentStep) {
      case 0: return <BasicInfoStep policy={policy} updatePolicy={updatePolicy} onNext={handleNext} />;
      case 1: return <ContractPermissionsStep />;
      case 2: return <SpendingLimitsStep />;
      case 3: return <SecuritySettingsStep />;
      case 4: return <ReviewStep />;
      default: return <BasicInfoStep policy={policy} updatePolicy={updatePolicy} onNext={handleNext} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Enhanced Progress Bar */}
        <div className="mb-12">
          <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              {steps.map((step, index) => {
                const isActive = index === currentStep;
                const isCompleted = index < currentStep;
                const isUpcoming = index > currentStep;
                
                return (
                  <div
                    key={step.id}
                    className={`flex items-center ${index < steps.length - 1 ? 'flex-1' : ''} transition-all duration-500`}
                  >
                    <div className="flex items-center">
                      <div className={`relative flex items-center justify-center w-12 h-12 rounded-2xl text-sm font-bold transition-all duration-500 ${
                        isCompleted 
                          ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg scale-110' 
                          : isActive 
                          ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg scale-110 animate-pulse' 
                          : 'bg-gray-200 text-gray-600'
                      }`}>
                        {isCompleted ? (
                          <CheckIcon className="h-6 w-6" />
                        ) : (
                          <span>{index + 1}</span>
                        )}
                        {isActive && (
                          <div className="absolute inset-0 bg-blue-500 rounded-2xl opacity-20 animate-ping" />
                        )}
                      </div>
                      <div className="ml-4">
                        <span className={`block text-sm font-bold transition-all duration-300 ${
                          isCompleted ? 'text-emerald-600' : isActive ? 'text-blue-600' : 'text-gray-500'
                        }`}>
                          {step.title}
                        </span>
                        <span className={`block text-xs transition-all duration-300 ${
                          isActive ? 'text-blue-500' : 'text-gray-400'
                        }`}>
                          {step.description}
                        </span>
                      </div>
                    </div>
                    {index < steps.length - 1 && (
                      <div className="flex-1 mx-6">
                        <div className={`h-1 rounded-full transition-all duration-700 ease-out ${
                          isCompleted 
                            ? 'bg-gradient-to-r from-emerald-500 to-blue-500' 
                            : isActive
                            ? 'bg-gradient-to-r from-blue-500 to-gray-300'
                            : 'bg-gray-200'
                        }`} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-200/50 p-8 md:p-12">
          <StepComponent />
        </div>
      </div>
    </div>
  );
}