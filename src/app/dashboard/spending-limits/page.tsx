'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SpendingLimitsManager } from '@/components/portal/SpendingLimitsManager';
import { WizardNavigation } from '@/components/portal/WizardNavigation';

export default function SpendingLimitsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = searchParams.get('project');

  const handleSave = () => {
    // Show success message and redirect
    router.push('/dashboard?spending-limits=updated');
  };

  return (
    <div>
      <WizardNavigation />
      <SpendingLimitsManager 
        projectId={projectId || undefined}
        onSave={handleSave}
      />
    </div>
  );
}