import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getSafeAccount, createSafeSession } from '../../src/lib/aa/safe';
import type { SmartAccountConfig } from '../../src/lib/aa/index';

describe('Safe Provider', () => {
  const mockConfig: SmartAccountConfig = {
    ownerAddress: '0x1234567890123456789012345678901234567890',
    chainId: 84532, // Base Sepolia
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getSafeAccount', () => {
    it('should create a Safe smart account with deterministic address', async () => {
      const account = await getSafeAccount(mockConfig);

      expect(account).toBeDefined();
      expect(account.provider).toBe('safe');
      expect(account.address).toMatch(/^0x[a-fA-F0-9]{40}$/);
      expect(account.isDeployed).toBe(false);
    });

    it('should generate same address for same owner and chain', async () => {
      const account1 = await getSafeAccount(mockConfig);
      const account2 = await getSafeAccount(mockConfig);

      expect(account1.address).toBe(account2.address);
    });

    it('should generate different addresses for different owners', async () => {
      const config2 = {
        ...mockConfig,
        ownerAddress: '0x9876543210987654321098765432109876543210',
      };

      const account1 = await getSafeAccount(mockConfig);
      const account2 = await getSafeAccount(config2);

      expect(account1.address).not.toBe(account2.address);
    });

    it('should generate different addresses for different chains', async () => {
      const config2 = {
        ...mockConfig,
        chainId: 1, // Ethereum mainnet
      };

      const account1 = await getSafeAccount(mockConfig);
      const account2 = await getSafeAccount(config2);

      expect(account1.address).not.toBe(account2.address);
    });
  });

  describe('createSafeSession', () => {
    const mockSafeAddress = '0x1234567890123456789012345678901234567890';
    const mockSessionKey = '0x' + '1'.repeat(64);
    const mockSpendingLimit = '1000000000000000000'; // 1 ETH in wei
    const mockExpiration = Date.now() + 3600000; // 1 hour from now

    it('should create a session successfully', async () => {
      const result = await createSafeSession(
        mockSafeAddress,
        mockSessionKey,
        mockSpendingLimit,
        mockExpiration
      );

      expect(result).toBe(true);
    });

    it('should handle invalid session parameters', async () => {
      // Test with invalid address
      await expect(
        createSafeSession(
          'invalid-address',
          mockSessionKey,
          mockSpendingLimit,
          mockExpiration
        )
      ).rejects.toThrow();

      // Test with invalid session key
      await expect(
        createSafeSession(
          mockSafeAddress,
          'invalid-key',
          mockSpendingLimit,
          mockExpiration
        )
      ).rejects.toThrow();
    });

    it('should handle expired sessions', async () => {
      const expiredTime = Date.now() - 3600000; // 1 hour ago

      await expect(
        createSafeSession(
          mockSafeAddress,
          mockSessionKey,
          mockSpendingLimit,
          expiredTime
        )
      ).rejects.toThrow('Session expiration time is in the past');
    });

    it('should validate spending limit format', async () => {
      await expect(
        createSafeSession(
          mockSafeAddress,
          mockSessionKey,
          'invalid-amount',
          mockExpiration
        )
      ).rejects.toThrow();
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors gracefully', async () => {
      // Mock a network error scenario
      const networkErrorConfig = {
        ...mockConfig,
        chainId: 999999, // Non-existent chain
      };

      await expect(getSafeAccount(networkErrorConfig)).rejects.toThrow();
    });

    it('should provide meaningful error messages', async () => {
      try {
        await createSafeSession(
          'invalid',
          'invalid',
          'invalid',
          -1
        );
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toContain('Invalid');
      }
    });
  });
});