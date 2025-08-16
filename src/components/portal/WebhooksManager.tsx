'use client';

import { useState, useEffect } from 'react';
import {
  LinkIcon,
  ShieldCheckIcon,
  PlusIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  CheckCircleIcon,
  ClockIcon,
  PencilIcon,
  TrashIcon,
  PlayIcon,
  EyeIcon,
  EyeSlashIcon,
  DocumentDuplicateIcon
} from '@heroicons/react/24/outline';
import { BoltIcon } from '@heroicons/react/24/solid';

interface Webhook {
  id: string;
  url: string;
  secret: string;
  events: string[];
  maxRetries: number;
  retryDelay: number;
  isActive: boolean;
  lastSuccess?: string;
  lastFailure?: string;
  failureCount: number;
  createdAt: string;
}

interface WebhooksManagerProps {
  projectId?: string;
  onSave?: (webhooks: Webhook[]) => void;
}

export function WebhooksManager({
  projectId,
  onSave
}: WebhooksManagerProps) {
  const [webhooks, setWebhooks] = useState<Webhook[]>([
    {
      id: '1',
      url: 'https://api.example.com/webhooks/aa',
      secret: 'whsec_1234567890abcdef',
      events: ['account.created', 'session.created', 'userOp.submitted'],
      maxRetries: 3,
      retryDelay: 1000,
      isActive: true,
      lastSuccess: new Date(Date.now() - 3600000).toISOString(),
      lastFailure: new Date(Date.now() - 86400000).toISOString(),
      failureCount: 0,
      createdAt: new Date(Date.now() - 604800000).toISOString()
    }
  ]);
  
  const [editingWebhook, setEditingWebhook] = useState<Webhook | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [testResults, setTestResults] = useState<Record<string, any>>({});

  // Available webhook events
  const availableEvents = [
    { 
      id: 'account.created', 
      name: 'Smart Account Created', 
      description: 'When a new smart account is deployed' 
    },
    { 
      id: 'account.funded', 
      name: 'Account Funded', 
      description: 'When an account receives funds' 
    },
    { 
      id: 'session.created', 
      name: 'Session Key Created', 
      description: 'When a new session key is generated' 
    },
    { 
      id: 'session.expired', 
      name: 'Session Expired', 
      description: 'When a session key expires' 
    },
    { 
      id: 'session.revoked', 
      name: 'Session Revoked', 
      description: 'When a session key is manually revoked' 
    },
    { 
      id: 'userOp.simulated', 
      name: 'UserOp Simulated', 
      description: 'When a UserOperation is simulated' 
    },
    { 
      id: 'userOp.submitted', 
      name: 'UserOp Submitted', 
      description: 'When a UserOperation is submitted to mempool' 
    },
    { 
      id: 'userOp.mined', 
      name: 'UserOp Mined', 
      description: 'When a UserOperation is successfully mined' 
    },
    { 
      id: 'userOp.failed', 
      name: 'UserOp Failed', 
      description: 'When a UserOperation fails' 
    },
    { 
      id: 'spending.limit.reached', 
      name: 'Spending Limit Reached', 
      description: 'When spending limits are approached or exceeded' 
    }
  ];

  const getWebhookStatus = (webhook: Webhook) => {
    if (!webhook.isActive) {
      return { color: 'gray', text: 'Inactive', icon: XMarkIcon };
    }
    
    if (webhook.failureCount >= webhook.maxRetries) {
      return { color: 'red', text: 'Failed', icon: ExclamationTriangleIcon };
    }
    
    if (webhook.failureCount > 0) {
      return { color: 'yellow', text: 'Warning', icon: ExclamationTriangleIcon };
    }
    
    return { color: 'green', text: 'Healthy', icon: CheckCircleIcon };
  };

  const testWebhook = async (webhookId: string) => {
    setIsLoading(true);
    try {
      // Simulate webhook test
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const testResult = {
        status: 'success',
        statusCode: 200,
        responseTime: 145,
        timestamp: new Date().toISOString()
      };
      
      setTestResults(prev => ({ ...prev, [webhookId]: testResult }));
      
      // Update webhook success timestamp
      setWebhooks(prev => prev.map(w => 
        w.id === webhookId 
          ? { ...w, lastSuccess: new Date().toISOString(), failureCount: 0 }
          : w
      ));
    } catch (error) {
      const testResult = {
        status: 'error',
        statusCode: 500,
        error: 'Connection timeout',
        timestamp: new Date().toISOString()
      };
      
      setTestResults(prev => ({ ...prev, [webhookId]: testResult }));
    } finally {
      setIsLoading(false);
    }
  };

  const saveWebhook = async (webhook: Webhook) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (editingWebhook) {
        setWebhooks(prev => prev.map(w => w.id === webhook.id ? webhook : w));
      } else {
        setWebhooks(prev => [...prev, { 
          ...webhook, 
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          failureCount: 0
        }]);
      }
      
      setEditingWebhook(null);
      setShowCreateForm(false);
    } catch (error) {
      console.error('Failed to save webhook:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteWebhook = async (webhookId: string) => {
    if (!confirm('Are you sure you want to delete this webhook?')) return;
    
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setWebhooks(prev => prev.filter(w => w.id !== webhookId));
      setTestResults(prev => {
        const newResults = { ...prev };
        delete newResults[webhookId];
        return newResults;
      });
    } catch (error) {
      console.error('Failed to delete webhook:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateSecret = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = 'whsec_';
    for (let i = 0; i < 32; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 py-8">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <LinkIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Webhooks
              </h1>
              <p className="text-gray-600 font-medium">Configure real-time event notifications for your project</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Info Banner */}
        <div className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/50 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <InformationCircleIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">About Webhooks</h3>
              <p className="text-blue-800 leading-relaxed mb-4">
                Webhooks allow your application to receive real-time notifications when events occur in your Account Abstraction project. 
                Set up endpoints to get notified about smart account creation, transaction submission, session management, and more.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <BoltIcon className="h-4 w-4 text-blue-600" />
                  <span className="text-blue-800">Real-time notifications</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheckIcon className="h-4 w-4 text-blue-600" />
                  <span className="text-blue-800">HMAC signature verification</span>
                </div>
                <div className="flex items-center gap-2">
                  <ClockIcon className="h-4 w-4 text-blue-600" />
                  <span className="text-blue-800">Automatic retry with backoff</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircleIcon className="h-4 w-4 text-blue-600" />
                  <span className="text-blue-800">Delivery status monitoring</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Configured Webhooks</h2>
          <button
            onClick={() => setShowCreateForm(true)}
            className="group px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2"
          >
            <PlusIcon className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
            <span>Add Webhook</span>
          </button>
        </div>

        {/* Webhooks List */}
        {webhooks.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <LinkIcon className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No Webhooks Configured</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
              Set up your first webhook to start receiving real-time notifications about your Account Abstraction events.
            </p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="group bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2 mx-auto"
            >
              <PlusIcon className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
              <span>Create Your First Webhook</span>
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {webhooks.map((webhook) => {
              const status = getWebhookStatus(webhook);
              const StatusIcon = status.icon;
              const testResult = testResults[webhook.id];

              return (
                <div key={webhook.id} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden">
                  {/* Header */}
                  <div className="p-6 border-b border-gray-200/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          status.color === 'green' ? 'bg-gradient-to-br from-green-500 to-green-600' :
                          status.color === 'yellow' ? 'bg-gradient-to-br from-yellow-500 to-yellow-600' :
                          status.color === 'red' ? 'bg-gradient-to-br from-red-500 to-red-600' :
                          'bg-gradient-to-br from-gray-400 to-gray-500'
                        }`}>
                          <StatusIcon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{webhook.url}</h3>
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${
                              status.color === 'green' ? 'bg-green-500' :
                              status.color === 'yellow' ? 'bg-yellow-500' :
                              status.color === 'red' ? 'bg-red-500' : 'bg-gray-400'
                            }`}></div>
                            <span className={`text-sm font-medium ${
                              status.color === 'green' ? 'text-green-600' :
                              status.color === 'yellow' ? 'text-yellow-600' :
                              status.color === 'red' ? 'text-red-600' : 'text-gray-500'
                            }`}>
                              {status.text}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => testWebhook(webhook.id)}
                          disabled={isLoading}
                          className="p-2 text-gray-400 hover:text-blue-600 transition-colors disabled:opacity-50"
                          title="Test webhook"
                        >
                          <PlayIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => setEditingWebhook(webhook)}
                          className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                          title="Edit webhook"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => deleteWebhook(webhook.id)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                          title="Delete webhook"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      
                      {/* Events */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Subscribed Events</h4>
                        <div className="space-y-2">
                          {webhook.events.map((eventId) => {
                            const event = availableEvents.find(e => e.id === eventId);
                            return (
                              <div key={eventId} className="flex items-center gap-2 p-2 bg-blue-50/80 backdrop-blur-sm border border-blue-200/50 rounded-lg">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                <span className="text-sm font-medium text-blue-800">
                                  {event?.name || eventId}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Stats */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Delivery Stats</h4>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Retry Policy</span>
                            <span className="text-sm font-medium text-gray-900">
                              {webhook.maxRetries} attempts, {webhook.retryDelay}ms delay
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Failure Count</span>
                            <span className={`text-sm font-medium ${
                              webhook.failureCount === 0 ? 'text-green-600' : 
                              webhook.failureCount >= webhook.maxRetries ? 'text-red-600' : 'text-yellow-600'
                            }`}>
                              {webhook.failureCount}
                            </span>
                          </div>
                          {webhook.lastSuccess && (
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">Last Success</span>
                              <span className="text-sm font-medium text-green-600">
                                {new Date(webhook.lastSuccess).toLocaleString()}
                              </span>
                            </div>
                          )}
                          {webhook.lastFailure && (
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">Last Failure</span>
                              <span className="text-sm font-medium text-red-600">
                                {new Date(webhook.lastFailure).toLocaleString()}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Test Results */}
                    {testResult && (
                      <div className="mt-6 p-4 bg-gray-50/80 backdrop-blur-sm border border-gray-200/50 rounded-xl">
                        <h4 className="font-semibold text-gray-900 mb-3">Test Result</h4>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${
                              testResult.status === 'success' ? 'bg-green-500' : 'bg-red-500'
                            }`}></div>
                            <span className={`font-medium ${
                              testResult.status === 'success' ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {testResult.status === 'success' ? 'Success' : 'Failed'}
                            </span>
                            <span className="text-sm text-gray-600">
                              Status: {testResult.statusCode}
                            </span>
                            {testResult.responseTime && (
                              <span className="text-sm text-gray-600">
                                Response: {testResult.responseTime}ms
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-gray-500">
                            {new Date(testResult.timestamp).toLocaleString()}
                          </span>
                        </div>
                        {testResult.error && (
                          <p className="mt-2 text-sm text-red-600">{testResult.error}</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Create/Edit Form Modal */}
        {(showCreateForm || editingWebhook) && (
          <WebhookForm
            webhook={editingWebhook}
            availableEvents={availableEvents}
            onSave={saveWebhook}
            onCancel={() => {
              setShowCreateForm(false);
              setEditingWebhook(null);
            }}
            isLoading={isLoading}
            generateSecret={generateSecret}
          />
        )}
      </div>
    </div>
  );
}

// Webhook Form Component
interface WebhookFormProps {
  webhook?: Webhook | null;
  availableEvents: Array<{ id: string; name: string; description: string }>;
  onSave: (webhook: Webhook) => void;
  onCancel: () => void;
  isLoading: boolean;
  generateSecret: () => string;
}

function WebhookForm({ webhook, availableEvents, onSave, onCancel, isLoading, generateSecret }: WebhookFormProps) {
  const [formData, setFormData] = useState({
    url: webhook?.url || '',
    secret: webhook?.secret || generateSecret(),
    events: webhook?.events || [],
    maxRetries: webhook?.maxRetries || 3,
    retryDelay: webhook?.retryDelay || 1000,
    isActive: webhook?.isActive ?? true
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSecret, setShowSecret] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.url.trim()) {
      newErrors.url = 'Webhook URL is required';
    } else if (!/^https?:\/\/.+/.test(formData.url)) {
      newErrors.url = 'URL must start with http:// or https://';
    }
    
    if (formData.events.length === 0) {
      newErrors.events = 'Select at least one event to subscribe to';
    }
    
    if (formData.maxRetries < 0 || formData.maxRetries > 10) {
      newErrors.maxRetries = 'Max retries must be between 0 and 10';
    }
    
    if (formData.retryDelay < 100 || formData.retryDelay > 10000) {
      newErrors.retryDelay = 'Retry delay must be between 100ms and 10000ms';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    
    const newWebhook: Webhook = {
      id: webhook?.id || '',
      url: formData.url.trim(),
      secret: formData.secret,
      events: formData.events,
      maxRetries: formData.maxRetries,
      retryDelay: formData.retryDelay,
      isActive: formData.isActive,
      lastSuccess: webhook?.lastSuccess,
      lastFailure: webhook?.lastFailure,
      failureCount: webhook?.failureCount || 0,
      createdAt: webhook?.createdAt || new Date().toISOString()
    };
    
    onSave(newWebhook);
  };

  const toggleEvent = (eventId: string) => {
    setFormData(prev => ({
      ...prev,
      events: prev.events.includes(eventId)
        ? prev.events.filter(e => e !== eventId)
        : [...prev.events, eventId]
    }));
  };

  const copySecret = () => {
    navigator.clipboard.writeText(formData.secret);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-200/50 w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
          <button
            onClick={onCancel}
            className="absolute top-4 right-4 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
          <h2 className="text-2xl font-bold mb-1">
            {webhook ? 'Edit Webhook' : 'Create Webhook'}
          </h2>
          <p className="text-indigo-100">Configure real-time event notifications</p>
        </div>
        
        {/* Form */}
        <div className="p-6 max-h-[calc(90vh-140px)] overflow-y-auto">
          <div className="space-y-6">
            
            {/* URL */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Webhook URL <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                value={formData.url}
                onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-300 ${
                  errors.url 
                    ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-200' 
                    : 'border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-200'
                }`}
                placeholder="https://api.yourapp.com/webhooks"
              />
              {errors.url && (
                <p className="mt-2 text-sm text-red-600">{errors.url}</p>
              )}
            </div>

            {/* Secret */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Webhook Secret
              </label>
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <input
                    type={showSecret ? 'text' : 'password'}
                    value={formData.secret}
                    onChange={(e) => setFormData(prev => ({ ...prev, secret: e.target.value }))}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-200 focus:outline-none transition-all duration-300 pr-20"
                    placeholder="whsec_..."
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center gap-1 pr-3">
                    <button
                      type="button"
                      onClick={() => setShowSecret(!showSecret)}
                      className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showSecret ? <EyeSlashIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                    </button>
                    <button
                      type="button"
                      onClick={copySecret}
                      className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <DocumentDuplicateIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, secret: generateSecret() }))}
                  className="px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-300 font-medium"
                >
                  Generate
                </button>
              </div>
              <p className="mt-2 text-sm text-gray-600">
                Used to verify webhook authenticity via HMAC signature
              </p>
            </div>

            {/* Events */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Events <span className="text-red-500">*</span>
              </label>
              {errors.events && (
                <p className="mb-3 text-sm text-red-600">{errors.events}</p>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto">
                {availableEvents.map((event) => (
                  <label
                    key={event.id}
                    className={`flex items-start gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                      formData.events.includes(event.id)
                        ? 'border-blue-500 bg-blue-50/80'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.events.includes(event.id)}
                      onChange={() => toggleEvent(event.id)}
                      className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500 mt-0.5"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{event.name}</div>
                      <div className="text-sm text-gray-600">{event.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Retry Configuration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Max Retries
                </label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={formData.maxRetries}
                  onChange={(e) => setFormData(prev => ({ ...prev, maxRetries: parseInt(e.target.value) }))}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-300 ${
                    errors.maxRetries 
                      ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-200' 
                      : 'border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-200'
                  }`}
                />
                {errors.maxRetries && (
                  <p className="mt-2 text-sm text-red-600">{errors.maxRetries}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Retry Delay (ms)
                </label>
                <input
                  type="number"
                  min="100"
                  max="10000"
                  step="100"
                  value={formData.retryDelay}
                  onChange={(e) => setFormData(prev => ({ ...prev, retryDelay: parseInt(e.target.value) }))}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-300 ${
                    errors.retryDelay 
                      ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-200' 
                      : 'border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-200'
                  }`}
                />
                {errors.retryDelay && (
                  <p className="mt-2 text-sm text-red-600">{errors.retryDelay}</p>
                )}
              </div>
            </div>

            {/* Active Toggle */}
            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                  className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <span className="text-sm font-semibold text-gray-900">Active Webhook</span>
              </label>
            </div>
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
            className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-semibold shadow-lg hover:shadow-xl hover:scale-105 disabled:hover:scale-100 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <CheckCircleIcon className="h-5 w-5" />
                <span>{webhook ? 'Update' : 'Create'} Webhook</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}