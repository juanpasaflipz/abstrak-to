import { NextRequest } from 'next/server';
import { withProjectAuth } from '@/lib/api/middleware';
import { createSuccessResponse, createErrorResponse, createValidationErrorResponse } from '@/lib/api/responses';
import { createProject, getUserProjects, generateApiKey } from '@/lib/portal/projects';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const createProjectSchema = z.object({
  name: z.string().min(1, 'Project name is required').max(100, 'Project name too long'),
  description: z.string().optional(),
  defaultProvider: z.enum(['safe', 'alchemy', 'biconomy']).default('safe'),
  defaultChainId: z.number().int().positive().default(84532),
});

async function createProjectHandler(
  context: any,
  request: NextRequest
): Promise<Response> {
  try {
    const body = await request.json();
    
    // Validate input
    const validationResult = createProjectSchema.safeParse(body);
    if (!validationResult.success) {
      const fieldErrors: Record<string, string> = {};
      validationResult.error.errors.forEach(error => {
        const field = error.path.join('.');
        fieldErrors[field] = error.message;
      });
      return createValidationErrorResponse(fieldErrors, context.requestId);
    }

    const { name, description, defaultProvider, defaultChainId } = validationResult.data;
    
    // For now, use a demo user ID - in production this would come from JWT token
    const userId = 'user_1';

    // Create the project
    const project = await createProject({
      name,
      description,
      ownerId: userId,
      defaultProvider,
      defaultChainId,
    });

    // Get the created environments
    const environments = await prisma.environment.findMany({
      where: { projectId: project.id },
    });

    const devEnv = environments.find(env => env.name === 'development');
    const prodEnv = environments.find(env => env.name === 'production');

    if (!devEnv || !prodEnv) {
      throw new Error('Failed to create default environments');
    }

    // Generate initial API keys for both environments
    const devKey = await generateApiKey(
      project.id,
      devEnv.id,
      userId,
      `${project.name} Development Key`,
      ['read', 'write', 'simulate']
    );

    const prodKey = await generateApiKey(
      project.id,
      prodEnv.id,
      userId,
      `${project.name} Production Key`,
      ['read', 'write']
    );

    const response = {
      project: {
        id: project.id,
        name: project.name,
        description: project.description,
        defaultProvider: project.defaultProvider,
        defaultChainId: project.defaultChainId,
        createdAt: project.createdAt,
      },
      apiKeys: {
        development: {
          id: devKey.apiKey.id,
          name: devKey.apiKey.name,
          key: devKey.key,
          scopes: devKey.apiKey.scopes,
        },
        production: {
          id: prodKey.apiKey.id,
          name: prodKey.apiKey.name,
          key: prodKey.key,
          scopes: prodKey.apiKey.scopes,
        },
      },
    };

    return createSuccessResponse(response, context.requestId, 201);
  } catch (error) {
    console.error('Failed to create project:', error);
    return createErrorResponse(
      'INTERNAL_ERROR',
      'Failed to create project',
      context.requestId,
      500
    );
  }
}

async function getProjectsHandler(
  context: any,
  request: NextRequest
): Promise<Response> {
  try {
    // For now, use a demo user ID - in production this would come from JWT token
    const userId = 'user_1';
    
    const projects = await getUserProjects(userId);
    
    const response = {
      projects: projects.map(project => ({
        id: project.id,
        name: project.name,
        description: project.description,
        defaultProvider: project.defaultProvider,
        defaultChainId: project.defaultChainId,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
      })),
      total: projects.length,
    };

    return createSuccessResponse(response, context.requestId);
  } catch (error) {
    console.error('Failed to get projects:', error);
    return createErrorResponse(
      'INTERNAL_ERROR',
      'Failed to get projects',
      context.requestId,
      500
    );
  }
}

// Export handlers with middleware
export const POST = withProjectAuth(createProjectHandler);
export const GET = withProjectAuth(getProjectsHandler);