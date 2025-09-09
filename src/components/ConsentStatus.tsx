'use client';

import { useState, useEffect } from 'react';
import { getConsentStatus, hasMarketingConsent, hasAnalyticsConsent } from '@/components/ConsentManager';

interface ConsentStatusProps {
  showDetails?: boolean;
  className?: string;
}

export default function ConsentStatus({ showDetails = false, className = '' }: ConsentStatusProps) {
  const [consent, setConsent] = useState(getConsentStatus());
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updateConsent = () => {
      setConsent(getConsentStatus());
    };

    // Update consent status every second
    const interval = setInterval(updateConsent, 1000);

    return () => clearInterval(interval);
  }, []);

  // Only show in development or when explicitly requested
  if (process.env.NODE_ENV === 'production' && !showDetails) {
    return null;
  }

  return (
    <div className={`consent-status ${className}`}>
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="fixed bottom-4 right-4 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium shadow-lg hover:bg-blue-700 transition-colors z-50"
      >
        Consent Status
      </button>

      {isVisible && (
        <div className="fixed bottom-16 right-4 bg-white border border-gray-200 rounded-lg shadow-xl p-4 max-w-sm z-50">
          <h3 className="font-semibold text-gray-800 mb-3">Consent Status</h3>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Necessary:</span>
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                consent.necessary ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {consent.necessary ? 'Granted' : 'Denied'}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Preferences:</span>
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                consent.preferences ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {consent.preferences ? 'Granted' : 'Denied'}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Statistics:</span>
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                consent.statistics ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {consent.statistics ? 'Granted' : 'Denied'}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Marketing:</span>
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                consent.marketing ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {consent.marketing ? 'Granted' : 'Denied'}
              </span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-gray-200">
            <div className="text-xs text-gray-500 space-y-1">
              <div>Marketing Ads: {hasMarketingConsent() ? '✅ Enabled' : '❌ Disabled'}</div>
              <div>Analytics: {hasAnalyticsConsent() ? '✅ Enabled' : '❌ Disabled'}</div>
            </div>
          </div>

          <button
            onClick={() => setIsVisible(false)}
            className="mt-3 w-full bg-gray-100 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}
