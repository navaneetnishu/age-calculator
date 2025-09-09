'use client';

import { memo } from 'react';
import AdSenseAd from './AdSenseAd';

interface AdSidebarProps {
  className?: string;
}

const AdSidebar = memo(function AdSidebar({ className = '' }: AdSidebarProps) {
  return (
    <div className={`ad-sidebar ${className}`}>
      {/* Vertical Ad - Wide Skyscraper */}
      <div className="mb-6">
        <AdSenseAd 
          slot="sidebar-vertical-1" 
          format="vertical" 
          className="w-full"
        />
      </div>

      {/* Medium Rectangle Ad */}
      <div className="mb-6">
        <AdSenseAd 
          slot="sidebar-rectangle-1" 
          format="rectangle" 
          className="w-full"
        />
      </div>

      {/* Another Vertical Ad */}
      <div className="mb-6">
        <AdSenseAd 
          slot="sidebar-vertical-2" 
          format="vertical" 
          className="w-full"
        />
      </div>
    </div>
  );
});

AdSidebar.displayName = 'AdSidebar';

export default AdSidebar;
