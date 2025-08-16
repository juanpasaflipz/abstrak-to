'use client';

import { useState, useEffect } from 'react';
import {
  BookOpenIcon,
  DocumentDuplicateIcon,
  CheckIcon,
  MagnifyingGlassIcon,
  TagIcon,
  ClockIcon,
  StarIcon,
  CodeBracketIcon,
  CubeIcon,
  GlobeAltIcon,
  BoltIcon,
  ShieldCheckIcon,
  ArrowTopRightOnSquareIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import { SparklesIcon } from '@heroicons/react/24/solid';

interface Recipe {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  tags: string[];
  codeSnippets: {
    language: string;
    title: string;
    code: string;
  }[];
  steps: string[];
  provider: 'safe' | 'alchemy' | 'biconomy' | 'all';
  useCase: string;
  demoUrl?: string;
  featured: boolean;
}

interface RecipesLibraryProps {
  projectId?: string;
}

export function RecipesLibrary({ projectId }: RecipesLibraryProps) {
  const [recipes, setRecipes] = useState<Recipe[]>([
    {
      id: '1',
      title: 'Gasless NFT Minting',
      description: 'Enable users to mint NFTs without holding ETH for gas fees. Perfect for onboarding new Web3 users.',
      category: 'NFT',
      difficulty: 'beginner',
      estimatedTime: '30 minutes',
      tags: ['gasless', 'nft', 'minting', 'paymaster'],
      provider: 'all',
      useCase: 'Allow users to mint NFTs without gas fees using session keys and paymaster sponsorship',
      featured: true,
      steps: [
        'Set up smart account for user',
        'Create session key with NFT contract permissions',
        'Configure paymaster policy for minting',
        'Execute gasless mint transaction',
        'Verify NFT ownership'
      ],
      codeSnippets: [
        {
          language: 'typescript',
          title: 'Frontend Integration',
          code: `// Create smart account and session
const account = await createSmartAccount(userAddress);
const session = await createSession({
  account: account.address,
  allowedTargets: [NFT_CONTRACT_ADDRESS],
  allowedMethods: ['mint(address)'],
  spendingLimit: parseEther('0.01'),
  duration: 3600 // 1 hour
});

// Execute gasless mint
const txHash = await executeUserOp({
  to: NFT_CONTRACT_ADDRESS,
  data: encodeFunctionData({
    abi: nftAbi,
    functionName: 'mint',
    args: [userAddress]
  }),
  sessionKey: session.privateKey
});`
        },
        {
          language: 'solidity',
          title: 'NFT Contract',
          code: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract GaslessNFT is ERC721, Ownable {
    uint256 private _tokenCounter;
    
    constructor() ERC721("GaslessNFT", "GNFT") {
        _tokenCounter = 0;
    }
    
    function mint(address to) public {
        uint256 tokenId = _tokenCounter;
        _tokenCounter += 1;
        _safeMint(to, tokenId);
    }
}`
        }
      ]
    },
    {
      id: '2',
      title: 'One-Click Token Swaps',
      description: 'Enable seamless token swaps with session keys, eliminating the need for multiple transaction approvals.',
      category: 'DeFi',
      difficulty: 'intermediate',
      estimatedTime: '45 minutes',
      tags: ['defi', 'swap', 'session-keys', 'uniswap'],
      provider: 'all',
      useCase: 'Allow users to perform token swaps with a single click using pre-authorized session keys',
      featured: true,
      steps: [
        'Deploy smart account',
        'Set up session key with DEX permissions',
        'Configure spending limits',
        'Execute swap transaction',
        'Monitor transaction status'
      ],
      codeSnippets: [
        {
          language: 'typescript',
          title: 'Swap Implementation',
          code: `// Setup session for Uniswap V3
const sessionKey = await createSession({
  account: smartAccount.address,
  allowedTargets: [
    UNISWAP_ROUTER_ADDRESS,
    USDC_TOKEN_ADDRESS,
    WETH_TOKEN_ADDRESS
  ],
  allowedMethods: [
    'exactInputSingle((address,address,uint24,address,uint256,uint256,uint256,uint160))',
    'approve(address,uint256)'
  ],
  spendingLimit: parseEther('1'), // 1 ETH spending limit
  duration: 7200 // 2 hours
});

// Execute swap
const swapParams = {
  tokenIn: USDC_TOKEN_ADDRESS,
  tokenOut: WETH_TOKEN_ADDRESS,
  fee: 3000,
  recipient: smartAccount.address,
  deadline: Math.floor(Date.now() / 1000) + 1800,
  amountIn: parseUnits('100', 6), // 100 USDC
  amountOutMinimum: 0,
  sqrtPriceLimitX96: 0
};

const txHash = await executeUserOp({
  to: UNISWAP_ROUTER_ADDRESS,
  data: encodeFunctionData({
    abi: uniswapV3RouterAbi,
    functionName: 'exactInputSingle',
    args: [swapParams]
  }),
  sessionKey: sessionKey.privateKey
});`
        }
      ]
    },
    {
      id: '3',
      title: 'Multi-Signature Wallet',
      description: 'Create a secure multi-signature wallet using Safe smart accounts with gasless execution.',
      category: 'Security',
      difficulty: 'advanced',
      estimatedTime: '90 minutes',
      tags: ['multisig', 'safe', 'security', 'governance'],
      provider: 'safe',
      useCase: 'Deploy and manage a multi-signature wallet for team funds with gasless proposal execution',
      featured: false,
      steps: [
        'Deploy Safe multi-sig wallet',
        'Configure signers and threshold',
        'Create gasless execution module',
        'Submit and execute proposals',
        'Monitor wallet activity'
      ],
      codeSnippets: [
        {
          language: 'typescript',
          title: 'Safe Deployment',
          code: `// Deploy Safe with multiple owners
const safeAccountConfig = {
  owners: [
    '0x1234567890123456789012345678901234567890',
    '0x2345678901234567890123456789012345678901',
    '0x3456789012345678901234567890123456789012'
  ],
  threshold: 2, // 2 of 3 signatures required
  saltNonce: Date.now().toString()
};

const safeSdk = await Safe.create({
  ethAdapter,
  safeAccountConfig
});

// Create proposal transaction
const safeTransaction = await safeSdk.createTransaction({
  to: recipient,
  value: parseEther('0.1'),
  data: '0x'
});

// Sign and execute
const signedTx = await safeSdk.signTransaction(safeTransaction);
const executeTxResponse = await safeSdk.executeTransaction(signedTx);`
        }
      ]
    },
    {
      id: '4',
      title: 'Subscription Payments',
      description: 'Implement recurring subscription payments using session keys with automatic renewals.',
      category: 'Payments',
      difficulty: 'intermediate',
      estimatedTime: '60 minutes',
      tags: ['subscriptions', 'recurring', 'automation', 'payments'],
      provider: 'all',
      useCase: 'Enable automatic recurring payments for subscriptions without requiring user interaction',
      featured: true,
      steps: [
        'Create subscription smart contract',
        'Set up session key for recurring payments',
        'Configure payment schedule',
        'Implement automatic execution',
        'Handle subscription lifecycle'
      ],
      codeSnippets: [
        {
          language: 'solidity',
          title: 'Subscription Contract',
          code: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract SubscriptionManager {
    struct Subscription {
        address subscriber;
        address token;
        uint256 amount;
        uint256 interval;
        uint256 lastPayment;
        bool active;
    }
    
    mapping(uint256 => Subscription) public subscriptions;
    uint256 public nextSubscriptionId;
    
    event SubscriptionCreated(uint256 indexed id, address subscriber);
    event PaymentProcessed(uint256 indexed id, uint256 amount);
    
    function createSubscription(
        address token,
        uint256 amount,
        uint256 interval
    ) external returns (uint256) {
        uint256 id = nextSubscriptionId++;
        subscriptions[id] = Subscription({
            subscriber: msg.sender,
            token: token,
            amount: amount,
            interval: interval,
            lastPayment: block.timestamp,
            active: true
        });
        
        emit SubscriptionCreated(id, msg.sender);
        return id;
    }
    
    function processPayment(uint256 subscriptionId) external {
        Subscription storage sub = subscriptions[subscriptionId];
        require(sub.active, "Subscription not active");
        require(
            block.timestamp >= sub.lastPayment + sub.interval,
            "Payment not due"
        );
        
        IERC20(sub.token).transferFrom(
            sub.subscriber,
            address(this),
            sub.amount
        );
        
        sub.lastPayment = block.timestamp;
        emit PaymentProcessed(subscriptionId, sub.amount);
    }
}`
        },
        {
          language: 'typescript',
          title: 'Session Key Setup',
          code: `// Create long-term session for subscription payments
const subscriptionSession = await createSession({
  account: smartAccount.address,
  allowedTargets: [
    SUBSCRIPTION_CONTRACT_ADDRESS,
    USDC_TOKEN_ADDRESS
  ],
  allowedMethods: [
    'processPayment(uint256)',
    'approve(address,uint256)'
  ],
  spendingLimit: parseUnits('1000', 6), // 1000 USDC limit
  duration: 30 * 24 * 3600, // 30 days
  recurring: true
});

// Setup automated payment execution
const subscriptionId = await createSubscription({
  token: USDC_TOKEN_ADDRESS,
  amount: parseUnits('10', 6), // $10 monthly
  interval: 30 * 24 * 3600 // 30 days
});

// Schedule recurring execution
scheduleRecurringPayment(subscriptionId, subscriptionSession);`
        }
      ]
    },
    {
      id: '5',
      title: 'DAO Voting with Gasless Execution',
      description: 'Enable DAO members to vote and execute proposals without gas fees using delegated execution.',
      category: 'Governance',
      difficulty: 'advanced',
      estimatedTime: '120 minutes',
      tags: ['dao', 'governance', 'voting', 'delegation'],
      provider: 'all',
      useCase: 'Allow DAO members to participate in governance without holding ETH for gas fees',
      featured: false,
      steps: [
        'Deploy governance contract',
        'Set up voting session keys',
        'Create proposal submission flow',
        'Implement gasless voting',
        'Execute approved proposals'
      ],
      codeSnippets: [
        {
          language: 'typescript',
          title: 'Gasless Voting',
          code: `// Create voting session for DAO member
const votingSession = await createSession({
  account: memberSmartAccount.address,
  allowedTargets: [DAO_GOVERNOR_ADDRESS],
  allowedMethods: [
    'castVote(uint256,uint8)',
    'castVoteWithReason(uint256,uint8,string)'
  ],
  spendingLimit: parseEther('0.01'), // Small limit for gas
  duration: 7 * 24 * 3600 // 7 days
});

// Submit gasless vote
const proposalId = 1;
const support = 1; // 1 = For, 0 = Against, 2 = Abstain
const reason = "This proposal will benefit the ecosystem";

const txHash = await executeUserOp({
  to: DAO_GOVERNOR_ADDRESS,
  data: encodeFunctionData({
    abi: governorAbi,
    functionName: 'castVoteWithReason',
    args: [proposalId, support, reason]
  }),
  sessionKey: votingSession.privateKey
});`
        }
      ]
    },
    {
      id: '6',
      title: 'Cross-Chain Asset Bridge',
      description: 'Bridge assets between chains using account abstraction for seamless user experience.',
      category: 'Cross-Chain',
      difficulty: 'advanced',
      estimatedTime: '150 minutes',
      tags: ['bridge', 'cross-chain', 'assets', 'l2'],
      provider: 'all',
      useCase: 'Enable users to bridge assets between different chains without managing gas on multiple networks',
      featured: false,
      steps: [
        'Deploy bridge contracts',
        'Set up cross-chain session keys',
        'Configure bridge parameters',
        'Execute cross-chain transfers',
        'Monitor bridge status'
      ],
      codeSnippets: [
        {
          language: 'typescript',
          title: 'Cross-Chain Bridge',
          code: `// Setup bridge session on source chain
const bridgeSession = await createSession({
  account: smartAccount.address,
  allowedTargets: [
    BRIDGE_CONTRACT_ADDRESS,
    TOKEN_ADDRESS
  ],
  allowedMethods: [
    'bridgeToken(address,uint256,uint256)',
    'approve(address,uint256)'
  ],
  spendingLimit: parseEther('10'),
  duration: 3600 // 1 hour
});

// Execute bridge transaction
const bridgeTx = await executeUserOp({
  to: BRIDGE_CONTRACT_ADDRESS,
  data: encodeFunctionData({
    abi: bridgeAbi,
    functionName: 'bridgeToken',
    args: [
      TOKEN_ADDRESS,
      parseEther('1'), // Amount to bridge
      137 // Polygon chain ID
    ]
  }),
  sessionKey: bridgeSession.privateKey
});

// Monitor bridge completion
const bridgeStatus = await monitorBridge(bridgeTx.hash);`
        }
      ]
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedProvider, setSelectedProvider] = useState('all');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const categories = ['all', 'NFT', 'DeFi', 'Security', 'Payments', 'Governance', 'Cross-Chain'];
  const difficulties = ['all', 'beginner', 'intermediate', 'advanced'];
  const providers = ['all', 'safe', 'alchemy', 'biconomy'];

  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         recipe.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         recipe.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || recipe.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || recipe.difficulty === selectedDifficulty;
    const matchesProvider = selectedProvider === 'all' || recipe.provider === selectedProvider || recipe.provider === 'all';

    return matchesSearch && matchesCategory && matchesDifficulty && matchesProvider;
  });

  const featuredRecipes = filteredRecipes.filter(recipe => recipe.featured);
  const regularRecipes = filteredRecipes.filter(recipe => !recipe.featured);

  const copyCode = async (code: string, snippetId: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(snippetId);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (error) {
      console.error('Failed to copy code:', error);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'green';
      case 'intermediate': return 'yellow';
      case 'advanced': return 'red';
      default: return 'gray';
    }
  };

  const getProviderColor = (provider: string) => {
    switch (provider) {
      case 'safe': return 'emerald';
      case 'alchemy': return 'blue';
      case 'biconomy': return 'purple';
      default: return 'gray';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 py-8">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl flex items-center justify-center shadow-lg">
              <BookOpenIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Recipes Library
              </h1>
              <p className="text-gray-600 font-medium">Pre-built templates and code snippets for common Account Abstraction use cases</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Search and Filters */}
        <div className="mb-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search recipes..."
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-200 focus:outline-none transition-all duration-300"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-200 focus:outline-none transition-all duration-300"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>

            {/* Difficulty Filter */}
            <div>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-200 focus:outline-none transition-all duration-300"
              >
                {difficulties.map(difficulty => (
                  <option key={difficulty} value={difficulty}>
                    {difficulty === 'all' ? 'All Levels' : difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Provider Filter */}
            <div>
              <select
                value={selectedProvider}
                onChange={(e) => setSelectedProvider(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-200 focus:outline-none transition-all duration-300"
              >
                {providers.map(provider => (
                  <option key={provider} value={provider}>
                    {provider === 'all' ? 'All Providers' : provider.charAt(0).toUpperCase() + provider.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredRecipes.length} of {recipes.length} recipes
          </div>
        </div>

        {/* Featured Recipes */}
        {featuredRecipes.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <SparklesIcon className="h-6 w-6 text-yellow-500" />
              <h2 className="text-2xl font-bold text-gray-900">Featured Recipes</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {featuredRecipes.map((recipe) => (
                <RecipeCard 
                  key={recipe.id} 
                  recipe={recipe} 
                  copyCode={copyCode} 
                  copiedCode={copiedCode}
                  getDifficultyColor={getDifficultyColor}
                  getProviderColor={getProviderColor}
                />
              ))}
            </div>
          </div>
        )}

        {/* All Recipes */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">All Recipes</h2>
          {regularRecipes.length === 0 ? (
            <div className="text-center py-16">
              <BookOpenIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No recipes found</h3>
              <p className="text-gray-600">Try adjusting your filters or search terms</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {regularRecipes.map((recipe) => (
                <RecipeCard 
                  key={recipe.id} 
                  recipe={recipe} 
                  copyCode={copyCode} 
                  copiedCode={copiedCode}
                  getDifficultyColor={getDifficultyColor}
                  getProviderColor={getProviderColor}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Recipe Card Component
interface RecipeCardProps {
  recipe: Recipe;
  copyCode: (code: string, snippetId: string) => void;
  copiedCode: string | null;
  getDifficultyColor: (difficulty: string) => string;
  getProviderColor: (provider: string) => string;
}

function RecipeCard({ recipe, copyCode, copiedCode, getDifficultyColor, getProviderColor }: RecipeCardProps) {
  const [expandedSnippet, setExpandedSnippet] = useState<number | null>(null);
  const difficultyColor = getDifficultyColor(recipe.difficulty);
  const providerColor = getProviderColor(recipe.provider);

  return (
    <div className={`bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden hover:shadow-xl transition-all duration-300 ${
      recipe.featured ? 'ring-2 ring-yellow-200' : ''
    }`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200/50">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-bold text-gray-900 line-clamp-2">{recipe.title}</h3>
          {recipe.featured && (
            <StarIcon className="h-5 w-5 text-yellow-500 flex-shrink-0 ml-2" />
          )}
        </div>
        
        <p className="text-gray-600 mb-4 line-clamp-3">{recipe.description}</p>
        
        {/* Metadata */}
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <ClockIcon className="h-4 w-4 text-gray-400" />
            <span className="text-gray-600">{recipe.estimatedTime}</span>
          </div>
          <div className={`px-3 py-1 bg-${difficultyColor}-100 text-${difficultyColor}-700 rounded-full text-xs font-semibold`}>
            {recipe.difficulty}
          </div>
          {recipe.provider !== 'all' && (
            <div className={`px-3 py-1 bg-${providerColor}-100 text-${providerColor}-700 rounded-full text-xs font-semibold`}>
              {recipe.provider}
            </div>
          )}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-3">
          {recipe.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs"
            >
              #{tag}
            </span>
          ))}
          {recipe.tags.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs">
              +{recipe.tags.length - 3} more
            </span>
          )}
        </div>
      </div>

      {/* Use Case */}
      <div className="p-6 border-b border-gray-200/50">
        <h4 className="font-semibold text-gray-900 mb-2">Use Case</h4>
        <p className="text-sm text-gray-600">{recipe.useCase}</p>
      </div>

      {/* Steps */}
      <div className="p-6 border-b border-gray-200/50">
        <h4 className="font-semibold text-gray-900 mb-3">Implementation Steps</h4>
        <ol className="space-y-2">
          {recipe.steps.map((step, index) => (
            <li key={index} className="flex gap-3 text-sm">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold">
                {index + 1}
              </span>
              <span className="text-gray-600">{step}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Code Snippets */}
      <div className="p-6">
        <h4 className="font-semibold text-gray-900 mb-3">Code Examples</h4>
        <div className="space-y-3">
          {recipe.codeSnippets.map((snippet, index) => (
            <div key={index} className="border border-gray-200 rounded-xl overflow-hidden">
              <div 
                className="flex items-center justify-between p-3 bg-gray-50/80 cursor-pointer"
                onClick={() => setExpandedSnippet(expandedSnippet === index ? null : index)}
              >
                <div className="flex items-center gap-2">
                  <CodeBracketIcon className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">{snippet.title}</span>
                  <span className="px-2 py-1 bg-gray-200 text-gray-600 rounded text-xs">
                    {snippet.language}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      copyCode(snippet.code, `${recipe.id}-${index}`);
                    }}
                    className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {copiedCode === `${recipe.id}-${index}` ? (
                      <CheckIcon className="h-4 w-4 text-green-500" />
                    ) : (
                      <DocumentDuplicateIcon className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
              
              {expandedSnippet === index && (
                <div className="bg-gray-900 text-green-400 p-4 text-xs font-mono overflow-x-auto">
                  <pre>{snippet.code}</pre>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Demo Link */}
        {recipe.demoUrl && (
          <div className="mt-4">
            <a
              href={recipe.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 transition-colors"
            >
              <ArrowTopRightOnSquareIcon className="h-4 w-4" />
              View Live Demo
            </a>
          </div>
        )}
      </div>
    </div>
  );
}