'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { WebhooksManager } from '@/components/portal/WebhooksManager';
import { WizardNavigation } from '@/components/portal/WizardNavigation';

export default function WebhooksPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = searchParams.get('project');

  const handleSave = () => {
    // Show success message and redirect
    router.push('/dashboard?webhooks=configured');
  };

  return (
    <div>
      <WizardNavigation />
      <WebhooksManager 
        projectId={projectId || undefined}
        onSave={handleSave}
      />
    </div>
  );
}