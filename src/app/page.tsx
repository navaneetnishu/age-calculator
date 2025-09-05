'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
// Removed performance monitoring to fix startup issues

// Optimized dynamic imports with better loading states
const AgeCalculator = dynamic(() => import('@/components/AgeCalculator'), {
  ssr: false,
  loading: () => (
    <div className="text-center py-8">
      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
      <p className="mt-2 text-sm text-gray-600">Loading...</p>
    </div>
  ),
});

const CelebritySection = dynamic(() => import('@/components/CelebritySection'), {
  ssr: false,
  loading: () => (
    <div className="text-center py-8">
      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600 mx-auto"></div>
      <p className="mt-2 text-sm text-gray-600">Loading...</p>
    </div>
  ),
});

export default function Home() {
  const [activeTab, setActiveTab] = useState<'calculator' | 'celebrities'>('calculator');

  // Handle hash navigation and preload components
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#celebrities') {
        setActiveTab('celebrities');
      } else {
        setActiveTab('calculator');
      }
    };

    // Check initial hash
    handleHashChange();

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);

    // Preload components for faster switching
    const preloadComponents = () => {
      // Preload CelebritySection when user hovers over celebrities tab
      const celebritiesTab = document.querySelector('[data-tab="celebrities"]');
      if (celebritiesTab) {
        celebritiesTab.addEventListener('mouseenter', () => {
          import('@/components/CelebritySection');
        }, { once: true });
      }
    };

    // Preload after initial render
    setTimeout(preloadComponents, 1000);

                  // Performance optimizations removed to fix startup issues

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  return (
    <main className="min-h-screen bg-gray-50">
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      
      {activeTab === 'calculator' ? (
        <AgeCalculator />
      ) : (
        <div id="celebrities">
          <CelebritySection />
        </div>
      )}
      
                      <Footer />
    </main>
  );
}
