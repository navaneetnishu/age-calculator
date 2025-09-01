'use client';

import { CelebrityProfile } from '@/types/celebrity';
import { categoryIcons } from '@/data/celebrities';
import { formatAge } from '@/utils/ageCalculator';

interface CelebrityCardProps {
  profile: CelebrityProfile;
  onClick?: () => void;
  showDetails?: boolean;
}

export default function CelebrityCard({ profile, onClick, showDetails = false }: CelebrityCardProps) {
  const { celebrity, age, daysUntilBirthday, isBirthdayToday } = profile;
  const categoryIcon = categoryIcons[celebrity.category];

  return (
    <div 
      className={`bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden transform hover:scale-105 transition-all duration-300 cursor-pointer ${onClick ? 'hover:shadow-xl' : ''}`}
      onClick={onClick}
    >
      {/* Image Section */}
      <div className="relative h-48 bg-gradient-to-br from-blue-100 to-purple-100">
        <img 
          src={celebrity.imageUrl} 
          alt={celebrity.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(celebrity.name)}&size=200&background=3B82F6&color=fff&font-size=0.4`;
          }}
        />
        
        {/* Birthday Badge */}
        {isBirthdayToday && (
          <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse">
            🎂 Today!
          </div>
        )}
        
        {/* Category Badge */}
        <div className="absolute bottom-3 left-3 bg-white bg-opacity-90 text-gray-800 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
          <span className="text-lg">{categoryIcon}</span>
          <span>{celebrity.category}</span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6">
        {/* Name and Age */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 mb-2">{celebrity.name}</h3>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-blue-600">
              {age.years} years old
            </div>
            <div className="text-sm text-gray-500">
              {formatAge(age)}
            </div>
          </div>
        </div>

        {/* Profession and Nationality */}
        <div className="mb-4 space-y-2">
          <p className="text-gray-700 font-medium">{celebrity.profession}</p>
          <p className="text-gray-500 text-sm">🇺🇸 {celebrity.nationality}</p>
        </div>

        {/* Birthday Info */}
        <div className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Birthday</p>
              <p className="font-semibold text-gray-900">
                {new Date(celebrity.birthDate).toLocaleDateString('en-US', { 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">
                {isBirthdayToday ? 'Today!' : daysUntilBirthday === 1 ? 'Tomorrow' : `${daysUntilBirthday} days`}
              </p>
              <p className="text-xs text-gray-500">
                {isBirthdayToday ? '🎉' : daysUntilBirthday === 1 ? '🎁' : 'until next'}
              </p>
            </div>
          </div>
        </div>

        {/* Show Details if requested */}
        {showDetails && (
          <div className="space-y-3">
            <p className="text-gray-600 text-sm line-clamp-3">{celebrity.bio}</p>
            
            {/* Achievements */}
            {celebrity.achievements && celebrity.achievements.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Notable Achievements:</p>
                <div className="flex flex-wrap gap-1">
                  {celebrity.achievements.slice(0, 3).map((achievement, index) => (
                    <span 
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                    >
                      {achievement}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Social Media */}
            {celebrity.socialMedia && Object.keys(celebrity.socialMedia).length > 0 && (
              <div className="flex gap-2">
                {celebrity.socialMedia.instagram && (
                  <a 
                    href={`https://instagram.com/${celebrity.socialMedia.instagram}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-pink-500 hover:text-pink-600"
                  >
                    📷
                  </a>
                )}
                {celebrity.socialMedia.twitter && (
                  <a 
                    href={`https://twitter.com/${celebrity.socialMedia.twitter}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-500"
                  >
                    🐦
                  </a>
                )}
                {celebrity.socialMedia.youtube && (
                  <a 
                    href={`https://youtube.com/channel/${celebrity.socialMedia.youtube}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-red-500 hover:text-red-600"
                  >
                    📺
                  </a>
                )}
              </div>
            )}
          </div>
        )}

        {/* View Details Button */}
        {!showDetails && onClick && (
          <button className="w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium py-2 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200">
            View Details
          </button>
        )}
      </div>
    </div>
  );
}
