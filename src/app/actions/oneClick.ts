'use server';

import { createSessionKey } from '@/lib/sessionKeys';
import { executeTransaction } from '@/lib/paymaster';

export async function executeOneClickAction(
  action: 'mint' | 'increment',
  userAddress: string
) {
  try {
    // Generate a new session key for this transaction
    const sessionKey = await createSessionKey(userAddress);
    
    // Execute the transaction with gas sponsorship
    const result = await executeTransaction({
      action,
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
