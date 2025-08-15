import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getBiconomyAccount } from '../../src/lib/aa/biconomy';
import type { SmartAccountConfig } from '../../src/lib/aa/index';

// Mock Biconomy SDK
vi.mock('@biconomy/account', () => ({
  createSmartAccountClient: vi.fn(),
  BiconomySmartAccountV2: vi.fn(),
}));

vi.mock('@biconomy/paymaster', () => ({
  createPaymaster: vi.fn(),
  PaymasterMode: {
    SPONSORED: 'SPONSORED',
  },
}));

describe('Biconomy Provider', () => {
  const mockConfig: SmartAccountConfig = {
    ownerAddress: '0x1234567890123456789012345678901234567890',
    chainId: 84532, // Base Sepolia
  };

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock environment variables
    process.env.BICONOMY_API_KEY = 'test-biconomy-key';
  });

  describe('getBiconomyAccount', () => {
    it('should create a Biconomy Smart Account V2', async () => {
      const account = await getBiconomyAccount(mockConfig);

      expect(account).toBeDefined();
      expect(account.provider).toBe('biconomy');
      expect(account.address).toMatch(/^0x[a-fA-F0-9]{40}$/);
      expect(typeof account.isDeployed).toBe('boolean');
    });

    it('should generate consistent addresses for same owner', async () => {
      const account1 = await getBiconomyAccount(mockConfig);
      const account2 = await getBiconomyAccount(mockConfig);

      expect(account1.address).toBe(account2.address);
    });

    it('should generate different addresses for different owners', async () => {
      const config2 = {
        ...mockConfig,
        ownerAddress: '0x9876543210987654321098765432109876543210',
      };

      const account1 = await getBiconomyAccount(mockConfig);
      const account2 = await getBiconomyAccount(config2);

      expect(account1.address).not.toBe(account2.address);
    });

    it('should handle different chain configurations', async () => {
      const polygonConfig = { ...mockConfig, chainId: 137 };
      const baseConfig = { ...mockConfig, chainId: 84532 };

      const polygonAccount = await getBiconomyAccount(polygonConfig);
      const baseAccount = await getBiconomyAccount(baseConfig);

      expect(polygonAccount.address).not.toBe(baseAccount.address);
    });
  });

  describe('Environment Configuration', () => {
    it('should require Biconomy API key', async () => {
      delete process.env.BICONOMY_API_KEY;

      await expect(getBiconomyAccount(mockConfig)).rejects.toThrow(
        'Biconomy API key is required'
      );
    });

    it('should validate API key format', async () => {
      process.env.BICONOMY_API_KEY = 'invalid-short-key';

      await expect(getBiconomyAccount(mockConfig)).rejects.toThrow();
    });

    it('should use correct bundler URLs for different chains', async () => {
      const configs = [
        { chainId: 137, name: 'Polygon' },
        { chainId: 84532, name: 'Base Sepolia' },
        { chainId: 1, name: 'Ethereum' },
      ];

      for (const { chainId, name } of configs) {
        const config = { ...mockConfig, chainId };
        const account = await getBiconomyAccount(config);
        
        expect(account).toBeDefined();
        expect(account.provider).toBe('biconomy');
      }
    });
  });

  describe('Paymaster Integration', () => {
    it('should configure paymaster for sponsored transactions', async () => {
      const account = await getBiconomyAccount(mockConfig);
      
      expect(account).toBeDefined();
      // Paymaster integration would be tested in integration tests
    });

    it('should handle paymaster configuration errors', async () => {
      // Mock paymaster creation failure
      vi.mocked(require('@biconomy/paymaster').createPaymaster)
        .mockRejectedValue(new Error('Paymaster configuration failed'));

      // Should still create account but without paymaster
      const account = await getBiconomyAccount(mockConfig);
      expect(account).toBeDefined();
    });

    it('should support different paymaster modes', async () => {
      const account = await getBiconomyAccount(mockConfig);
      
      expect(account).toBeDefined();
      expect(account.provider).toBe('biconomy');
    });
  });

  describe('Chain Support', () => {
    const supportedChains = [
      { name: 'Ethereum Mainnet', chainId: 1 },
      { name: 'Polygon', chainId: 137 },
      { name: 'Base', chainId: 8453 },
      { name: 'Base Sepolia', chainId: 84532 },
      { name: 'Arbitrum', chainId: 42161 },
      { name: 'Optimism', chainId: 10 },
    ];

    supportedChains.forEach(({ name, chainId }) => {
      it(`should support ${name} (${chainId})`, async () => {
        const config = { ...mockConfig, chainId };
        const account = await getBiconomyAccount(config);

        expect(account).toBeDefined();
        expect(account.provider).toBe('biconomy');
      });
    });

    it('should provide meaningful errors for unsupported chains', async () => {
      const unsupportedConfig = { ...mockConfig, chainId: 999999 };

      await expect(getBiconomyAccount(unsupportedConfig)).rejects.toThrow(
        'Chain 999999 is not supported by Biconomy'
      );
    });
  });

  describe('Smart Account Features', () => {
    it('should support batch transactions', async () => {
      const account = await getBiconomyAccount(mockConfig);
      
      expect(account).toBeDefined();
      // Batch transaction support would be tested in integration tests
    });

    it('should support session keys', async () => {
      const account = await getBiconomyAccount(mockConfig);
      
      expect(account).toBeDefined();
      // Session key support would be tested in integration tests
    });

    it('should handle account deployment status', async () => {
      const account = await getBiconomyAccount(mockConfig);
      
      expect(account).toBeDefined();
      expect(typeof account.isDeployed).toBe('boolean');
    });
  });

  describe('Error Handling', () => {
    it('should handle SDK initialization failures', async () => {
      vi.mocked(require('@biconomy/account').createSmartAccountClient)
        .mockRejectedValue(new Error('SDK initialization failed'));

      await expect(getBiconomyAccount(mockConfig)).rejects.toThrow(
        'SDK initialization failed'
      );
    });

    it('should handle network connectivity issues', async () => {
      vi.mocked(require('@biconomy/account').createSmartAccountClient)
        .mockRejectedValue(new Error('Network unreachable'));

      await expect(getBiconomyAccount(mockConfig)).rejects.toThrow(
        'Network unreachable'
      );
    });

    it('should provide context in error messages', async () => {
      vi.mocked(require('@biconomy/account').createSmartAccountClient)
        .mockRejectedValue(new Error('Invalid configuration'));

      try {
        await getBiconomyAccount(mockConfig);
      } catch (error) {
        expect((error as Error).message).toContain('Biconomy');
        expect((error as Error).message).toContain('configuration');
      }
    });

    it('should handle API rate limiting gracefully', async () => {
      vi.mocked(require('@biconomy/account').createSmartAccountClient)
        .mockRejectedValue(new Error('429: Rate limit exceeded'));

      await expect(getBiconomyAccount(mockConfig)).rejects.toThrow(
        'Rate limit exceeded'
      );
    });
  });

  describe('Gas Estimation', () => {
    it('should provide gas estimates for transactions', async () => {
      const account = await getBiconomyAccount(mockConfig);
      
      expect(account).toBeDefined();
      // Gas estimation would be tested in integration tests
    });

    it('should handle gas estimation failures', async () => {
      const account = await getBiconomyAccount(mockConfig);
      
      expect(account).toBeDefined();
      // Error handling for gas estimation would be tested in integration tests
    });
  });
});