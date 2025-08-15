import { NextRequest } from 'next/server';
import { withAuth, createApiResponse, handleApiError, type AuthContext } from '@/lib/auth';
import { validateRequest, addressSchema, validateQueryParams, paginationSchema } from '@/lib/validation';
import { z } from 'zod';
import { getActiveSession } from '@/lib/sessionKeys';

async function getSessionsHandler(
  authContext: AuthContext,
  request: NextRequest,
  { params }: { params: { address: string } }
): Promise<Response> {
  try {
    const address = validateRequest(addressSchema, params.address);
    const queryParams = validateQueryParams(
      new URL(request.url).searchParams,
      paginationSchema.extend({
        status: z.enum(['active', 'expired', 'revoked', 'all']).optional().default('active'),
      })
    );

    // Get sessions for the address
    const activeSession = getActiveSession(address);

    // Mock sessions data (in real implementation, query from database)
    const sessions = [
      {
        id: 'session-123',
        userAddress: address,
        sessionKey: '0x1234...', // Truncated for security
        spendingLimit: '1000000000000000000', // 1 ETH
        remainingLimit: '750000000000000000', // 0.75 ETH
        expiresAt: Date.now() + 3600000, // 1 hour from now
        isActive: true,
        allowedTargets: ['0x' + '1'.repeat(40)],
        allowedMethods: ['increment', 'mint'],
        createdAt: Date.now() - 1800000, // 30 minutes ago
        lastUsed: Date.now() - 300000, // 5 minutes ago
        transactionCount: 3,
      },
      {
        id: 'session-456',
        userAddress: address,
        sessionKey: '0x5678...',
        spendingLimit: '500000000000000000', // 0.5 ETH
        remainingLimit: '0', // Spent
        expiresAt: Date.now() - 3600000, // Expired 1 hour ago
        isActive: false,
        allowedTargets: ['0x' + '2'.repeat(40)],
        allowedMethods: ['transfer'],
        createdAt: Date.now() - 7200000, // 2 hours ago
        lastUsed: Date.now() - 3700000, // 1 hour 2 minutes ago
        transactionCount: 5,
      },
    ];

    // Filter by status
    const filteredSessions = sessions.filter(session => {
      if (queryParams.status === 'all') return true;
      if (queryParams.status === 'active') return session.isActive && session.expiresAt > Date.now();
      if (queryParams.status === 'expired') return session.expiresAt <= Date.now();
      if (queryParams.status === 'revoked') return !session.isActive && session.expiresAt > Date.now();
      return false;
    });

    // Apply pagination
    const { page, limit } = queryParams;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedSessions = filteredSessions.slice(startIndex, endIndex);

    const response = {
      sessions: paginatedSessions,
      pagination: {
        page,
        limit,
        total: filteredSessions.length,
        pages: Math.ceil(filteredSessions.length / limit),
      },
      summary: {
        total: sessions.length,
        active: sessions.filter(s => s.isActive && s.expiresAt > Date.now()).length,
        expired: sessions.filter(s => s.expiresAt <= Date.now()).length,
        revoked: sessions.filter(s => !s.isActive && s.expiresAt > Date.now()).length,
      },
    };

    return createApiResponse(response);
  } catch (error) {
    return handleApiError(error);
  }
}

export const GET = withAuth(getSessionsHandler);