export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta: {
    requestId: string;
    timestamp: string;
    version: string;
  };
}

export function createSuccessResponse<T>(
  data: T,
  requestId: string,
  status: number = 200
): Response {
  const response: ApiResponse<T> = {
    success: true,
    data,
    meta: {
      requestId,
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    },
  };

  return new Response(JSON.stringify(response), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'X-Request-ID': requestId,
      'X-API-Version': '1.0.0',
    },
  });
}

export function createErrorResponse(
  code: string,
  message: string,
  requestId: string,
  status: number = 400,
  details?: any
): Response {
  const response: ApiResponse = {
    success: false,
    error: {
      code,
      message,
      details,
    },
    meta: {
      requestId,
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    },
  };

  return new Response(JSON.stringify(response), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'X-Request-ID': requestId,
      'X-API-Version': '1.0.0',
    },
  });
}

// Common error responses
export const ErrorCodes = {
  // Authentication
  AUTH_REQUIRED: 'AUTH_REQUIRED',
  INVALID_API_KEY: 'INVALID_API_KEY',
  API_KEY_EXPIRED: 'API_KEY_EXPIRED',
  RATE_LIMITED: 'RATE_LIMITED',
  
  // Authorization
  INSUFFICIENT_PERMISSIONS: 'INSUFFICIENT_PERMISSIONS',
  PROJECT_ACCESS_DENIED: 'PROJECT_ACCESS_DENIED',
  
  // Validation
  INVALID_INPUT: 'INVALID_INPUT',
  MISSING_REQUIRED_FIELD: 'MISSING_REQUIRED_FIELD',
  INVALID_ADDRESS: 'INVALID_ADDRESS',
  INVALID_CHAIN_ID: 'INVALID_CHAIN_ID',
  
  // Business Logic
  ACCOUNT_ALREADY_EXISTS: 'ACCOUNT_ALREADY_EXISTS',
  SESSION_EXPIRED: 'SESSION_EXPIRED',
  SPENDING_LIMIT_EXCEEDED: 'SPENDING_LIMIT_EXCEEDED',
  POLICY_VIOLATION: 'POLICY_VIOLATION',
  
  // Infrastructure
  PROVIDER_ERROR: 'PROVIDER_ERROR',
  BUNDLER_ERROR: 'BUNDLER_ERROR',
  PAYMASTER_ERROR: 'PAYMASTER_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
  
  // General
  NOT_FOUND: 'NOT_FOUND',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
} as const;

export function createValidationErrorResponse(
  fieldErrors: Record<string, string>,
  requestId: string
): Response {
  return createErrorResponse(
    ErrorCodes.INVALID_INPUT,
    'Request validation failed',
    requestId,
    400,
    { fieldErrors }
  );
}

export function createNotFoundResponse(
  resource: string,
  requestId: string
): Response {
  return createErrorResponse(
    ErrorCodes.NOT_FOUND,
    `${resource} not found`,
    requestId,
    404
  );
}

export function createUnauthorizedResponse(
  message: string,
  requestId: string
): Response {
  return createErrorResponse(
    ErrorCodes.AUTH_REQUIRED,
    message,
    requestId,
    401
  );
}

export function createForbiddenResponse(
  message: string,
  requestId: string
): Response {
  return createErrorResponse(
    ErrorCodes.INSUFFICIENT_PERMISSIONS,
    message,
    requestId,
    403
  );
}

export function createRateLimitResponse(
  retryAfter: number,
  requestId: string
): Response {
  const response = createErrorResponse(
    ErrorCodes.RATE_LIMITED,
    `Rate limit exceeded. Try again in ${retryAfter} seconds.`,
    requestId,
    429
  );

  // Add retry-after header
  const headers = new Headers(response.headers);
  headers.set('Retry-After', retryAfter.toString());
  
  return new Response(response.body, {
    status: response.status,
    headers,
  });
}

export function createInternalErrorResponse(
  requestId: string,
  error?: Error
): Response {
  const message = process.env.NODE_ENV === 'development' && error
    ? error.message
    : 'An unexpected error occurred';

  return createErrorResponse(
    ErrorCodes.INTERNAL_ERROR,
    message,
    requestId,
    500
  );
}