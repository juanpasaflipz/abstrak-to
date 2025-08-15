import { NextRequest } from 'next/server';
import { withAuth, createApiResponse, handleApiError, type AuthContext } from '@/lib/auth';
import { validateRequest, txHashSchema } from '@/lib/validation';

async function getTransactionHandler(
  authContext: AuthContext,
  request: NextRequest,
  { params }: { params: { hash: string } }
): Promise<Response> {
  try {
    const hash = validateRequest(txHashSchema, params.hash);

    // In a real implementation:
    // 1. Query transaction from blockchain
    // 2. Get additional metadata from database
    // 3. Calculate confirmation status
    // 4. Return comprehensive transaction info

    // Mock transaction data
    const transaction = {
      hash,
      from: '0x1234567890123456789012345678901234567890',
      to: '0x9876543210987654321098765432109876543210',
      value: '1000000000000000000', // 1 ETH
      data: '0xa9059cbb000000000000000000000000abcdef1234567890123456789012345678901234000000000000000000000000000000000000000000000000016345785d8a0000',
      gasUsed: '21000',
      gasPrice: '20000000000', // 20 gwei
      gasLimit: '21000',
      nonce: 5,
      status: 'success' as const,
      sponsored: true,
      timestamp: Date.now() - 300000, // 5 minutes ago
      blockNumber: 12345678,
      blockHash: '0x' + Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join(''),
      transactionIndex: 15,
      confirmations: 12,
      sessionId: 'session-123',
      provider: 'safe',
      chainId: 84532,
      logs: [
        {
          address: '0x9876543210987654321098765432109876543210',
          topics: ['0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'],
          data: '0x000000000000000000000000000000000000000000000000016345785d8a0000',
        },
      ],
      decodedLogs: [
        {
          name: 'Transfer',
          signature: 'Transfer(address,address,uint256)',
          args: {
            from: '0x1234567890123456789012345678901234567890',
            to: '0xabcdef1234567890123456789012345678901234',
            value: '100000000000000000000', // 100 tokens
          },
        },
      ],
    };

    return createApiResponse(transaction);
  } catch (error) {
    return handleApiError(error);
  }
}

export const GET = withAuth(getTransactionHandler);