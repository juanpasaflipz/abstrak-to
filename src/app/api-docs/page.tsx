'use client';

import { useState, useEffect } from 'react';

interface ApiEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  description: string;
  requestBody?: any;
  responseExample?: any;
  parameters?: Array<{
    name: string;
    type: string;
    required: boolean;
    description: string;
  }>;
  headers?: Record<string, string>;
  category: 'Account' | 'Session' | 'Transaction' | 'Utility';
  authentication?: string;
  rateLimit?: string;
}

const API_ENDPOINTS: ApiEndpoint[] = [
  // Account Management
  {
    method: 'POST',
    path: '/api/aa/account/create',
    description: 'Create a new smart account address deterministically',
    category: 'Account',
    authentication: 'Required',
    rateLimit: '100 requests/hour',
    headers: { 'Content-Type': 'application/json' },
    parameters: [
      {
        name: 'ownerAddress',
        type: 'string',
        required: true,
        description: 'The EOA address that will own the smart account'
      },
      {
        name: 'chainId',
        type: 'number',
        required: true,
        description: 'The blockchain network ID (e.g., 84532 for Base Sepolia)'
      },
      {
        name: 'provider',
        type: 'string',
        required: true,
        description: 'The account abstraction provider (safe, biconomy, alchemy)'
      }
    ],
    requestBody: {
      ownerAddress: '0x1234567890123456789012345678901234567890',
      chainId: 84532,
      provider: 'safe'
    },
    responseExample: {
      success: true,
      accountAddress: '0x9876543210987654321098765432109876543210',
      chainId: 84532,
      provider: 'safe',
      createdAt: '2024-01-15T10:30:00Z'
    }
  },
  {
    method: 'GET',
    path: '/api/aa/account/{address}',
    description: 'Get smart account details by address',
    category: 'Account',
    authentication: 'Required',
    rateLimit: '1000 requests/hour',
    headers: { 'Content-Type': 'application/json' },
    parameters: [
      {
        name: 'address',
        type: 'string',
        required: true,
        description: 'The smart account address to query'
      }
    ],
    responseExample: {
      success: true,
      accountAddress: '0x9876543210987654321098765432109876543210',
      ownerAddress: '0x1234567890123456789012345678901234567890',
      chainId: 84532,
      provider: 'safe',
      isDeployed: true,
      balance: '0.1',
      transactionCount: 5,
      createdAt: '2024-01-15T10:30:00Z'
    }
  },
  {
    method: 'POST',
    path: '/api/aa/account/deploy',
    description: 'Deploy a smart account to the blockchain',
    category: 'Account',
    authentication: 'Required',
    rateLimit: '50 requests/hour',
    headers: { 'Content-Type': 'application/json' },
    parameters: [
      {
        name: 'accountAddress',
        type: 'string',
        required: true,
        description: 'The smart account address to deploy'
      },
      {
        name: 'chainId',
        type: 'number',
        required: true,
        description: 'The blockchain network ID'
      },
      {
        name: 'provider',
        type: 'string',
        required: true,
        description: 'The account abstraction provider'
      }
    ],
    requestBody: {
      accountAddress: '0x9876543210987654321098765432109876543210',
      chainId: 84532,
      provider: 'safe'
    },
    responseExample: {
      success: true,
      transactionHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef12',
      accountAddress: '0x9876543210987654321098765432109876543210',
      status: 'pending',
      estimatedGas: '150000',
      createdAt: '2024-01-15T10:30:00Z'
    }
  },
  
  // Session Management
  {
    method: 'GET',
    path: '/api/aa/sessions/by-address/{address}',
    description: 'Get active sessions for a smart account address',
    category: 'Session',
    authentication: 'Required',
    rateLimit: '500 requests/hour',
    headers: { 'Content-Type': 'application/json' },
    parameters: [
      {
        name: 'address',
        type: 'string',
        required: true,
        description: 'The smart account address to query sessions for'
      }
    ],
    responseExample: {
      success: true,
      sessions: [
        {
          sessionId: '550e8400-e29b-41d4-a716-446655440000',
          accountAddress: '0x9876543210987654321098765432109876543210',
          permissions: ['execute', 'batch'],
          spendingLimit: '0.01',
          remainingSpending: '0.008',
          expiresAt: '2024-02-15T10:30:00Z',
          createdAt: '2024-01-15T10:30:00Z'
        }
      ],
      totalCount: 1
    }
  },
  {
    method: 'GET',
    path: '/api/aa/sessions/{sessionId}',
    description: 'Get session details by session ID',
    category: 'Session',
    authentication: 'Required',
    rateLimit: '500 requests/hour',
    headers: { 'Content-Type': 'application/json' },
    parameters: [
      {
        name: 'sessionId',
        type: 'string',
        required: true,
        description: 'The unique session identifier'
      }
    ],
    responseExample: {
      success: true,
      session: {
        sessionId: '550e8400-e29b-41d4-a716-446655440000',
        accountAddress: '0x9876543210987654321098765432109876543210',
        permissions: ['execute', 'batch'],
        spendingLimit: '0.01',
        remainingSpending: '0.008',
        expiresAt: '2024-02-15T10:30:00Z',
        createdAt: '2024-01-15T10:30:00Z',
        lastUsedAt: '2024-01-16T14:20:00Z'
      }
    }
  },
  {
    method: 'DELETE',
    path: '/api/aa/sessions/{sessionId}/revoke',
    description: 'Revoke a session key',
    category: 'Session',
    authentication: 'Required',
    rateLimit: '100 requests/hour',
    headers: { 'Content-Type': 'application/json' },
    parameters: [
      {
        name: 'sessionId',
        type: 'string',
        required: true,
        description: 'The session ID to revoke'
      }
    ],
    responseExample: {
      success: true,
      sessionId: '550e8400-e29b-41d4-a716-446655440000',
      revokedAt: '2024-01-16T15:00:00Z',
      message: 'Session revoked successfully'
    }
  },
  
  // Transaction Management
  {
    method: 'POST',
    path: '/api/aa/transaction/execute',
    description: 'Execute a single gasless transaction',
    category: 'Transaction',
    authentication: 'Required',
    rateLimit: '200 requests/hour',
    headers: { 'Content-Type': 'application/json' },
    parameters: [
      {
        name: 'userAddress',
        type: 'string',
        required: true,
        description: 'The smart account address executing the transaction'
      },
      {
        name: 'to',
        type: 'string',
        required: true,
        description: 'The destination contract or address'
      },
      {
        name: 'data',
        type: 'string',
        required: false,
        description: 'The transaction data (hex encoded)'
      },
      {
        name: 'value',
        type: 'string',
        required: false,
        description: 'The amount of ETH to send (in wei)'
      }
    ],
    requestBody: {
      userAddress: '0x9876543210987654321098765432109876543210',
      to: '0x742d35Cc6434C0532925a3b8c5481a3d3E7Cc4A7',
      data: '0xd09de08a',
      value: '0'
    },
    responseExample: {
      success: true,
      transactionHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef12',
      userOperationHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
      status: 'pending',
      estimatedGas: '120000',
      createdAt: '2024-01-15T10:30:00Z'
    }
  },
  {
    method: 'POST',
    path: '/api/aa/transaction/batch',
    description: 'Execute multiple transactions in a batch',
    category: 'Transaction',
    authentication: 'Required',
    rateLimit: '100 requests/hour',
    headers: { 'Content-Type': 'application/json' },
    parameters: [
      {
        name: 'userAddress',
        type: 'string',
        required: true,
        description: 'The smart account address executing the batch'
      },
      {
        name: 'transactions',
        type: 'array',
        required: true,
        description: 'Array of transaction objects to execute'
      }
    ],
    requestBody: {
      userAddress: '0x9876543210987654321098765432109876543210',
      transactions: [
        {
          to: '0x742d35Cc6434C0532925a3b8c5481a3d3E7Cc4A7',
          data: '0xd09de08a',
          value: '0'
        },
        {
          to: '0x742d35Cc6434C0532925a3b8c5481a3d3E7Cc4A7',
          data: '0xa9059cbb',
          value: '0'
        }
      ]
    },
    responseExample: {
      success: true,
      batchId: 'batch_1234567890',
      transactionHashes: [
        '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef12',
        '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890'
      ],
      status: 'pending',
      estimatedGas: '250000',
      createdAt: '2024-01-15T10:30:00Z'
    }
  },
  {
    method: 'GET',
    path: '/api/aa/transaction/{hash}',
    description: 'Get transaction details by hash',
    category: 'Transaction',
    authentication: 'Required',
    rateLimit: '1000 requests/hour',
    headers: { 'Content-Type': 'application/json' },
    parameters: [
      {
        name: 'hash',
        type: 'string',
        required: true,
        description: 'The transaction hash to query'
      }
    ],
    responseExample: {
      success: true,
      transaction: {
        hash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef12',
        userOperationHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
        from: '0x9876543210987654321098765432109876543210',
        to: '0x742d35Cc6434C0532925a3b8c5481a3d3E7Cc4A7',
        data: '0xd09de08a',
        value: '0',
        gasUsed: '115000',
        gasPrice: '2000000000',
        status: 'confirmed',
        blockNumber: 12345678,
        timestamp: '2024-01-15T10:30:00Z'
      }
    }
  }
];

export default function ApiDocsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Handle URL parameters for pre-selecting endpoints
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const endpointParam = urlParams.get('endpoint');
      if (endpointParam) {
        setSearchTerm(endpointParam);
      }
    }
  }, []);

  const categories = ['All', ...Array.from(new Set(API_ENDPOINTS.map(ep => ep.category)))];

  const filteredEndpoints = API_ENDPOINTS.filter(endpoint => {
    const matchesCategory = selectedCategory === 'All' || endpoint.category === selectedCategory;
    const matchesSearch = endpoint.path.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         endpoint.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <a 
              href="/api-playground"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              ← Back to Playground
            </a>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            📚 API Documentation
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Complete reference for the Account Abstraction API endpoints, including request/response examples, 
            authentication requirements, and rate limits.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Endpoints
                </label>
                <input
                  type="text"
                  placeholder="Search by path or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filter by Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Navigation */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              🧭 Quick Navigation
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {categories.filter(cat => cat !== 'All').map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    selectedCategory === category
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <h3 className="font-semibold text-gray-900 mb-2">{category}</h3>
                  <p className="text-sm text-gray-600">
                    {API_ENDPOINTS.filter(ep => ep.category === category).length} endpoints
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* API Overview */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              🚀 API Overview
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl mb-2">🔐</div>
                <h3 className="font-semibold text-blue-900">Authentication</h3>
                <p className="text-sm text-blue-700">API key required for most endpoints</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl mb-2">⚡</div>
                <h3 className="font-semibold text-green-900">Rate Limiting</h3>
                <p className="text-sm text-green-700">Varies by endpoint (50-1000 req/hour)</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl mb-2">🌐</div>
                <h3 className="font-semibold text-purple-900">Networks</h3>
                <p className="text-sm text-purple-700">Base Sepolia, Ethereum, Polygon</p>
              </div>
            </div>
          </div>
        </div>

        {/* Endpoints Documentation */}
        <div className="max-w-6xl mx-auto">
          {filteredEndpoints.map((endpoint, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-3 py-1 text-sm font-semibold rounded ${
                      endpoint.method === 'GET' ? 'bg-green-100 text-green-800' :
                      endpoint.method === 'POST' ? 'bg-blue-100 text-blue-800' :
                      endpoint.method === 'PUT' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {endpoint.method}
                    </span>
                    <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                      {endpoint.category}
                    </span>
                    {endpoint.authentication && (
                      <span className="px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded">
                        {endpoint.authentication}
                      </span>
                    )}
                    {endpoint.rateLimit && (
                      <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded">
                        {endpoint.rateLimit}
                      </span>
                    )}
                  </div>
                  <code className="block text-lg text-gray-800 mb-2 break-all">
                    {endpoint.path}
                  </code>
                  <p className="text-gray-600 mb-4">
                    {endpoint.description}
                  </p>
                </div>
              </div>

              {/* Parameters */}
              {endpoint.parameters && endpoint.parameters.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Parameters</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                      <div className="font-semibold text-gray-700">Name</div>
                      <div className="font-semibold text-gray-700">Type</div>
                      <div className="font-semibold text-gray-700">Required</div>
                      <div className="font-semibold text-gray-700">Description</div>
                      {endpoint.parameters.map((param, paramIndex) => (
                        <>
                          <div key={`${index}-${paramIndex}-name`} className="text-gray-600">{param.name}</div>
                          <div key={`${index}-${paramIndex}-type`} className="text-gray-600">{param.type}</div>
                          <div key={`${index}-${paramIndex}-required`} className="text-gray-600">
                            {param.required ? 'Yes' : 'No'}
                          </div>
                          <div key={`${index}-${paramIndex}-description`} className="text-gray-600">{param.description}</div>
                        </>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Request/Response Examples */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Request Example */}
                {endpoint.requestBody && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">Request Example</h4>
                      <button
                        onClick={() => copyToClipboard(JSON.stringify(endpoint.requestBody, null, 2))}
                        className="text-xs text-blue-600 hover:text-blue-800"
                      >
                        📋 Copy
                      </button>
                    </div>
                    <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-auto">
                      <pre className="whitespace-pre-wrap">
                        {JSON.stringify(endpoint.requestBody, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}

                {/* Response Example */}
                {endpoint.responseExample && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">Response Example</h4>
                      <button
                        onClick={() => copyToClipboard(JSON.stringify(endpoint.responseExample, null, 2))}
                        className="text-xs text-blue-600 hover:text-blue-800"
                      >
                        📋 Copy
                      </button>
                    </div>
                    <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-auto">
                      <pre className="whitespace-pre-wrap">
                        {JSON.stringify(endpoint.responseExample, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}
              </div>

              {/* Test in Playground Button */}
              <div className="mt-6 text-center">
                <a
                  href={`/api-playground?endpoint=${encodeURIComponent(endpoint.path)}`}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  🧪 Test in Playground
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Resources */}
        <div className="max-w-4xl mx-auto mt-12">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
              📖 Additional Resources
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 border border-gray-200 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">
                  🔐 Authentication Guide
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  Learn how to authenticate your API requests and manage your API keys.
                </p>
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  Coming Soon →
                </button>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">
                  🚀 Getting Started
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  Step-by-step guide to integrate Account Abstraction into your application.
                </p>
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  Coming Soon →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Back to Top Button */}
        <div className="text-center mt-8">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            ↑ Back to Top
          </button>
        </div>
      </div>
    </div>
  );
}
