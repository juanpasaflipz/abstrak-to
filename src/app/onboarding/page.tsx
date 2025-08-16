'use client';

import { useRouter } from 'next/navigation';
import { OnboardingWizard } from '@/components/portal/OnboardingWizard';

export default function OnboardingPage() {
  const router = useRouter();

  const handleComplete = () => {
    // Mark onboarding as completed and redirect to dashboard
    localStorage.setItem('onboarding_completed', 'true');
    router.push('/dashboard?onboarding=completed');
  };

  const handleSkip = () => {
    // Mark onboarding as skipped and redirect to dashboard
    localStorage.setItem('onboarding_completed', 'skipped');
    router.push('/dashboard');
  };

  return (
    <OnboardingWizard 
      onComplete={handleComplete}
      onSkip={handleSkip}
    />
  );
}