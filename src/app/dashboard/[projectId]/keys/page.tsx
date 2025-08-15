'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface ApiKey {
  id: string;
  name: string;
  keyPrefix: string;
  scopes: string[];
  environment: string;
  lastUsedAt: string | null;
  usageCount: number;
  rateLimit: number;
  isActive: boolean;
  createdAt: string;
}

interface CreateKeyForm {
  name: string;
  environment: 'development' | 'production';
  scopes: string[];
  rateLimit: number;
}

export default function ApiKeysPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.projectId as string;

  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showKeyModal, setShowKeyModal] = useState<{ key: string; name: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [createForm, setCreateForm] = useState<CreateKeyForm>({
    name: '',
    environment: 'development',
    scopes: ['read', 'write'],
    rateLimit: 100,
  });

  useEffect(() => {
    loadApiKeys();
  }, [projectId]);

  const loadApiKeys = async () => {
    try {
      setIsLoading(true);
      
      // Mock data for now
      const mockKeys: ApiKey[] = [
        {
          id: '1',
          name: 'Development Key',
          keyPrefix: 'ak_test_abc123...',
          scopes: ['read', 'write'],
          environment: 'development',
          lastUsedAt: '2024-01-15T10:30:00Z',
          usageCount: 1247,
          rateLimit: 100,
          isActive: true,
          createdAt: '2024-01-10T09:00:00Z',
        },
        {
          id: '2',
          name: 'Production Key',
          keyPrefix: 'ak_live_def456...',
          scopes: ['read', 'write'],
          environment: 'production',
          lastUsedAt: '2024-01-15T11:45:00Z',
          usageCount: 5432,
          rateLimit: 1000,
          isActive: true,
          createdAt: '2024-01-12T14:30:00Z',
        },
        {
          id: '3',
          name: 'Read-only Key',
          keyPrefix: 'ak_test_ghi789...',
          scopes: ['read'],
          environment: 'development',
          lastUsedAt: null,
          usageCount: 0,
          rateLimit: 50,
          isActive: false,
          createdAt: '2024-01-14T16:20:00Z',
        },
      ];
      
      setApiKeys(mockKeys);
    } catch (error) {
      console.error('Failed to load API keys:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createApiKey = async () => {
    try {
      // Mock API key creation
      const newKey = `ak_${createForm.environment === 'development' ? 'test' : 'live'}_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
      
      const newApiKey: ApiKey = {
        id: Date.now().toString(),
        name: createForm.name,
        keyPrefix: newKey.substring(0, 12) + '...',
        scopes: createForm.scopes,
        environment: createForm.environment,
        lastUsedAt: null,
        usageCount: 0,
        rateLimit: createForm.rateLimit,
        isActive: true,
        createdAt: new Date().toISOString(),
      };
      
      setApiKeys([newApiKey, ...apiKeys]);
      setShowCreateForm(false);
      setShowKeyModal({ key: newKey, name: createForm.name });
      setCreateForm({
        name: '',
        environment: 'development',
        scopes: ['read', 'write'],
        rateLimit: 100,
      });
    } catch (error) {
      console.error('Failed to create API key:', error);
    }
  };

  const toggleKeyStatus = async (keyId: string) => {
    setApiKeys(apiKeys.map(key => 
      key.id === keyId ? { ...key, isActive: !key.isActive } : key
    ));
  };

  const deleteKey = async (keyId: string) => {
    if (confirm('Are you sure you want to delete this API key? This action cannot be undone.')) {
      setApiKeys(apiKeys.filter(key => key.id !== keyId));
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push(`/dashboard/${projectId}`)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">API Keys</h1>
                <p className="text-sm text-gray-500">Manage authentication for your project</p>
              </div>
            </div>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create API Key
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-3">
            <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="font-medium text-blue-900">API Key Security</h3>
              <p className="text-blue-700 text-sm mt-1">
                Keep your API keys secure and never expose them in client-side code. 
                Use environment variables and rotate keys regularly.
              </p>
            </div>
          </div>
        </div>

        {/* API Keys List */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-500 mt-4">Loading API keys...</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg border">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Your API Keys</h2>
            </div>
            
            {apiKeys.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No API keys yet</h3>
                <p className="text-gray-500 mb-6">Create your first API key to start using the API</p>
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create API Key
                </button>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {apiKeys.map((apiKey) => (
                  <div key={apiKey.id} className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <h3 className="font-medium text-gray-900">{apiKey.name}</h3>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            apiKey.environment === 'production' 
                              ? 'bg-red-100 text-red-800' 
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {apiKey.environment}
                          </span>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            apiKey.isActive 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {apiKey.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        
                        <div className="mt-2 flex items-center space-x-6 text-sm text-gray-500">
                          <span>
                            <span className="font-mono">{apiKey.keyPrefix}</span>
                          </span>
                          <span>Scopes: {apiKey.scopes.join(', ')}</span>
                          <span>Rate: {apiKey.rateLimit}/min</span>
                          <span>Used: {apiKey.usageCount.toLocaleString()} times</span>
                          <span>Last used: {formatDate(apiKey.lastUsedAt)}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => toggleKeyStatus(apiKey.id)}
                          className={`px-3 py-1 text-sm rounded ${
                            apiKey.isActive
                              ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              : 'bg-green-100 text-green-700 hover:bg-green-200'
                          }`}
                        >
                          {apiKey.isActive ? 'Disable' : 'Enable'}
                        </button>
                        
                        <button
                          onClick={() => deleteKey(apiKey.id)}
                          className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Create API Key Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Create API Key</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Key Name
                </label>
                <input
                  type="text"
                  value={createForm.name}
                  onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="My API Key"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Environment
                </label>
                <select
                  value={createForm.environment}
                  onChange={(e) => setCreateForm({ ...createForm, environment: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="development">Development</option>
                  <option value="production">Production</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Permissions
                </label>
                <div className="space-y-2">
                  {['read', 'write', 'simulate'].map((scope) => (
                    <label key={scope} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={createForm.scopes.includes(scope)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setCreateForm({ ...createForm, scopes: [...createForm.scopes, scope] });
                          } else {
                            setCreateForm({ ...createForm, scopes: createForm.scopes.filter(s => s !== scope) });
                          }
                        }}
                        className="mr-2"
                      />
                      <span className="text-sm capitalize">{scope}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rate Limit (requests per minute)
                </label>
                <input
                  type="number"
                  value={createForm.rateLimit}
                  onChange={(e) => setCreateForm({ ...createForm, rateLimit: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="1"
                  max="10000"
                />
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
                onClick={createApiKey}
                disabled={!createForm.name.trim() || createForm.scopes.length === 0}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Key
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Show New Key Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-900 mb-4">API Key Created</h2>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-2">
                  Copy this key now. For security reasons, it won't be shown again.
                </p>
                <div className="bg-gray-50 p-3 rounded-lg border">
                  <code className="text-sm font-mono break-all">{showKeyModal.key}</code>
                </div>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <div className="flex items-start space-x-2">
                  <svg className="w-4 h-4 text-yellow-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <p className="text-yellow-800 text-sm">
                    Store this key securely. Never expose it in client-side code or commit it to version control.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => navigator.clipboard.writeText(showKeyModal.key)}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Copy Key
              </button>
              <button
                onClick={() => setShowKeyModal(null)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}