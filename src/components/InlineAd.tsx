'use client';

import { memo } from 'react';
import AdSenseAd from './AdSenseAd';

interface InlineAdProps {
  className?: string;
  format?: 'rectangle' | 'horizontal';
}

const InlineAd = memo(function InlineAd({ 
  className = '', 
  format = 'rectangle' 
}: InlineAdProps) {
  return (
    <div className={`inline-ad ${className}`}>
      <div className="flex justify-center my-8">
        <AdSenseAd 
          slot={`inline-${format}-1`} 
          format={format} 
          className="max-w-full"
        />
      </div>
    </div>
  );
});

InlineAd.displayName = 'InlineAd';

export default InlineAd;
