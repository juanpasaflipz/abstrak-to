'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';
import {
  CheckIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  SparklesIcon,
  CogIcon,
  KeyIcon,
  CurrencyDollarIcon,
  LinkIcon,
  BookOpenIcon,
  RocketLaunchIcon,
  BeakerIcon,
  ClockIcon,
  ShieldCheckIcon,
  BoltIcon,
  InformationCircleIcon,
  ExclamationTriangleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { SparklesIcon as SparklesIconSolid } from '@heroicons/react/24/solid';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  content: React.ComponentType<any>;
  canSkip: boolean;
  estimatedTime: string;
}

interface OnboardingWizardProps {
  onComplete: () => void;
  onSkip?: () => void;
}

export function OnboardingWizard({ onComplete, onSkip }: OnboardingWizardProps) {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [stepData, setStepData] = useState<Record<string, any>>({});

  const steps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to Account Abstraction',
      description: 'Learn the fundamentals of gasless transactions and smart accounts',
      icon: SparklesIconSolid,
      content: WelcomeStep,
      canSkip: false,
      estimatedTime: '2 min'
    },
    {
      id: 'connect-wallet',
      title: 'Connect Your Wallet',
      description: 'Connect your EOA wallet to create your first smart account',
      icon: RocketLaunchIcon,
      content: ConnectWalletStep,
      canSkip: false,
      estimatedTime: '1 min'
    },
    {
      id: 'create-project',
      title: 'Create Your First Project',
      description: 'Set up a project to organize your Account Abstraction apps',
      icon: CogIcon,
      content: CreateProjectStep,
      canSkip: false,
      estimatedTime: '3 min'
    },
    {
      id: 'configure-provider',
      title: 'Configure AA Provider',
      description: 'Choose and configure your Account Abstraction provider',
      icon: ShieldCheckIcon,
      content: ConfigureProviderStep,
      canSkip: true,
      estimatedTime: '5 min'
    },
    {
      id: 'session-policies',
      title: 'Set Up Session Policies',
      description: 'Create security policies for gasless transactions',
      icon: KeyIcon,
      content: SessionPoliciesStep,
      canSkip: true,
      estimatedTime: '4 min'
    },
    {
      id: 'paymaster-config',
      title: 'Configure Gas Sponsorship',
      description: 'Set up paymaster policies for sponsoring gas fees',
      icon: CurrencyDollarIcon,
      content: PaymasterConfigStep,
      canSkip: true,
      estimatedTime: '3 min'
    },
    {
      id: 'try-demo',
      title: 'Try a Live Demo',
      description: 'Experience gasless transactions with our interactive demo',
      icon: BeakerIcon,
      content: TryDemoStep,
      canSkip: true,
      estimatedTime: '5 min'
    },
    {
      id: 'explore-recipes',
      title: 'Explore Code Recipes',
      description: 'Browse templates and examples for common use cases',
      icon: BookOpenIcon,
      content: ExploreRecipesStep,
      canSkip: true,
      estimatedTime: '10 min'
    },
    {
      id: 'complete',
      title: 'You\'re All Set!',
      description: 'Start building amazing Account Abstraction experiences',
      icon: CheckIcon,
      content: CompleteStep,
      canSkip: false,
      estimatedTime: '1 min'
    }
  ];

  const currentStepData = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCompletedSteps(prev => new Set([...prev, currentStep]));
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const skipStep = () => {
    if (currentStepData.canSkip) {
      nextStep();
    }
  };

  const goToStep = (stepIndex: number) => {
    if (stepIndex <= currentStep || completedSteps.has(stepIndex)) {
      setCurrentStep(stepIndex);
    }
  };

  const updateStepData = (key: string, value: any) => {
    setStepData(prev => ({ ...prev, [key]: value }));
  };

  const handleSkipOnboarding = () => {
    if (onSkip) {
      onSkip();
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl mb-6 shadow-xl">
            <SparklesIconSolid className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-4">
            Account Abstraction Onboarding
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get started with gasless transactions, session keys, and smart accounts in just a few steps
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Step {currentStep + 1} of {steps.length}
            </h2>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <ClockIcon className="h-4 w-4" />
              <span>{currentStepData.estimatedTime}</span>
            </div>
          </div>
          
          <div className="relative">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isCompleted = completedSteps.has(index);
                const isCurrent = index === currentStep;
                const isAccessible = index <= currentStep || completedSteps.has(index);
                
                return (
                  <div key={step.id} className="relative flex flex-col items-center">
                    {/* Step Circle */}
                    <button
                      onClick={() => goToStep(index)}
                      disabled={!isAccessible}
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isCompleted
                          ? 'bg-green-500 text-white shadow-lg shadow-green-200'
                          : isCurrent
                          ? 'bg-blue-500 text-white shadow-lg shadow-blue-200 scale-110'
                          : isAccessible
                          ? 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckIcon className="h-6 w-6" />
                      ) : (
                        <Icon className="h-6 w-6" />
                      )}
                    </button>
                    
                    {/* Step Label */}
                    <span className={`text-xs mt-2 text-center max-w-20 hidden lg:block ${
                      isCurrent ? 'text-blue-600 font-semibold' : 'text-gray-500'
                    }`}>
                      {step.title.split(' ').slice(0, 2).join(' ')}
                    </span>
                    
                    {/* Connection Line */}
                    {index < steps.length - 1 && (
                      <div className={`absolute top-6 left-12 w-full h-0.5 transition-colors duration-300 ${
                        completedSteps.has(index) ? 'bg-green-300' : 'bg-gray-200'
                      }`} style={{ width: 'calc(100% - 48px)' }} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden">
          {/* Step Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                <currentStepData.icon className="h-8 w-8" />
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-2">{currentStepData.title}</h2>
                <p className="text-blue-100 text-lg">{currentStepData.description}</p>
              </div>
            </div>
          </div>

          {/* Step Content */}
          <div className="p-8">
            <currentStepData.content
              stepData={stepData}
              updateStepData={updateStepData}
              nextStep={nextStep}
              isConnected={isConnected}
              address={address}
            />
          </div>

          {/* Navigation */}
          <div className="bg-gray-50/80 backdrop-blur-sm border-t border-gray-200/50 p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              {!isFirstStep && (
                <button
                  onClick={prevStep}
                  className="flex items-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-all duration-300 font-semibold"
                >
                  <ChevronLeftIcon className="h-5 w-5" />
                  Previous
                </button>
              )}
              
              {currentStepData.canSkip && (
                <button
                  onClick={skipStep}
                  className="px-6 py-3 text-gray-600 hover:text-gray-700 transition-colors font-medium"
                >
                  Skip this step
                </button>
              )}
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={handleSkipOnboarding}
                className="px-6 py-3 text-gray-600 hover:text-gray-700 transition-colors font-medium"
              >
                Skip Onboarding
              </button>
              
              <button
                onClick={nextStep}
                className="group flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl hover:scale-105"
              >
                <span>{isLastStep ? 'Complete Onboarding' : 'Continue'}</span>
                <ChevronRightIcon className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Individual Step Components
function WelcomeStep({ nextStep }: any) {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          Welcome to the Future of Web3 UX
        </h3>
        <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
          Account Abstraction eliminates the biggest barriers to Web3 adoption. Let's explore how you can 
          build apps with gasless transactions, social logins, and seamless user experiences.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            icon: BoltIcon,
            title: 'Gasless Transactions',
            description: 'Users never need ETH for gas fees. You sponsor transactions or use paymasters.',
            color: 'yellow'
          },
          {
            icon: ShieldCheckIcon,
            title: 'Smart Account Security',
            description: 'Multi-sig capabilities, social recovery, and advanced security features built-in.',
            color: 'green'
          },
          {
            icon: KeyIcon,
            title: 'Session Keys',
            description: 'One-click interactions with temporary, scoped permissions for seamless UX.',
            color: 'purple'
          }
        ].map((feature, index) => (
          <div key={index} className={`p-6 bg-${feature.color}-50 border border-${feature.color}-200 rounded-2xl text-center`}>
            <div className={`w-16 h-16 bg-${feature.color}-100 rounded-2xl flex items-center justify-center mx-auto mb-4`}>
              <feature.icon className={`h-8 w-8 text-${feature.color}-600`} />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h4>
            <p className="text-gray-600 text-sm">{feature.description}</p>
          </div>
        ))}
      </div>
      
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <InformationCircleIcon className="h-6 w-6 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-blue-900 mb-2">What you'll learn in this onboarding:</h4>
            <ul className="text-blue-800 text-sm space-y-1">
              <li>• How to create and manage smart accounts</li>
              <li>• Setting up gasless transaction sponsorship</li>
              <li>• Implementing session keys for one-click UX</li>
              <li>• Configuring security policies and spending limits</li>
              <li>• Integration examples and best practices</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function ConnectWalletStep({ isConnected, address }: any) {
  return (
    <div className="space-y-8 text-center">
      {!isConnected ? (
        <>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Connect Your Wallet
            </h3>
            <p className="text-lg text-gray-600 mb-8">
              Connect your EOA (Externally Owned Account) wallet to create your first smart account.
              Don't worry - your smart account will be completely separate and more secure.
            </p>
          </div>
          
          <div className="max-w-md mx-auto">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 border border-blue-200 rounded-2xl p-8">
              <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <RocketLaunchIcon className="h-10 w-10 text-blue-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Ready to Connect?</h4>
              <p className="text-gray-600 mb-6">
                Click the "Get Started" button in the top right to connect your wallet and continue.
              </p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <p className="text-yellow-800 text-sm">
                    Make sure you have a Web3 wallet like MetaMask, Coinbase Wallet, or WalletConnect installed.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div>
            <div className="w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <CheckIcon className="h-10 w-10 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Wallet Connected Successfully!
            </h3>
            <p className="text-lg text-gray-600 mb-6">
              Your wallet <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </span> is now connected.
            </p>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 max-w-2xl mx-auto">
            <h4 className="font-semibold text-green-900 mb-3">What happens next:</h4>
            <div className="text-green-800 text-sm space-y-2">
              <div className="flex items-center gap-2">
                <CheckIcon className="h-4 w-4 text-green-600" />
                <span>We'll create your first smart account project</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckIcon className="h-4 w-4 text-green-600" />
                <span>Configure your preferred Account Abstraction provider</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckIcon className="h-4 w-4 text-green-600" />
                <span>Set up gasless transaction policies</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckIcon className="h-4 w-4 text-green-600" />
                <span>Try a live demo with real transactions</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function CreateProjectStep({ stepData, updateStepData }: any) {
  const [projectName, setProjectName] = useState(stepData.projectName || '');
  const [provider, setProvider] = useState(stepData.provider || 'safe');

  useEffect(() => {
    updateStepData('projectName', projectName);
    updateStepData('provider', provider);
  }, [projectName, provider, updateStepData]);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          Create Your First Project
        </h3>
        <p className="text-lg text-gray-600 mb-8">
          Projects help you organize different applications and their Account Abstraction configurations.
        </p>
      </div>
      
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-3">
            Project Name
          </label>
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-200 focus:outline-none transition-all duration-300"
            placeholder="My Awesome DApp"
          />
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-3">
            Account Abstraction Provider
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { id: 'safe', name: 'Safe{Core}', description: 'Most secure with multi-sig', color: 'emerald' },
              { id: 'alchemy', name: 'Alchemy AA', description: 'Most popular choice', color: 'blue' },
              { id: 'biconomy', name: 'Biconomy', description: 'Most flexible options', color: 'purple' }
            ].map((option) => (
              <button
                key={option.id}
                onClick={() => setProvider(option.id)}
                className={`p-4 border-2 rounded-xl transition-all duration-300 ${
                  provider === option.id
                    ? `border-${option.color}-500 bg-${option.color}-50`
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <h4 className="font-semibold text-gray-900 mb-1">{option.name}</h4>
                <p className="text-sm text-gray-600">{option.description}</p>
              </button>
            ))}
          </div>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <InformationCircleIcon className="h-6 w-6 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-blue-900 mb-2">Don't worry about this choice</h4>
              <p className="text-blue-800 text-sm">
                You can change providers later or even use multiple providers in the same project. 
                This is just to get you started with a good default configuration.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ConfigureProviderStep({ stepData }: any) {
  const provider = stepData.provider || 'safe';
  
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          Configure {provider.charAt(0).toUpperCase() + provider.slice(1)}
        </h3>
        <p className="text-lg text-gray-600 mb-8">
          Set up your Account Abstraction provider with the optimal configuration for your project.
        </p>
      </div>
      
      <div className="max-w-3xl mx-auto">
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-2xl p-8 text-center">
          <CogIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-semibold text-gray-900 mb-2">
            Provider Configuration Coming Soon
          </h4>
          <p className="text-gray-600 mb-6">
            The provider configuration wizard will help you set up API keys, bundler endpoints, 
            and paymaster configurations for your chosen provider.
          </p>
          <button
            onClick={() => window.open('/dashboard/configure', '_blank')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-300 font-semibold"
          >
            <CogIcon className="h-5 w-5" />
            Open Configuration Wizard
          </button>
        </div>
      </div>
    </div>
  );
}

function SessionPoliciesStep() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          Session Key Policies
        </h3>
        <p className="text-lg text-gray-600 mb-8">
          Create security policies that define what actions users can perform with session keys.
        </p>
      </div>
      
      <div className="max-w-3xl mx-auto">
        <div className="bg-gradient-to-br from-purple-50 to-indigo-100 border border-purple-200 rounded-2xl p-8 text-center">
          <KeyIcon className="w-16 h-16 text-purple-600 mx-auto mb-4" />
          <h4 className="text-lg font-semibold text-gray-900 mb-2">
            Session Policy Builder
          </h4>
          <p className="text-gray-600 mb-6">
            Configure contract permissions, spending limits, time restrictions, and security policies 
            for seamless one-click user experiences.
          </p>
          <button
            onClick={() => window.open('/dashboard/session-policies', '_blank')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all duration-300 font-semibold"
          >
            <KeyIcon className="h-5 w-5" />
            Open Session Policy Builder
          </button>
        </div>
      </div>
    </div>
  );
}

function PaymasterConfigStep() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          Gas Sponsorship Configuration
        </h3>
        <p className="text-lg text-gray-600 mb-8">
          Set up paymaster policies to sponsor gas fees for your users' transactions.
        </p>
      </div>
      
      <div className="max-w-3xl mx-auto">
        <div className="bg-gradient-to-br from-green-50 to-emerald-100 border border-green-200 rounded-2xl p-8 text-center">
          <CurrencyDollarIcon className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h4 className="text-lg font-semibold text-gray-900 mb-2">
            Paymaster Policy Editor
          </h4>
          <p className="text-gray-600 mb-6">
            Configure daily budgets, per-transaction limits, and contract allowlists for 
            intelligent gas sponsorship that protects your funds.
          </p>
          <button
            onClick={() => window.open('/dashboard/paymaster-policies', '_blank')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all duration-300 font-semibold"
          >
            <CurrencyDollarIcon className="h-5 w-5" />
            Open Paymaster Editor
          </button>
        </div>
      </div>
    </div>
  );
}

function TryDemoStep() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          Try the Live Demo
        </h3>
        <p className="text-lg text-gray-600 mb-8">
          Experience gasless transactions firsthand with our interactive demo featuring real smart contracts.
        </p>
      </div>
      
      <div className="max-w-3xl mx-auto">
        <div className="bg-gradient-to-br from-orange-50 to-red-100 border border-orange-200 rounded-2xl p-8 text-center">
          <BeakerIcon className="w-16 h-16 text-orange-600 mx-auto mb-4" />
          <h4 className="text-lg font-semibold text-gray-900 mb-2">
            Interactive Demo Environment
          </h4>
          <p className="text-gray-600 mb-6">
            Try minting NFTs, incrementing counters, and transferring tokens - all without gas fees!
            Perfect for understanding the user experience your apps can provide.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => window.open('/demo', '_blank')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-all duration-300 font-semibold"
            >
              <BeakerIcon className="h-5 w-5" />
              Try Live Demo
            </button>
            <button
              onClick={() => window.open('/api-playground', '_blank')}
              className="inline-flex items-center gap-2 px-6 py-3 border-2 border-orange-600 text-orange-600 rounded-xl hover:bg-orange-50 transition-all duration-300 font-semibold"
            >
              <CogIcon className="h-5 w-5" />
              API Playground
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ExploreRecipesStep() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          Explore Code Recipes
        </h3>
        <p className="text-lg text-gray-600 mb-8">
          Browse our library of templates, examples, and best practices for common Account Abstraction use cases.
        </p>
      </div>
      
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              title: 'Gasless NFT Minting',
              description: 'Enable users to mint NFTs without gas fees',
              category: 'NFT',
              difficulty: 'Beginner'
            },
            {
              title: 'One-Click Token Swaps',
              description: 'Seamless DeFi interactions with session keys',
              category: 'DeFi',
              difficulty: 'Intermediate'
            },
            {
              title: 'Multi-Signature Wallet',
              description: 'Secure team funds with gasless execution',
              category: 'Security',
              difficulty: 'Advanced'
            },
            {
              title: 'Subscription Payments',
              description: 'Recurring payments without user interaction',
              category: 'Payments',
              difficulty: 'Intermediate'
            }
          ].map((recipe, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex justify-between items-start mb-3">
                <h4 className="text-lg font-semibold text-gray-900">{recipe.title}</h4>
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-semibold">
                  {recipe.difficulty}
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-3">{recipe.description}</p>
              <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                {recipe.category}
              </span>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-8">
          <button
            onClick={() => window.open('/recipes', '_blank')}
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-xl hover:from-pink-700 hover:to-rose-700 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl hover:scale-105"
          >
            <BookOpenIcon className="h-6 w-6" />
            Explore Full Recipes Library
          </button>
        </div>
      </div>
    </div>
  );
}

function CompleteStep({ onComplete }: any) {
  return (
    <div className="space-y-8 text-center">
      <div>
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckIcon className="h-12 w-12 text-green-600" />
        </div>
        <h3 className="text-3xl font-bold text-gray-900 mb-4">
          Congratulations! 🎉
        </h3>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          You've successfully completed the Account Abstraction onboarding. 
          You're now ready to build amazing gasless experiences for your users!
        </p>
      </div>
      
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 border border-blue-200 rounded-2xl p-8 max-w-3xl mx-auto">
        <h4 className="text-xl font-semibold text-gray-900 mb-6">What's next?</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="text-left">
            <h5 className="font-semibold text-gray-900 mb-2">Build & Deploy</h5>
            <ul className="text-gray-600 text-sm space-y-1">
              <li>• Integrate the SDK into your app</li>
              <li>• Configure your smart contracts</li>
              <li>• Test with the demo environment</li>
              <li>• Deploy to production</li>
            </ul>
          </div>
          <div className="text-left">
            <h5 className="font-semibold text-gray-900 mb-2">Get Support</h5>
            <ul className="text-gray-600 text-sm space-y-1">
              <li>• Browse the recipes library</li>
              <li>• Join our Discord community</li>
              <li>• Read the documentation</li>
              <li>• Schedule a demo call</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={() => window.location.href = '/dashboard'}
          className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl hover:scale-105"
        >
          <RocketLaunchIcon className="h-6 w-6" />
          Go to Dashboard
        </button>
        <button
          onClick={() => window.open('/recipes', '_blank')}
          className="inline-flex items-center gap-2 px-8 py-4 border-2 border-blue-600 text-blue-600 rounded-xl hover:bg-blue-50 transition-all duration-300 font-semibold text-lg"
        >
          <BookOpenIcon className="h-6 w-6" />
          Browse Recipes
        </button>
      </div>
    </div>
  );
}