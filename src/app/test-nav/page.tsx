'use client';

import { ProminentNavigation } from '@/components/portal/Navigation';

export default function TestNavPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="py-20 px-4">
        <h1 className="text-4xl font-bold text-center mb-8">
          Navigation Test Page
        </h1>
        <p className="text-center text-muted-foreground mb-8">
          Testing the ProminentNavigation component
        </p>
      </div>
      
      <ProminentNavigation />
      
      <div className="py-20 px-4">
        <p className="text-center text-muted-foreground">
          Navigation component should appear above this text
        </p>
      </div>
    </div>
  );
}
