'use client';

import Link from 'next/link';
import { ConnectCard } from '@/components/ConnectCard';
import { SessionBadge } from '@/components/SessionBadge';
import { TxButton } from '@/components/TxButton';
import { Navigation, ProminentNavigation } from '@/components/portal/Navigation';
import { useAccount, useBalance } from 'wagmi';
import { useState, useEffect } from 'react';
import { getSmartAccountAddress } from '@/lib/aa';

export default function Home() {
  const { address, isConnected } = useAccount();
  const [smartAccountAddress, setSmartAccountAddress] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { data: balance } = useBalance({
    address: smartAccountAddress as `0x${string}`,
  });

  useEffect(() => {
    if (isConnected && address) {
      initializeSmartAccount();
    }
  }, [isConnected, address]);

  const initializeSmartAccount = async () => {
    if (!address) return;
    
    setIsLoading(true);
    try {
      const smartAddress = await getSmartAccountAddress(address);
      setSmartAccountAddress(smartAddress);
      localStorage.setItem('smartAccountAddress', smartAddress);
    } catch (error) {
      console.error('Failed to initialize smart account:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 animate-fade-in">
            One-click crypto for{' '}
            <span className="gradient-text">everyone</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8 animate-slide-up">
            No seed phrases. Gas on us. Built on ERC-4337 smart accounts.
          </p>
        </div>
      </section>

      {/* Prominent Navigation Section */}
      <ProminentNavigation />

      {/* Dashboard UI Section */}
      <section className="px-4 sm:px-6 lg:px-8 pb-20">
        <div className="container mx-auto">
          <div className="bg-muted/30 rounded-2xl p-8 border border-border">
            <div className="bg-card rounded-xl p-6 shadow-lg border border-border">
              {/* Dashboard Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-card-foreground">Smart Account Dashboard</h2>
                <div className="flex items-center space-x-2">
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                  <span className="text-sm text-muted-foreground">Connected</span>
                </div>
              </div>

              {/* Smart Account Status */}
              {smartAccountAddress && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center mb-6">
                  <div className="text-sm text-green-800 mb-2">Smart Account Active</div>
                  <div className="text-xs text-green-700 font-mono break-all">
                    {smartAccountAddress.slice(0, 6)}...{smartAccountAddress.slice(-4)}
                  </div>
                  {balance && (
                    <div className="text-sm text-green-800 mt-2">
                      Balance: {balance.formatted} {balance.symbol}
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="card">
                  <h3 className="text-lg font-semibold mb-4">Smart Wallet</h3>
                  <ConnectCard />
                  
                  {isLoading && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-blue-700">Creating your smart account...</p>
                    </div>
                  )}
                </div>

                <div className="card">
                  <h3 className="text-lg font-semibold mb-4">Session & Actions</h3>
                  <SessionBadge />
                  
                  <div className="mt-6 space-y-3">
                    <TxButton 
                      action="mintNFT" 
                      label="Mint Test NFT"
                      className="w-full"
                    />
                    <TxButton 
                      action="incrementCounter" 
                      label="Increment Counter"
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Spending Limits Info */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border border-border rounded-lg bg-muted/30">
                  <h3 className="font-medium mb-2">Daily Cap: 0.01 ETH</h3>
                  <p className="text-sm text-muted-foreground">
                    Try spending more than the daily limit to see the policy in action
                  </p>
                </div>
                <div className="p-4 border border-border rounded-lg bg-muted/30">
                  <h3 className="font-medium mb-2">Session Scope</h3>
                  <p className="text-sm text-muted-foreground">
                    Limited to specific contracts and methods for security
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Account Abstraction?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experience the future of Web3 with seamless, secure, and user-friendly transactions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-card rounded-lg p-6 border border-border text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">No Seed Phrases</h3>
              <p className="text-muted-foreground">
                Users never see or handle private keys. Smart accounts handle everything securely.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-card rounded-lg p-6 border border-border text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Gasless Transactions</h3>
              <p className="text-muted-foreground">
                We cover gas fees so users can interact with dApps without worrying about transaction costs.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-card rounded-lg p-6 border border-border text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Session Keys</h3>
              <p className="text-muted-foreground">
                Temporary permissions for specific actions, enhancing security and user experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* API Playground Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              🚀 Try It Now
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Test our Account Abstraction API endpoints in real-time with our interactive playground
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="bg-card rounded-lg p-8 border border-border text-center">
              <div className="text-6xl mb-6">🧪</div>
              <h3 className="text-2xl font-bold text-foreground mb-4">
                Interactive API Playground
              </h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Explore all our ERC-4337 endpoints, test with real data, and see responses in real-time. 
                Perfect for developers and integrators.
              </p>
              <Link 
                href="/playground" 
                className="btn-primary inline-flex items-center space-x-2"
              >
                <span>Open Playground</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Start free, scale as you grow. No hidden fees.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Starter Plan */}
            <div className="bg-card rounded-lg p-6 border border-border">
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-foreground mb-2">Starter</h3>
                <div className="text-3xl font-bold text-foreground mb-1">Free</div>
                <p className="text-muted-foreground">Perfect for side projects</p>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-muted-foreground">1,000 transactions/month</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-muted-foreground">Basic support</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-muted-foreground">Core features</span>
                </li>
              </ul>
              <button className="w-full btn-secondary">Get Started</button>
            </div>

            {/* Pro Plan */}
            <div className="bg-card rounded-lg p-6 border border-border border-purple-600 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">Most Popular</span>
              </div>
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-foreground mb-2">Pro</h3>
                <div className="text-3xl font-bold text-foreground mb-1">$99<span className="text-lg text-muted-foreground">/month</span></div>
                <p className="text-muted-foreground">For growing businesses</p>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-muted-foreground">100,000 transactions/month</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-muted-foreground">Priority support</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-muted-foreground">Advanced features</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-muted-foreground">Custom policies</span>
                </li>
              </ul>
              <button className="w-full btn-primary">Start Pro</button>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-card rounded-lg p-6 border border-border">
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-foreground mb-2">Enterprise</h3>
                <div className="text-3xl font-bold text-foreground mb-1">Custom</div>
                <p className="text-muted-foreground">For large organizations</p>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-muted-foreground">Unlimited transactions</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-muted-foreground">24/7 support</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-muted-foreground">Custom integrations</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-muted-foreground">Dedicated account manager</span>
                </li>
              </ul>
              <button className="w-full btn-secondary">Contact Sales</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}