'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ProviderWizard } from '@/components/portal/ProviderWizard';
import { WizardNavigation } from '@/components/portal/WizardNavigation';

export default function ConfigurePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = searchParams.get('project');

  const handleComplete = () => {
    // Show success message and redirect
    router.push('/dashboard?configured=true');
  };

  return (
    <div>
      <WizardNavigation />
      <ProviderWizard 
        projectId={projectId || undefined}
        onComplete={handleComplete}
      />
    </div>
  );
}