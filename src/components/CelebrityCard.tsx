'use client';

import { useRouter } from 'next/navigation';
import { memo, useCallback } from 'react';
import { CelebrityProfile } from '@/types/celebrity';
import { categoryIcons } from '@/utils/categoryMetadata';
import { formatAge } from '@/utils/ageCalculator';
import SocialMediaIcon from './SocialMediaIcon';

interface CelebrityCardProps {
  profile: CelebrityProfile;
  showDetails?: boolean;
}

const CelebrityCard = memo(function CelebrityCard({ profile, showDetails = false }: CelebrityCardProps) {
  const router = useRouter();
  const { celebrity, age, daysUntilBirthday, isBirthdayToday } = profile;
  const categoryIcon = categoryIcons[celebrity.category];

  const handleCardClick = useCallback(() => {
    router.push(`/celebrity/${celebrity.id}`);
  }, [router, celebrity.id]);

  return (
    <div
      className={`bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden transform hover:scale-105 transition-all duration-300 cursor-pointer hover:shadow-lg`}
      onClick={handleCardClick}
    >
      {/* Image Section - More Compact */}
      <div className="relative h-24 bg-gradient-to-br from-blue-100 to-purple-100">
        {/* Avatar instead of celebrity image */}
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-md">
            {celebrity.name.split(' ').map(n => n[0]).join('').toUpperCase()}
          </div>
        </div>
        
        {/* Birthday Badge */}
        {isBirthdayToday && (
          <div className="absolute top-1 right-1 bg-red-500 text-white px-1.5 py-0.5 rounded-full text-xs font-bold animate-pulse">
            🎂 Today!
          </div>
        )}
        
        {/* Category Badge */}
        <div className="absolute bottom-1 left-1 bg-white bg-opacity-90 text-gray-800 px-1.5 py-0.5 rounded-full text-xs font-medium flex items-center gap-1">
          <span className="text-xs">{categoryIcon}</span>
          <span className="text-xs">{celebrity.category}</span>
        </div>
      </div>

      {/* Content Section - More Compact */}
      <div className="p-3">
        {/* Name and Age */}
        <div className="mb-2">
          <h3 className="text-sm font-bold text-gray-900 mb-1">{celebrity.name}</h3>
          <div className="flex items-center justify-between">
            <div className="text-lg font-bold text-blue-600">
              {age.years} years
            </div>
            <div className="text-xs text-gray-500">
              {formatAge(age)}
            </div>
          </div>
          {/* Zodiac Sign */}
          {celebrity.zodiacSign && (
            <div className="mt-1 flex items-center gap-1">
              <span className="text-sm">{celebrity.zodiacSign.split(' ')[1]}</span>
              <span className="text-xs text-gray-600 font-medium">{celebrity.zodiacSign.split(' ')[0]}</span>
            </div>
          )}
        </div>

        {/* Profession and Nationality */}
        <div className="mb-2 space-y-0.5">
          <p className="text-gray-700 font-medium text-xs">{celebrity.profession}</p>
          <p className="text-gray-500 text-xs">🇺🇸 {celebrity.nationality}</p>
        </div>

        {/* Birthday Info - More Compact */}
        <div className="mb-2 p-1.5 bg-gradient-to-r from-blue-50 to-purple-50 rounded-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600">Birthday</p>
              <p className="font-semibold text-gray-900 text-xs">
                {new Date(celebrity.birthDate).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-600">
                {isBirthdayToday ? 'Today!' : daysUntilBirthday === 1 ? 'Tomorrow' : `${daysUntilBirthday} days`}
              </p>
              <p className="text-xs text-gray-500">
                {isBirthdayToday ? '🎉' : daysUntilBirthday === 1 ? '🎁' : 'until next'}
              </p>
            </div>
          </div>
        </div>

        {/* Show Details if requested - More Compact */}
        {showDetails && (
          <div className="space-y-1.5">
            <p className="text-gray-600 text-xs line-clamp-2">{celebrity.bio}</p>
            
            {/* Achievements */}
            {celebrity.achievements && celebrity.achievements.length > 0 && (
              <div>
                <p className="text-xs font-medium text-gray-700 mb-1">Notable Achievements:</p>
                <div className="flex flex-wrap gap-1">
                  {celebrity.achievements.slice(0, 2).map((achievement, index) => (
                    <span 
                      key={index}
                      className="px-1 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-full"
                    >
                      {achievement}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Social Media */}
            {celebrity.socialMedia && Object.keys(celebrity.socialMedia).length > 0 && (
              <div className="flex gap-1">
                {celebrity.socialMedia.instagram && (
                  <a 
                    href={`https://instagram.com/${celebrity.socialMedia.instagram}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-pink-500 hover:text-pink-600 text-sm"
                    title={`Follow ${celebrity.name} on Instagram`}
                  >
                    <SocialMediaIcon platform="instagram" size="sm" />
                  </a>
                )}
                {celebrity.socialMedia.twitter && (
                  <a 
                    href={`https://x.com/${celebrity.socialMedia.twitter}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-black hover:text-gray-800 text-sm"
                    title={`Follow ${celebrity.name} on X`}
                  >
                    <SocialMediaIcon platform="x" size="sm" />
                  </a>
                )}
                {celebrity.socialMedia.youtube && (
                  <a 
                    href={`https://youtube.com/channel/${celebrity.socialMedia.youtube}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-red-500 hover:text-red-600 text-sm"
                    title={`Subscribe to ${celebrity.name}'s YouTube channel`}
                  >
                    <SocialMediaIcon platform="youtube" size="sm" />
                  </a>
                )}
              </div>
            )}
          </div>
        )}

        {/* View Details Button */}
        {!showDetails && (
          <button className="w-full mt-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium py-1.5 px-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 text-sm">
            View Details
          </button>
        )}
      </div>
    </div>
  );
});

export default CelebrityCard;
