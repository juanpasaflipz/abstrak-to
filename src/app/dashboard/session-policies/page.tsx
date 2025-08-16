'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SessionPolicyBuilder } from '@/components/portal/SessionPolicyBuilder';
import { WizardNavigation } from '@/components/portal/WizardNavigation';

export default function SessionPoliciesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = searchParams.get('project');

  const handleComplete = () => {
    // Show success message and redirect
    router.push('/dashboard?session-policy=created');
  };

  return (
    <div>
      <WizardNavigation />
      <SessionPolicyBuilder 
        projectId={projectId || undefined}
        onComplete={handleComplete}
      />
    </div>
  );
}