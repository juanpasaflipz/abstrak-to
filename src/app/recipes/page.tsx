'use client';

import { useState } from 'react';
import { RecipesLibrary } from '@/components/portal/RecipesLibrary';
import Header from '@/components/Header';

export default function RecipesPage() {
  return (
    <div>
      <RecipesLibrary />
    </div>
  );
}