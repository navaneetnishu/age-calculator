'use client';

import { useEffect, useState } from 'react';
import { generateServerAdsTxt } from '@/components/AdsTxtLoader';

interface ConsentManagerProps {
  children: React.ReactNode;
}

// Google Consent Mode configuration
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
    Cookiebot: any;
    cookiebotConsent: any;
  }
}

export default function ConsentManager({ children }: ConsentManagerProps) {
  const [consentLoaded, setConsentLoaded] = useState(false);

  useEffect(() => {
    // Initialize Google Consent Mode
    const initializeConsentMode = () => {
      // Set default consent state
      window.gtag = window.gtag || function() {
        (window.dataLayer = window.dataLayer || []).push(arguments);
      };

      // Default consent state (deny all until user consents)
      window.gtag('consent', 'default', {
        'ad_storage': 'denied',
        'ad_user_data': 'denied',
        'ad_personalization': 'denied',
        'analytics_storage': 'denied',
        'functionality_storage': 'denied',
        'personalization_storage': 'denied',
        'security_storage': 'granted',
        'wait_for_update': 2000,
      });

      // Update consent when Cookiebot consent changes
      const updateConsent = () => {
        if (window.cookiebotConsent) {
          const consent = window.cookiebotConsent;
          
          window.gtag('consent', 'update', {
            'ad_storage': consent.marketing ? 'granted' : 'denied',
            'ad_user_data': consent.marketing ? 'granted' : 'denied',
            'ad_personalization': consent.marketing ? 'granted' : 'denied',
            'analytics_storage': consent.statistics ? 'granted' : 'denied',
            'functionality_storage': consent.preferences ? 'granted' : 'denied',
            'personalization_storage': consent.preferences ? 'granted' : 'denied',
          });

          // Load ads.txt only after marketing consent is granted
          if (consent.marketing) {
            loadAdsTxtAfterConsent();
          }
        }
      };

      // Load ads.txt file after consent is granted
      const loadAdsTxtAfterConsent = async () => {
        try {
          // Check if ads.txt is already loaded
          const adsTxtLoaded = sessionStorage.getItem('adsTxtLoaded');
          if (adsTxtLoaded) {
            return;
          }

          // Generate ads.txt content
          const adsTxtContent = generateServerAdsTxt('pub-0000000000000000'); // Replace with your actual publisher ID
          
          // Create a temporary element to validate the content
          const tempElement = document.createElement('div');
          tempElement.style.display = 'none';
          tempElement.textContent = adsTxtContent;
          document.body.appendChild(tempElement);
          
          // Mark as loaded
          sessionStorage.setItem('adsTxtLoaded', 'true');
          
          // Cleanup
          document.body.removeChild(tempElement);
          
          console.log('ads.txt loaded successfully after marketing consent granted');
          
        } catch (error) {
          console.error('Error loading ads.txt after consent:', error);
        }
      };

      // Listen for Cookiebot consent changes
      if (window.Cookiebot) {
        window.Cookiebot.consentupdate = updateConsent;
      }

      // Check if consent is already available
      if (window.cookiebotConsent) {
        updateConsent();
      }
    };

    // Load Cookiebot script
    const loadCookiebot = () => {
      const script = document.createElement('script');
      script.id = 'Cookiebot';
      script.src = 'https://consent.cookiebot.com/uc.js';
      script.setAttribute('data-cbid', 'YOUR_COOKIEBOT_ID'); // Replace with your actual Cookiebot ID
      script.setAttribute('data-blockingmode', 'auto');
      script.setAttribute('data-culture', 'EN');
      script.async = true;
      
      script.onload = () => {
        initializeConsentMode();
        setConsentLoaded(true);
      };

      document.head.appendChild(script);
    };

    // Initialize consent management
    initializeConsentMode();
    loadCookiebot();

    return () => {
      // Cleanup if needed
    };
  }, []);

  return (
    <>
      {children}
      {/* Cookiebot consent banner will be automatically injected */}
    </>
  );
}

// Utility functions for consent management
export const getConsentStatus = () => {
  if (typeof window !== 'undefined' && window.cookiebotConsent) {
    return {
      necessary: window.cookiebotConsent.necessary || false,
      preferences: window.cookiebotConsent.preferences || false,
      statistics: window.cookiebotConsent.statistics || false,
      marketing: window.cookiebotConsent.marketing || false,
    };
  }
  return {
    necessary: true,
    preferences: false,
    statistics: false,
    marketing: false,
  };
};

export const hasMarketingConsent = () => {
  const consent = getConsentStatus();
  return consent.marketing;
};

export const hasAnalyticsConsent = () => {
  const consent = getConsentStatus();
  return consent.statistics;
};

export const showConsentBanner = () => {
  if (typeof window !== 'undefined' && window.Cookiebot) {
    window.Cookiebot.show();
  }
};

export const hideConsentBanner = () => {
  if (typeof window !== 'undefined' && window.Cookiebot) {
    window.Cookiebot.hide();
  }
};
