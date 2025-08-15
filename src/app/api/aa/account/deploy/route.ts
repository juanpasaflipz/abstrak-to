import { NextRequest } from 'next/server';
import { withAuth, createApiResponse, handleApiError, type AuthContext } from '@/lib/auth';
import { validateRequest, createAccountRequestSchema, type CreateAccountRequest } from '@/lib/validation';
import { deploySmartAccount } from '@/lib/aa';

async function deployAccountHandler(
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

    // Deploy the smart account
    const smartAccountAddress = await deploySmartAccount(ownerAddress);

    const response = {
      address: smartAccountAddress,
      provider: process.env.AA_PROVIDER || 'safe',
      chainId: chainId || parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || '84532'),
      isDeployed: true,
      deploymentTxHash: 'deployment-tx-hash', // Would be returned from deployment
      message: 'Smart account deployed successfully',
    };

    return createApiResponse(response, 201);
  } catch (error) {
    return handleApiError(error);
  }
}

export const POST = withAuth(deployAccountHandler);