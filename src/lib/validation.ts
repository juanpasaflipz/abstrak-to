import { z } from 'zod';

// Ethereum address validation
export const addressSchema = z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid Ethereum address');

// Transaction hash validation
export const txHashSchema = z.string().regex(/^0x[a-fA-F0-9]{64}$/, 'Invalid transaction hash');

// Private key validation (64 hex characters)
export const privateKeySchema = z.string().regex(/^0x[a-fA-F0-9]{64}$/, 'Invalid private key format');

// Chain ID validation
export const chainIdSchema = z.number().int().positive();

// Wei amount validation (string representation of big number)
export const weiAmountSchema = z.string().regex(/^\d+$/, 'Invalid wei amount');

// Account creation request
export const createAccountRequestSchema = z.object({
  ownerAddress: addressSchema,
  chainId: chainIdSchema.optional(),
  provider: z.enum(['safe', 'alchemy', 'biconomy']).optional(),
});

// Session creation request
export const createSessionRequestSchema = z.object({
  userAddress: addressSchema,
  spendingLimit: weiAmountSchema,
  duration: z.number().int().positive().max(86400000), // Max 24 hours in milliseconds
  allowedTargets: z.array(addressSchema).optional(),
  allowedMethods: z.array(z.string()).optional(),
});

// Transaction execution request
export const executeTransactionRequestSchema = z.object({
  userAddress: addressSchema,
  to: addressSchema,
  value: weiAmountSchema.default('0'),
  data: z.string().regex(/^0x[a-fA-F0-9]*$/, 'Invalid hex data').default('0x'),
  sessionId: z.string().optional(),
  gasLimit: z.number().int().positive().optional(),
});

// Batch transaction execution request
export const executeBatchRequestSchema = z.object({
  userAddress: addressSchema,
  transactions: z.array(z.object({
    to: addressSchema,
    value: weiAmountSchema.default('0'),
    data: z.string().regex(/^0x[a-fA-F0-9]*$/, 'Invalid hex data').default('0x'),
  })).min(1).max(10), // Limit batch size
  sessionId: z.string().optional(),
});

// Spending limits update request
export const updateLimitsRequestSchema = z.object({
  userAddress: addressSchema,
  dailyLimit: weiAmountSchema,
  transactionLimit: weiAmountSchema,
  allowedTargets: z.array(addressSchema).optional(),
});

// Gas estimation request
export const estimateGasRequestSchema = z.object({
  userAddress: addressSchema,
  to: addressSchema,
  value: weiAmountSchema.optional().default('0'),
  data: z.string().regex(/^0x[a-fA-F0-9]*$/, 'Invalid hex data').optional().default('0x'),
});

// Webhook configuration
export const webhookConfigSchema = z.object({
  url: z.string().url(),
  events: z.array(z.enum(['transaction.completed', 'transaction.failed', 'session.created', 'session.revoked'])),
  secret: z.string().min(32, 'Webhook secret must be at least 32 characters'),
});

// Query parameters for pagination
export const paginationSchema = z.object({
  page: z.number().int().positive().optional().default(1),
  limit: z.number().int().positive().max(100).optional().default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

// Transaction status filter
export const transactionStatusSchema = z.enum(['pending', 'success', 'failed', 'cancelled']);

// Date range filter
export const dateRangeSchema = z.object({
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
});

// Validation helper function
export function validateRequest<T>(schema: z.ZodSchema<T>, data: unknown): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const formattedErrors = error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message,
        code: err.code,
      }));
      
      throw new ValidationError('Request validation failed', formattedErrors);
    }
    throw error;
  }
}

export class ValidationError extends Error {
  constructor(
    message: string,
    public errors: Array<{ field: string; message: string; code: string }>
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

// Helper to validate query parameters
export function validateQueryParams(searchParams: URLSearchParams, schema: z.ZodSchema) {
  const params: Record<string, any> = {};
  
  for (const [key, value] of searchParams.entries()) {
    // Try to parse numbers
    if (/^\d+$/.test(value)) {
      params[key] = parseInt(value, 10);
    } else if (/^\d+\.\d+$/.test(value)) {
      params[key] = parseFloat(value);
    } else if (value === 'true' || value === 'false') {
      params[key] = value === 'true';
    } else {
      params[key] = value;
    }
  }
  
  return validateRequest(schema, params);
}

// Contract interaction validation
export const contractCallSchema = z.object({
  contractAddress: addressSchema,
  functionName: z.string().min(1),
  args: z.array(z.any()).optional().default([]),
  value: weiAmountSchema.optional().default('0'),
});

// Smart account deployment validation
export const deployAccountRequestSchema = z.object({
  ownerAddress: addressSchema,
  chainId: chainIdSchema.optional(),
  provider: z.enum(['safe', 'alchemy', 'biconomy']).optional(),
  initializers: z.array(contractCallSchema).optional(),
});

// Session key validation with enhanced security
export const sessionKeySchema = z.object({
  id: z.string().uuid(),
  userAddress: addressSchema,
  sessionKey: privateKeySchema,
  spendingLimit: weiAmountSchema,
  dailySpent: weiAmountSchema.optional().default('0'),
  allowedTargets: z.array(addressSchema).optional(),
  allowedMethods: z.array(z.string()).optional(),
  expiresAt: z.number().int().positive(),
  isActive: z.boolean().default(true),
  createdAt: z.number().int().positive(),
});

// Response schemas for type safety
export const accountResponseSchema = z.object({
  address: addressSchema,
  provider: z.string(),
  isDeployed: z.boolean(),
  balance: weiAmountSchema.optional(),
  nonce: z.number().int().nonnegative().optional(),
});

export const sessionResponseSchema = z.object({
  id: z.string().uuid(),
  userAddress: addressSchema,
  sessionKey: z.string(), // Don't expose full private key
  spendingLimit: weiAmountSchema,
  remainingLimit: weiAmountSchema,
  expiresAt: z.number().int().positive(),
  isActive: z.boolean(),
  allowedTargets: z.array(addressSchema).optional(),
});

export const transactionResponseSchema = z.object({
  hash: txHashSchema.optional(),
  from: addressSchema,
  to: addressSchema,
  value: weiAmountSchema,
  gasUsed: z.string().optional(),
  gasPrice: z.string().optional(),
  status: transactionStatusSchema,
  sponsored: z.boolean(),
  timestamp: z.number().int().positive(),
  blockNumber: z.number().int().positive().optional(),
});

// Export types for TypeScript
export type CreateAccountRequest = z.infer<typeof createAccountRequestSchema>;
export type CreateSessionRequest = z.infer<typeof createSessionRequestSchema>;
export type ExecuteTransactionRequest = z.infer<typeof executeTransactionRequestSchema>;
export type ExecuteBatchRequest = z.infer<typeof executeBatchRequestSchema>;
export type UpdateLimitsRequest = z.infer<typeof updateLimitsRequestSchema>;
export type EstimateGasRequest = z.infer<typeof estimateGasRequestSchema>;
export type WebhookConfig = z.infer<typeof webhookConfigSchema>;
export type PaginationParams = z.infer<typeof paginationSchema>;
export type TransactionStatus = z.infer<typeof transactionStatusSchema>;
export type DateRange = z.infer<typeof dateRangeSchema>;
export type ContractCall = z.infer<typeof contractCallSchema>;
export type DeployAccountRequest = z.infer<typeof deployAccountRequestSchema>;
export type SessionKey = z.infer<typeof sessionKeySchema>;
export type AccountResponse = z.infer<typeof accountResponseSchema>;
export type SessionResponse = z.infer<typeof sessionResponseSchema>;
export type TransactionResponse = z.infer<typeof transactionResponseSchema>;