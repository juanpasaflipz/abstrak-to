import { vi } from 'vitest';

// Mock Next.js API route helpers
export const mockRequest = (overrides: Partial<Request> = {}) => ({
  method: 'GET',
  url: 'http://localhost:3000/api/test',
  headers: new Headers(),
  json: vi.fn(),
  text: vi.fn(),
  ...overrides,
});

export const mockResponse = () => {
  const response = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
    send: vi.fn().mockReturnThis(),
    end: vi.fn().mockReturnThis(),
    setHeader: vi.fn().mockReturnThis(),
  };
  return response;
};

// Mock API authentication
export const mockAuthenticatedRequest = (apiKey = 'test-api-key') => ({
  ...mockRequest(),
  headers: new Headers({
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  }),
});

// Mock user addresses for testing
export const TEST_ADDRESSES = {
  user1: '0x1234567890123456789012345678901234567890',
  user2: '0x9876543210987654321098765432109876543210',
  smartAccount1: '0xabcdef1234567890123456789012345678901234',
  smartAccount2: '0x567890abcdef123456789012345678901234abcd',
};

// Mock session data
export const mockSessionData = {
  id: 'session-123',
  userAddress: TEST_ADDRESSES.user1,
  sessionKey: '0x' + '1'.repeat(64),
  spendingLimit: '1000000000000000000', // 1 ETH
  expiration: Date.now() + 3600000, // 1 hour
  isActive: true,
};

// Mock transaction data
export const mockTransactionData = {
  hash: '0x' + '9'.repeat(64),
  from: TEST_ADDRESSES.smartAccount1,
  to: '0x' + '8'.repeat(40),
  value: '0',
  gasUsed: '21000',
  status: 'success',
  sponsored: true,
};

// Mock environment variables for API tests
export const setupApiTestEnv = () => {
  process.env.AA_PROVIDER = 'safe';
  process.env.NEXT_PUBLIC_CHAIN = 'base-sepolia';
  process.env.NEXT_PUBLIC_ALCHEMY_API_KEY = 'test-alchemy-key';
  process.env.BICONOMY_API_KEY = 'test-biconomy-key';
  process.env.API_SECRET_KEY = 'test-secret-key';
};

// Clean up environment after tests
export const cleanupApiTestEnv = () => {
  delete process.env.AA_PROVIDER;
  delete process.env.NEXT_PUBLIC_CHAIN;
  delete process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;
  delete process.env.BICONOMY_API_KEY;
  delete process.env.API_SECRET_KEY;
};