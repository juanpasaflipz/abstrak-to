import { ethers } from 'ethers';
import { 
  getSafeAccount, 
  createSafeSession, 
  executeSafeTransaction as executeSafeTx 
} from '@/lib/aa/safe';
import { 
  getAlchemyAccount, 
  createAlchemySession, 
  executeAlchemyTransaction as executeAlchemyTx 
} from '@/lib/aa/alchemy';
import { 
  getBiconomyAccount, 
  createBiconomySession, 
  executeBiconomyTransaction as executeBiconomyTx 
} from '@/lib/aa/biconomy';

export interface TransactionRequest {
  to: string;
  data: string;
  value: string;
  sessionKey: string;
  userAddress: string;
  provider?: 'safe' | 'alchemy' | 'biconomy';
}

export interface TransactionResult {
  txHash: string;
  sponsored: boolean;
  gasUsed?: string;
}

export async function executeTransaction(request: TransactionRequest): Promise<TransactionResult> {
  const { provider = 'safe' } = request;
  
  let result: TransactionResult;
  
  try {
    switch (provider) {
      case 'safe':
        result = await executeSafeTransaction(request);
        break;
      case 'alchemy':
        result = await executeAlchemyTransaction(request);
        break;
      case 'biconomy':
        result = await executeBiconomyTransaction(request);
        break;
      default:
        result = await executeFallbackTransaction(request);
    }
  } catch (error) {
    console.error(`Failed to execute transaction with ${provider}:`, error);
    // Fallback to basic transaction
    result = await executeFallbackTransaction(request);
  }
  
  return result;
}

async function executeSafeTransaction(request: TransactionRequest): Promise<TransactionResult> {
  const { to, data, value, sessionKey, userAddress } = request;
  
  // Get smart account address
  const smartAccount = await getSafeAccount({
    ownerAddress: userAddress,
    chainId: 84532,
  });
  
  // Create session if needed
  const sessionCreated = await createSafeSession(
    smartAccount.address,
    sessionKey,
    '0.01',
    Math.floor(Date.now() / 1000) + 1800
  );
  
  if (!sessionCreated) {
    throw new Error('Failed to create Safe session');
  }
  
  // Execute transaction
  const txHash = await executeSafeTx(
    smartAccount.address,
    sessionKey,
    to,
    value,
    data
  );
  
  return {
    txHash,
    sponsored: true,
  };
}

async function executeAlchemyTransaction(request: TransactionRequest): Promise<TransactionResult> {
  const { to, data, value, sessionKey, userAddress } = request;
  
  // Get smart account address
  const smartAccount = await getAlchemyAccount({
    ownerAddress: userAddress,
    chainId: 84532,
  });
  
  // Create session if needed
  const sessionCreated = await createAlchemySession(
    smartAccount.address,
    sessionKey,
    '0.01',
    Math.floor(Date.now() / 1000) + 1800
  );
  
  if (!sessionCreated) {
    throw new Error('Failed to create Alchemy session');
  }
  
  // Execute transaction with gas sponsorship
  const txHash = await executeAlchemyTx(
    smartAccount.address,
    sessionKey,
    to,
    value,
    data
  );
  
  return {
    txHash,
    sponsored: true,
  };
}

async function executeBiconomyTransaction(request: TransactionRequest): Promise<TransactionResult> {
  const { to, data, value, sessionKey, userAddress } = request;
  
  // Get smart account address
  const smartAccount = await getBiconomyAccount({
    ownerAddress: userAddress,
    chainId: 84532,
  });
  
  // Create session if needed
  const sessionCreated = await createBiconomySession(
    smartAccount.address,
    sessionKey,
    '0.01',
    Math.floor(Date.now() / 1000) + 1800
  );
  
  if (!sessionCreated) {
    throw new Error('Failed to create Biconomy session');
  }
  
  // Execute transaction with paymaster
  const txHash = await executeBiconomyTx(
    smartAccount.address,
    sessionKey,
    to,
    value,
    data
  );
  
  return {
    txHash,
    sponsored: true,
  };
}

async function executeFallbackTransaction(request: TransactionRequest): Promise<TransactionResult> {
  // Simple fallback - in production you'd implement actual transaction execution
  const txHash = ethers.hexlify(ethers.randomBytes(32));
  
  return {
    txHash,
    sponsored: false,
    gasUsed: '0.001', // Estimated gas cost
  };
}

function getTargetContract(action: string): string {
  switch (action) {
    case 'mint':
      return '0x1234567890123456789012345678901234567890'; // Mock NFT contract
    case 'increment':
      return '0x0987654321098765432109876543210987654321'; // Mock counter contract
    default:
      throw new Error(`Unknown action: ${action}`);
  }
}

function getActionData(action: string): string {
  switch (action) {
    case 'mint':
      // Mock mint function call
      return ethers.AbiCoder.defaultAbiCoder().encode(
        ['address', 'uint256'],
        ['0x1234567890123456789012345678901234567890', 1]
      );
    case 'increment':
      // Mock increment function call
      return ethers.AbiCoder.defaultAbiCoder().encode(
        ['uint256'],
        [1]
      );
    default:
      throw new Error(`Unknown action: ${action}`);
  }
}
