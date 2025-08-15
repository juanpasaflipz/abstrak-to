import { getDefaultChain } from './chains';

// Contract addresses on different networks
export const CONTRACT_ADDRESSES = {
  84532: { // Base Sepolia
    Counter: '0x742d35Cc6434C0532925a3b8c5481a3d3E7Cc4A7',
    DemoToken: '0x8B3F3D61a4b6Cc4E2b8A3D2e4B8A5A8C5D1E7F9C',
    DemoNFT: '0x4A8B6C8E2A4B6C8E2A4B6C8E2A4B6C8E2A4B6C8E',
  },
  11155111: { // Ethereum Sepolia
    Counter: '0x123456789abcdef123456789abcdef123456789a',
    DemoToken: '0x987654321fedcba987654321fedcba987654321',
    DemoNFT: '0xabcdef123456789abcdef123456789abcdef12345',
  },
  1: { // Ethereum Mainnet (not deployed)
    Counter: '0x0000000000000000000000000000000000000000',
    DemoToken: '0x0000000000000000000000000000000000000000',
    DemoNFT: '0x0000000000000000000000000000000000000000',
  },
} as const;

// Contract ABIs
export const COUNTER_ABI = [
  {
    "inputs": [],
    "name": "count",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "increment",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "amount", "type": "uint256" }],
    "name": "incrementBy",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "reset",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getCount",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "user", "type": "address" },
      { "indexed": false, "internalType": "uint256", "name": "newCount", "type": "uint256" }
    ],
    "name": "CounterIncremented",
    "type": "event"
  },
] as const;

export const DEMO_TOKEN_ABI = [
  {
    "inputs": [],
    "name": "name",
    "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "symbol",
    "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "decimals",
    "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "name": "balanceOf",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "mintToSelf",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "to", "type": "address" },
      { "internalType": "uint256", "name": "amount", "type": "uint256" }
    ],
    "name": "mint",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "to", "type": "address" },
      { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }
    ],
    "name": "Mint",
    "type": "event"
  },
] as const;

export const DEMO_NFT_ABI = [
  {
    "inputs": [],
    "name": "name",
    "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "symbol",
    "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "name": "balanceOf",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalSupply",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "mintToSelf",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "to", "type": "address" },
      { "internalType": "string", "name": "metadata", "type": "string" }
    ],
    "name": "mint",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "to", "type": "address" },
      { "indexed": true, "internalType": "uint256", "name": "tokenId", "type": "uint256" }
    ],
    "name": "Mint",
    "type": "event"
  },
] as const;

// Helper functions
export function getContractAddress(contractName: keyof (typeof CONTRACT_ADDRESSES)[84532], chainId?: number) {
  const chain = chainId || getDefaultChain().id;
  const addresses = CONTRACT_ADDRESSES[chain as keyof typeof CONTRACT_ADDRESSES];
  
  if (!addresses) {
    throw new Error(`No contract addresses configured for chain ${chain}`);
  }
  
  const address = addresses[contractName];
  if (!address || address === '0x0000000000000000000000000000000000000000') {
    throw new Error(`Contract ${contractName} not deployed on chain ${chain}`);
  }
  
  return address;
}

export function getContractABI(contractName: 'Counter' | 'DemoToken' | 'DemoNFT') {
  switch (contractName) {
    case 'Counter':
      return COUNTER_ABI;
    case 'DemoToken':
      return DEMO_TOKEN_ABI;
    case 'DemoNFT':
      return DEMO_NFT_ABI;
    default:
      throw new Error(`Unknown contract: ${contractName}`);
  }
}

// Contract interaction helpers
export function encodeCounterIncrement() {
  return '0x' + 'd09de08a'; // increment() function selector
}

export function encodeTokenMintToSelf() {
  return '0x' + 'a0712d68'; // mintToSelf() function selector
}

export function encodeNFTMintToSelf() {
  return '0x' + 'a0712d68'; // mintToSelf() function selector
}

// Predefined contract calls for TxButton
export const CONTRACT_CALLS = {
  incrementCounter: {
    to: () => getContractAddress('Counter'),
    data: encodeCounterIncrement(),
    value: '0',
    description: 'Increment the counter by 1',
  },
  mintTokens: {
    to: () => getContractAddress('DemoToken'),
    data: encodeTokenMintToSelf(),
    value: '0',
    description: 'Mint 100 DEMO tokens to your account',
  },
  mintNFT: {
    to: () => getContractAddress('DemoNFT'),
    data: encodeNFTMintToSelf(),
    value: '0',
    description: 'Mint a Demo NFT to your account',
  },
} as const;

// Contract information for UI display
export const CONTRACT_INFO = {
  Counter: {
    name: 'Demo Counter',
    description: 'A simple counter that can be incremented gaslessly',
    features: ['Increment', 'Reset', 'Get current count'],
    explorerName: 'View on BaseScan',
  },
  DemoToken: {
    name: 'Demo Token (DEMO)',
    description: 'An ERC-20 token for testing gasless transactions',
    features: ['Mint tokens', 'Transfer', 'Check balance'],
    explorerName: 'View on BaseScan',
  },
  DemoNFT: {
    name: 'Demo NFT (DNFT)',
    description: 'An ERC-721 NFT for testing gasless minting',
    features: ['Mint NFT', 'Transfer', 'View metadata'],
    explorerName: 'View on BaseScan',
  },
} as const;

export type ContractName = keyof typeof CONTRACT_INFO;
export type ContractCall = keyof typeof CONTRACT_CALLS;