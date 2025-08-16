import { NextRequest } from 'next/server';
import { withProjectAuth, withActivityLogging, ProjectContext } from '@/lib/api/middleware';
import { createSuccessResponse, createValidationErrorResponse, ErrorCodes } from '@/lib/api/responses';
import { z } from 'zod';
import { getSafeAccount } from '@/lib/aa/safe';
import { getAlchemyAccount } from '@/lib/aa/alchemy';
import { getBiconomyAccount } from '@/lib/aa/biconomy';

const createAccountSchema = z.object({
  ownerAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid Ethereum address'),
  chainId: z.number().int().positive().optional(),
  provider: z.enum(['safe', 'alchemy', 'biconomy']).optional(),
});

async function createSmartAccountHandler(
  context: ProjectContext,
  request: NextRequest
): Promise<Response> {
  try {
    const body = await request.json();
    
    // Validate input
    const validationResult = createAccountSchema.safeParse(body);
    if (!validationResult.success) {
      const fieldErrors: Record<string, string> = {};
      validationResult.error.errors.forEach(error => {
        const field = error.path.join('.');
        fieldErrors[field] = error.message;
      });
      return createValidationErrorResponse(fieldErrors, context.requestId);
    }

    const { ownerAddress, chainId, provider } = validationResult.data;
    
    // Use project defaults if not specified
    const finalChainId = chainId || context.project.defaultChainId;
    const finalProvider = provider || context.project.defaultProvider;

    // Create smart account based on provider
    let smartAccount;
    try {
      switch (finalProvider) {
        case 'safe':
          smartAccount = await getSafeAccount({
            ownerAddress,
            chainId: finalChainId,
          });
          break;
        case 'alchemy':
          smartAccount = await getAlchemyAccount({
            ownerAddress,
            chainId: finalChainId,
          });
          break;
        case 'biconomy':
          smartAccount = await getBiconomyAccount({
            ownerAddress,
            chainId: finalChainId,
          });
          break;
        default:
          throw new Error(`Unsupported provider: ${finalProvider}`);
      }
    } catch (error) {
      console.error('Provider error:', error);
      return createSuccessResponse(
        {
          error: {
            code: ErrorCodes.PROVIDER_ERROR,
            message: `Failed to create account with ${finalProvider} provider`,
            details: error instanceof Error ? error.message : 'Unknown provider error',
          },
        },
        context.requestId,
        400
      );
    }

    const response = {
      smartAccount: {
        address: smartAccount.address,
        provider: smartAccount.provider,
        isDeployed: smartAccount.isDeployed,
        chainId: finalChainId,
        ownerAddress,
      },
      project: {
        id: context.project.id,
        name: context.project.name,
      },
    };

    return createSuccessResponse(response, context.requestId, 201);
  } catch (error) {
    console.error('Failed to create smart account:', error);
    return createSuccessResponse(
      {
        error: {
          code: ErrorCodes.INTERNAL_ERROR,
          message: 'Failed to create smart account',
          details: error instanceof Error ? error.message : 'Unknown error',
        },
      },
      context.requestId,
      500
    );
  }
}

// Export with middleware
export const POST = withProjectAuth(
  withActivityLogging('smart_account.create', '/api/v1/smart-accounts')(
    createSmartAccountHandler
  )
);