'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useAccount } from 'wagmi';

export function Navigation() {
  const router = useRouter();
  const pathname = usePathname();
  const { isConnected } = useAccount();

  const isActive = (path: string) => pathname.startsWith(path);

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <button
              onClick={() => router.push('/')}
              className="text-xl font-bold text-gray-900"
            >
              Abstrak-to
            </button>
            
            <div className="flex space-x-6">
              <button
                onClick={() => router.push('/')}
                className={`text-sm font-medium ${
                  pathname === '/' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Home
              </button>
              
              <button
                onClick={() => router.push('/demo')}
                className={`text-sm font-medium ${
                  isActive('/demo') ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Demo
              </button>
              
              <button
                onClick={() => router.push('/playground')}
                className={`text-sm font-medium ${
                  isActive('/playground') ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                API Playground
              </button>
              
              {isConnected && (
                <button
                  onClick={() => router.push('/dashboard')}
                  className={`text-sm font-medium ${
                    isActive('/dashboard') ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Developer Portal
                </button>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {!isConnected && (
              <button
                onClick={() => router.push('/dashboard')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                Developer Portal
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

// New component for the prominent navigation under hero section
export function ProminentNavigation() {
  const router = useRouter();
  const pathname = usePathname();
  const { isConnected } = useAccount();

  const isActive = (path: string) => pathname.startsWith(path);

  const navItems = [
    { label: 'Home', path: '/', icon: '🏠' },
    { label: 'Demo', path: '/demo', icon: '🎮' },
    { label: 'API Playground', path: '/playground', icon: '🧪' },
    ...(isConnected ? [{ label: 'Developer Portal', path: '/dashboard', icon: '⚙️' }] : [])
  ];

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-purple-50 to-blue-50">
      <div className="container mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            Explore Our Platform
          </h2>
          <p className="text-muted-foreground">
            Choose your path to start building with Account Abstraction
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              className={`group relative p-6 bg-card rounded-xl border border-border hover:border-purple-300 hover:shadow-lg transition-all duration-200 ${
                isActive(item.path) 
                  ? 'border-purple-500 bg-purple-50 shadow-lg' 
                  : 'hover:bg-purple-50'
              }`}
            >
              <div className="text-center">
                <div className={`text-4xl mb-3 transition-transform group-hover:scale-110 ${
                  isActive(item.path) ? 'animate-pulse' : ''
                }`}>
                  {item.icon}
                </div>
                <h3 className={`font-semibold text-lg mb-2 ${
                  isActive(item.path) ? 'text-purple-700' : 'text-foreground'
                }`}>
                  {item.label}
                </h3>
                <div className={`text-sm ${
                  isActive(item.path) ? 'text-purple-600' : 'text-muted-foreground'
                }`}>
                  {item.path === '/' && 'Main landing page'}
                  {item.path === '/demo' && 'Interactive demo experience'}
                  {item.path === '/playground' && 'Test API endpoints'}
                  {item.path === '/dashboard' && 'Developer tools & analytics'}
                </div>
              </div>
              
              {isActive(item.path) && (
                <div className="absolute -top-2 -right-2">
                  <div className="w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                </div>
              )}
            </button>
          ))}
        </div>
        
        {!isConnected && (
          <div className="text-center mt-8">
            <button
              onClick={() => router.push('/dashboard')}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              🚀 Access Developer Portal
            </button>
          </div>
        )}
      </div>
    </section>
  );
}