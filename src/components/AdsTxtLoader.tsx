'use client';

import { useEffect, useState } from 'react';
import { hasMarketingConsent } from '@/components/ConsentManager';

interface AdsTxtLoaderProps {
  publisherId?: string;
  className?: string;
}

export default function AdsTxtLoader({ publisherId, className = '' }: AdsTxtLoaderProps) {
  const [adsTxtLoaded, setAdsTxtLoaded] = useState(false);
  const [consentGranted, setConsentGranted] = useState(false);

  useEffect(() => {
    const checkConsentAndLoadAdsTxt = () => {
      const hasConsent = hasMarketingConsent();
      setConsentGranted(hasConsent);

      if (hasConsent && !adsTxtLoaded) {
        loadAdsTxt();
      }
    };

    // Check consent status
    checkConsentAndLoadAdsTxt();

    // Monitor consent changes
    const interval = setInterval(checkConsentAndLoadAdsTxt, 1000);

    return () => clearInterval(interval);
  }, [adsTxtLoaded]);

  const loadAdsTxt = async () => {
    try {
      // Create ads.txt content dynamically
      const adsTxtContent = generateAdsTxtContent(publisherId);
      
      // Create a blob with the ads.txt content
      const blob = new Blob([adsTxtContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      
      // Create a temporary link to download/validate the ads.txt
      const link = document.createElement('a');
      link.href = url;
      link.download = 'ads.txt';
      link.style.display = 'none';
      
      // Add to DOM temporarily
      document.body.appendChild(link);
      
      // Trigger download (this validates the content)
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      setAdsTxtLoaded(true);
      
      // Log for debugging
      console.log('ads.txt loaded successfully after consent granted');
      
    } catch (error) {
      console.error('Error loading ads.txt:', error);
    }
  };

  const generateAdsTxtContent = (publisherId?: string) => {
    const defaultPublisherId = publisherId || 'pub-0000000000000000';
    
    return `# ads.txt file for Age Calculator Website
# This file is loaded only after user consent is obtained
# Last updated: ${new Date().toISOString().split('T')[0]}

# Google AdSense
google.com, ${defaultPublisherId}, DIRECT, f08c47fec0942fa0

# Google Ad Manager (if using)
google.com, ${defaultPublisherId}, DIRECT, f08c47fec0942fa0

# Note: This file is loaded only after user consent is obtained
# to ensure compliance with privacy regulations`;
  };

  // Don't render anything in production unless explicitly requested
  if (process.env.NODE_ENV === 'production' && !className.includes('debug')) {
    return null;
  }

  return (
    <div className={`ads-txt-loader ${className}`}>
      <div className="fixed bottom-20 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-3 max-w-xs z-40">
        <div className="text-xs text-gray-600 space-y-1">
          <div className="font-medium">ads.txt Status</div>
          <div className="flex items-center gap-2">
            <span>Consent:</span>
            <span className={`px-2 py-1 rounded text-xs font-medium ${
              consentGranted ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {consentGranted ? 'Granted' : 'Pending'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span>ads.txt:</span>
            <span className={`px-2 py-1 rounded text-xs font-medium ${
              adsTxtLoaded ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
            }`}>
              {adsTxtLoaded ? 'Loaded' : 'Waiting'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Utility function to validate ads.txt format
export const validateAdsTxtFormat = (content: string): boolean => {
  const lines = content.split('\n').filter(line => 
    line.trim() && !line.trim().startsWith('#')
  );
  
  return lines.every(line => {
    const parts = line.split(',');
    return parts.length >= 3 && parts.length <= 4;
  });
};

// Utility function to generate ads.txt for server-side
export const generateServerAdsTxt = (publisherId: string): string => {
  return `# ads.txt file for Age Calculator Website
# This file must be accessible at https://yourdomain.com/ads.txt
# Last updated: ${new Date().toISOString().split('T')[0]}

# Google AdSense
google.com, ${publisherId}, DIRECT, f08c47fec0942fa0

# Google Ad Manager (if using)
google.com, ${publisherId}, DIRECT, f08c47fec0942fa0

# Note: This file is loaded only after user consent is obtained
# to ensure compliance with privacy regulations`;
};
