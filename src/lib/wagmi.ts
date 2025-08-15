import { http, createConfig } from 'wagmi';
import { baseSepolia, mainnet, sepolia } from 'wagmi/chains';
import { injected, metaMask, walletConnect } from 'wagmi/connectors';

// Ensure environment variables are available
const alchemyApiKey = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;
const walletConnectProjectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

if (!alchemyApiKey) {
  console.warn('NEXT_PUBLIC_ALCHEMY_API_KEY not found. Some features may not work properly.');
}

if (!walletConnectProjectId) {
  console.warn('NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID not found. WalletConnect may not work properly.');
}

export const config = createConfig({
  chains: [baseSepolia, mainnet, sepolia],
  transports: {
    [baseSepolia.id]: http('https://sepolia.base.org'),
    [mainnet.id]: http(alchemyApiKey ? `https://eth-mainnet.g.alchemy.com/v2/${alchemyApiKey}` : 'https://eth.public-rpc.com'),
    [sepolia.id]: http(alchemyApiKey ? `https://eth-sepolia.g.alchemy.com/v2/${alchemyApiKey}` : 'https://rpc.sepolia.org'),
  },
  connectors: [
    injected(),
    metaMask(),
    ...(walletConnectProjectId ? [
      walletConnect({
        projectId: walletConnectProjectId,
        metadata: {
          name: 'Abstrak-to',
          description: 'ERC-4337 Account Abstraction Portal',
          url: typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3001',
          icons: [`${typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3001'}/icon.png`],
        },
      })
    ] : []),
  ],
  ssr: true,
});
