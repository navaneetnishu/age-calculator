'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import Navigation from '@/components/Navigation';

// Dynamically import components with no SSR to avoid hydration issues
const AgeCalculator = dynamic(() => import('@/components/AgeCalculator'), {
  ssr: false,
  loading: () => (
    <div className="text-center py-12">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
      <p className="mt-4 text-gray-600">Loading Age Calculator...</p>
    </div>
  ),
});

const CelebritySection = dynamic(() => import('@/components/CelebritySection'), {
  ssr: false,
  loading: () => (
    <div className="text-center py-12">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
      <p className="mt-4 text-gray-600">Loading Celebrity Section...</p>
    </div>
  ),
});

export default function Home() {
  const [activeTab, setActiveTab] = useState<'calculator' | 'celebrities'>('calculator');

  return (
    <main className="min-h-screen bg-gray-50">
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      
      {activeTab === 'calculator' ? (
        <AgeCalculator />
      ) : (
        <CelebritySection />
      )}
    </main>
  );
}
