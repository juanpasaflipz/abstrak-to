import { NextRequest } from 'next/server';
import { withProjectAuth, withActivityLogging, ProjectContext } from '@/lib/api/middleware';
import { createSuccessResponse, createValidationErrorResponse, ErrorCodes } from '@/lib/api/responses';
import { z } from 'zod';

const simulateUserOpSchema = z.object({
  smartAccountAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid smart account address'),
  to: z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid target address'),
  data: z.string().regex(/^0x[a-fA-F0-9]*$/, 'Invalid call data'),
  value: z.string().regex(/^\d+$/, 'Invalid value amount').default('0'),
  chainId: z.number().int().positive().optional(),
});

async function simulateUserOpHandler(
  context: ProjectContext,
  request: NextRequest
): Promise<Response> {
  try {
    const body = await request.json();
    
    // Validate input
    const validationResult = simulateUserOpSchema.safeParse(body);
    if (!validationResult.success) {
      const fieldErrors: Record<string, string> = {};
      validationResult.error.errors.forEach(error => {
        const field = error.path.join('.');
        fieldErrors[field] = error.message;
      });
      return createValidationErrorResponse(fieldErrors, context.requestId);
    }

    const { smartAccountAddress, to, data, value, chainId } = validationResult.data;
    
    // Use project default chain if not specified
    const finalChainId = chainId || context.project.defaultChainId;
    
    try {
      // Simulate gas estimation and sponsorship check
      // In a real implementation, this would call the bundler/paymaster
      
      // Mock simulation results
      const estimatedGas = '150000'; // 150k gas units
      const gasPrice = '20000000000'; // 20 gwei
      const estimatedGasCost = (BigInt(estimatedGas) * BigInt(gasPrice)).toString();
      
      // Check if sponsorship is available based on project gas policies
      const gasPolicy = context.project.gasPolicies?.[0];
      let canSponsor = true;
      let sponsorshipReason = 'Gas sponsorship available';
      
      if (gasPolicy) {
        switch (gasPolicy.mode) {
          case 'sponsor_all':
            canSponsor = true;
            sponsorshipReason = 'All transactions sponsored';
            break;
          case 'allowlist':
            // Check if target contract and method are allowed
            const allowedContracts = gasPolicy.allowedContracts || [];
            const allowedMethods = gasPolicy.allowedMethods || [];
            
            const isContractAllowed = allowedContracts.length === 0 || allowedContracts.includes(to.toLowerCase());
            const methodSelector = data.slice(0, 10).toLowerCase();
            const isMethodAllowed = allowedMethods.length === 0 || allowedMethods.includes(methodSelector);
            
            canSponsor = isContractAllowed && isMethodAllowed;
            sponsorshipReason = canSponsor 
              ? 'Contract and method allowed' 
              : 'Contract or method not in allowlist';
            break;
          case 'user_pays':
            canSponsor = false;
            sponsorshipReason = 'User pays mode enabled';
            break;
          default:
            canSponsor = false;
            sponsorshipReason = 'Unknown gas policy mode';
        }
        
        // Check daily budget if sponsorship is enabled
        if (canSponsor && gasPolicy.dailyBudget) {
          const dailyBudgetWei = BigInt(gasPolicy.dailyBudget);
          const estimatedCostBigInt = BigInt(estimatedGasCost);
          
          if (estimatedCostBigInt > dailyBudgetWei) {
            canSponsor = false;
            sponsorshipReason = 'Exceeds daily budget';
          }
        }
      }

      const response = {
        simulation: {
          smartAccountAddress,
          target: to,
          callData: data,
          value,
          chainId: finalChainId,
          gasEstimate: {
            gasLimit: estimatedGas,
            gasPrice,
            estimatedCost: estimatedGasCost,
            estimatedCostEth: (parseFloat(estimatedGasCost) / 1e18).toFixed(6),
          },
          sponsorship: {
            canSponsor,
            reason: sponsorshipReason,
            gasPolicy: gasPolicy ? {
              mode: gasPolicy.mode,
              dailyBudget: gasPolicy.dailyBudget,
              perTxLimit: gasPolicy.perTxLimit,
            } : null,
          },
          validation: {
            isValid: true,
            warnings: [],
            errors: [],
          },
        },
        project: {
          id: context.project.id,
          name: context.project.name,
          provider: context.environment.provider,
        },
      };

      return createSuccessResponse(response, context.requestId);
    } catch (simulationError) {
      console.error('Simulation error:', simulationError);
      return createSuccessResponse(
        {
          error: {
            code: ErrorCodes.PROVIDER_ERROR,
            message: 'Simulation failed',
            details: simulationError instanceof Error ? simulationError.message : 'Unknown simulation error',
          },
        },
        context.requestId,
        400
      );
    }
  } catch (error) {
    console.error('Failed to simulate UserOp:', error);
    return createSuccessResponse(
      {
        error: {
          code: ErrorCodes.INTERNAL_ERROR,
          message: 'Failed to simulate UserOp',
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
  withActivityLogging('userop.simulate', '/api/v1/userops/simulate')(
    simulateUserOpHandler
  )
);