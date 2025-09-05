'use client';

import { useState, useEffect } from 'react';
import SocialMediaIcon from './SocialMediaIcon';

interface SocialMediaEmbedProps {
  platform: 'instagram' | 'twitter';
  handle: string;
  fallbackImage?: string;
  celebrityName: string;
}

export default function SocialMediaEmbed({ platform, handle, fallbackImage, celebrityName }: SocialMediaEmbedProps) {
  const [profileImage, setProfileImage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        setIsLoading(true);
        setError('');

        // For Instagram, we can try to get profile picture
        if (platform === 'instagram') {
          // Note: Instagram's public API is limited, so we'll use a fallback approach
          // In a real production app, you'd need to use Instagram's Graph API with authentication
          setProfileImage(`https://www.instagram.com/${handle}/media/?size=l`);
        } else if (platform === 'twitter') {
          // Twitter also requires authentication for profile images
          // For now, we'll use a placeholder approach
          setProfileImage(`https://twitter.com/${handle}/profile_image?size=bigger`);
        }
      } catch (err) {
        console.error(`Error fetching ${platform} profile:`, err);
        setError(`Failed to load ${platform} profile`);
      } finally {
        setIsLoading(false);
      }
    };

    if (handle) {
      fetchProfileImage();
    }
  }, [handle, platform]);

  if (isLoading) {
    return (
      <div className="w-full h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center animate-pulse">
        <div className="text-center">
          <div className="w-6 h-6 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-xs text-gray-500">Loading {platform}...</p>
        </div>
      </div>
    );
  }

  if (error || !profileImage) {
    return (
      <div className="w-full h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl mb-1">
            <SocialMediaIcon 
              platform={platform} 
              size="lg" 
              className={`mx-auto ${platform === 'instagram' ? 'text-pink-500' : 'text-black'}`}
            />
          </div>
          <p className="text-xs text-gray-600 mb-1">@{handle}</p>
          {fallbackImage && (
            <img 
              src={fallbackImage} 
              alt={celebrityName}
              className="w-full h-full object-cover rounded-lg"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(celebrityName)}&size=200&background=3B82F6&color=fff&font-size=0.6`;
              }}
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-32 rounded-lg overflow-hidden relative">
      <img 
        src={profileImage} 
        alt={`${celebrityName} on ${platform}`}
        className="w-full h-full object-cover"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          if (fallbackImage) {
            target.src = fallbackImage;
          } else {
            target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(celebrityName)}&size=200&background=3B82F6&color=fff&font-size=0.6`;
          }
        }}
      />
      {/* Social Media Badge */}
      <div className="absolute top-2 left-2 bg-white bg-opacity-90 text-gray-800 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
        <span className="text-sm">
          <SocialMediaIcon 
            platform={platform} 
            size="sm" 
            className={platform === 'instagram' ? 'text-pink-500' : 'text-black'}
          />
        </span>
        <span className="text-xs">@{handle}</span>
      </div>
    </div>
  );
}
