'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { ConnectCard } from '@/components/ConnectCard';
import { getProjectsAction, createProjectAction } from '@/app/actions/projects';
import {
  SparklesIcon,
  BoltIcon,
  LockClosedIcon,
  RocketLaunchIcon,
  CheckIcon,
  ChevronRightIcon,
  PlusIcon,
  XMarkIcon,
  InformationCircleIcon,
  CodeBracketIcon,
  GlobeAltIcon,
  ClockIcon,
  CurrencyDollarIcon,
  ShieldCheckIcon,
  CogIcon,
  BeakerIcon,
  KeyIcon,
  ChartBarIcon,
  LinkIcon
} from '@heroicons/react/24/outline';
import { ShieldExclamationIcon } from '@heroicons/react/24/solid';

interface Project {
  id: string;
  name: string;
  description: string | null;
  defaultProvider: string;
  defaultChainId: number;
  createdAt: string;
  environments: { name: string; id: string }[];
  _count: {
    apiKeys: number;
    activityLogs: number;
  };
}

interface CreateProjectForm {
  name: string;
  description: string;
  provider: 'safe' | 'alchemy' | 'biconomy';
  chainId: number;
}

export default function DashboardPage() {
  const { address, isConnected } = useAccount();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createForm, setCreateForm] = useState<CreateProjectForm>({
    name: '',
    description: '',
    provider: 'safe',
    chainId: 84532,
  });

  useEffect(() => {
    if (isConnected && address) {
      loadProjects();
    }
  }, [isConnected, address]);

  const loadProjects = async () => {
    try {
      setIsLoading(true);
      const result = await getProjectsAction();
      if (result.success && result.projects) {
        // Transform the data to match our interface
        const transformedProjects = result.projects.map(project => ({
          id: project.id,
          name: project.name,
          description: project.description,
          defaultProvider: project.defaultProvider,
          defaultChainId: project.defaultChainId,
          createdAt: project.createdAt.toISOString(),
          environments: [
            { name: 'development', id: 'dev' },
            { name: 'production', id: 'prod' },
          ],
          _count: {
            apiKeys: 2, // Will be replaced with real count later
            activityLogs: 0, // Will be replaced with real count later
          },
        }));
        setProjects(transformedProjects);
      } else {
        console.error('Failed to load projects:', result.error);
      }
    } catch (error) {
      console.error('Failed to load projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createProject = async () => {
    try {
      setIsLoading(true);
      
      // Create FormData object
      const formData = new FormData();
      formData.append('name', createForm.name);
      formData.append('description', createForm.description);
      formData.append('defaultProvider', createForm.provider);
      formData.append('defaultChainId', createForm.chainId.toString());
      
      const result = await createProjectAction(formData);
      
      if (result.success) {
        // Reload projects to get the latest data
        await loadProjects();
        setShowCreateForm(false);
        setCreateForm({ name: '', description: '', provider: 'safe', chainId: 84532 });
      } else {
        console.error('Failed to create project:', result.error);
        alert(`Failed to create project: ${result.error}`);
      }
    } catch (error) {
      console.error('Failed to create project:', error);
      alert('Failed to create project. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 flex items-center justify-center">
        <div className="max-w-lg w-full">
          <div className="text-center mb-8 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 blur-3xl -z-10" />
            <div className="relative">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl mb-6 shadow-xl">
                <SparklesIcon className="h-10 w-10 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-4">
                Developer Portal
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed">
                Connect your wallet to access your <span className="text-blue-600 font-semibold">ERC-4337</span> projects and build the future of Web3
              </p>
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-6">
            <ConnectCard />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
      {/* Enhanced Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <SparklesIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Developer Portal
                </h1>
                <p className="text-gray-600 font-medium">Build with <span className="text-blue-600 font-semibold">ERC-4337</span> Account Abstraction</p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="flex items-center gap-3 bg-gray-100/80 backdrop-blur-sm px-4 py-2 rounded-xl border border-gray-200/50">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xs font-bold">{address?.slice(2, 4).toUpperCase()}</span>
                </div>
                <span className="text-sm font-mono text-gray-700">
                  {address?.slice(0, 6)}...{address?.slice(-4)}
                </span>
              </div>
              <button
                onClick={() => setShowCreateForm(true)}
                className="group relative px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-2"
              >
                <PlusIcon className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
                <span>New Project</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-800 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Getting Started Banner */}
        {projects.length === 0 && !isLoading && (
          <div className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-blue-700 rounded-3xl p-10 text-white mb-12 shadow-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-purple-600/90 backdrop-blur-sm" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-48 translate-x-48" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-400/20 rounded-full blur-2xl translate-y-32 -translate-x-32" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
                  <RocketLaunchIcon className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold mb-2">Welcome to the Developer Portal!</h2>
                  <p className="text-blue-100 text-lg">
                    Build the future of Web3 with <span className="text-white font-semibold">gasless transactions</span>, <span className="text-white font-semibold">session keys</span>, and <span className="text-white font-semibold">smart accounts</span>.
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {[
                  { icon: PlusIcon, title: 'Create your first project', desc: 'Set up your development environment' },
                  { icon: CogIcon, title: 'Configure providers & API keys', desc: 'Connect to your preferred AA provider' },
                  { icon: BoltIcon, title: 'Build gasless experiences', desc: 'Deploy and test your smart accounts' }
                ].map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <div key={index} className="group">
                      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300 hover:scale-105">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-bold text-sm">{index + 1}</span>
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
                              <Icon className="h-4 w-4" />
                              {step.title}
                            </h3>
                            <p className="text-blue-100 text-sm leading-relaxed">{step.desc}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="group relative bg-white text-blue-600 px-8 py-4 rounded-xl hover:bg-blue-50 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2"
                >
                  <PlusIcon className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
                  <span>Create Your First Project</span>
                </button>
                <button
                  onClick={() => window.location.href = '/dashboard/configure'}
                  className="group bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 px-8 py-4 rounded-xl hover:bg-white/20 transition-all duration-300 font-semibold hover:scale-105 flex items-center gap-2"
                >
                  <BeakerIcon className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
                  <span>Quick Setup Guide</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Projects Grid */}
        {isLoading ? (
          <div className="text-center py-16">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-6"></div>
              <div className="absolute inset-0 w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mt-2" style={{animationDirection: 'reverse'}}></div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Loading your projects...</h3>
            <p className="text-gray-600">Please wait while we gather your Account Abstraction projects</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-16">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <CodeBracketIcon className="w-10 h-10 text-gray-400" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <PlusIcon className="h-4 w-4 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Ready to build something amazing?</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
              Create your first project to start building with <span className="text-blue-600 font-semibold">Account Abstraction</span> and unlock gasless transactions
            </p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="group relative bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2 mx-auto"
            >
              <PlusIcon className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
              <span>Create Your First Project</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => {
              const getProviderInfo = (provider: string) => {
                switch(provider) {
                  case 'safe': return { icon: LockClosedIcon, color: 'emerald', name: 'Safe{Core}' };
                  case 'alchemy': return { icon: BoltIcon, color: 'blue', name: 'Alchemy' };
                  case 'biconomy': return { icon: RocketLaunchIcon, color: 'purple', name: 'Biconomy' };
                  default: return { icon: ShieldCheckIcon, color: 'gray', name: provider };
                }
              };
              
              const providerInfo = getProviderInfo(project.defaultProvider);
              const ProviderIcon = providerInfo.icon;
              
              return (
                <div 
                  key={project.id} 
                  className="group relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 hover:shadow-2xl transition-all duration-500 hover:scale-105 overflow-hidden"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Background Gradient Effect */}
                  <div className={`absolute inset-0 bg-gradient-to-br from-${providerInfo.color}-500/5 to-${providerInfo.color}-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                  
                  <div className="relative p-8">
                    {/* Project Header */}
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div className={`w-14 h-14 bg-gradient-to-br from-${providerInfo.color}-500 to-${providerInfo.color}-600 rounded-2xl flex items-center justify-center shadow-lg`}>
                          <ProviderIcon className="h-7 w-7 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-1">{project.name}</h3>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                            <span className="text-sm text-emerald-600 font-medium">Active</span>
                          </div>
                        </div>
                      </div>
                      <div className={`px-3 py-1 bg-${providerInfo.color}-100 text-${providerInfo.color}-700 rounded-full text-xs font-semibold`}>
                        {providerInfo.name}
                      </div>
                    </div>
                    
                    {project.description && (
                      <div className="bg-gray-50/80 backdrop-blur-sm rounded-xl p-4 mb-6 border border-gray-200/50">
                        <p className="text-gray-700 text-sm leading-relaxed">{project.description}</p>
                      </div>
                    )}
                    
                    {/* Project Stats */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-blue-50/80 backdrop-blur-sm rounded-xl p-4 border border-blue-200/50">
                        <div className="flex items-center gap-2 mb-2">
                          <GlobeAltIcon className="h-4 w-4 text-blue-600" />
                          <span className="text-xs font-semibold text-blue-700">Network</span>
                        </div>
                        <p className="text-sm font-bold text-blue-900">
                          {project.defaultChainId === 84532 ? 'Base Sepolia' : `Chain ${project.defaultChainId}`}
                        </p>
                      </div>
                      <div className="bg-purple-50/80 backdrop-blur-sm rounded-xl p-4 border border-purple-200/50">
                        <div className="flex items-center gap-2 mb-2">
                          <KeyIcon className="h-4 w-4 text-purple-600" />
                          <span className="text-xs font-semibold text-purple-700">API Keys</span>
                        </div>
                        <p className="text-sm font-bold text-purple-900">{project._count.apiKeys} keys</p>
                      </div>
                    </div>
                    
                    {/* Configuration Status */}
                    <div className="bg-amber-50/80 backdrop-blur-sm rounded-xl p-4 mb-6 border border-amber-200/50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CogIcon className="h-4 w-4 text-amber-600" />
                          <span className="text-sm font-semibold text-amber-700">Configuration</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                          <span className="text-sm font-bold text-amber-700">Basic Setup</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="space-y-3">
                      <button
                        onClick={() => window.location.href = `/dashboard/${project.id}`}
                        className={`group w-full bg-gradient-to-r from-${providerInfo.color}-600 to-${providerInfo.color}-700 text-white py-3 px-4 rounded-xl hover:from-${providerInfo.color}-700 hover:to-${providerInfo.color}-800 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2`}
                      >
                        <ChartBarIcon className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                        <span>Open Dashboard</span>
                        <ChevronRightIcon className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                      </button>
                      
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          onClick={() => window.location.href = `/dashboard/configure?project=${project.id}`}
                          className="group bg-amber-100/80 backdrop-blur-sm text-amber-700 py-3 px-3 rounded-xl hover:bg-amber-200 transition-all duration-300 font-semibold border border-amber-200/50 hover:scale-105 flex items-center justify-center gap-1"
                        >
                          <CogIcon className="h-4 w-4 group-hover:rotate-90 transition-transform duration-300" />
                          <span className="text-sm">Config</span>
                        </button>
                        <button
                          onClick={() => window.location.href = `/api-playground`}
                          className="group bg-gray-100/80 backdrop-blur-sm text-gray-700 py-3 px-3 rounded-xl hover:bg-gray-200 transition-all duration-300 font-semibold border border-gray-200/50 hover:scale-105 flex items-center justify-center gap-1"
                        >
                          <BeakerIcon className="h-4 w-4 group-hover:rotate-12 transition-transform duration-300" />
                          <span className="text-sm">API</span>
                        </button>
                        <button
                          onClick={() => window.location.href = `/dashboard/spending-limits?project=${project.id}`}
                          className="group bg-orange-100/80 backdrop-blur-sm text-orange-700 py-3 px-3 rounded-xl hover:bg-orange-200 transition-all duration-300 font-semibold border border-orange-200/50 hover:scale-105 flex items-center justify-center gap-1"
                        >
                          <ChartBarIcon className="h-4 w-4 group-hover:rotate-12 transition-transform duration-300" />
                          <span className="text-sm">Limits</span>
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          onClick={() => window.location.href = `/dashboard/session-policies?project=${project.id}`}
                          className="group bg-purple-100/80 backdrop-blur-sm text-purple-700 py-3 px-2 rounded-xl hover:bg-purple-200 transition-all duration-300 font-semibold border border-purple-200/50 hover:scale-105 flex items-center justify-center gap-1"
                        >
                          <KeyIcon className="h-4 w-4 group-hover:rotate-12 transition-transform duration-300" />
                          <span className="text-sm">Sessions</span>
                        </button>
                        <button
                          onClick={() => window.location.href = `/dashboard/paymaster-policies?project=${project.id}`}
                          className="group bg-green-100/80 backdrop-blur-sm text-green-700 py-3 px-2 rounded-xl hover:bg-green-200 transition-all duration-300 font-semibold border border-green-200/50 hover:scale-105 flex items-center justify-center gap-1"
                        >
                          <CurrencyDollarIcon className="h-4 w-4 group-hover:rotate-12 transition-transform duration-300" />
                          <span className="text-sm">Paymaster</span>
                        </button>
                        <button
                          onClick={() => window.location.href = `/dashboard/webhooks?project=${project.id}`}
                          className="group bg-indigo-100/80 backdrop-blur-sm text-indigo-700 py-3 px-2 rounded-xl hover:bg-indigo-200 transition-all duration-300 font-semibold border border-indigo-200/50 hover:scale-105 flex items-center justify-center gap-1"
                        >
                          <LinkIcon className="h-4 w-4 group-hover:rotate-12 transition-transform duration-300" />
                          <span className="text-sm">Webhooks</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Enhanced Create Project Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-200/50 w-full max-w-lg overflow-hidden">
            {/* Modal Header */}
            <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white">
              <div className="absolute top-4 right-4">
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <SparklesIcon className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-1">Create New Project</h2>
                  <p className="text-blue-100">Set up your Account Abstraction project</p>
                </div>
              </div>
            </div>
            
            {/* Modal Content */}
            <div className="p-8 space-y-6">
              <div className="group">
                <label className="block text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <CodeBracketIcon className="h-4 w-4 text-blue-600" />
                  Project Name
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={createForm.name}
                  onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                  className="w-full px-4 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-200 focus:outline-none transition-all duration-300 bg-white/50 backdrop-blur-sm group-hover:border-gray-300"
                  placeholder="My Awesome DApp"
                />
              </div>
              
              <div className="group">
                <label className="block text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <InformationCircleIcon className="h-4 w-4 text-purple-600" />
                  Description
                  <span className="text-gray-400 text-xs font-normal">(Optional)</span>
                </label>
                <textarea
                  value={createForm.description}
                  onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                  className="w-full px-4 py-4 text-base border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-200 focus:outline-none transition-all duration-300 bg-white/50 backdrop-blur-sm group-hover:border-gray-300 resize-none"
                  rows={3}
                  placeholder="Describe your project's purpose and features..."
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <ShieldCheckIcon className="h-4 w-4 text-emerald-600" />
                    AA Provider
                  </label>
                  <select
                    value={createForm.provider}
                    onChange={(e) => setCreateForm({ ...createForm, provider: e.target.value as any })}
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-200 focus:outline-none transition-all duration-300 bg-white/50 backdrop-blur-sm group-hover:border-gray-300 font-medium"
                  >
                    <option value="safe">🔒 Safe{'{Core}'} - Most Secure</option>
                    <option value="alchemy">⚡ Alchemy - Most Popular</option>
                    <option value="biconomy">🚀 Biconomy - Most Flexible</option>
                  </select>
                </div>
                
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <GlobeAltIcon className="h-4 w-4 text-blue-600" />
                    Default Chain
                  </label>
                  <select
                    value={createForm.chainId}
                    onChange={(e) => setCreateForm({ ...createForm, chainId: parseInt(e.target.value) })}
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-200 focus:outline-none transition-all duration-300 bg-white/50 backdrop-blur-sm group-hover:border-gray-300 font-medium"
                  >
                    <option value={84532}>🔵 Base Sepolia (Recommended)</option>
                    <option value={1}>⟠ Ethereum Mainnet</option>
                    <option value={11155111}>🧪 Sepolia Testnet</option>
                  </select>
                </div>
              </div>
              
              {/* Provider Info */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200/50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <InformationCircleIcon className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-semibold text-blue-900">Quick Tip</span>
                </div>
                <p className="text-sm text-blue-800 leading-relaxed">
                  {createForm.provider === 'safe' && 'Safe{Core} offers the highest security with multi-signature capabilities, perfect for production applications.'}
                  {createForm.provider === 'alchemy' && 'Alchemy provides excellent developer experience with built-in gas sponsorship and robust infrastructure.'}
                  {createForm.provider === 'biconomy' && 'Biconomy offers maximum flexibility with advanced paymaster configurations and cross-chain support.'}
                </p>
              </div>
            </div>
            
            {/* Modal Footer */}
            <div className="bg-gray-50/80 backdrop-blur-sm border-t border-gray-200/50 p-6 flex gap-4">
              <button
                onClick={() => setShowCreateForm(false)}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-all duration-300 font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={createProject}
                disabled={!createForm.name.trim() || isLoading}
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-semibold shadow-lg hover:shadow-xl hover:scale-105 disabled:hover:scale-100 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <SparklesIcon className="h-5 w-5" />
                    <span>Create Project</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}