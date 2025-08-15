import { getSafeAccount } from './safe';
import { getAlchemyAccount } from './alchemy';
import { getBiconomyAccount } from './biconomy';

export interface SmartAccount {
  address: string;
  provider: string;
  isDeployed: boolean;
}

export interface SmartAccountConfig {
  ownerAddress: string;
  chainId: number;
}

export async function getSmartAccountAddress(ownerAddress: string): Promise<string> {
  const aaProvider = process.env.AA_PROVIDER || 'safe';
  const chainId = parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || '84532'); // Base Sepolia default
  
  const config: SmartAccountConfig = {
    ownerAddress,
    chainId,
  };

  try {
    let smartAccount: SmartAccount;

    switch (aaProvider) {
      case 'safe':
        smartAccount = await getSafeAccount(config);
        break;
      case 'alchemy':
        smartAccount = await getAlchemyAccount(config);
        break;
      case 'biconomy':
        smartAccount = await getBiconomyAccount(config);
        break;
      default:
        throw new Error(`Unsupported AA provider: ${aaProvider}`);
    }

    return smartAccount.address;
  } catch (error) {
    console.error('Failed to get smart account:', error);
    throw new Error(`Failed to initialize ${aaProvider} smart account: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function deploySmartAccount(ownerAddress: string): Promise<string> {
  const aaProvider = process.env.AA_PROVIDER || 'safe';
  const chainId = parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || '84532');
  
  const config: SmartAccountConfig = {
    ownerAddress,
    chainId,
  };

  try {
    let smartAccount: SmartAccount;

    switch (aaProvider) {
      case 'safe':
        smartAccount = await getSafeAccount(config);
        break;
      case 'alchemy':
        smartAccount = await getAlchemyAccount(config);
        break;
      case 'biconomy':
        smartAccount = await getBiconomyAccount(config);
        break;
      default:
        throw new Error(`Unsupported AA provider: ${aaProvider}`);
    }

    if (!smartAccount.isDeployed) {
      // For demo purposes, we'll simulate deployment
      // In production, you'd call the actual deployment method
      console.log(`Smart account ${smartAccount.address} needs deployment`);
    }

    return smartAccount.address;
  } catch (error) {
    console.error('Failed to deploy smart account:', error);
    throw new Error(`Failed to deploy ${aaProvider} smart account: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
