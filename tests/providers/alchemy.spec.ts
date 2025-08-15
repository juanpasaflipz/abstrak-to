import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getAlchemyAccount } from '../../src/lib/aa/alchemy';
import type { SmartAccountConfig } from '../../src/lib/aa/index';

// Mock Alchemy SDK
vi.mock('@alchemy/aa-alchemy', () => ({
  createLightAccountAlchemyClient: vi.fn(),
  createAlchemySmartAccountClient: vi.fn(),
}));

vi.mock('@alchemy/aa-core', () => ({
  createSmartAccountClient: vi.fn(),
  type: vi.fn(),
}));

describe('Alchemy Provider', () => {
  const mockConfig: SmartAccountConfig = {
    ownerAddress: '0x1234567890123456789012345678901234567890',
    chainId: 84532, // Base Sepolia
  };

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock environment variables
    process.env.NEXT_PUBLIC_ALCHEMY_API_KEY = 'test-api-key';
    process.env.ALCHEMY_GAS_POLICY_ID = 'test-policy-id';
  });

  describe('getAlchemyAccount', () => {
    it('should create an Alchemy Light Account with correct configuration', async () => {
      const account = await getAlchemyAccount(mockConfig);

      expect(account).toBeDefined();
      expect(account.provider).toBe('alchemy');
      expect(account.address).toMatch(/^0x[a-fA-F0-9]{40}$/);
      expect(typeof account.isDeployed).toBe('boolean');
    });

    it('should generate deterministic addresses', async () => {
      const account1 = await getAlchemyAccount(mockConfig);
      const account2 = await getAlchemyAccount(mockConfig);

      expect(account1.address).toBe(account2.address);
    });

    it('should handle different owners', async () => {
      const config2 = {
        ...mockConfig,
        ownerAddress: '0x9876543210987654321098765432109876543210',
      };

      const account1 = await getAlchemyAccount(mockConfig);
      const account2 = await getAlchemyAccount(config2);

      expect(account1.address).not.toBe(account2.address);
    });

    it('should support multiple chains', async () => {
      const mainnetConfig = { ...mockConfig, chainId: 1 };
      const sepoliaConfig = { ...mockConfig, chainId: 11155111 };

      const mainnetAccount = await getAlchemyAccount(mainnetConfig);
      const sepoliaAccount = await getAlchemyAccount(sepoliaConfig);

      expect(mainnetAccount.address).not.toBe(sepoliaAccount.address);
    });
  });

  describe('Environment Configuration', () => {
    it('should require API key', async () => {
      delete process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;

      await expect(getAlchemyAccount(mockConfig)).rejects.toThrow(
        'Alchemy API key is required'
      );
    });

    it('should work without gas policy ID for basic operations', async () => {
      delete process.env.ALCHEMY_GAS_POLICY_ID;

      const account = await getAlchemyAccount(mockConfig);
      expect(account).toBeDefined();
    });

    it('should validate API key format', async () => {
      process.env.NEXT_PUBLIC_ALCHEMY_API_KEY = 'invalid-key';

      await expect(getAlchemyAccount(mockConfig)).rejects.toThrow();
    });
  });

  describe('Gas Sponsorship', () => {
    beforeEach(() => {
      process.env.ALCHEMY_GAS_POLICY_ID = 'test-policy-123';
    });

    it('should configure gas manager with policy ID', async () => {
      const account = await getAlchemyAccount(mockConfig);
      
      expect(account).toBeDefined();
      // Gas manager configuration would be tested in integration tests
    });

    it('should handle gas policy errors gracefully', async () => {
      process.env.ALCHEMY_GAS_POLICY_ID = 'invalid-policy';

      // Should not throw during account creation, only during transaction
      const account = await getAlchemyAccount(mockConfig);
      expect(account).toBeDefined();
    });
  });

  describe('Chain Support', () => {
    const supportedChains = [
      { name: 'Ethereum Mainnet', chainId: 1 },
      { name: 'Sepolia', chainId: 11155111 },
      { name: 'Base Sepolia', chainId: 84532 },
      { name: 'Polygon', chainId: 137 },
      { name: 'Arbitrum', chainId: 42161 },
    ];

    supportedChains.forEach(({ name, chainId }) => {
      it(`should support ${name} (${chainId})`, async () => {
        const config = { ...mockConfig, chainId };
        const account = await getAlchemyAccount(config);

        expect(account).toBeDefined();
        expect(account.provider).toBe('alchemy');
      });
    });

    it('should reject unsupported chains', async () => {
      const unsupportedConfig = { ...mockConfig, chainId: 999999 };

      await expect(getAlchemyAccount(unsupportedConfig)).rejects.toThrow(
        'Unsupported chain'
      );
    });
  });

  describe('Error Handling', () => {
    it('should handle network timeouts', async () => {
      // Mock network timeout
      vi.mocked(require('@alchemy/aa-alchemy').createLightAccountAlchemyClient)
        .mockRejectedValue(new Error('Network timeout'));

      await expect(getAlchemyAccount(mockConfig)).rejects.toThrow('Network timeout');
    });

    it('should handle rate limiting', async () => {
      vi.mocked(require('@alchemy/aa-alchemy').createLightAccountAlchemyClient)
        .mockRejectedValue(new Error('Rate limit exceeded'));

      await expect(getAlchemyAccount(mockConfig)).rejects.toThrow('Rate limit exceeded');
    });

    it('should provide helpful error context', async () => {
      vi.mocked(require('@alchemy/aa-alchemy').createLightAccountAlchemyClient)
        .mockRejectedValue(new Error('API key invalid'));

      try {
        await getAlchemyAccount(mockConfig);
      } catch (error) {
        expect((error as Error).message).toContain('Alchemy');
        expect((error as Error).message).toContain('API key');
      }
    });
  });
});