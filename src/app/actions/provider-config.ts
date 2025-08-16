'use server';

import { prisma } from '@/lib/db';

export interface ProviderConfigData {
  projectId: string;
  provider: 'safe' | 'alchemy' | 'biconomy';
  chainId: number;
  apiKey?: string;
  customRpc?: string;
  gasPolicy?: {
    mode: 'sponsor_all' | 'allowlist' | 'user_pays';
    dailyBudget?: string;
    perTxLimit?: string;
    allowedContracts?: string[];
    allowedMethods?: string[];
  };
}

export async function saveProviderConfigAction(data: ProviderConfigData) {
  try {
    // Check if project exists
    const project = await prisma.project.findUnique({
      where: { id: data.projectId },
    });

    if (!project) {
      return {
        success: false,
        error: 'Project not found',
      };
    }

    // Check if configuration already exists
    const existingConfig = await prisma.providerConfig.findFirst({
      where: {
        projectId: data.projectId,
        provider: data.provider,
      },
    });

    // Update project defaults
    await prisma.project.update({
      where: { id: data.projectId },
      data: {
        defaultProvider: data.provider,
        defaultChainId: data.chainId,
      },
    });

    // Save or update provider configuration
    const configData = {
      projectId: data.projectId,
      provider: data.provider,
      chainId: data.chainId,
      apiKey: data.apiKey || null,
      customRpc: data.customRpc || null,
      settings: {
        customRpc: data.customRpc,
        gasPolicy: data.gasPolicy,
      },
    };

    let savedConfig;
    
    if (existingConfig) {
      savedConfig = await prisma.providerConfig.update({
        where: { id: existingConfig.id },
        data: configData,
      });
    } else {
      savedConfig = await prisma.providerConfig.create({
        data: configData,
      });
    }

    // Update or create gas policy if specified
    if (data.gasPolicy) {
      const existingPolicy = await prisma.gasPolicy.findFirst({
        where: { projectId: data.projectId },
      });

      const policyData = {
        projectId: data.projectId,
        name: `${data.provider} Default Policy`,
        mode: data.gasPolicy.mode,
        dailyBudget: data.gasPolicy.dailyBudget,
        perTxLimit: data.gasPolicy.perTxLimit,
        allowedContracts: data.gasPolicy.allowedContracts || [],
        allowedMethods: data.gasPolicy.allowedMethods || [],
        isActive: true,
      };

      if (existingPolicy) {
        await prisma.gasPolicy.update({
          where: { id: existingPolicy.id },
          data: policyData,
        });
      } else {
        await prisma.gasPolicy.create({
          data: policyData,
        });
      }
    }

    return {
      success: true,
      config: savedConfig,
    };
  } catch (error) {
    console.error('Failed to save provider configuration:', error);
    return {
      success: false,
      error: 'Failed to save configuration',
    };
  }
}

export async function getProviderConfigAction(projectId: string) {
  try {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        providerConfigs: true,
        gasPolicies: {
          where: { isActive: true },
          take: 1,
        },
      },
    });

    if (!project) {
      return {
        success: false,
        error: 'Project not found',
      };
    }

    return {
      success: true,
      project,
      configs: project.providerConfigs,
      gasPolicy: project.gasPolicies[0] || null,
    };
  } catch (error) {
    console.error('Failed to get provider configuration:', error);
    return {
      success: false,
      error: 'Failed to get configuration',
    };
  }
}

export async function testProviderConnectionAction(data: {
  provider: 'safe' | 'alchemy' | 'biconomy';
  chainId: number;
  apiKey?: string;
  customRpc?: string;
}) {
  try {
    // Mock test implementation - in production this would make real API calls
    const results = {
      providerConnection: true,
      chainConnection: true,
      apiKeyValid: data.apiKey ? Math.random() > 0.2 : true,
      smartAccountCreation: Math.random() > 0.1,
      gasSponsorship: data.provider !== 'safe', // Safe doesn't have built-in gas sponsorship
    };

    // Simulate realistic test delays
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));

    return {
      success: true,
      results,
    };
  } catch (error) {
    console.error('Failed to test provider connection:', error);
    return {
      success: false,
      error: 'Test failed',
      results: {
        providerConnection: false,
        chainConnection: false,
        apiKeyValid: false,
        smartAccountCreation: false,
        gasSponsorship: false,
      },
    };
  }
}