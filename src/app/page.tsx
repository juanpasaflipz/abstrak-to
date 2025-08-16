'use client';

import Link from 'next/link';
import { ConnectCard } from '@/components/ConnectCard';
import { SessionBadge } from '@/components/SessionBadge';
import { TxButton } from '@/components/TxButton';
// Navigation components removed - using main Header from layout
import { useAccount, useBalance } from 'wagmi';
import { useState, useEffect } from 'react';
import { getSmartAccountAddress } from '@/lib/aa';
import { 
  ShieldCheckIcon,
  BoltIcon,
  KeyIcon,
  RocketLaunchIcon,
  CommandLineIcon,
  CurrencyDollarIcon,
  CheckIcon,
  ArrowRightIcon,
  SparklesIcon as SparklesIconOutline
} from '@heroicons/react/24/outline';
import { 
  SparklesIcon,
  StarIcon,
  HeartIcon
} from '@heroicons/react/24/solid';

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
      {/* Hero Section */}
      <section className="relative py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-indigo-50/30 to-purple-50/50" />
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-indigo-400/10 
                        rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-gradient-to-br from-purple-400/10 to-pink-400/10 
                        rounded-full blur-3xl" />
        
        <div className="relative z-10 container mx-auto text-center">
          {/* Hero Badge */}
          <div className="inline-flex items-center space-x-2 bg-white/60 backdrop-blur-sm 
                          border border-blue-200/50 rounded-full px-6 py-3 mb-8 
                          shadow-lg shadow-blue-100/50 animate-fade-in">
            <SparklesIcon className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">Powered by ERC-4337 Account Abstraction</span>
          </div>
          
          {/* Main Headline */}
          <h1 className="text-6xl md:text-8xl font-bold mb-8 animate-fade-in">
            <span className="text-gray-900">One-click crypto for</span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 
                             bg-clip-text text-transparent">
              everyone
            </span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-2xl text-gray-600 max-w-4xl mx-auto mb-12 leading-relaxed animate-slide-up">
            No seed phrases. <span className="font-semibold text-indigo-600"> Gas on us. </span> 
            Built on the future of Web3 with smart accounts that just work.
          </p>
          
          {/* Hero CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16 animate-slide-up">
            <Link 
              href="/demo"
              className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 
                         hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-lg 
                         px-8 py-4 rounded-2xl shadow-xl shadow-blue-500/25 
                         hover:shadow-2xl hover:shadow-blue-500/40 transition-all duration-300"
            >
              {/* Button background animation */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 
                              translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              
              <div className="relative flex items-center space-x-3">
                <RocketLaunchIcon className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" />
                <span>Try Live Demo</span>
                <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
              </div>
            </Link>
            
            <Link 
              href="/playground"
              className="group flex items-center space-x-3 text-lg font-semibold text-gray-700 
                         hover:text-gray-900 transition-colors duration-200"
            >
              <CommandLineIcon className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" />
              <span>API Playground</span>
              <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
          </div>
          
          {/* Trust Indicators */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-6 sm:space-y-0 sm:space-x-12 
                          text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <ShieldCheckIcon className="w-5 h-5 text-green-500" />
              <span>Audited & Secure</span>
            </div>
            <div className="flex items-center space-x-2">
              <BoltIcon className="w-5 h-5 text-yellow-500" />
              <span>Production Ready</span>
            </div>
            <div className="flex items-center space-x-2">
              <HeartIcon className="w-5 h-5 text-red-500" />
              <span>Developer Friendly</span>
            </div>
          </div>
        </div>
      </section>

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
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-slate-100">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-white/60 backdrop-blur-sm 
                            border border-gray-200/50 rounded-full px-6 py-3 mb-6">
              <StarIcon className="w-5 h-5 text-orange-500" />
              <span className="text-sm font-medium text-gray-700">Why Choose Account Abstraction?</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                The Future of Web3
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Experience seamless, secure, and user-friendly transactions that eliminate Web3's biggest barriers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Feature 1 */}
            <div className="group relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 
                            border border-blue-200/50 rounded-3xl p-8 text-center 
                            transition-all duration-300 hover:shadow-2xl hover:shadow-blue-200/50 
                            hover:-translate-y-2">
              {/* Background decoration */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/10" />
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-blue-400/10 to-indigo-400/10 
                              rounded-full blur-xl" />
              
              <div className="relative z-10">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl 
                                flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-500/25 
                                group-hover:scale-110 transition-transform duration-300">
                  <ShieldCheckIcon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">No Seed Phrases</h3>
                <p className="text-gray-600 leading-relaxed">
                  Users never see or handle private keys. Smart accounts provide enterprise-grade security 
                  with consumer-friendly simplicity.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="group relative overflow-hidden bg-gradient-to-br from-green-50 to-emerald-100 
                            border border-green-200/50 rounded-3xl p-8 text-center 
                            transition-all duration-300 hover:shadow-2xl hover:shadow-green-200/50 
                            hover:-translate-y-2">
              {/* Background decoration */}
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/10" />
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-green-400/10 to-emerald-400/10 
                              rounded-full blur-xl" />
              
              <div className="relative z-10">
                <div className="w-20 h-20 bg-gradient-to-br from-green-600 to-emerald-700 rounded-3xl 
                                flex items-center justify-center mx-auto mb-6 shadow-xl shadow-green-500/25 
                                group-hover:scale-110 transition-transform duration-300">
                  <BoltIcon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Gasless Transactions</h3>
                <p className="text-gray-600 leading-relaxed">
                  We sponsor gas fees so users can interact with dApps without ETH, 
                  removing the biggest friction point in Web3.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="group relative overflow-hidden bg-gradient-to-br from-purple-50 to-violet-100 
                            border border-purple-200/50 rounded-3xl p-8 text-center 
                            transition-all duration-300 hover:shadow-2xl hover:shadow-purple-200/50 
                            hover:-translate-y-2">
              {/* Background decoration */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-violet-500/10" />
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-purple-400/10 to-violet-400/10 
                              rounded-full blur-xl" />
              
              <div className="relative z-10">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-violet-700 rounded-3xl 
                                flex items-center justify-center mx-auto mb-6 shadow-xl shadow-purple-500/25 
                                group-hover:scale-110 transition-transform duration-300">
                  <KeyIcon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Session Keys</h3>
                <p className="text-gray-600 leading-relaxed">
                  Temporary permissions with spending limits enable one-click experiences 
                  while maintaining maximum security.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* API Playground Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-50 to-purple-100">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-white/60 backdrop-blur-sm 
                            border border-indigo-200/50 rounded-full px-6 py-3 mb-6">
              <CommandLineIcon className="w-5 h-5 text-indigo-600" />
              <span className="text-sm font-medium text-gray-700">Developer Experience</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Try It Now
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Test our Account Abstraction API endpoints in real-time with our interactive playground
            </p>
          </div>
          
          <div className="max-w-5xl mx-auto">
            <div className="relative overflow-hidden bg-gradient-to-br from-white to-indigo-50 
                            border border-indigo-200/50 rounded-3xl p-12 text-center 
                            shadow-2xl shadow-indigo-200/50">
              {/* Background decoration */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/10" />
              <div className="absolute -top-12 -right-12 w-48 h-48 bg-gradient-to-br from-indigo-400/10 to-purple-400/10 
                              rounded-full blur-3xl" />
              <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-gradient-to-br from-purple-400/10 to-pink-400/10 
                              rounded-full blur-3xl" />
              
              <div className="relative z-10">
                <div className="w-24 h-24 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl 
                                flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-indigo-500/30">
                  <span className="text-4xl">🧪</span>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-6">
                  Interactive API Playground
                </h3>
                <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
                  Explore all our ERC-4337 endpoints, test with real data, and see responses in real-time. 
                  Perfect for developers, integrators, and anyone curious about Account Abstraction.
                </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                  <Link 
                    href="/playground" 
                    className="group relative overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-600 
                               hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-lg 
                               px-8 py-4 rounded-2xl shadow-xl shadow-indigo-500/25 
                               hover:shadow-2xl hover:shadow-indigo-500/40 transition-all duration-300"
                  >
                    {/* Button background animation */}
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 
                                    translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                    
                    <div className="relative flex items-center space-x-3">
                      <CommandLineIcon className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" />
                      <span>Open Playground</span>
                      <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                    </div>
                  </Link>
                  
                  <Link 
                    href="/demo" 
                    className="group flex items-center space-x-3 text-lg font-semibold text-gray-700 
                               hover:text-gray-900 transition-colors duration-200"
                  >
                    <RocketLaunchIcon className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" />
                    <span>View Live Demo</span>
                    <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                  </Link>
                </div>
                
                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                      <CheckIcon className="w-6 h-6 text-green-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-1">Real-time Testing</h4>
                    <p className="text-sm text-gray-600">Live API endpoints</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                      <SparklesIconOutline className="w-6 h-6 text-blue-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-1">Interactive UI</h4>
                    <p className="text-sm text-gray-600">Easy to use interface</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                      <CommandLineIcon className="w-6 h-6 text-purple-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-1">Full Documentation</h4>
                    <p className="text-sm text-gray-600">Complete API reference</p>
                  </div>
                </div>
              </div>
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