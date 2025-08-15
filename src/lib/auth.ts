import { NextRequest } from 'next/server';

export interface ApiUser {
  id: string;
  apiKey: string;
  name: string;
  rateLimit: number;
  isActive: boolean;
}

export interface AuthContext {
  user: ApiUser;
  requestId: string;
}

// Rate limiting storage (in production, use Redis)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export class AuthError extends Error {
  constructor(
    message: string,
    public statusCode: number = 401
  ) {
    super(message);
    this.name = 'AuthError';
  }
}

export class RateLimitError extends Error {
  constructor(
    message: string,
    public retryAfter: number
  ) {
    super(message);
    this.name = 'RateLimitError';
  }
}

// Mock user database (in production, use a real database)
const API_USERS: ApiUser[] = [
  {
    id: 'user_1',
    apiKey: 'ak_test_1234567890abcdef',
    name: 'Test User',
    rateLimit: 100, // requests per minute
    isActive: true,
  },
  {
    id: 'demo_user',
    apiKey: 'ak_demo_abcdef1234567890',
    name: 'Demo User',
    rateLimit: 10, // lower limit for demo
    isActive: true,
  },
];

export function extractApiKey(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization');
  
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  
  // Also check query parameter for convenience (less secure)
  const urlKey = new URL(request.url).searchParams.get('apiKey');
  return urlKey;
}

export function validateApiKey(apiKey: string): ApiUser {
  if (!apiKey) {
    throw new AuthError('API key is required');
  }

  if (!apiKey.startsWith('ak_')) {
    throw new AuthError('Invalid API key format');
  }

  const user = API_USERS.find(u => u.apiKey === apiKey);
  
  if (!user) {
    throw new AuthError('Invalid API key');
  }

  if (!user.isActive) {
    throw new AuthError('API key is inactive');
  }

  return user;
}

export function checkRateLimit(user: ApiUser): void {
  const now = Date.now();
  const windowStart = Math.floor(now / 60000) * 60000; // 1-minute windows
  const key = `${user.id}:${windowStart}`;
  
  const current = rateLimitMap.get(key) || { count: 0, resetTime: windowStart + 60000 };
  
  if (current.count >= user.rateLimit) {
    const retryAfter = Math.ceil((current.resetTime - now) / 1000);
    throw new RateLimitError(
      `Rate limit exceeded. Try again in ${retryAfter} seconds.`,
      retryAfter
    );
  }

  current.count++;
  rateLimitMap.set(key, current);

  // Clean up old entries
  if (Math.random() < 0.01) { // 1% chance to clean up
    for (const [mapKey, value] of rateLimitMap.entries()) {
      if (value.resetTime < now) {
        rateLimitMap.delete(mapKey);
      }
    }
  }
}

export async function authenticate(request: NextRequest): Promise<AuthContext> {
  const apiKey = extractApiKey(request);
  
  if (!apiKey) {
    throw new AuthError('Missing API key. Provide it in Authorization header: Bearer ak_your_key');
  }

  const user = validateApiKey(apiKey);
  checkRateLimit(user);

  return {
    user,
    requestId: crypto.randomUUID(),
  };
}

export function withAuth<T extends any[]>(
  handler: (authContext: AuthContext, ...args: T) => Promise<Response>
) {
  return async (request: NextRequest, ...args: T): Promise<Response> => {
    try {
      const authContext = await authenticate(request);
      return await handler(authContext, ...args);
    } catch (error) {
      if (error instanceof AuthError) {
        return new Response(
          JSON.stringify({
            error: 'Authentication failed',
            message: error.message,
            code: 'AUTH_ERROR',
          }),
          {
            status: error.statusCode,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }

      if (error instanceof RateLimitError) {
        return new Response(
          JSON.stringify({
            error: 'Rate limit exceeded',
            message: error.message,
            code: 'RATE_LIMIT_ERROR',
          }),
          {
            status: 429,
            headers: {
              'Content-Type': 'application/json',
              'Retry-After': error.retryAfter.toString(),
            },
          }
        );
      }

      console.error('Authentication error:', error);
      return new Response(
        JSON.stringify({
          error: 'Internal server error',
          message: 'An unexpected error occurred',
          code: 'INTERNAL_ERROR',
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
  };
}

// Helper to create API responses with consistent format
export function createApiResponse(
  data: any,
  status: number = 200,
  headers: Record<string, string> = {}
): Response {
  const responseData = {
    success: status >= 200 && status < 300,
    data: status >= 200 && status < 300 ? data : undefined,
    error: status >= 400 ? data : undefined,
    timestamp: new Date().toISOString(),
  };

  return new Response(JSON.stringify(responseData), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'X-API-Version': '1.0.0',
      ...headers,
    },
  });
}

// Error handler for API routes
export function handleApiError(error: unknown): Response {
  console.error('API Error:', error);

  if (error instanceof AuthError) {
    return createApiResponse(
      {
        message: error.message,
        code: 'AUTH_ERROR',
      },
      error.statusCode
    );
  }

  if (error instanceof RateLimitError) {
    return createApiResponse(
      {
        message: error.message,
        code: 'RATE_LIMIT_ERROR',
      },
      429,
      { 'Retry-After': error.retryAfter.toString() }
    );
  }

  if (error instanceof Error) {
    return createApiResponse(
      {
        message: error.message,
        code: 'VALIDATION_ERROR',
      },
      400
    );
  }

  return createApiResponse(
    {
      message: 'An unexpected error occurred',
      code: 'INTERNAL_ERROR',
    },
    500
  );
}