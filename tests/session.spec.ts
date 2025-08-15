import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createSessionKey, getActiveSession, revokeSession } from '../src/lib/sessionKeys';

describe('Session Key Management', () => {
  beforeEach(() => {
    // Setup is handled in tests/setup.ts
    localStorage.getItem = vi.fn().mockReturnValue('{}');
  });

  it('should create a new session key', async () => {
    const userAddress = '0x1234567890123456789012345678901234567890';
    const sessionKey = await createSessionKey(userAddress);
    
    expect(sessionKey).toBeDefined();
    expect(sessionKey).toMatch(/^0x[a-fA-F0-9]{64}$/);
  });

  it('should retrieve active session', () => {
    const userAddress = '0x1234567890123456789012345678901234567890';
    const session = getActiveSession(userAddress);
    
    // Should return null for non-existent session
    expect(session).toBeNull();
  });

  it('should revoke session', () => {
    const userAddress = '0x1234567890123456789012345678901234567890';
    const result = revokeSession(userAddress);
    
    expect(result).toBe(true);
  });
});
