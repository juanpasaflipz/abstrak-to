'use client';

import Link from 'next/link';
import { useState } from 'react';
import { 
  Bars3Icon, 
  XMarkIcon, 
  SparklesIcon,
  CommandLineIcon,
  BeakerIcon,
  CurrencyDollarIcon,
  RocketLaunchIcon,
  BookOpenIcon
} from '@heroicons/react/24/outline';
import { SparklesIcon as SparklesIconSolid } from '@heroicons/react/24/solid';

export default function Header(): JSX.Element {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { 
      label: 'Features', 
      href: '#features',
      icon: SparklesIcon,
      description: 'Account abstraction features'
    },
    { 
      label: 'API Playground', 
      href: '/playground',
      icon: CommandLineIcon,
      description: 'Interactive API testing'
    },
    { 
      label: 'Recipes', 
      href: '/recipes',
      icon: BookOpenIcon,
      description: 'Code templates & examples'
    },
    { 
      label: 'Demo', 
      href: '/demo',
      icon: BeakerIcon,
      description: 'Live gasless transactions'
    },
    { 
      label: 'Pricing', 
      href: '#pricing',
      icon: CurrencyDollarIcon,
      description: 'Simple, transparent pricing'
    },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/90 border-b border-white/20 
                       shadow-lg shadow-black/5">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 w-full">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="group flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl 
                              flex items-center justify-center shadow-lg shadow-blue-500/25 
                              group-hover:shadow-xl group-hover:shadow-blue-500/30 
                              transition-all duration-300 group-hover:scale-105">
                <SparklesIconSolid className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 
                               bg-clip-text text-transparent group-hover:from-blue-600 
                               group-hover:to-indigo-600 transition-all duration-300">
                Abstrak
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center flex-shrink-0">
            <div className="ml-4 flex items-center space-x-1">
              {navItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="group relative px-2 py-2 rounded-xl text-sm font-medium 
                               text-gray-600 hover:text-gray-900 transition-all duration-200 
                               hover:bg-white/60 hover:backdrop-blur-sm hover:shadow-sm"
                  >
                    <div className="flex items-center space-x-1.5">
                      <IconComponent className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                      <span className="whitespace-nowrap">{item.label}</span>
                    </div>
                    
                    {/* Hover tooltip */}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 
                                    opacity-0 group-hover:opacity-100 transition-opacity duration-200 
                                    pointer-events-none z-[100]">
                      <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 
                                      whitespace-nowrap shadow-xl">
                        {item.description}
                        <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 
                                        w-2 h-2 bg-gray-900 rotate-45"></div>
                      </div>
                    </div>
                  </Link>
                );
              })}
              
              {/* CTA Buttons */}
              <div className="ml-2 pl-2 border-l border-gray-200/50 flex items-center space-x-2">
                <Link
                  href="/onboarding"
                  className="group relative overflow-hidden bg-gradient-to-r from-purple-600 to-pink-600 
                             hover:from-purple-700 hover:to-pink-700 text-white font-semibold 
                             px-3 py-2 rounded-xl shadow-lg shadow-purple-500/25 
                             hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-300"
                >
                  <div className="relative flex items-center space-x-1">
                    <SparklesIcon className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                    <span className="whitespace-nowrap text-sm">Tutorial</span>
                  </div>
                </Link>
                
                <Link
                  href="/dashboard"
                  className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 
                             hover:from-blue-700 hover:to-indigo-700 text-white font-semibold 
                             px-4 py-2 rounded-xl shadow-lg shadow-blue-500/25 
                             hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300"
                >
                  {/* Button background animation */}
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 
                                  translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                  
                  <div className="relative flex items-center space-x-2">
                    <RocketLaunchIcon className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                    <span className="whitespace-nowrap">Get Started</span>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* Medium screen navigation - simplified */}
          <div className="hidden md:flex lg:hidden items-center space-x-1">
            <Link
              href="/demo"
              className="group relative px-2 py-2 rounded-xl text-sm font-medium 
                         text-gray-600 hover:text-gray-900 transition-all duration-200 
                         hover:bg-white/60 hover:backdrop-blur-sm hover:shadow-sm"
            >
              <div className="flex items-center space-x-1">
                <BeakerIcon className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                <span className="hidden sm:inline">Demo</span>
              </div>
            </Link>
            
            {/* CTA Button */}
            <Link
              href="/dashboard"
              className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 
                         hover:from-blue-700 hover:to-indigo-700 text-white font-semibold 
                         px-3 py-2 rounded-xl shadow-lg shadow-blue-500/25 
                         hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 ml-2"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 
                              translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              
              <div className="relative flex items-center space-x-1">
                <RocketLaunchIcon className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                <span className="hidden sm:inline">Start</span>
                <span className="sm:hidden">•</span>
              </div>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="group relative p-2 rounded-xl text-gray-600 hover:text-gray-900 
                         hover:bg-white/60 hover:backdrop-blur-sm transition-all duration-200 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-expanded={isMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6 
                                     group-hover:scale-110 transition-transform duration-200`} />
              <XMarkIcon className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6 
                                     group-hover:scale-110 transition-transform duration-200`} />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden transition-all duration-300`}>
          <div className="px-2 pt-4 pb-6 space-y-2">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className="group flex items-center space-x-3 px-4 py-3 rounded-xl 
                             text-gray-600 hover:text-gray-900 hover:bg-white/60 
                             hover:backdrop-blur-sm transition-all duration-200 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <IconComponent className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                  <div>
                    <div className="font-medium">{item.label}</div>
                    <div className="text-xs text-gray-500">{item.description}</div>
                  </div>
                </Link>
              );
            })}
            
            {/* Mobile CTA */}
            <div className="pt-4 mt-4 border-t border-gray-200/50">
              <Link
                href="/dashboard"
                className="group flex items-center justify-center space-x-2 w-full 
                           bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 
                           text-white font-semibold px-4 py-3 rounded-xl shadow-lg shadow-blue-500/25 
                           hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                <RocketLaunchIcon className="w-5 h-5" />
                <span>Get Started</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}