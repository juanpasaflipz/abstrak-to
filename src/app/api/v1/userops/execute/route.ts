import { NextRequest } from 'next/server';
import { withProjectAuth, withActivityLogging, ProjectContext } from '@/lib/api/middleware';
import { createSuccessResponse, createValidationErrorResponse, ErrorCodes } from '@/lib/api/responses';
import { z } from 'zod';
import { executeOneClickAction } from '@/app/actions/oneClick';

const executeUserOpSchema = z.object({
  smartAccountAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid smart account address'),
  to: z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid target address'),
  data: z.string().regex(/^0x[a-fA-F0-9]*$/, 'Invalid call data'),
  value: z.string().regex(/^\d+$/, 'Invalid value amount').default('0'),
  chainId: z.number().int().positive().optional(),
  sponsor: z.boolean().default(true),
  sessionId: z.string().optional(),
});

async function executeUserOpHandler(
  context: ProjectContext,
  request: NextRequest
): Promise<Response> {
  try {
    const body = await request.json();
    
    // Validate input
    const validationResult = executeUserOpSchema.safeParse(body);
    if (!validationResult.success) {
      const fieldErrors: Record<string, string> = {};
      validationResult.error.errors.forEach(error => {
        const field = error.path.join('.');
        fieldErrors[field] = error.message;
      });
      return createValidationErrorResponse(fieldErrors, context.requestId);
    }

    const { smartAccountAddress, to, data, value, chainId, sponsor, sessionId } = validationResult.data;
    
    // Use project default chain if not specified
    const finalChainId = chainId || context.project.defaultChainId;
    
    try {
      // For now, we'll simulate execution since the existing executeOneClickAction
      // expects specific contract calls. In production, this would:
      // 1. Validate session if sessionId provided
      // 2. Check spending limits and policies
      // 3. Build UserOp
      // 4. Submit to bundler
      // 5. Return transaction hash

      // Mock execution results
      const userOpHash = '0x' + Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('');
      const txHash = '0x' + Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('');
      
      // Simulate gas costs
      const gasUsed = '127836';
      const gasPrice = '20000000000';
      const gasCost = (BigInt(gasUsed) * BigInt(gasPrice)).toString();
      
      const response = {
        execution: {
          userOpHash,
          transactionHash: txHash,
          smartAccountAddress,
          target: to,
          callData: data,
          value,
          chainId: finalChainId,
          status: 'pending' as const,
          gas: {
            gasUsed,
            gasPrice,
            gasCost,
            gasCostEth: (parseFloat(gasCost) / 1e18).toFixed(6),
            sponsored: sponsor,
          },
          timing: {
            submittedAt: new Date().toISOString(),
            estimatedConfirmationTime: 15, // seconds
          },
          sessionId,
        },
        project: {
          id: context.project.id,
          name: context.project.name,
          provider: context.environment.provider,
        },
        links: {
          transaction: `https://sepolia.basescan.org/tx/${txHash}`,
          userOp: `https://jiffyscan.xyz/userOpHash/${userOpHash}?network=base-sepolia`,
        },
      };

      return createSuccessResponse(response, context.requestId, 201);
    } catch (executionError) {
      console.error('Execution error:', executionError);
      return createSuccessResponse(
        {
          error: {
            code: ErrorCodes.BUNDLER_ERROR,
            message: 'UserOp execution failed',
            details: executionError instanceof Error ? executionError.message : 'Unknown execution error',
          },
        },
        context.requestId,
        400
      );
    }
  } catch (error) {
    console.error('Failed to execute UserOp:', error);
    return createSuccessResponse(
      {
        error: {
          code: ErrorCodes.INTERNAL_ERROR,
          message: 'Failed to execute UserOp',
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
  withActivityLogging('userop.execute', '/api/v1/userops/execute')(
    executeUserOpHandler
  )
);