'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { PaymasterPolicyEditor } from '@/components/portal/PaymasterPolicyEditor';
import { WizardNavigation } from '@/components/portal/WizardNavigation';

export default function PaymasterPoliciesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = searchParams.get('project');

  const handleComplete = () => {
    // Show success message and redirect
    router.push('/dashboard?paymaster-policy=created');
  };

  const handleCancel = () => {
    // Go back to dashboard
    router.push('/dashboard');
  };

  return (
    <div>
      <WizardNavigation />
      <PaymasterPolicyEditor 
        projectId={projectId || undefined}
        onSave={handleComplete}
        onCancel={handleCancel}
      />
    </div>
  );
}