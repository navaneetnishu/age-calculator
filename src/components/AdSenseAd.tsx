'use client';

import { memo, useEffect, useState } from 'react';
import { hasMarketingConsent } from '@/components/ConsentManager';

interface AdSenseAdProps {
  slot: string;
  format?: 'auto' | 'rectangle' | 'vertical' | 'horizontal';
  responsive?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

// Google AdSense Ad Component with realistic styling and consent management
const AdSenseAd = memo(function AdSenseAd({ 
  slot, 
  format = 'auto', 
  responsive = true,
  className = '',
  style = {}
}: AdSenseAdProps) {
  const [showAd, setShowAd] = useState(false);
  const [consentChecked, setConsentChecked] = useState(false);

  useEffect(() => {
    // Check consent status
    const checkConsent = () => {
      const hasConsent = hasMarketingConsent();
      setShowAd(hasConsent);
      setConsentChecked(true);
    };

    // Initial check
    checkConsent();

    // Listen for consent changes
    const interval = setInterval(checkConsent, 1000);
    
    // Cleanup
    return () => clearInterval(interval);
  }, []);

  // Don't render if consent not checked yet or no marketing consent
  if (!consentChecked || !showAd) {
    return (
      <div 
        className={`adsense-ad-placeholder ${className}`}
        style={{
          width: responsive ? '100%' : '300px',
          height: '250px',
          minHeight: '250px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f8f9fa',
          border: '1px solid #e1e5e9',
          borderRadius: '8px',
          ...style
        }}
      >
        <div className="text-center text-gray-500">
          <div className="text-sm mb-2">Advertisement</div>
          <div className="text-xs">Consent required to show ads</div>
        </div>
      </div>
    );
  }
  // Realistic AdSense dimensions and styling
  const getAdDimensions = () => {
    switch (format) {
      case 'rectangle':
        return { width: 300, height: 250 }; // Medium Rectangle
      case 'vertical':
        return { width: 160, height: 600 }; // Wide Skyscraper
      case 'horizontal':
        return { width: 728, height: 90 }; // Leaderboard
      default:
        return { width: 300, height: 250 }; // Auto/Responsive
    }
  };

  const dimensions = getAdDimensions();

  return (
    <div 
      className={`adsense-ad ${className}`}
      style={{
        width: responsive ? '100%' : `${dimensions.width}px`,
        height: responsive ? 'auto' : `${dimensions.height}px`,
        minHeight: `${dimensions.height}px`,
        maxWidth: `${dimensions.width}px`,
        margin: '0 auto',
        ...style
      }}
    >
      {/* AdSense Container with Google-like styling */}
      <div 
        className="relative bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden"
        style={{
          width: '100%',
          height: '100%',
          minHeight: `${dimensions.height}px`,
          background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)',
          border: '1px solid #e1e5e9',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}
      >
        {/* Google AdSense Header */}
        <div 
          className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-r from-blue-50 to-gray-50 border-b border-gray-200 flex items-center justify-between px-2"
          style={{
            background: 'linear-gradient(90deg, #f1f3f4 0%, #f8f9fa 100%)',
            borderBottom: '1px solid #e8eaed'
          }}
        >
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-xs text-gray-500 font-medium">Ad</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
          </div>
        </div>

        {/* Ad Content Area */}
        <div 
          className="flex flex-col items-center justify-center p-4 text-center"
          style={{
            paddingTop: '20px',
            height: 'calc(100% - 16px)'
          }}
        >
          {/* Ad Title */}
          <div 
            className="font-semibold text-gray-800 mb-2 leading-tight"
            style={{
              fontSize: '14px',
              fontWeight: '600',
              color: '#1a73e8',
              lineHeight: '1.3'
            }}
          >
            Discover Amazing Products
          </div>

          {/* Ad Description */}
          <div 
            className="text-gray-600 mb-3 text-sm leading-relaxed"
            style={{
              fontSize: '12px',
              color: '#5f6368',
              lineHeight: '1.4'
            }}
          >
            Find the best deals and offers from trusted brands. Shop now and save big!
          </div>

          {/* Ad Image Placeholder */}
          <div 
            className="w-full bg-gradient-to-br from-blue-100 to-purple-100 rounded-md mb-3 flex items-center justify-center"
            style={{
              height: format === 'horizontal' ? '40px' : '80px',
              background: 'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)',
              border: '1px solid #e1e5e9'
            }}
          >
            <div className="text-gray-500 text-xs">Advertisement</div>
          </div>

          {/* Ad Link */}
          <div 
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors cursor-pointer"
            style={{
              background: '#1a73e8',
              fontSize: '12px',
              fontWeight: '500',
              padding: '6px 16px',
              borderRadius: '4px',
              transition: 'background-color 0.2s ease'
            }}
          >
            Learn More
          </div>
        </div>

        {/* AdSense Footer */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-3 bg-gray-50 border-t border-gray-200 flex items-center justify-center"
          style={{
            background: '#f8f9fa',
            borderTop: '1px solid #e8eaed'
          }}
        >
          <span className="text-xs text-gray-400">AdChoices</span>
        </div>
      </div>

      {/* AdSense Script (commented out for demo) */}
      {/* 
      <script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR_PUBLISHER_ID"
        crossOrigin="anonymous"
      ></script>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-YOUR_PUBLISHER_ID"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      ></ins>
      <script>
        (adsbygoogle = window.adsbygoogle || []).push({});
      </script>
      */}
    </div>
  );
});

AdSenseAd.displayName = 'AdSenseAd';

export default AdSenseAd;
