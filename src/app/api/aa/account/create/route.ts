import { NextRequest } from 'next/server';
import { withAuth, createApiResponse, handleApiError, type AuthContext } from '@/lib/auth';
import { validateRequest, createAccountRequestSchema, type CreateAccountRequest } from '@/lib/validation';
import { getSmartAccountAddress, deploySmartAccount } from '@/lib/aa';

async function createAccountHandler(
  authContext: AuthContext,
  request: NextRequest
): Promise<Response> {
  try {
    const body = await request.json();
    const validatedData: CreateAccountRequest = validateRequest(createAccountRequestSchema, body);

    const { ownerAddress, chainId, provider } = validatedData;

    // Set provider and chain from request or use defaults
    if (provider) {
      process.env.AA_PROVIDER = provider;
    }
    if (chainId) {
      process.env.NEXT_PUBLIC_CHAIN_ID = chainId.toString();
    }

    // Get smart account address (deterministic)
    const smartAccountAddress = await getSmartAccountAddress(ownerAddress);

    // For this endpoint, we just return the address without deploying
    // Deployment is handled by a separate endpoint for better gas management
    const response = {
      address: smartAccountAddress,
      provider: process.env.AA_PROVIDER || 'safe',
      chainId: chainId || parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || '84532'),
      isDeployed: false, // Would need to check on-chain status
      message: 'Smart account address generated. Use /deploy endpoint to deploy to blockchain.',
    };

    return createApiResponse(response, 201);
  } catch (error) {
    return handleApiError(error);
  }
}

export const POST = withAuth(createAccountHandler);