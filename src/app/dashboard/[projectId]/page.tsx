'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';
import {
  SparklesIcon,
  BoltIcon,
  LockClosedIcon,
  RocketLaunchIcon,
  CheckIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
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
  CloudIcon,
  UserGroupIcon,
  ArrowTrendingUpIcon,
  ExclamationCircleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { ShieldExclamationIcon } from '@heroicons/react/24/solid';

interface ProjectStats {
  totalRequests: number;
  successRate: number;
  gasSponsored: string;
  activeUsers: number;
  activeSessions: number;
}

interface Activity {
  id: string;
  event: string;
  timestamp: string;
  status: 'success' | 'error' | 'pending';
  description: string;
}

export default function ProjectDashboard() {
  const params = useParams();
  const router = useRouter();
  const { isConnected } = useAccount();
  const projectId = params.projectId as string;

  const [stats, setStats] = useState<ProjectStats>({
    totalRequests: 0,
    successRate: 0,
    gasSponsored: '0',
    activeUsers: 0,
    activeSessions: 0,
  });
  const [recentActivity, setRecentActivity] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isConnected) {
      router.push('/dashboard');
      return;
    }
    loadProjectData();
  }, [isConnected, projectId]);

  const loadProjectData = async () => {
    try {
      setIsLoading(true);
      
      // Mock data for now
      setStats({
        totalRequests: 1247,
        successRate: 98.4,
        gasSponsored: '2.34',
        activeUsers: 156,
        activeSessions: 43,
      });

      setRecentActivity([
        {
          id: '1',
          event: 'Smart Account Created',
          timestamp: '2 minutes ago',
          status: 'success',
          description: 'New smart account deployed for user 0x1234...5678',
        },
        {
          id: '2',
          event: 'Session Key Created',
          timestamp: '5 minutes ago',
          status: 'success',
          description: 'Session key created with 1 hour TTL',
        },
        {
          id: '3',
          event: 'Transaction Sponsored',
          timestamp: '8 minutes ago',
          status: 'success',
          description: 'NFT mint transaction sponsored (0.003 ETH)',
        },
        {
          id: '4',
          event: 'API Rate Limit Hit',
          timestamp: '12 minutes ago',
          status: 'error',
          description: 'Rate limit exceeded for API key ak_test_...abc123',
        },
      ]);
    } catch (error) {
      console.error('Failed to load project data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-6"></div>
            <div className="absolute inset-0 w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mt-2" style={{animationDirection: 'reverse'}}></div>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Loading project dashboard...</h3>
          <p className="text-gray-600">Gathering your project analytics and metrics</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
      {/* Enhanced Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-xl border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-6">
              <button
                onClick={() => router.push('/dashboard')}
                className="group w-10 h-10 bg-gray-100/80 backdrop-blur-sm hover:bg-gray-200 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 border border-gray-200/50"
              >
                <ChevronLeftIcon className="w-5 h-5 text-gray-600 group-hover:text-gray-900 group-hover:-translate-x-0.5 transition-all duration-300" />
              </button>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <SparklesIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">My First DApp</h1>
                  <p className="text-gray-600 font-medium flex items-center gap-2">
                    <ChartBarIcon className="h-4 w-4 text-blue-600" />
                    Project Dashboard
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <select className="appearance-none bg-white/80 backdrop-blur-sm border-2 border-gray-200/50 rounded-xl px-4 py-3 pr-10 text-sm font-semibold text-gray-700 hover:border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-200 focus:outline-none transition-all duration-300 shadow-sm hover:shadow-md">
                  <option>🚀 Development</option>
                  <option>🏭 Production</option>
                </select>
                <ChevronRightIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 rotate-90 pointer-events-none" />
              </div>
              <button className="group relative px-4 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-300 rounded-full animate-pulse"></div>
                <span>Live</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[
            {
              title: 'API Keys',
              description: 'Manage access tokens',
              icon: KeyIcon,
              color: 'blue',
              path: `/dashboard/${projectId}/keys`,
              badge: '2 active'
            },
            {
              title: 'Providers',
              description: 'Configure Account Abstraction',
              icon: CogIcon,
              color: 'emerald',
              path: `/dashboard/${projectId}/providers`,
              badge: 'Safe{Core}'
            },
            {
              title: 'API Playground',
              description: 'Test endpoints & flows',
              icon: BeakerIcon,
              color: 'purple',
              path: `/playground`,
              badge: 'Interactive'
            },
            {
              title: 'Analytics',
              description: 'Performance metrics',
              icon: ChartBarIcon,
              color: 'amber',
              path: `/dashboard/${projectId}/analytics`,
              badge: 'Real-time'
            }
          ].map((action, index) => {
            const Icon = action.icon;
            return (
              <button
                key={action.title}
                onClick={() => router.push(action.path)}
                className={`group relative bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-200/50 hover:shadow-2xl transition-all duration-500 hover:scale-105 text-left overflow-hidden`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Background Gradient Effect */}
                <div className={`absolute inset-0 bg-gradient-to-br from-${action.color}-500/5 to-${action.color}-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                
                <div className="relative">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-br from-${action.color}-500 to-${action.color}-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className={`px-3 py-1 bg-${action.color}-100 text-${action.color}-700 rounded-full text-xs font-semibold`}>
                      {action.badge}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-gray-800 transition-colors">
                      {action.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {action.description}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-4 text-sm font-medium text-gray-500 group-hover:text-gray-700 transition-colors">
                    <span>Open</span>
                    <ChevronRightIcon className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Enhanced Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-10">
          {[
            {
              title: 'API Requests',
              value: stats.totalRequests.toLocaleString(),
              change: '+12%',
              changeType: 'positive',
              icon: CloudIcon,
              color: 'blue',
              description: 'Total requests this week'
            },
            {
              title: 'Success Rate',
              value: `${stats.successRate}%`,
              change: '+0.2%',
              changeType: 'positive',
              icon: CheckCircleIcon,
              color: 'emerald',
              description: 'Request success rate'
            },
            {
              title: 'Gas Sponsored',
              value: `${stats.gasSponsored} ETH`,
              change: '+8%',
              changeType: 'positive',
              icon: BoltIcon,
              color: 'purple',
              description: 'Total gas coverage'
            },
            {
              title: 'Active Users',
              value: stats.activeUsers.toString(),
              change: '+15%',
              changeType: 'positive',
              icon: UserGroupIcon,
              color: 'amber',
              description: 'Unique users this week'
            },
            {
              title: 'Active Sessions',
              value: stats.activeSessions.toString(),
              change: '+3%',
              changeType: 'positive',
              icon: KeyIcon,
              color: 'rose',
              description: 'Current live sessions'
            }
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.title}
                className={`group relative bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-200/50 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 overflow-hidden`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Background Gradient Effect */}
                <div className={`absolute inset-0 bg-gradient-to-br from-${stat.color}-500/5 to-${stat.color}-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-br from-${stat.color}-500 to-${stat.color}-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className={`flex items-center gap-1 px-3 py-1 bg-${stat.changeType === 'positive' ? 'emerald' : 'red'}-100 text-${stat.changeType === 'positive' ? 'emerald' : 'red'}-700 rounded-full text-xs font-semibold`}>
                      <ArrowTrendingUpIcon className="h-3 w-3" />
                      {stat.change}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-gray-600">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900 group-hover:text-gray-800 transition-colors">
                      {stat.value}
                    </p>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      {stat.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Enhanced Recent Activity */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-gray-50 to-blue-50/50 px-8 py-6 border-b border-gray-200/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <ClockIcon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
                  <p className="text-sm text-gray-600">Latest events and transactions</p>
                </div>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                Live
              </div>
            </div>
          </div>
          
          <div className="divide-y divide-gray-200/50">
            {recentActivity.map((activity, index) => {
              const getStatusInfo = (status: string) => {
                switch(status) {
                  case 'success': return { icon: CheckCircleIcon, color: 'emerald', bg: 'emerald-100' };
                  case 'error': return { icon: ExclamationCircleIcon, color: 'red', bg: 'red-100' };
                  default: return { icon: ClockIcon, color: 'amber', bg: 'amber-100' };
                }
              };
              
              const statusInfo = getStatusInfo(activity.status);
              const StatusIcon = statusInfo.icon;
              
              return (
                <div 
                  key={activity.id} 
                  className="group px-8 py-6 hover:bg-gray-50/50 transition-all duration-300"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 bg-${statusInfo.bg} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                        <StatusIcon className={`h-5 w-5 text-${statusInfo.color}-600`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-bold text-gray-900 group-hover:text-gray-700 transition-colors">
                            {activity.event}
                          </h3>
                          <div className={`px-2 py-1 bg-${statusInfo.color}-100 text-${statusInfo.color}-700 rounded-lg text-xs font-semibold capitalize`}>
                            {activity.status}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {activity.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                      <ClockIcon className="h-4 w-4" />
                      <span>{activity.timestamp}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="bg-gradient-to-r from-gray-50 to-blue-50/50 px-8 py-6 border-t border-gray-200/50">
            <button
              onClick={() => router.push(`/dashboard/${projectId}/logs`)}
              className="group flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition-all duration-300 hover:scale-105"
            >
              <span>View all activity</span>
              <ChevronRightIcon className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}