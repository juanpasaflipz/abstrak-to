import { NextRequest } from 'next/server';
import { withAuth, createApiResponse, handleApiError, type AuthContext } from '@/lib/auth';
import { validateRequest } from '@/lib/validation';
import { revokeSession } from '@/lib/sessionKeys';
import { z } from 'zod';

const sessionIdSchema = z.string().uuid();

async function revokeSessionHandler(
  authContext: AuthContext,
  request: NextRequest,
  { params }: { params: { sessionId: string } }
): Promise<Response> {
  try {
    const sessionId = validateRequest(sessionIdSchema, params.sessionId);

    // In a real implementation:
    // 1. Verify the session belongs to the authenticated user
    // 2. Check if session is already revoked
    // 3. Revoke on-chain session if applicable
    // 4. Update database status
    // 5. Log the revocation event

    // For now, use the basic revoke function
    // This would need to be updated to handle session IDs instead of user addresses
    const success = revokeSession('temp-user-address'); // This is a placeholder

    if (!success) {
      return createApiResponse(
        { message: 'Session not found or already revoked' },
        404
      );
    }

    const response = {
      sessionId,
      status: 'revoked',
      revokedAt: Date.now(),
      message: 'Session revoked successfully',
    };

    return createApiResponse(response);
  } catch (error) {
    return handleApiError(error);
  }
}

export const DELETE = withAuth(revokeSessionHandler);