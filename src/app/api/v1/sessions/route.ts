import { NextRequest } from 'next/server';
import { withProjectAuth, withActivityLogging, ProjectContext } from '@/lib/api/middleware';
import { createSuccessResponse, createValidationErrorResponse, ErrorCodes } from '@/lib/api/responses';
import { z } from 'zod';
import { createSessionKey, getActiveSession } from '@/lib/sessionKeys';

const createSessionSchema = z.object({
  smartAccountAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid smart account address'),
  scope: z.object({
    contracts: z.array(z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid contract address')).optional(),
    methods: z.array(z.string()).optional(),
  }).optional(),
  caps: z.object({
    perTx: z.string().regex(/^\d+$/, 'Invalid amount').optional(),
    daily: z.string().regex(/^\d+$/, 'Invalid amount').optional(),
  }).optional(),
  ttl: z.number().int().min(60).max(86400).optional(), // 1 minute to 24 hours
});

async function createSessionHandler(
  context: ProjectContext,
  request: NextRequest
): Promise<Response> {
  try {
    const body = await request.json();
    
    // Validate input
    const validationResult = createSessionSchema.safeParse(body);
    if (!validationResult.success) {
      const fieldErrors: Record<string, string> = {};
      validationResult.error.errors.forEach(error => {
        const field = error.path.join('.');
        fieldErrors[field] = error.message;
      });
      return createValidationErrorResponse(fieldErrors, context.requestId);
    }

    const { smartAccountAddress, scope, caps, ttl } = validationResult.data;
    
    // Get project session policy for defaults
    const sessionPolicy = context.project.sessionPolicies?.[0];
    
    // Apply defaults from project policy
    const finalScope = {
      contracts: scope?.contracts || sessionPolicy?.allowedContracts || [],
      methods: scope?.methods || sessionPolicy?.allowedMethods || [],
    };
    
    const finalCaps = {
      perTx: caps?.perTx || sessionPolicy?.maxValue || '10000000000000000', // 0.01 ETH
      daily: caps?.daily || sessionPolicy?.dailyCap || '100000000000000000', // 0.1 ETH
    };
    
    const finalTtl = ttl || sessionPolicy?.defaultTTL || 1800; // 30 minutes

    try {
      // Create session key using existing library
      const sessionKey = await createSessionKey(smartAccountAddress);
      
      // Get the created session details
      const sessionDetails = getActiveSession(smartAccountAddress);
      
      if (!sessionDetails) {
        throw new Error('Failed to retrieve created session');
      }

      const response = {
        session: {
          id: `session_${Date.now()}`, // Generate a unique session ID
          smartAccountAddress,
          sessionKey: sessionDetails.address, // Public key of the session
          scope: finalScope,
          caps: finalCaps,
          ttl: finalTtl,
          expiresAt: sessionDetails.expiration,
          isActive: true,
          createdAt: new Date().toISOString(),
        },
        project: {
          id: context.project.id,
          name: context.project.name,
        },
      };

      return createSuccessResponse(response, context.requestId, 201);
    } catch (sessionError) {
      console.error('Session creation error:', sessionError);
      return createSuccessResponse(
        {
          error: {
            code: ErrorCodes.PROVIDER_ERROR,
            message: 'Failed to create session key',
            details: sessionError instanceof Error ? sessionError.message : 'Unknown session error',
          },
        },
        context.requestId,
        400
      );
    }
  } catch (error) {
    console.error('Failed to create session:', error);
    return createSuccessResponse(
      {
        error: {
          code: ErrorCodes.INTERNAL_ERROR,
          message: 'Failed to create session',
          details: error instanceof Error ? error.message : 'Unknown error',
        },
      },
      context.requestId,
      500
    );
  }
}

async function getSessionsHandler(
  context: ProjectContext,
  request: NextRequest
): Promise<Response> {
  try {
    const url = new URL(request.url);
    const smartAccountAddress = url.searchParams.get('smartAccountAddress');
    
    if (!smartAccountAddress) {
      return createValidationErrorResponse(
        { smartAccountAddress: 'Smart account address is required' },
        context.requestId
      );
    }

    // Validate address format
    if (!/^0x[a-fA-F0-9]{40}$/.test(smartAccountAddress)) {
      return createValidationErrorResponse(
        { smartAccountAddress: 'Invalid smart account address format' },
        context.requestId
      );
    }

    // Get active session
    const activeSession = getActiveSession(smartAccountAddress);
    
    const sessions = activeSession ? [{
      id: `session_${smartAccountAddress.slice(-8)}`,
      smartAccountAddress,
      sessionKey: activeSession.address,
      expiresAt: activeSession.expiration,
      isActive: true,
      spendingLimit: activeSession.spendingLimit,
      dailySpent: activeSession.dailySpent,
      allowedContracts: activeSession.allowedContracts,
      allowedMethods: activeSession.allowedMethods,
    }] : [];

    const response = {
      sessions,
      total: sessions.length,
      smartAccountAddress,
    };

    return createSuccessResponse(response, context.requestId);
  } catch (error) {
    console.error('Failed to get sessions:', error);
    return createSuccessResponse(
      {
        error: {
          code: ErrorCodes.INTERNAL_ERROR,
          message: 'Failed to get sessions',
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
  withActivityLogging('session.create', '/api/v1/sessions')(
    createSessionHandler
  )
);

export const GET = withProjectAuth(
  withActivityLogging('session.list', '/api/v1/sessions')(
    getSessionsHandler
  )
);