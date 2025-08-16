import { NextRequest } from 'next/server';
import { authenticate, AuthContext } from '@/lib/auth';
import { prisma } from '@/lib/db';

export interface ProjectContext extends AuthContext {
  project: any;
  environment: any;
}

export async function withProjectAuth<T extends any[]>(
  handler: (context: ProjectContext, ...args: T) => Promise<Response>
) {
  return async (request: NextRequest, ...args: T): Promise<Response> => {
    try {
      // First authenticate the API key
      const authContext = await authenticate(request);
      
      // If the user has a project/environment context, validate it
      if (authContext.user.projectId) {
        const project = await prisma.project.findUnique({
          where: { id: authContext.user.projectId },
          include: {
            environments: true,
            spendingLimits: true,
            sessionPolicies: true,
            gasPolicies: true,
          },
        });

        if (!project) {
          return new Response(
            JSON.stringify({
              success: false,
              error: {
                code: 'PROJECT_NOT_FOUND',
                message: 'Project associated with API key not found',
              },
            }),
            {
              status: 404,
              headers: { 'Content-Type': 'application/json' },
            }
          );
        }

        const environment = await prisma.environment.findUnique({
          where: { id: authContext.user.environmentId! },
        });

        if (!environment) {
          return new Response(
            JSON.stringify({
              success: false,
              error: {
                code: 'ENVIRONMENT_NOT_FOUND',
                message: 'Environment associated with API key not found',
              },
            }),
            {
              status: 404,
              headers: { 'Content-Type': 'application/json' },
            }
          );
        }

        return await handler({
          ...authContext,
          project,
          environment,
        }, ...args);
      }

      // For demo keys, create a mock project context
      const mockProject = {
        id: 'demo',
        name: 'Demo Project',
        defaultProvider: 'safe',
        defaultChainId: 84532,
        spendingLimits: [],
        sessionPolicies: [],
        gasPolicies: [],
      };

      const mockEnvironment = {
        id: 'demo-env',
        name: 'development',
        chainId: 84532,
        provider: 'safe',
      };

      return await handler({
        ...authContext,
        project: mockProject,
        environment: mockEnvironment,
      }, ...args);

    } catch (error) {
      console.error('Project auth middleware error:', error);
      
      if (error instanceof Error && error.name === 'AuthError') {
        return new Response(
          JSON.stringify({
            success: false,
            error: {
              code: 'AUTH_ERROR',
              message: error.message,
            },
          }),
          {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }

      return new Response(
        JSON.stringify({
          success: false,
          error: {
            code: 'INTERNAL_ERROR',
            message: 'An unexpected error occurred',
          },
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
  };
}

// Policy enforcement middleware
export function withPolicyEnforcement(
  policyType: 'session' | 'gas' | 'spending'
) {
  return function <T extends any[]>(
    handler: (context: ProjectContext, ...args: T) => Promise<Response>
  ) {
    return async (context: ProjectContext, ...args: T): Promise<Response> => {
      // TODO: Implement policy validation based on type
      // For now, just pass through
      return await handler(context, ...args);
    };
  };
}

// Activity logging middleware
export function withActivityLogging(event: string, endpoint: string) {
  return function <T extends any[]>(
    handler: (context: ProjectContext, ...args: T) => Promise<Response>
  ) {
    return async (context: ProjectContext, request: NextRequest, ...args: T): Promise<Response> => {
      const startTime = Date.now();
      
      try {
        const response = await handler(context, request, ...args);
        const responseTime = Date.now() - startTime;
        
        // Log the activity asynchronously
        setImmediate(async () => {
          try {
            await prisma.activityLog.create({
              data: {
                projectId: context.project.id,
                event,
                endpoint,
                method: request.method,
                userAddress: null, // Will be extracted from request body if needed
                apiKeyId: context.user.id,
                statusCode: response.status,
                responseTime,
                metadata: {
                  userAgent: request.headers.get('user-agent'),
                  requestId: context.requestId,
                },
              },
            });
          } catch (logError) {
            console.error('Failed to log activity:', logError);
          }
        });

        return response;
      } catch (error) {
        const responseTime = Date.now() - startTime;
        
        // Log error
        setImmediate(async () => {
          try {
            await prisma.activityLog.create({
              data: {
                projectId: context.project.id,
                event: `${event}.error`,
                endpoint,
                method: request.method,
                apiKeyId: context.user.id,
                statusCode: 500,
                responseTime,
                metadata: {
                  error: error instanceof Error ? error.message : 'Unknown error',
                  requestId: context.requestId,
                },
              },
            });
          } catch (logError) {
            console.error('Failed to log error activity:', logError);
          }
        });

        throw error;
      }
    };
  };
}