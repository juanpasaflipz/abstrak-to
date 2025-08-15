import { prisma } from '@/lib/db';
import crypto from 'crypto';

export interface CreateProjectData {
  name: string;
  description?: string;
  ownerId: string;
  defaultChainId?: number;
  defaultProvider?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string | null;
  ownerId: string;
  defaultChainId: number;
  defaultProvider: string;
  createdAt: Date;
  updatedAt: Date;
}

export async function createProject(data: CreateProjectData): Promise<Project> {
  const project = await prisma.project.create({
    data: {
      name: data.name,
      description: data.description,
      ownerId: data.ownerId,
      defaultChainId: data.defaultChainId || 84532, // Base Sepolia
      defaultProvider: data.defaultProvider || 'safe',
    },
  });

  // Create default environments
  await Promise.all([
    prisma.environment.create({
      data: {
        name: 'development',
        projectId: project.id,
        chainId: project.defaultChainId,
        provider: project.defaultProvider,
      },
    }),
    prisma.environment.create({
      data: {
        name: 'production',
        projectId: project.id,
        chainId: project.defaultChainId,
        provider: project.defaultProvider,
      },
    }),
  ]);

  // Create default spending limits
  await prisma.spendingLimit.create({
    data: {
      projectId: project.id,
      type: 'project',
      dailyLimit: '1000000000000000000', // 1 ETH
      monthlyLimit: '10000000000000000000', // 10 ETH
    },
  });

  // Create default session policy
  await prisma.sessionPolicy.create({
    data: {
      projectId: project.id,
      name: 'Default Policy',
      defaultTTL: 1800, // 30 minutes
      maxValue: '10000000000000000', // 0.01 ETH
      allowedContracts: [],
      allowedMethods: [],
      dailyCap: '100000000000000000', // 0.1 ETH
    },
  });

  return project;
}

export async function getUserProjects(userId: string): Promise<Project[]> {
  return await prisma.project.findMany({
    where: { ownerId: userId },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getProject(projectId: string, userId: string): Promise<Project | null> {
  return await prisma.project.findFirst({
    where: {
      id: projectId,
      ownerId: userId,
    },
  });
}

export async function updateProject(
  projectId: string,
  userId: string,
  data: Partial<CreateProjectData>
): Promise<Project> {
  return await prisma.project.update({
    where: {
      id: projectId,
      ownerId: userId,
    },
    data,
  });
}

export async function deleteProject(projectId: string, userId: string): Promise<void> {
  await prisma.project.delete({
    where: {
      id: projectId,
      ownerId: userId,
    },
  });
}

export async function generateApiKey(
  projectId: string,
  environmentId: string,
  userId: string,
  name: string,
  scopes: string[] = ['read', 'write']
): Promise<{ key: string; apiKey: any }> {
  // Generate a random API key
  const randomBytes = crypto.randomBytes(32);
  const key = `ak_${environmentId === 'development' ? 'test' : 'live'}_${randomBytes.toString('hex')}`;
  
  // Hash the key for storage
  const keyHash = crypto.createHash('sha256').update(key).digest('hex');
  const keyPrefix = key.substring(0, 12) + '...';

  const apiKey = await prisma.apiKey.create({
    data: {
      name,
      keyHash,
      keyPrefix,
      projectId,
      environmentId,
      userId,
      scopes: scopes,
      allowedDomains: [],
      allowedIPs: [],
    },
  });

  return { key, apiKey };
}

export async function validateApiKey(key: string): Promise<any | null> {
  const keyHash = crypto.createHash('sha256').update(key).digest('hex');
  
  const apiKey = await prisma.apiKey.findFirst({
    where: {
      keyHash,
      isActive: true,
    },
    include: {
      project: true,
      environment: true,
      user: true,
    },
  });

  if (!apiKey) return null;

  // Check expiration
  if (apiKey.expiresAt && apiKey.expiresAt < new Date()) {
    return null;
  }

  // Update usage stats
  await prisma.apiKey.update({
    where: { id: apiKey.id },
    data: {
      lastUsedAt: new Date(),
      usageCount: { increment: 1 },
    },
  });

  return apiKey;
}