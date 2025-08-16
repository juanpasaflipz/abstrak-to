'use server';

import { createProject, getUserProjects, getProject, updateProject, deleteProject, generateApiKey } from '@/lib/portal/projects';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

// For now, we'll use a mock user ID until we implement proper authentication
const MOCK_USER_ID = 'user_1';

export async function createProjectAction(formData: FormData) {
  try {
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const defaultProvider = formData.get('defaultProvider') as string;
    const defaultChainId = parseInt(formData.get('defaultChainId') as string);

    if (!name) {
      throw new Error('Project name is required');
    }

    const project = await createProject({
      name,
      description: description || undefined,
      ownerId: MOCK_USER_ID,
      defaultProvider: defaultProvider || 'safe',
      defaultChainId: defaultChainId || 84532,
    });

    // Generate initial API keys for development and production
    const environments = ['development', 'production'];
    for (const env of environments) {
      await generateApiKey(
        project.id,
        env,
        MOCK_USER_ID,
        `${project.name} ${env} key`,
        ['read', 'write', 'simulate']
      );
    }

    revalidatePath('/dashboard');
    return { success: true, projectId: project.id };
  } catch (error) {
    console.error('Failed to create project:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to create project' 
    };
  }
}

export async function getProjectsAction() {
  try {
    const projects = await getUserProjects(MOCK_USER_ID);
    return { success: true, projects };
  } catch (error) {
    console.error('Failed to get projects:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to get projects' 
    };
  }
}

export async function getProjectAction(projectId: string) {
  try {
    const project = await getProject(projectId, MOCK_USER_ID);
    if (!project) {
      return { success: false, error: 'Project not found' };
    }
    return { success: true, project };
  } catch (error) {
    console.error('Failed to get project:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to get project' 
    };
  }
}

export async function updateProjectAction(projectId: string, formData: FormData) {
  try {
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;

    const project = await updateProject(projectId, MOCK_USER_ID, {
      name,
      description,
    });

    revalidatePath(`/dashboard/${projectId}`);
    return { success: true, project };
  } catch (error) {
    console.error('Failed to update project:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to update project' 
    };
  }
}

export async function deleteProjectAction(projectId: string) {
  try {
    await deleteProject(projectId, MOCK_USER_ID);
    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    console.error('Failed to delete project:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to delete project' 
    };
  }
}

export async function generateApiKeyAction(projectId: string, formData: FormData) {
  try {
    const name = formData.get('name') as string;
    const environment = formData.get('environment') as string;
    const scopes = JSON.parse(formData.get('scopes') as string);

    if (!name) {
      throw new Error('API key name is required');
    }

    const result = await generateApiKey(
      projectId,
      environment,
      MOCK_USER_ID,
      name,
      scopes
    );

    revalidatePath(`/dashboard/${projectId}/keys`);
    return { success: true, key: result.key, apiKey: result.apiKey };
  } catch (error) {
    console.error('Failed to generate API key:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to generate API key' 
    };
  }
}