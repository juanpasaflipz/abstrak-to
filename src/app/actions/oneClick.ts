'use server';

import { createSessionKey } from '@/lib/sessionKeys';
import { executeTransaction } from '@/lib/paymaster';

import { CONTRACT_CALLS, type ContractCall } from '@/lib/contracts';

export async function executeOneClickAction(
  action: ContractCall,
  userAddress: string
) {
  try {
    // Generate a new session key for this transaction
    const sessionKey = await createSessionKey(userAddress);
    
    // Get contract call details
    const contractCall = CONTRACT_CALLS[action];
    
    // Execute the transaction with gas sponsorship
    const result = await executeTransaction({
      to: contractCall.to(),
      data: contractCall.data,
      value: contractCall.value,
      sessionKey,
      userAddress,
      provider: 'safe', // Default to Safe
    });
    
    return {
      success: true,
      txHash: result.txHash,
      sponsored: result.sponsored,
      gasUsed: result.gasUsed,
    };
  } catch (error) {
    console.error('One-click action failed:', error);
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}
