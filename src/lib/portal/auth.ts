import { NextRequest } from 'next/server';
import { validateApiKey } from './projects';
import { prisma } from '@/lib/db';

export interface AuthContext {
  user: {
    id: string;
    address: string;
    name?: string;
  };
  project: {
    id: string;
    name: string;
    ownerId: string;
  };
  environment: {
    id: string;
    name: string;
  };
  apiKey: {
    id: string;
    scopes: string[];
  };
}

export async function authenticateRequest(request: NextRequest): Promise<AuthContext | null> {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const apiKey = authHeader.substring(7); // Remove 'Bearer '
  const authData = await validateApiKey(apiKey);
  
  if (!authData) {
    return null;
  }

  return {
    user: {
      id: authData.user.id,
      address: authData.user.address,
      name: authData.user.name,
    },
    project: {
      id: authData.project.id,
      name: authData.project.name,
      ownerId: authData.project.ownerId,
    },
    environment: {
      id: authData.environment.id,
      name: authData.environment.name,
    },
    apiKey: {
      id: authData.id,
      scopes: authData.scopes as string[],
    },
  };
}

export function hasScope(context: AuthContext, requiredScope: string): boolean {
  return context.apiKey.scopes.includes(requiredScope) || context.apiKey.scopes.includes('admin');
}

export function isProjectOwner(context: AuthContext): boolean {
  return context.user.id === context.project.ownerId;
}

export async function createOrUpdateUser(address: string, data?: { name?: string; email?: string }) {
  const existingUser = await prisma.user.findUnique({
    where: { address },
  });

  if (existingUser) {
    if (data) {
      return await prisma.user.update({
        where: { address },
        data,
      });
    }
    return existingUser;
  }

  return await prisma.user.create({
    data: {
      address,
      name: data?.name,
      email: data?.email,
    },
  });
}

// Utility for wrapping API handlers with authentication
export function withAuth<T extends any[]>(
  handler: (context: AuthContext, request: NextRequest, ...args: T) => Promise<Response>
) {
  return async (request: NextRequest, ...args: T): Promise<Response> => {
    const authContext = await authenticateRequest(request);
    
    if (!authContext) {
      return new Response(
        JSON.stringify({
          success: false,
          error: {
            code: 'AUTH_ERROR',
            message: 'Invalid or missing API key',
          },
          timestamp: new Date().toISOString(),
        }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    try {
      return await handler(authContext, request, ...args);
    } catch (error) {
      console.error('API error:', error);
      return new Response(
        JSON.stringify({
          success: false,
          error: {
            code: 'INTERNAL_ERROR',
            message: 'Internal server error',
          },
          timestamp: new Date().toISOString(),
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
  };
}

export function createApiResponse(data: any, status: number = 200): Response {
  return new Response(
    JSON.stringify({
      success: status < 400,
      data: status < 400 ? data : undefined,
      error: status >= 400 ? data : undefined,
      timestamp: new Date().toISOString(),
    }),
    {
      status,
      headers: { 'Content-Type': 'application/json' },
    }
  );
}