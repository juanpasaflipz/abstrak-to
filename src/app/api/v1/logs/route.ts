import { NextRequest } from 'next/server';
import { withProjectAuth, ProjectContext } from '@/lib/api/middleware';
import { createSuccessResponse, createValidationErrorResponse } from '@/lib/api/responses';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const getLogsSchema = z.object({
  since: z.string().datetime().optional(),
  until: z.string().datetime().optional(),
  event: z.string().optional(),
  limit: z.number().int().min(1).max(100).default(20),
  offset: z.number().int().min(0).default(0),
});

async function getLogsHandler(
  context: ProjectContext,
  request: NextRequest
): Promise<Response> {
  try {
    const url = new URL(request.url);
    const queryParams = {
      since: url.searchParams.get('since') || undefined,
      until: url.searchParams.get('until') || undefined,
      event: url.searchParams.get('event') || undefined,
      limit: parseInt(url.searchParams.get('limit') || '20'),
      offset: parseInt(url.searchParams.get('offset') || '0'),
    };
    
    // Validate query parameters
    const validationResult = getLogsSchema.safeParse(queryParams);
    if (!validationResult.success) {
      const fieldErrors: Record<string, string> = {};
      validationResult.error.errors.forEach(error => {
        const field = error.path.join('.');
        fieldErrors[field] = error.message;
      });
      return createValidationErrorResponse(fieldErrors, context.requestId);
    }

    const { since, until, event, limit, offset } = validationResult.data;
    
    // Build where clause
    const where: any = {
      projectId: context.project.id,
    };
    
    if (since) {
      where.createdAt = { ...where.createdAt, gte: new Date(since) };
    }
    
    if (until) {
      where.createdAt = { ...where.createdAt, lte: new Date(until) };
    }
    
    if (event) {
      where.event = { contains: event };
    }

    try {
      // Get logs with pagination
      const [logs, total] = await Promise.all([
        prisma.activityLog.findMany({
          where,
          orderBy: { createdAt: 'desc' },
          take: limit,
          skip: offset,
        }),
        prisma.activityLog.count({ where }),
      ]);

      const response = {
        logs: logs.map(log => ({
          id: log.id,
          event: log.event,
          endpoint: log.endpoint,
          method: log.method,
          statusCode: log.statusCode,
          responseTime: log.responseTime,
          userAddress: log.userAddress,
          metadata: log.metadata,
          createdAt: log.createdAt,
        })),
        pagination: {
          total,
          limit,
          offset,
          hasMore: offset + limit < total,
        },
        project: {
          id: context.project.id,
          name: context.project.name,
        },
      };

      return createSuccessResponse(response, context.requestId);
    } catch (dbError) {
      console.error('Database error:', dbError);
      
      // For demo projects, return mock logs
      if (context.project.id === 'demo') {
        const mockLogs = [
          {
            id: 'log_1',
            event: 'smart_account.create',
            endpoint: '/api/v1/smart-accounts',
            method: 'POST',
            statusCode: 201,
            responseTime: 245,
            userAddress: '0x1234567890123456789012345678901234567890',
            metadata: { provider: 'safe', chainId: 84532 },
            createdAt: new Date(Date.now() - 3600000), // 1 hour ago
          },
          {
            id: 'log_2',
            event: 'session.create',
            endpoint: '/api/v1/sessions',
            method: 'POST',
            statusCode: 201,
            responseTime: 189,
            userAddress: '0x1234567890123456789012345678901234567890',
            metadata: { ttl: 1800, dailyCap: '0.1' },
            createdAt: new Date(Date.now() - 1800000), // 30 minutes ago
          },
          {
            id: 'log_3',
            event: 'userop.simulate',
            endpoint: '/api/v1/userops/simulate',
            method: 'POST',
            statusCode: 200,
            responseTime: 156,
            userAddress: '0x1234567890123456789012345678901234567890',
            metadata: { gasEstimate: '150000', canSponsor: true },
            createdAt: new Date(Date.now() - 900000), // 15 minutes ago
          },
          {
            id: 'log_4',
            event: 'userop.execute',
            endpoint: '/api/v1/userops/execute',
            method: 'POST',
            statusCode: 201,
            responseTime: 2340,
            userAddress: '0x1234567890123456789012345678901234567890',
            metadata: { 
              userOpHash: '0xabcd...1234',
              txHash: '0xefgh...5678',
              gasUsed: '127836',
              sponsored: true 
            },
            createdAt: new Date(Date.now() - 600000), // 10 minutes ago
          },
        ];

        const filteredLogs = mockLogs.filter(log => {
          if (event && !log.event.includes(event)) return false;
          return true;
        });

        const response = {
          logs: filteredLogs.slice(offset, offset + limit),
          pagination: {
            total: filteredLogs.length,
            limit,
            offset,
            hasMore: offset + limit < filteredLogs.length,
          },
          project: {
            id: context.project.id,
            name: context.project.name,
          },
        };

        return createSuccessResponse(response, context.requestId);
      }

      throw dbError;
    }
  } catch (error) {
    console.error('Failed to get logs:', error);
    return createSuccessResponse(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to get activity logs',
          details: error instanceof Error ? error.message : 'Unknown error',
        },
      },
      context.requestId,
      500
    );
  }
}

// Export with middleware
export const GET = withProjectAuth(getLogsHandler);