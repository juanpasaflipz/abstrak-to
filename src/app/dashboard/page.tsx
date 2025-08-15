'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { ConnectCard } from '@/components/ConnectCard';

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
      // For now, use mock data - we'll implement API later
      const mockProjects: Project[] = [
        {
          id: '1',
          name: 'My First DApp',
          description: 'A simple DeFi application',
          defaultProvider: 'safe',
          defaultChainId: 84532,
          createdAt: new Date().toISOString(),
          environments: [
            { name: 'development', id: 'env1' },
            { name: 'production', id: 'env2' },
          ],
          _count: {
            apiKeys: 2,
            activityLogs: 156,
          },
        },
      ];
      setProjects(mockProjects);
    } catch (error) {
      console.error('Failed to load projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createProject = async () => {
    try {
      // For now, just add to local state - we'll implement API later
      const newProject: Project = {
        id: Date.now().toString(),
        name: createForm.name,
        description: createForm.description || null,
        defaultProvider: createForm.provider,
        defaultChainId: createForm.chainId,
        createdAt: new Date().toISOString(),
        environments: [
          { name: 'development', id: 'env1' },
          { name: 'production', id: 'env2' },
        ],
        _count: {
          apiKeys: 0,
          activityLogs: 0,
        },
      };
      
      setProjects([newProject, ...projects]);
      setShowCreateForm(false);
      setCreateForm({ name: '', description: '', provider: 'safe', chainId: 84532 });
    } catch (error) {
      console.error('Failed to create project:', error);
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Developer Portal
            </h1>
            <p className="text-gray-600">
              Connect your wallet to access your ERC-4337 projects
            </p>
          </div>
          <ConnectCard />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Developer Portal</h1>
              <p className="text-gray-600">Build with ERC-4337 Account Abstraction</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </div>
              <button
                onClick={() => setShowCreateForm(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                New Project
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Getting Started Banner */}
        {projects.length === 0 && !isLoading && (
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-white mb-8">
            <h2 className="text-2xl font-bold mb-4">🚀 Welcome to the Developer Portal!</h2>
            <p className="text-blue-100 mb-6">
              Build amazing Web3 experiences with gasless transactions, session keys, and smart accounts.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-start space-x-2">
                <span className="bg-white bg-opacity-20 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">1</span>
                <span>Create your first project</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="bg-white bg-opacity-20 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">2</span>
                <span>Configure providers & get API keys</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="bg-white bg-opacity-20 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">3</span>
                <span>Build gasless experiences</span>
              </div>
            </div>
          </div>
        )}

        {/* Projects Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-500 mt-4">Loading projects...</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
            <p className="text-gray-500 mb-6">Create your first project to start building with Account Abstraction</p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Project
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div key={project.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
                    <div className="flex items-center space-x-1">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      <span className="text-xs text-gray-500">Active</span>
                    </div>
                  </div>
                  
                  {project.description && (
                    <p className="text-gray-600 text-sm mb-4">{project.description}</p>
                  )}
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Provider:</span>
                      <span className="font-medium capitalize">{project.defaultProvider}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Chain:</span>
                      <span className="font-medium">
                        {project.defaultChainId === 84532 ? 'Base Sepolia' : `Chain ${project.defaultChainId}`}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">API Keys:</span>
                      <span className="font-medium">{project._count.apiKeys}</span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => window.location.href = `/dashboard/${project.id}`}
                      className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      Open Dashboard
                    </button>
                    <button className="px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Project Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Create New Project</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project Name
                </label>
                <input
                  type="text"
                  value={createForm.name}
                  onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="My Awesome DApp"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description (optional)
                </label>
                <textarea
                  value={createForm.description}
                  onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Describe your project..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  AA Provider
                </label>
                <select
                  value={createForm.provider}
                  onChange={(e) => setCreateForm({ ...createForm, provider: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="safe">Safe{'{Core}'}</option>
                  <option value="alchemy">Alchemy</option>
                  <option value="biconomy">Biconomy</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Default Chain
                </label>
                <select
                  value={createForm.chainId}
                  onChange={(e) => setCreateForm({ ...createForm, chainId: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={84532}>Base Sepolia (Testnet)</option>
                  <option value={1}>Ethereum Mainnet</option>
                  <option value={11155111}>Sepolia Testnet</option>
                </select>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowCreateForm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={createProject}
                disabled={!createForm.name.trim()}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}