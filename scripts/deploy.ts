#!/usr/bin/env ts-node

import { ethers } from 'ethers';
import * as fs from 'fs';
import * as path from 'path';

// Contract addresses on Base Sepolia (these would be updated after actual deployment)
export const DEPLOYED_CONTRACTS = {
  base_sepolia: {
    chainId: 84532,
    Counter: '0x742d35Cc6434C0532925a3b8c5481a3d3E7Cc4A7', // Example address
    DemoToken: '0x8B3F3D61a4b6Cc4E2b8A3D2e4B8A5A8C5D1E7F9C', // Example address
    DemoNFT: '0x4A8B6C8E2A4B6C8E2A4B6C8E2A4B6C8E2A4B6C8E', // Example address
  },
  sepolia: {
    chainId: 11155111,
    Counter: '0x123456789abcdef123456789abcdef123456789a', // Example address
    DemoToken: '0x987654321fedcba987654321fedcba987654321', // Example address
    DemoNFT: '0xabcdef123456789abcdef123456789abcdef12345', // Example address
  },
  mainnet: {
    chainId: 1,
    Counter: '0x0000000000000000000000000000000000000000', // Not deployed
    DemoToken: '0x0000000000000000000000000000000000000000', // Not deployed
    DemoNFT: '0x0000000000000000000000000000000000000000', // Not deployed
  }
};

// ABI exports
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
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "user", "type": "address" }
    ],
    "name": "CounterReset",
    "type": "event"
  }
];

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
    "inputs": [],
    "name": "totalSupply",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
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
    "name": "transfer",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "from", "type": "address" },
      { "indexed": true, "internalType": "address", "name": "to", "type": "address" },
      { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }
    ],
    "name": "Transfer",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "to", "type": "address" },
      { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }
    ],
    "name": "Mint",
    "type": "event"
  }
];

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
    "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "name": "ownerOf",
    "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
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
    "inputs": [],
    "name": "mintToSelf",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }],
    "name": "tokenURI",
    "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
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
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "from", "type": "address" },
      { "indexed": true, "internalType": "address", "name": "to", "type": "address" },
      { "indexed": true, "internalType": "uint256", "name": "tokenId", "type": "uint256" }
    ],
    "name": "Transfer",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "to", "type": "address" },
      { "indexed": true, "internalType": "uint256", "name": "tokenId", "type": "uint256" }
    ],
    "name": "Mint",
    "type": "event"
  }
];

// Helper function to get contract info for current chain
export function getContractInfo(chainName: keyof typeof DEPLOYED_CONTRACTS = 'base_sepolia') {
  return DEPLOYED_CONTRACTS[chainName];
}

// Deployment script (would be used with a real deployment tool like Hardhat)
async function deployContracts() {
  console.log('🚀 Contract Deployment Script');
  console.log('==============================');
  
  console.log('\nNote: This is a simulation script.');
  console.log('For actual deployment, use Hardhat, Foundry, or similar tools.');
  
  console.log('\n📋 Contracts to Deploy:');
  console.log('- Counter: Simple increment/decrement counter');
  console.log('- DemoToken: ERC-20 token with minting');
  console.log('- DemoNFT: ERC-721 NFT with minting');
  
  console.log('\n🌐 Target Networks:');
  console.log('- Base Sepolia (Primary testnet)');
  console.log('- Ethereum Sepolia (Secondary testnet)');
  
  console.log('\n💡 After deployment, update the addresses in:');
  console.log('- src/lib/contracts.ts');
  console.log('- scripts/deploy.ts');
  
  console.log('\n✅ Contract ABIs and addresses are ready for use!');
}

// Run deployment if script is called directly
if (require.main === module) {
  deployContracts().catch(console.error);
}