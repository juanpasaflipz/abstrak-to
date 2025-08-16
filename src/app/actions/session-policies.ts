'use server';

import { prisma } from '@/lib/db';

export interface SessionPolicyData {
  projectId: string;
  name: string;
  description: string;
  permissions: {
    contracts: {
      address: string;
      name: string;
      methods: string[];
    }[];
    spendingLimits: {
      dailyLimit: string;
      perTxLimit: string;
      monthlyLimit: string;
    };
    timeRestrictions: {
      expiresAt?: string;
      validFrom?: string;
      timezone: string;
    };
    ipWhitelist: string[];
  };
  isActive: boolean;
}

export async function saveSessionPolicyAction(data: SessionPolicyData) {
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

    // Create the session policy
    const sessionPolicy = await prisma.sessionPolicy.create({
      data: {
        projectId: data.projectId,
        name: data.name,
        description: data.description,
        permissions: data.permissions,
        isActive: data.isActive,
      },
    });

    return {
      success: true,
      policy: sessionPolicy,
    };
  } catch (error) {
    console.error('Failed to save session policy:', error);
    return {
      success: false,
      error: 'Failed to save session policy',
    };
  }
}

export async function getSessionPoliciesAction(projectId: string) {
  try {
    const policies = await prisma.sessionPolicy.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
    });

    return {
      success: true,
      policies,
    };
  } catch (error) {
    console.error('Failed to get session policies:', error);
    return {
      success: false,
      error: 'Failed to get session policies',
      policies: [],
    };
  }
}

export async function updateSessionPolicyAction(
  policyId: string,
  updates: Partial<SessionPolicyData>
) {
  try {
    const policy = await prisma.sessionPolicy.update({
      where: { id: policyId },
      data: updates,
    });

    return {
      success: true,
      policy,
    };
  } catch (error) {
    console.error('Failed to update session policy:', error);
    return {
      success: false,
      error: 'Failed to update session policy',
    };
  }
}

export async function deleteSessionPolicyAction(policyId: string) {
  try {
    await prisma.sessionPolicy.delete({
      where: { id: policyId },
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error('Failed to delete session policy:', error);
    return {
      success: false,
      error: 'Failed to delete session policy',
    };
  }
}

export async function toggleSessionPolicyAction(policyId: string, isActive: boolean) {
  try {
    const policy = await prisma.sessionPolicy.update({
      where: { id: policyId },
      data: { isActive },
    });

    return {
      success: true,
      policy,
    };
  } catch (error) {
    console.error('Failed to toggle session policy:', error);
    return {
      success: false,
      error: 'Failed to toggle session policy',
    };
  }
}