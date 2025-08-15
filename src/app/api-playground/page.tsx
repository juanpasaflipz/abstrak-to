'use client';

import { useState, useEffect } from 'react';
import { Navigation } from '@/components/portal/Navigation';

interface ApiEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  description: string;
  requestBody?: any;
  headers?: Record<string, string>;
  category: 'Account' | 'Session' | 'Transaction' | 'Utility';
}

const API_ENDPOINTS: ApiEndpoint[] = [
  // Account Management
  {
    method: 'POST',
    path: '/api/aa/account/create',
    description: 'Create a new smart account',
    category: 'Account',
    headers: { 'Content-Type': 'application/json' },
    requestBody: {
      ownerAddress: '0x1234567890123456789012345678901234567890',
      chainId: 84532,
      provider: 'safe'
    }
  },
  {
    method: 'GET',
    path: '/api/aa/account/0x1234567890123456789012345678901234567890',
    description: 'Get smart account details by address',
    category: 'Account',
    headers: { 'Content-Type': 'application/json' }
  },
  {
    method: 'POST',
    path: '/api/aa/account/deploy',
    description: 'Deploy a smart account to the blockchain',
    category: 'Account',
    headers: { 'Content-Type': 'application/json' },
    requestBody: {
      accountAddress: '0x1234567890123456789012345678901234567890',
      chainId: 84532,
      provider: 'safe'
    }
  },
  
  // Session Management
  {
    method: 'GET',
    path: '/api/aa/sessions/by-address/0x1234567890123456789012345678901234567890',
    description: 'Get active sessions for an address',
    category: 'Session',
    headers: { 'Content-Type': 'application/json' }
  },
  {
    method: 'GET',
    path: '/api/aa/sessions/550e8400-e29b-41d4-a716-446655440000',
    description: 'Get session details by session ID',
    category: 'Session',
    headers: { 'Content-Type': 'application/json' }
  },
  {
    method: 'DELETE',
    path: '/api/aa/sessions/550e8400-e29b-41d4-a716-446655440000/revoke',
    description: 'Revoke a session key',
    category: 'Session',
    headers: { 'Content-Type': 'application/json' }
  },
  
  // Transaction Management
  {
    method: 'POST',
    path: '/api/aa/transaction/execute',
    description: 'Execute a single gasless transaction',
    category: 'Transaction',
    headers: { 'Content-Type': 'application/json' },
    requestBody: {
      userAddress: '0x1234567890123456789012345678901234567890',
      to: '0x742d35Cc6434C0532925a3b8c5481a3d3E7Cc4A7',
      data: '0xd09de08a',
      value: '0'
    }
  },
  {
    method: 'POST',
    path: '/api/aa/transaction/batch',
    description: 'Execute multiple transactions in a batch',
    category: 'Transaction',
    headers: { 'Content-Type': 'application/json' },
    requestBody: {
      userAddress: '0x1234567890123456789012345678901234567890',
      transactions: [
        {
          to: '0x742d35Cc6434C0532925a3b8c5481a3d3E7Cc4A7',
          data: '0xd09de08a',
          value: '0'
        }
      ]
    }
  },
  {
    method: 'GET',
    path: '/api/aa/transaction/0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef12',
    description: 'Get transaction details by hash',
    category: 'Transaction',
    headers: { 'Content-Type': 'application/json' }
  }
];

export default function ApiPlaygroundPage() {
  const [selectedEndpoint, setSelectedEndpoint] = useState<ApiEndpoint>(API_ENDPOINTS[0]);
  const [requestBody, setRequestBody] = useState<string>(
    JSON.stringify(selectedEndpoint.requestBody || {}, null, 2)
  );
  const [response, setResponse] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [headers, setHeaders] = useState<string>(
    JSON.stringify(selectedEndpoint.headers || {}, null, 2)
  );
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [responseTime, setResponseTime] = useState<number>(0);
  const [responseSize, setResponseSize] = useState<number>(0);

  const categories = ['All', ...Array.from(new Set(API_ENDPOINTS.map(ep => ep.category)))];

  const filteredEndpoints = selectedCategory === 'All' 
    ? API_ENDPOINTS 
    : API_ENDPOINTS.filter(ep => ep.category === selectedCategory);

  useEffect(() => {
    handleEndpointChange(selectedEndpoint);
  }, [selectedEndpoint]);

  const handleEndpointChange = (endpoint: ApiEndpoint) => {
    setSelectedEndpoint(endpoint);
    setRequestBody(JSON.stringify(endpoint.requestBody || {}, null, 2));
    setHeaders(JSON.stringify(endpoint.headers || {}, null, 2));
    setResponse('');
    setResponseTime(0);
    setResponseSize(0);
  };

  const validateJson = (jsonString: string): boolean => {
    try {
      JSON.parse(jsonString);
      return true;
    } catch {
      return false;
    }
  };

  const executeRequest = async () => {
    // Validate JSON inputs
    if (!validateJson(headers)) {
      setResponse('Error: Invalid JSON in headers');
      return;
    }
    
    if (selectedEndpoint.method !== 'GET' && !validateJson(requestBody)) {
      setResponse('Error: Invalid JSON in request body');
      return;
    }

    setIsLoading(true);
    setResponse('');
    setResponseTime(0);
    setResponseSize(0);

    const startTime = Date.now();

    try {
      const parsedHeaders = JSON.parse(headers);
      const options: RequestInit = {
        method: selectedEndpoint.method,
        headers: {
          'Content-Type': 'application/json',
          ...parsedHeaders,
        },
      };

      if (selectedEndpoint.method !== 'GET' && requestBody.trim()) {
        options.body = requestBody;
      }

      const fullUrl = `${window.location.origin}${selectedEndpoint.path}`;
      console.log('Executing request:', { url: fullUrl, options });
      
      const res = await fetch(fullUrl, options);
      const endTime = Date.now();
      const responseTimeMs = endTime - startTime;
      
      const responseText = await res.text();
      const responseSizeBytes = new Blob([responseText]).size;
      
      let formattedResponse;
      let isJson = false;

      try {
        const jsonResponse = JSON.parse(responseText);
        formattedResponse = JSON.stringify(jsonResponse, null, 2);
        isJson = true;
      } catch {
        formattedResponse = responseText;
      }

      // Format the response with metadata
      const responseMeta = [
        `Status: ${res.status} ${res.statusText}`,
        `Response Time: ${responseTimeMs}ms`,
        `Response Size: ${(responseSizeBytes / 1024).toFixed(2)} KB`,
        `Content-Type: ${res.headers.get('content-type') || 'text/plain'}`,
        `Date: ${new Date().toISOString()}`,
        '',
        isJson ? 'Response Body (JSON):' : 'Response Body:',
        formattedResponse
      ].join('\n');

      setResponse(responseMeta);
      setResponseTime(responseTimeMs);
      setResponseSize(responseSizeBytes);
    } catch (error) {
      setResponse(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const formatEndpointPath = (path: string) => {
    return path.replace(/\/api\/aa\//, '');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation temporarily removed for debugging */}
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🚀 API Playground
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Test the Account Abstraction API endpoints interactively. 
            Explore smart account creation, session management, and gasless transactions.
          </p>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Sidebar - Endpoints */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                📡 Available Endpoints
              </h2>
              
              {/* Category Filter */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filter by Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredEndpoints.map((endpoint, index) => (
                  <button
                    key={index}
                    onClick={() => handleEndpointChange(endpoint)}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      selectedEndpoint === endpoint
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-1 text-xs font-semibold rounded ${
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
                    </div>
                    <code className="block text-xs text-gray-600 mb-2 break-all">
                      {formatEndpointPath(endpoint.path)}
                    </code>
                    <p className="text-sm text-gray-500">
                      {endpoint.description}
                    </p>
                  </button>
                ))}
              </div>

              {/* API Documentation */}
              <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">
                  🔑 Authentication
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  Most endpoints require authentication. Include your API key in headers if needed.
                </p>
                
                <h3 className="font-semibold text-gray-900 mb-2 mt-4">
                  📋 Test Data
                </h3>
                <div className="space-y-1 text-xs">
                  <div>
                    <strong>Test Address:</strong>
                    <code className="block bg-gray-800 text-green-400 p-1 rounded mt-1 break-all">
                      0x1234567890123456789012345678901234567890
                    </code>
                  </div>
                  <div>
                    <strong>Test Contract:</strong>
                    <code className="block bg-gray-800 text-green-400 p-1 rounded mt-1 break-all">
                      0x742d35Cc6434C0532925a3b8c5481a3d3E7Cc4A7
                    </code>
                  </div>
                </div>
              </div>
            </div>

            {/* Center - Request Configuration */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                ⚙️ Request Configuration
              </h2>

              {/* Endpoint Info */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-3 py-1 text-sm font-semibold rounded ${
                    selectedEndpoint.method === 'GET' ? 'bg-green-100 text-green-800' :
                    selectedEndpoint.method === 'POST' ? 'bg-blue-100 text-blue-800' :
                    selectedEndpoint.method === 'PUT' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {selectedEndpoint.method}
                  </span>
                  <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                    {selectedEndpoint.category}
                  </span>
                </div>
                <code className="block text-sm text-gray-700 mb-2 break-all">
                  {selectedEndpoint.path}
                </code>
                <p className="text-sm text-gray-600">
                  {selectedEndpoint.description}
                </p>
              </div>

              {/* Headers */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Headers
                  </label>
                  <button
                    onClick={() => copyToClipboard(headers)}
                    className="text-xs text-blue-600 hover:text-blue-800"
                  >
                    📋 Copy
                  </button>
                </div>
                <textarea
                  value={headers}
                  onChange={(e) => setHeaders(e.target.value)}
                  className="w-full h-24 p-3 border border-gray-300 rounded-lg font-mono text-sm"
                  placeholder="Enter headers as JSON"
                />
                {!validateJson(headers) && headers.trim() && (
                  <p className="text-red-500 text-xs mt-1">Invalid JSON format</p>
                )}
              </div>

              {/* Request Body */}
              {selectedEndpoint.method !== 'GET' && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Request Body
                    </label>
                    <button
                      onClick={() => copyToClipboard(requestBody)}
                      className="text-xs text-blue-600 hover:text-blue-800"
                    >
                      📋 Copy
                    </button>
                  </div>
                  <textarea
                    value={requestBody}
                    onChange={(e) => setRequestBody(e.target.value)}
                    className="w-full h-48 p-3 border border-gray-300 rounded-lg font-mono text-sm"
                    placeholder="Enter request body as JSON"
                  />
                  {!validateJson(requestBody) && requestBody.trim() && (
                    <p className="text-red-500 text-xs mt-1">Invalid JSON format</p>
                  )}
                </div>
              )}

              {/* Execute Button */}
              <button
                onClick={executeRequest}
                disabled={isLoading || 
                  !validateJson(headers) || 
                  (selectedEndpoint.method !== 'GET' && !validateJson(requestBody))}
                className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
                  isLoading || 
                  !validateJson(headers) || 
                  (selectedEndpoint.method !== 'GET' && !validateJson(requestBody))
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                } text-white`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Executing...
                  </div>
                ) : (
                  `Execute ${selectedEndpoint.method} Request`
                )}
              </button>
            </div>

            {/* Right - Response */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                📄 Response
              </h2>

              {response ? (
                <div className="space-y-4">
                  {/* Response Metadata */}
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>⏱️ {responseTime}ms</span>
                    <span>📦 {(responseSize / 1024).toFixed(2)} KB</span>
                  </div>
                  
                  {/* Response Content */}
                  <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-auto max-h-80">
                    <pre className="whitespace-pre-wrap">{response}</pre>
                  </div>
                  
                  {/* Copy Response Button */}
                  <button
                    onClick={() => copyToClipboard(response)}
                    className="w-full py-2 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                  >
                    📋 Copy Response
                  </button>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <div className="text-4xl mb-4">📡</div>
                  <p>Execute a request to see the response here</p>
                </div>
              )}

              {/* Response Info */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">
                  💡 Response Information
                </h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Response time and size are displayed</li>
                  <li>• All responses include HTTP status codes</li>
                  <li>• JSON responses are automatically formatted</li>
                  <li>• Copy response button for easy sharing</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom Section - Examples and Documentation */}
          <div className="mt-12 bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
              📚 Common Usage Examples
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="p-4 border border-gray-200 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">
                  1. Create Smart Account
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  Generate a deterministic smart account address for a user's EOA.
                </p>
                <button
                  onClick={() => handleEndpointChange(API_ENDPOINTS[0])}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Try Example →
                </button>
              </div>

              <div className="p-4 border border-gray-200 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">
                  2. Execute Transaction
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  Send a gasless transaction using the smart account.
                </p>
                <button
                  onClick={() => handleEndpointChange(API_ENDPOINTS[4])}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Try Example →
                </button>
              </div>

              <div className="p-4 border border-gray-200 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">
                  3. Batch Transactions
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  Execute multiple transactions in a single batch for efficiency.
                </p>
                <button
                  onClick={() => handleEndpointChange(API_ENDPOINTS[5])}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Try Example →
                </button>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-500 mb-4">
                Need help? Check out the full API documentation or contact support.
              </p>
              <div className="flex justify-center gap-4">
                <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                  📖 API Docs
                </button>
                <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                  💬 Support
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}