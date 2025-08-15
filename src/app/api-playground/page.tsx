'use client';

import { useState } from 'react';

interface ApiEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  description: string;
  requestBody?: any;
  headers?: Record<string, string>;
}

const API_ENDPOINTS: ApiEndpoint[] = [
  {
    method: 'POST',
    path: '/api/aa/account/create',
    description: 'Create a new smart account',
    headers: { 'Authorization': 'Bearer ak_test_1234567890abcdef' },
    requestBody: {
      ownerAddress: '0x1234567890123456789012345678901234567890',
      chainId: 84532,
      provider: 'safe'
    }
  },
  {
    method: 'GET',
    path: '/api/aa/account/0x1234567890123456789012345678901234567890',
    description: 'Get smart account details',
    headers: { 'Authorization': 'Bearer ak_test_1234567890abcdef' }
  },
  {
    method: 'POST',
    path: '/api/aa/session/create',
    description: 'Create a new session key',
    headers: { 'Authorization': 'Bearer ak_test_1234567890abcdef' },
    requestBody: {
      userAddress: '0x1234567890123456789012345678901234567890',
      spendingLimit: '1000000000000000000',
      duration: 3600000,
      allowedTargets: ['0x742d35Cc6434C0532925a3b8c5481a3d3E7Cc4A7']
    }
  },
  {
    method: 'GET',
    path: '/api/aa/session/0x1234567890123456789012345678901234567890',
    description: 'Get active sessions for address',
    headers: { 'Authorization': 'Bearer ak_test_1234567890abcdef' }
  },
  {
    method: 'POST',
    path: '/api/aa/transaction/execute',
    description: 'Execute a gasless transaction',
    headers: { 'Authorization': 'Bearer ak_test_1234567890abcdef' },
    requestBody: {
      userAddress: '0x1234567890123456789012345678901234567890',
      to: '0x742d35Cc6434C0532925a3b8c5481a3d3E7Cc4A7',
      data: '0xd09de08a',
      value: '0'
    }
  },
  {
    method: 'GET',
    path: '/api/aa/transaction/0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef12',
    description: 'Get transaction details',
    headers: { 'Authorization': 'Bearer ak_test_1234567890abcdef' }
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

  const handleEndpointChange = (endpoint: ApiEndpoint) => {
    setSelectedEndpoint(endpoint);
    setRequestBody(JSON.stringify(endpoint.requestBody || {}, null, 2));
    setHeaders(JSON.stringify(endpoint.headers || {}, null, 2));
    setResponse('');
  };

  const executeRequest = async () => {
    setIsLoading(true);
    setResponse('');

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
      const res = await fetch(fullUrl, options);
      
      const responseText = await res.text();
      let formattedResponse;

      try {
        const jsonResponse = JSON.parse(responseText);
        formattedResponse = JSON.stringify(jsonResponse, null, 2);
      } catch {
        formattedResponse = responseText;
      }

      setResponse(`Status: ${res.status} ${res.statusText}\n\n${formattedResponse}`);
    } catch (error) {
      setResponse(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🚀 API Playground
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Test the Account Abstraction API endpoints interactively. 
            Try different requests and see real responses.
          </p>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Sidebar - Endpoints */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                📡 Available Endpoints
              </h2>
              
              <div className="space-y-2">
                {API_ENDPOINTS.map((endpoint, index) => (
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
                      <code className="text-sm text-gray-600">
                        {endpoint.path}
                      </code>
                    </div>
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
                  Include your API key in the Authorization header:
                </p>
                <code className="block text-xs bg-gray-800 text-green-400 p-2 rounded">
                  Authorization: Bearer ak_test_1234567890abcdef
                </code>
                
                <h3 className="font-semibold text-gray-900 mb-2 mt-4">
                  📋 Test API Keys
                </h3>
                <div className="space-y-1 text-xs">
                  <div>
                    <strong>Test User:</strong>
                    <code className="block bg-gray-800 text-green-400 p-1 rounded mt-1">
                      ak_test_1234567890abcdef
                    </code>
                  </div>
                  <div>
                    <strong>Demo User:</strong>
                    <code className="block bg-gray-800 text-green-400 p-1 rounded mt-1">
                      ak_demo_abcdef1234567890
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
                  <code className="text-sm text-gray-700">
                    {selectedEndpoint.path}
                  </code>
                </div>
                <p className="text-sm text-gray-600">
                  {selectedEndpoint.description}
                </p>
              </div>

              {/* Headers */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Headers
                </label>
                <textarea
                  value={headers}
                  onChange={(e) => setHeaders(e.target.value)}
                  className="w-full h-24 p-3 border border-gray-300 rounded-lg font-mono text-sm"
                  placeholder="Enter headers as JSON"
                />
              </div>

              {/* Request Body */}
              {selectedEndpoint.method !== 'GET' && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Request Body
                  </label>
                  <textarea
                    value={requestBody}
                    onChange={(e) => setRequestBody(e.target.value)}
                    className="w-full h-48 p-3 border border-gray-300 rounded-lg font-mono text-sm"
                    placeholder="Enter request body as JSON"
                  />
                </div>
              )}

              {/* Execute Button */}
              <button
                onClick={executeRequest}
                disabled={isLoading}
                className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
                  isLoading
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
                <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-auto max-h-96">
                  <pre>{response}</pre>
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
                  <li>• All responses include success/error status</li>
                  <li>• Timestamps are in ISO format</li>
                  <li>• Rate limits are enforced (check headers)</li>
                  <li>• Errors include detailed error codes</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom Section - Examples */}
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
                  2. Create Session
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  Set up a session key for gasless transactions with spending limits.
                </p>
                <button
                  onClick={() => handleEndpointChange(API_ENDPOINTS[2])}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Try Example →
                </button>
              </div>

              <div className="p-4 border border-gray-200 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">
                  3. Execute Transaction
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  Send a gasless transaction using a session key.
                </p>
                <button
                  onClick={() => handleEndpointChange(API_ENDPOINTS[4])}
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