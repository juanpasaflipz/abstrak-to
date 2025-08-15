import { baseSepolia, mainnet, sepolia } from 'wagmi/chains';

export const chains = [baseSepolia, mainnet, sepolia];

export const getDefaultChain = () => {
  const chainEnv = process.env.NEXT_PUBLIC_CHAIN;
  
  switch (chainEnv) {
    case 'base-sepolia':
      return baseSepolia;
    case 'mainnet':
      return mainnet;
    case 'sepolia':
      return sepolia;
    default:
      return baseSepolia; // Default to Base Sepolia for testing
  }
};

interface ChainConfig {
  name: string;
  rpc: string;
  explorer: string;
  nativeCurrency: { name: string; symbol: string; decimals: number };
}

export const getChainConfig = (chainId: number): ChainConfig => {
  switch (chainId) {
    case baseSepolia.id:
      return {
        name: 'Base Sepolia',
        rpc: `https://sepolia.base.org`,
        explorer: 'https://sepolia.basescan.org',
        nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
      };
    case mainnet.id:
      return {
        name: 'Ethereum Mainnet',
        rpc: `https://eth-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`,
        explorer: 'https://etherscan.io',
        nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
      };
    case sepolia.id:
      return {
        name: 'Sepolia Testnet',
        rpc: `https://eth-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`,
        explorer: 'https://sepolia.etherscan.io',
        nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
      };
    default:
      return getChainConfig(baseSepolia.id);
  }
};
