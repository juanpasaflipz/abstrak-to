import { http, createConfig } from 'wagmi';
import { baseSepolia, mainnet, sepolia } from 'wagmi/chains';
import { injected, metaMask, walletConnect } from 'wagmi/connectors';

export const config = createConfig({
  chains: [baseSepolia, mainnet, sepolia],
  transports: {
    [baseSepolia.id]: http('https://sepolia.base.org'),
    [mainnet.id]: http(`https://eth-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`),
    [sepolia.id]: http(`https://eth-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`),
  },
  connectors: [
    injected(),
    metaMask(),
    walletConnect({
      projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'default-project-id',
      metadata: {
        name: 'StreamLine',
        description: 'ERC-4337 Account Abstraction Demo',
        url: 'https://streamline.vercel.app',
        icons: ['https://streamline.vercel.app/icon.png'],
      },
    }),
  ],
});
