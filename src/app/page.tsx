'use client';

import { ConnectCard } from '@/components/ConnectCard';
import { SessionBadge } from '@/components/SessionBadge';
import { TxButton } from '@/components/TxButton';
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
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up">
            <button className="btn-primary flex items-center space-x-2">
              <span>Get Started Free</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
            <button className="btn-secondary flex items-center space-x-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
              <span>Watch Demo</span>
            </button>
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
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything you need, nothing you don't
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Built for developers and users who want crypto without the complexity
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-card rounded-lg p-6 border border-border">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">No Seed Phrases</h3>
              <p className="text-muted-foreground">
                Sign in with passkeys, social accounts, or email. Your wallet, your way - no 24-word phrases to lose.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-card rounded-lg p-6 border border-border">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Gasless Transactions</h3>
              <p className="text-muted-foreground">
                We sponsor your gas fees through paymasters. Focus on what matters - we'll handle the blockchain fees.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-card rounded-lg p-6 border border-border">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Smart Account Security</h3>
              <p className="text-muted-foreground">
                ERC-4337 smart accounts with spending limits, session keys, and multi-signature support for enterprise-grade security.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-card rounded-lg p-6 border border-border">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">One-Click Actions</h3>
              <p className="text-muted-foreground">
                Execute complex transactions with a single click. Session keys enable seamless interactions without constant approvals.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-card rounded-lg p-6 border border-border">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Multi-Chain Ready</h3>
              <p className="text-muted-foreground">
                Deploy on Base, Ethereum, Polygon, and more. One account, multiple chains - true interoperability.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-card rounded-lg p-6 border border-border">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Developer Friendly</h3>
              <p className="text-muted-foreground">
                Simple SDK, comprehensive docs, and plug-and-play components. Ship Web3 features in hours, not weeks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Loved by builders worldwide
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join thousands of developers building the future of Web3
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-card rounded-lg p-6 border border-border">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full mr-3"></div>
                <div>
                  <div className="font-semibold text-foreground">Sarah Chen</div>
                  <div className="text-sm text-muted-foreground">CTO at DeFi Protocol</div>
                </div>
              </div>
              <p className="text-muted-foreground italic">
                "Finally, a solution that makes Web3 accessible to our non-crypto users. Integration took less than a day."
              </p>
              <div className="flex mt-4 text-yellow-500">
                {"★★★★★".split("").map((star, i) => (
                  <span key={i}>{star}</span>
                ))}
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-card rounded-lg p-6 border border-border">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full mr-3"></div>
                <div>
                  <div className="font-semibold text-foreground">Marcus Johnson</div>
                  <div className="text-sm text-muted-foreground">Founder at NFT Marketplace</div>
                </div>
              </div>
              <p className="text-muted-foreground italic">
                "Our conversion rate tripled after implementing gasless transactions. Game changer for user onboarding."
              </p>
              <div className="flex mt-4 text-yellow-500">
                {"★★★★★".split("").map((star, i) => (
                  <span key={i}>{star}</span>
                ))}
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-card rounded-lg p-6 border border-border">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full mr-3"></div>
                <div>
                  <div className="font-semibold text-foreground">Emily Rodriguez</div>
                  <div className="text-sm text-muted-foreground">Lead Dev at Gaming Studio</div>
                </div>
              </div>
              <p className="text-muted-foreground italic">
                "The session key feature is brilliant. Players can now play without signing every single transaction."
              </p>
              <div className="flex mt-4 text-yellow-500">
                {"★★★★★".split("").map((star, i) => (
                  <span key={i}>{star}</span>
                ))}
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
                  <span className="text-muted-foreground">Up to 100 monthly active users</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-muted-foreground">1,000 sponsored transactions</span>
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
                  <span className="text-muted-foreground">All core features</span>
                </li>
              </ul>
              <button className="w-full btn-secondary">Get Started</button>
            </div>

            {/* Pro Plan */}
            <div className="bg-card rounded-lg p-6 border-2 border-purple-600 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">Popular</span>
              </div>
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-foreground mb-2">Pro</h3>
                <div className="text-3xl font-bold text-foreground mb-1">$99<span className="text-lg font-normal text-muted-foreground">/month</span></div>
                <p className="text-muted-foreground">For growing applications</p>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-muted-foreground">Up to 10,000 monthly active users</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-muted-foreground">50,000 sponsored transactions</span>
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
                  <span className="text-muted-foreground">Advanced analytics</span>
                </li>
              </ul>
              <button className="w-full btn-primary">Start Free Trial</button>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-card rounded-lg p-6 border border-border">
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-foreground mb-2">Enterprise</h3>
                <div className="text-3xl font-bold text-foreground mb-1">Custom</div>
                <p className="text-muted-foreground">For large scale deployments</p>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-muted-foreground">Unlimited users</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-muted-foreground">Custom transaction limits</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-muted-foreground">Dedicated support team</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-muted-foreground">SLA & compliance</span>
                </li>
              </ul>
              <button className="w-full btn-secondary">Contact Sales</button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Let's build the future together
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Have questions? Want to integrate? We're here to help.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Contact Form */}
            <div className="bg-card rounded-lg p-6 border border-border">
              <h3 className="text-xl font-semibold text-foreground mb-4">Send us a message</h3>
              <form className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-purple-600"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-purple-600"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-foreground mb-1">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-purple-600"
                    placeholder="Tell us about your project..."
                  />
                </div>
                <button type="submit" className="w-full btn-primary">
                  Send Message
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              <div className="bg-card rounded-lg p-6 border border-border">
                <h3 className="text-xl font-semibold text-foreground mb-4">Get in touch</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-purple-600 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <div>
                      <div className="font-medium text-foreground">Email</div>
                      <div className="text-muted-foreground">hello@abstrak.to</div>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-purple-600 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <div>
                      <div className="font-medium text-foreground">Discord</div>
                      <div className="text-muted-foreground">Join our community</div>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-purple-600 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <div>
                      <div className="font-medium text-foreground">Documentation</div>
                      <div className="text-muted-foreground">docs.abstrak.to</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg p-6 text-white">
                <h3 className="text-xl font-semibold mb-2">Ready to ship?</h3>
                <p className="mb-4 opacity-90">
                  Join thousands of developers building the future of Web3 with our platform.
                </p>
                <button className="bg-white text-purple-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                  Start Building →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}