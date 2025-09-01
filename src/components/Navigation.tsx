'use client';

import { useState } from 'react';

interface NavigationProps {
  activeTab: 'calculator' | 'celebrities';
  onTabChange: (tab: 'calculator' | 'celebrities') => void;
}

export default function Navigation({ activeTab, onTabChange }: NavigationProps) {
  return (
    <div className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center">
          <div className="flex bg-gray-100 rounded-2xl p-2 my-4">
            <button
              onClick={() => onTabChange('calculator')}
              className={`px-8 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 ${
                activeTab === 'calculator'
                  ? 'bg-white text-blue-600 shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span className="text-xl">🧮</span>
              Age Calculator
            </button>
            <button
              onClick={() => onTabChange('celebrities')}
              className={`px-8 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 ${
                activeTab === 'celebrities'
                  ? 'bg-white text-blue-600 shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span className="text-xl">⭐</span>
              Famous People
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
