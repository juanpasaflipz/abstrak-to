'use client';

import { useState, useCallback, memo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { saveProviderConfigAction, testProviderConnectionAction } from '@/app/actions/provider-config';
import { 
  CheckIcon, 
  ChevronRightIcon, 
  ChevronLeftIcon,
  ShieldCheckIcon, 
  ClockIcon, 
  CurrencyDollarIcon, 
  CodeBracketIcon, 
  GlobeAltIcon, 
  InformationCircleIcon,
  CloudIcon,
  CogIcon,
  BeakerIcon,
  KeyIcon,
  LinkIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { 
  SparklesIcon, 
  BoltIcon, 
  LockClosedIcon,
  RocketLaunchIcon,
  ShieldExclamationIcon
} from '@heroicons/react/24/solid';

interface ProviderConfig {
  provider: 'safe' | 'alchemy' | 'biconomy';
  chainId: number;
  apiKey?: string;
  gasPolicy?: {
    mode: 'sponsor_all' | 'allowlist' | 'user_pays';
    dailyBudget?: string;
    perTxLimit?: string;
  };
  customRpc?: string;
}

interface WizardStep {
  id: string;
  title: string;
  description: string;
  component: React.ComponentType<any>;
}

const SUPPORTED_CHAINS = [
  { 
    id: 84532, 
    name: 'Base Sepolia', 
    network: 'base-sepolia', 
    testnet: true,
    icon: '🔵',
    description: 'Coinbase L2 testnet',
    recommended: true
  },
  { 
    id: 1, 
    name: 'Ethereum Mainnet', 
    network: 'mainnet', 
    testnet: false,
    icon: '⟠',
    description: 'Primary Ethereum network',
    recommended: false
  },
  { 
    id: 11155111, 
    name: 'Sepolia Testnet', 
    network: 'sepolia', 
    testnet: true,
    icon: '🧪',
    description: 'Ethereum testnet',
    recommended: false
  },
  { 
    id: 137, 
    name: 'Polygon', 
    network: 'polygon', 
    testnet: false,
    icon: '🟣',
    description: 'Polygon PoS chain',
    recommended: false
  },
  { 
    id: 10, 
    name: 'Optimism', 
    network: 'optimism', 
    testnet: false,
    icon: '🔴',
    description: 'Optimistic rollup L2',
    recommended: false
  },
];

const PROVIDERS = [
  {
    id: 'safe',
    name: 'Safe{Core}',
    description: 'Industry standard smart accounts with multi-sig capabilities and battle-tested security',
    features: ['Multi-signature support', 'Modular architecture', 'Battle-tested security', 'EIP-4337 compliant'],
    requiresApiKey: false,
    icon: LockClosedIcon,
    gradient: 'from-emerald-500 to-teal-600',
    accentColor: 'emerald',
    highlight: 'Most Secure'
  },
  {
    id: 'alchemy',
    name: 'Alchemy Account Kit',
    description: 'High-performance smart accounts with built-in gas sponsorship and enterprise-grade infrastructure',
    features: ['Gas sponsorship', 'High throughput', 'Developer-friendly APIs', 'Enterprise support'],
    requiresApiKey: true,
    icon: BoltIcon,
    gradient: 'from-blue-500 to-indigo-600',
    accentColor: 'blue',
    highlight: 'Most Popular'
  },
  {
    id: 'biconomy',
    name: 'Biconomy',
    description: 'Flexible smart accounts with advanced paymaster integration and cross-chain capabilities',
    features: ['Flexible paymasters', 'Gasless transactions', 'Multi-chain support', 'Advanced automation'],
    requiresApiKey: true,
    icon: RocketLaunchIcon,
    gradient: 'from-purple-500 to-pink-600',
    accentColor: 'purple',
    highlight: 'Most Flexible'
  }
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

// Step 1: Provider Selection - Enhanced with beautiful design
function ProviderSelection({ config, updateConfig, onNext }: any) {
  const [selectedProvider, setSelectedProvider] = useState(config.provider || null);
  const [isSelecting, setIsSelecting] = useState(false);

  const handleProviderSelect = (providerId: string) => {
    setIsSelecting(true);
    setSelectedProvider(providerId);
    updateConfig({ provider: providerId });
    
    setTimeout(() => {
      setIsSelecting(false);
      const provider = PROVIDERS.find(p => p.id === providerId);
      if (!provider?.requiresApiKey) {
        setTimeout(() => onNext(), 500);
      }
    }, 300);
  };

  return (
    <StepWrapper>
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="text-center relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 blur-3xl -z-10" />
          <div className="relative">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-6 shadow-lg">
              <CloudIcon className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-3">
              Choose Your Account Abstraction Provider
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Select the provider that best fits your application's needs.
              <span className="text-blue-600 font-medium"> Each offers unique advantages.</span>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {PROVIDERS.map((provider, index) => {
            const Icon = provider.icon;
            const isSelected = selectedProvider === provider.id;
            const isProcessing = isSelecting && isSelected;
            
            return (
              <div
                key={provider.id}
                className={`group relative transition-all duration-500 transform hover:scale-105 ${
                  isSelected ? 'scale-105' : ''
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {provider.highlight && (
                  <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r ${provider.gradient} text-white text-xs font-bold rounded-full shadow-lg z-10`}>
                    {provider.highlight}
                  </div>
                )}
                
                <button
                  onClick={() => handleProviderSelect(provider.id)}
                  disabled={isProcessing}
                  className={`relative w-full p-8 border-2 rounded-2xl text-left transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-2xl overflow-hidden group ${
                    isSelected
                      ? `border-${provider.accentColor}-500 bg-${provider.accentColor}-50/50`
                      : 'border-gray-200/50 hover:border-gray-300'
                  }`}
                >
                  {/* Background Gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${provider.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                  
                  {/* Selection Indicator */}
                  {isSelected && (
                    <div className={`absolute top-4 right-4 w-6 h-6 bg-gradient-to-br ${provider.gradient} rounded-full flex items-center justify-center`}>
                      {isProcessing ? (
                        <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <CheckIcon className="h-4 w-4 text-white" />
                      )}
                    </div>
                  )}

                  {/* Provider Header */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`w-14 h-14 bg-gradient-to-br ${provider.gradient} rounded-2xl flex items-center justify-center shadow-lg`}>
                      <Icon className="h-7 w-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{provider.name}</h3>
                      {provider.requiresApiKey && (
                        <div className="flex items-center gap-1">
                          <KeyIcon className="h-3 w-3 text-amber-500" />
                          <span className="text-xs text-amber-600 font-medium">API Key Required</span>
                        </div>
                      )}
                    </div>
                  </div>
            
                  <p className="text-gray-600 mb-6 leading-relaxed">{provider.description}</p>
            
                  {/* Features */}
                  <div className="space-y-3">
                    {provider.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <div className={`w-5 h-5 bg-gradient-to-br ${provider.gradient} rounded-full flex items-center justify-center flex-shrink-0`}>
                          <CheckIcon className="h-3 w-3 text-white" />
                        </div>
                        <span className="text-sm text-gray-700 font-medium">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {provider.requiresApiKey && (
                    <div className="mt-6 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                      <div className="flex items-center gap-2">
                        <InformationCircleIcon className="h-4 w-4 text-amber-600" />
                        <span className="text-xs text-amber-800 font-medium">Configuration required in next step</span>
                      </div>
                    </div>
                  )}

                  {/* Hover Effect Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Enhanced Tips Section */}
        <div className="relative bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200/50 rounded-2xl p-6 shadow-sm">
          <div className="absolute top-4 left-4">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <SparklesIcon className="h-4 w-4 text-white" />
            </div>
          </div>
          <div className="ml-12">
            <h3 className="font-semibold text-blue-900 mb-3 text-lg">Provider Selection Guide</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-start gap-3 text-blue-800">
                <span className="text-lg">🔒</span>
                <div>
                  <p className="font-medium">Maximum Security</p>
                  <p className="text-sm text-blue-600">Choose Safe for multi-sig and enterprise</p>
                </div>
              </div>
              <div className="flex items-start gap-3 text-blue-800">
                <span className="text-lg">⚡</span>
                <div>
                  <p className="font-medium">Best Performance</p>
                  <p className="text-sm text-blue-600">Choose Alchemy for speed and reliability</p>
                </div>
              </div>
              <div className="flex items-start gap-3 text-blue-800">
                <span className="text-lg">🚀</span>
                <div>
                  <p className="font-medium">Most Flexible</p>
                  <p className="text-sm text-blue-600">Choose Biconomy for advanced features</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        {selectedProvider && (
          <div className="flex justify-end pt-6">
            <button
              onClick={onNext}
              disabled={isProcessing}
              className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 disabled:hover:scale-100 flex items-center gap-2"
            >
              <span>Continue to Chain Selection</span>
              <ChevronRightIcon className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-800 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
            </button>
          </div>
        )}
      </div>
    </StepWrapper>
  );
}

// Step 2: Chain Selection - Enhanced with beautiful design
function ChainSelection({ config, updateConfig, onNext, onBack }: any) {
  const [selectedChain, setSelectedChain] = useState(config.chainId || null);
  const [isSelecting, setIsSelecting] = useState(false);

  const handleChainSelect = (chainId: number) => {
    setIsSelecting(true);
    setSelectedChain(chainId);
    updateConfig({ chainId });
    
    setTimeout(() => {
      setIsSelecting(false);
    }, 300);
  };

  return (
    <StepWrapper>
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="text-center relative">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 to-blue-600/20 blur-3xl -z-10" />
          <div className="relative">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-2xl mb-6 shadow-lg">
              <GlobeAltIcon className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-3">
              Select Target Chain
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Choose the blockchain network for your smart accounts.
              <span className="text-emerald-600 font-medium"> We recommend starting with testnet.</span>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SUPPORTED_CHAINS.map((chain, index) => {
            const isSelected = selectedChain === chain.id;
            const isProcessing = isSelecting && isSelected;
            
            return (
              <div
                key={chain.id}
                className={`group relative transition-all duration-500 transform hover:scale-105 ${
                  isSelected ? 'scale-105' : ''
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {chain.recommended && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xs font-bold rounded-full shadow-lg z-10">
                    Recommended
                  </div>
                )}
                
                <button
                  onClick={() => handleChainSelect(chain.id)}
                  disabled={isProcessing}
                  className={`relative w-full p-6 border-2 rounded-2xl text-left transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-2xl overflow-hidden group ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-50/50'
                      : 'border-gray-200/50 hover:border-gray-300'
                  }`}
                >
                  {/* Background Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Selection Indicator */}
                  {isSelected && (
                    <div className="absolute top-4 right-4 w-6 h-6 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
                      {isProcessing ? (
                        <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <CheckIcon className="h-4 w-4 text-white" />
                      )}
                    </div>
                  )}

                  {/* Chain Header */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="text-3xl">{chain.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-xl font-bold text-gray-900">{chain.name}</h3>
                        {chain.testnet && (
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-lg">
                            Testnet
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{chain.description}</p>
                    </div>
                  </div>
            
                  {/* Chain Details */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Chain ID:</span>
                      <span className="font-mono font-medium text-gray-900">{chain.id}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Network:</span>
                      <span className="font-medium text-gray-900">{chain.network}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Type:</span>
                      <span className={`font-medium ${
                        chain.testnet ? 'text-yellow-600' : 'text-emerald-600'
                      }`}>
                        {chain.testnet ? 'Test Network' : 'Mainnet'}
                      </span>
                    </div>
                  </div>

                  {/* Hover Effect Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Chain Selection Tips */}
        <div className="relative bg-gradient-to-br from-emerald-50 to-blue-50 border border-emerald-200/50 rounded-2xl p-6 shadow-sm">
          <div className="absolute top-4 left-4">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
              <InformationCircleIcon className="h-4 w-4 text-white" />
            </div>
          </div>
          <div className="ml-12">
            <h3 className="font-semibold text-emerald-900 mb-3 text-lg">Chain Selection Tips</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 text-emerald-800">
                <span className="text-lg">🧪</span>
                <div>
                  <p className="font-medium">Start with Testnet</p>
                  <p className="text-sm text-emerald-600">Test your integration without real funds</p>
                </div>
              </div>
              <div className="flex items-start gap-3 text-emerald-800">
                <span className="text-lg">🚀</span>
                <div>
                  <p className="font-medium">Production Ready</p>
                  <p className="text-sm text-emerald-600">Switch to mainnet when ready to launch</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-6">
          <button
            onClick={onBack}
            className="group px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 flex items-center gap-2 font-medium"
          >
            <ChevronLeftIcon className="h-5 w-5 group-hover:-translate-x-1 transition-transform duration-300" />
            <span>Back to Providers</span>
          </button>
          
          {selectedChain && (
            <button
              onClick={onNext}
              disabled={isProcessing}
              className="group relative px-8 py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 disabled:hover:scale-100 flex items-center gap-2"
            >
              <span>Continue to Configuration</span>
              <ChevronRightIcon className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-700 to-emerald-800 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
            </button>
          )}
        </div>
      </div>
    </StepWrapper>
  );
}

// Step 3: Provider Configuration - Enhanced with beautiful design
function ProviderConfigStep({ config, updateConfig, onNext, onBack }: any) {
  const [apiKey, setApiKey] = useState(config.apiKey || '');
  const [customRpc, setCustomRpc] = useState(config.customRpc || '');
  const [gasMode, setGasMode] = useState(config.gasPolicy?.mode || 'sponsor_all');
  const [dailyBudget, setDailyBudget] = useState(config.gasPolicy?.dailyBudget || '1');
  const [perTxLimit, setPerTxLimit] = useState(config.gasPolicy?.perTxLimit || '0.1');

  const selectedProvider = PROVIDERS.find(p => p.id === config.provider);
  const requiresApiKey = selectedProvider?.requiresApiKey;

  const handleNext = () => {
    updateConfig({
      apiKey: requiresApiKey ? apiKey : undefined,
      customRpc: customRpc || undefined,
      gasPolicy: {
        mode: gasMode,
        dailyBudget: gasMode !== 'user_pays' ? `${dailyBudget}000000000000000000` : undefined,
        perTxLimit: gasMode !== 'user_pays' ? `${perTxLimit}000000000000000000` : undefined,
      }
    });
    onNext();
  };

  return (
    <StepWrapper>
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="text-center relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 blur-3xl -z-10" />
          <div className="relative">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl mb-6 shadow-lg">
              <CogIcon className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-3">
              Configure {selectedProvider?.name}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Set up provider-specific settings and gas policies.
              <span className="text-purple-600 font-medium"> Customize for your needs.</span>
            </p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto space-y-8">
          {/* API Key Configuration */}
          {requiresApiKey && (
            <div className="relative bg-gradient-to-br from-red-50 to-orange-50 border border-red-200/50 rounded-2xl p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center">
                  <KeyIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">API Key Configuration</h3>
                  <p className="text-sm text-gray-600">Secure authentication for {selectedProvider?.name}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <KeyIcon className="h-4 w-4 text-red-600" />
                    {selectedProvider?.name} API Key
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="Enter your API key"
                      className="w-full px-4 py-4 border-2 border-red-200 rounded-xl focus:border-red-500 focus:ring-4 focus:ring-red-200 focus:outline-none transition-all duration-300 bg-white hover:border-red-300 font-mono text-sm"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      <ShieldCheckIcon className="h-5 w-5 text-red-400" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <LockClosedIcon className="h-4 w-4 text-green-600" />
                    <p className="text-xs text-gray-600">
                      Your API key will be encrypted and stored securely using industry-standard practices
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Custom RPC */}
          <div className="relative bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200/50 rounded-2xl p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                <LinkIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Network Configuration</h3>
                <p className="text-sm text-gray-600">Custom RPC endpoints for better performance</p>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <GlobeAltIcon className="h-4 w-4 text-blue-600" />
                Custom RPC URL
                <span className="text-xs text-gray-500 font-normal">(Optional)</span>
              </label>
              <input
                type="url"
                value={customRpc}
                onChange={(e) => setCustomRpc(e.target.value)}
                placeholder="https://your-custom-rpc-endpoint.com"
                className="w-full px-4 py-4 border-2 border-blue-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-200 focus:outline-none transition-all duration-300 bg-white hover:border-blue-300 font-mono text-sm"
              />
              <div className="flex items-center gap-2 mt-3">
                <InformationCircleIcon className="h-4 w-4 text-blue-600" />
                <p className="text-xs text-gray-600">
                  Leave empty to use default RPC endpoints. Custom endpoints can improve performance.
                </p>
              </div>
            </div>
          </div>

          {/* Gas Policy */}
          <div className="relative bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200/50 rounded-2xl p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center">
                <CurrencyDollarIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Gas Sponsorship Policy</h3>
                <p className="text-sm text-gray-600">Control how transaction fees are handled</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <BoltIcon className="h-4 w-4 text-emerald-600" />
                  Sponsorship Mode
                </label>
                <select
                  value={gasMode}
                  onChange={(e) => setGasMode(e.target.value as any)}
                  className="w-full px-4 py-4 border-2 border-emerald-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-200 focus:outline-none transition-all duration-300 bg-white hover:border-emerald-300 font-medium"
                >
                  <option value="sponsor_all">🎆 Sponsor All Transactions (Recommended)</option>
                  <option value="allowlist">📋 Contract/Method Allowlist</option>
                  <option value="user_pays">💳 User Pays Gas</option>
                </select>
              </div>

              {gasMode !== 'user_pays' && (
                <div className="space-y-6">
                  <div className="p-4 bg-emerald-100 border border-emerald-200 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <ShieldExclamationIcon className="h-4 w-4 text-emerald-600" />
                      <span className="text-sm font-medium text-emerald-800">Spending Limits</span>
                    </div>
                    <p className="text-xs text-emerald-700">
                      Set reasonable limits to protect your paymaster budget from abuse.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <ClockIcon className="h-4 w-4 text-blue-600" />
                        Daily Budget (ETH)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={dailyBudget}
                        onChange={(e) => setDailyBudget(e.target.value)}
                        className="w-full px-4 py-4 border-2 border-emerald-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-200 focus:outline-none transition-all duration-300 bg-white hover:border-emerald-300 font-mono"
                      />
                      <p className="text-xs text-gray-600 mt-2">Maximum ETH to spend per day</p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <CurrencyDollarIcon className="h-4 w-4 text-purple-600" />
                        Per Transaction Limit (ETH)
                      </label>
                      <input
                        type="number"
                        step="0.001"
                        value={perTxLimit}
                        onChange={(e) => setPerTxLimit(e.target.value)}
                        className="w-full px-4 py-4 border-2 border-emerald-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-200 focus:outline-none transition-all duration-300 bg-white hover:border-emerald-300 font-mono"
                      />
                      <p className="text-xs text-gray-600 mt-2">Maximum ETH per single transaction</p>
                    </div>
                  </div>
                  
                  {/* Quick Preset Buttons */}
                  <div className="p-4 bg-white rounded-xl border border-emerald-200">
                    <p className="text-sm font-medium text-gray-700 mb-3">Quick budget presets:</p>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { name: 'Conservative', daily: '0.1', perTx: '0.01' },
                        { name: 'Moderate', daily: '1', perTx: '0.1' },
                        { name: 'Generous', daily: '10', perTx: '1' }
                      ].map((preset) => (
                        <button
                          key={preset.name}
                          onClick={() => {
                            setDailyBudget(preset.daily);
                            setPerTxLimit(preset.perTx);
                          }}
                          className="px-3 py-2 text-xs font-medium text-emerald-700 bg-emerald-100 rounded-lg hover:bg-emerald-200 transition-colors duration-200"
                        >
                          {preset.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
      </div>

        {/* Navigation */}
        <div className="flex justify-between pt-6">
          <button
            onClick={onBack}
            className="group px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 flex items-center gap-2 font-medium"
          >
            <ChevronLeftIcon className="h-5 w-5 group-hover:-translate-x-1 transition-transform duration-300" />
            <span>Back to Chain Selection</span>
          </button>
          
          <button
            onClick={handleNext}
            disabled={requiresApiKey && !apiKey}
            className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 disabled:hover:scale-100 flex items-center gap-2"
          >
            <span>Test Configuration</span>
            <BeakerIcon className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
            <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-purple-800 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
          </button>
        </div>
      </div>
    </StepWrapper>
  );
}

// Step 4: Test Configuration - Enhanced with beautiful design
function TestConfiguration({ config, onNext, onBack, onSave }: any) {
  const [testing, setTesting] = useState(false);
  const [testResults, setTestResults] = useState<any>(null);

  const selectedProvider = PROVIDERS.find(p => p.id === config.provider);
  const selectedChain = SUPPORTED_CHAINS.find(c => c.id === config.chainId);

  const runTests = async () => {
    setTesting(true);
    setTestResults(null);

    try {
      const result = await testProviderConnectionAction({
        provider: config.provider,
        chainId: config.chainId,
        apiKey: config.apiKey,
        customRpc: config.customRpc,
      });

      if (result.success) {
        setTestResults(result.results);
      } else {
        setTestResults({
          providerConnection: false,
          chainConnection: false,
          apiKeyValid: false,
          smartAccountCreation: false,
          gasSponsorship: false,
        });
      }
    } catch (error) {
      console.error('Test failed:', error);
      setTestResults({
        providerConnection: false,
        chainConnection: false,
        apiKeyValid: false,
        smartAccountCreation: false,
        gasSponsorship: false,
      });
    } finally {
      setTesting(false);
    }
  };

  const allTestsPassed = testResults && Object.values(testResults).every(result => result === true);

  return (
    <StepWrapper>
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="text-center relative">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 to-green-600/20 blur-3xl -z-10" />
          <div className="relative">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl mb-6 shadow-lg">
              <BeakerIcon className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-3">
              Test Your Configuration
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Verify that your setup is working correctly.
              <span className="text-emerald-600 font-medium"> All systems green means you're ready!</span>
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Configuration Summary */}
          <div className="relative bg-gradient-to-br from-gray-50 to-blue-50 border border-gray-200/50 rounded-2xl p-8 shadow-sm mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                <CodeBracketIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Configuration Summary</h3>
                <p className="text-sm text-gray-600">Review your Account Abstraction setup</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 bg-gradient-to-br ${selectedProvider?.gradient} rounded-lg flex items-center justify-center`}>
                      {selectedProvider?.icon && <selectedProvider.icon className="h-4 w-4 text-white" />}
                    </div>
                    <span className="text-gray-600 font-medium">Provider:</span>
                  </div>
                  <span className="font-bold text-gray-900">{selectedProvider?.name}</span>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="text-xl">{selectedChain?.icon}</div>
                    <span className="text-gray-600 font-medium">Chain:</span>
                  </div>
                  <span className="font-bold text-gray-900">{selectedChain?.name}</span>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                      <CurrencyDollarIcon className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-gray-600 font-medium">Gas Policy:</span>
                  </div>
                  <span className="font-bold text-gray-900 capitalize">
                    {config.gasPolicy?.mode?.replace('_', ' ') || 'sponsor all'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                      <KeyIcon className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-gray-600 font-medium">API Key:</span>
                  </div>
                  <span className="font-bold text-gray-900">
                    {config.apiKey ? '••••••••' : 'Not required'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Test Runner */}
          <div className="relative bg-white border-2 border-gray-200/50 rounded-2xl p-8 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center">
                  <BeakerIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Connectivity Tests</h3>
                  <p className="text-sm text-gray-600">Verify all components are working</p>
                </div>
              </div>
              <button
                onClick={runTests}
                disabled={testing}
                className="group relative px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 disabled:hover:scale-100 flex items-center gap-2"
              >
                {testing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Testing...</span>
                  </>
                ) : (
                  <>
                    <BeakerIcon className="h-5 w-5" />
                    <span>Run Tests</span>
                  </>
                )}
              </button>
            </div>

            {testing && (
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  <span className="text-blue-800 font-medium">Running connectivity tests...</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full animate-pulse" />
                </div>
              </div>
            )}

            {testResults && (
              <div className="space-y-4">
                {[
                  { key: 'providerConnection', label: 'Provider API Connection', icon: CloudIcon },
                  { key: 'chainConnection', label: 'Blockchain RPC Connection', icon: GlobeAltIcon },
                  { key: 'apiKeyValid', label: 'API Key Validation', icon: KeyIcon },
                  { key: 'smartAccountCreation', label: 'Smart Account Creation', icon: ShieldCheckIcon },
                  { key: 'gasSponsorship', label: 'Gas Sponsorship Setup', icon: CurrencyDollarIcon },
                ].map((test) => {
                  const TestIcon = test.icon;
                  const passed = testResults[test.key];
                  
                  return (
                    <div key={test.key} className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-300 ${
                      passed 
                        ? 'bg-emerald-50 border-emerald-200' 
                        : 'bg-red-50 border-red-200'
                    }`}>
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        passed 
                          ? 'bg-emerald-500' 
                          : 'bg-red-500'
                      }`}>
                        {passed ? (
                          <CheckIcon className="h-5 w-5 text-white" />
                        ) : (
                          <ExclamationTriangleIcon className="h-5 w-5 text-white" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <TestIcon className="h-4 w-4 text-gray-600" />
                          <span className="font-medium text-gray-900">{test.label}</span>
                        </div>
                        <span className={`text-sm font-medium ${
                          passed ? 'text-emerald-600' : 'text-red-600'
                        }`}>
                          {passed ? 'Connected successfully' : 'Connection failed'}
                        </span>
                      </div>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        passed ? 'bg-emerald-100' : 'bg-red-100'
                      }`}>
                        <span className={`text-lg ${
                          passed ? 'text-emerald-600' : 'text-red-600'
                        }`}>
                          {passed ? '✓' : '×'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {testResults && (
            <div className={`relative p-8 rounded-2xl border-2 shadow-lg ${
              allTestsPassed 
                ? 'bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200' 
                : 'bg-gradient-to-br from-red-50 to-orange-50 border-red-200'
            }`}>
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                  allTestsPassed 
                    ? 'bg-gradient-to-br from-emerald-500 to-green-600' 
                    : 'bg-gradient-to-br from-red-500 to-orange-600'
                }`}>
                  <span className="text-3xl text-white">
                    {allTestsPassed ? '🎉' : '⚠️'}
                  </span>
                </div>
                <div>
                  <h4 className={`text-xl font-bold mb-1 ${
                    allTestsPassed ? 'text-emerald-800' : 'text-red-800'
                  }`}>
                    {allTestsPassed 
                      ? 'Configuration Verified!' 
                      : 'Tests Failed'}
                  </h4>
                  <p className={`text-sm ${
                    allTestsPassed ? 'text-emerald-600' : 'text-red-600'
                  }`}>
                    {allTestsPassed 
                      ? 'All systems are working correctly. Your setup is ready for production.'
                      : 'Some components failed verification. Please review your configuration.'}
                  </p>
                </div>
              </div>
            </div>
          )}
      </div>

        {/* Navigation */}
        <div className="flex justify-between pt-6">
          <button
            onClick={onBack}
            className="group px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 flex items-center gap-2 font-medium"
          >
            <ChevronLeftIcon className="h-5 w-5 group-hover:-translate-x-1 transition-transform duration-300" />
            <span>Back to Configuration</span>
          </button>
          
          <button
            onClick={onSave}
            disabled={!allTestsPassed}
            className="group relative px-8 py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 disabled:hover:scale-100 flex items-center gap-2"
          >
            <CheckIcon className="h-5 w-5" />
            <span>Save Configuration</span>
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-700 to-emerald-800 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
          </button>
        </div>
      </div>
    </StepWrapper>
  );
}

export function ProviderWizard({ projectId, onComplete }: { projectId?: string; onComplete?: () => void }) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [config, setConfig] = useState<ProviderConfig>({
    provider: 'safe',
    chainId: 84532,
  });

  const steps: WizardStep[] = [
    {
      id: 'provider',
      title: 'Provider Selection',
      description: 'Choose your AA provider',
      component: ProviderSelection
    },
    {
      id: 'chain',
      title: 'Chain Selection', 
      description: 'Select blockchain network',
      component: ChainSelection
    },
    {
      id: 'config',
      title: 'Configuration',
      description: 'Set up provider settings',
      component: ProviderConfigStep
    },
    {
      id: 'test',
      title: 'Testing',
      description: 'Verify your setup',
      component: TestConfiguration
    }
  ];

  const updateConfig = (updates: Partial<ProviderConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSave = async () => {
    if (!projectId) {
      console.error('No project ID provided');
      return;
    }

    try {
      const result = await saveProviderConfigAction({
        projectId,
        provider: config.provider,
        chainId: config.chainId,
        apiKey: config.apiKey,
        customRpc: config.customRpc,
        gasPolicy: config.gasPolicy,
      });

      if (result.success) {
        // Success notification
        const audio = new Audio('/sounds/success.mp3');
        audio.play().catch(() => {});
        
        if (onComplete) {
          onComplete();
        } else {
          router.push('/dashboard?configured=true');
        }
      } else {
        console.error('Failed to save configuration:', result.error);
        alert('Failed to save configuration. Please try again.');
      }
    } catch (error) {
      console.error('Failed to save configuration:', error);
      alert('Failed to save configuration. Please try again.');
    }
  };

  const StepComponent = steps[currentStep].component;

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
                          ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg scale-110' 
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
                            : 'bg-gray-300'
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
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-8">
          <StepComponent
            config={config}
            updateConfig={updateConfig}
            onNext={handleNext}
            onBack={handleBack}
            onSave={handleSave}
          />
        </div>
      </div>
    </div>
  );
}