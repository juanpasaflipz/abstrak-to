'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PlaygroundPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the API playground
    router.push('/api-playground');
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-4xl mb-4">🔄</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Redirecting...</h1>
        <p className="text-gray-600">Taking you to the API Playground</p>
      </div>
    </div>
  );
}
