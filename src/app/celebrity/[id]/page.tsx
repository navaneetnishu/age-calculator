'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { CelebrityProfile } from '@/types/celebrity';
import { getCelebrityById } from '@/utils/celebrityUtils';
import { formatAge, calculateAge } from '@/utils/ageCalculator';
import SocialMediaIcon from '@/components/SocialMediaIcon';
import InlineAd from '@/components/InlineAd';

export default function CelebrityProfilePage() {
  const params = useParams();
  const router = useRouter();
  const [profile, setProfile] = useState<CelebrityProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCelebrity = async () => {
      if (params.id) {
        try {
          const celebrity = await getCelebrityById(params.id as string);
          if (celebrity) {
            // Create a CelebrityProfile object from the Celebrity data
            const celebrityProfile: CelebrityProfile = {
              celebrity,
              age: calculateAge(new Date(celebrity.birthDate)),
              nextBirthday: getNextBirthday(celebrity.birthDate),
              daysUntilBirthday: getDaysUntilBirthday(celebrity.birthDate),
              isBirthdayToday: isBirthdayToday(celebrity.birthDate)
            };
            setProfile(celebrityProfile);
          }
        } catch (error) {
          console.error('Error loading celebrity:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    loadCelebrity();
  }, [params.id]);

  // Helper functions
  function getNextBirthday(dateOfBirth: string): string {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    const nextBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
    
    if (nextBirthday < today) {
      nextBirthday.setFullYear(today.getFullYear() + 1);
    }
    
    return nextBirthday.toISOString().split('T')[0];
  }

  function getDaysUntilBirthday(dateOfBirth: string): number {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    const nextBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
    
    if (nextBirthday < today) {
      nextBirthday.setFullYear(today.getFullYear() + 1);
    }
    
    return Math.ceil((nextBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  }

  function isBirthdayToday(dateOfBirth: string): boolean {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    return today.getMonth() === birthDate.getMonth() && today.getDate() === birthDate.getDate();
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading celebrity profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Celebrity Not Found</h1>
          <p className="text-gray-600 mb-6">The celebrity you&apos;re looking for doesn&apos;t exist.</p>
          <button
            onClick={() => router.push('/')}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const { celebrity, age, daysUntilBirthday, isBirthdayToday: isToday } = profile;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Enhanced Header with Navigation Options */}
      <div className="relative overflow-hidden bg-white shadow-sm">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Navigation Options */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push('/')}
                className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="text-sm font-medium">Age Calculator</span>
              </button>
              
              <div className="h-6 w-px bg-gray-300"></div>
              
              <button
                onClick={() => {
                  router.push('/#celebrities');
                }}
                className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span className="text-sm font-medium">Celebrity Search</span>
              </button>
            </div>
            
            <h1 className="text-xl font-bold text-gray-900">Celebrity Profile</h1>
            
            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => window.history.back()}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200"
                title="Go back to previous page"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="bg-white border-b border-gray-200 lg:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex gap-2">
            <button
              onClick={() => router.push('/')}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg font-medium hover:bg-blue-100 transition-colors duration-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              Age Calculator
            </button>
            <button
              onClick={() => {
                router.push('/#celebrities');
              }}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-purple-50 text-purple-700 rounded-lg font-medium hover:bg-purple-100 transition-colors duration-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Celebrity Search
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Image and Basic Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-8">
              <div className="text-center">
                {/* Profile Avatar */}
                <div className="relative mb-4">
                  <div className="w-32 h-32 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-4xl font-bold border-4 border-white shadow-lg">
                    {celebrity.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </div>
                  
                  {/* Birthday Badge */}
                  {isToday && (
                    <div className="absolute -top-2 -right-2 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                      🎂 Today!
                    </div>
                  )}
                </div>

                {/* Name and Age */}
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{celebrity.name}</h2>
                <div className="text-xl font-bold text-blue-600 mb-3">
                  {age.years} years old
                </div>
                
                {/* Zodiac Sign */}
                {celebrity.zodiacSign && (
                  <div className="mb-3 flex items-center justify-center gap-2">
                    <span className="text-2xl">{celebrity.zodiacSign.split(' ')[1]}</span>
                    <span className="text-lg text-gray-700 font-medium">{celebrity.zodiacSign.split(' ')[0]}</span>
                  </div>
                )}

                {/* Profession and Nationality */}
                <div className="space-y-1 mb-4">
                  <p className="text-base text-gray-700 font-medium">{celebrity.profession}</p>
                  <p className="text-gray-500">🇺🇸 {celebrity.nationality}</p>
                </div>

                {/* Birthday Info */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-3 mb-4">
                  <h3 className="font-semibold text-gray-900 mb-1 text-sm">Birthday</h3>
                  <p className="text-base font-bold text-gray-900">
                    {new Date(celebrity.birthDate).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    {isToday ? '🎉 Celebrating today!' : 
                     daysUntilBirthday === 1 ? '🎁 Birthday tomorrow!' : 
                     `${daysUntilBirthday} days until next birthday`}
                  </p>
                </div>

                {/* Social Media Links */}
                {celebrity.socialMedia && Object.keys(celebrity.socialMedia).length > 0 && (
                  <div className="space-y-2">
                    <h3 className="font-semibold text-gray-900 text-sm">Social Media</h3>
                    <div className="flex justify-center gap-3">
                      {celebrity.socialMedia.instagram && (
                        <a
                          href={`https://instagram.com/${celebrity.socialMedia.instagram}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full hover:scale-110 transition-transform duration-200"
                          title={`Follow ${celebrity.name} on Instagram`}
                        >
                          <SocialMediaIcon platform="instagram" size="md" className="text-white" />
                        </a>
                      )}
                      {celebrity.socialMedia.twitter && (
                        <a
                          href={`https://x.com/${celebrity.socialMedia.twitter}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-black text-white rounded-full hover:scale-110 transition-transform duration-200"
                          title={`Follow ${celebrity.name} on X`}
                        >
                          <SocialMediaIcon platform="x" size="md" className="text-white" />
                        </a>
                      )}
                      {celebrity.socialMedia.youtube && (
                        <a
                          href={`https://youtube.com/channel/${celebrity.socialMedia.youtube}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-red-600 text-white rounded-full hover:scale-110 transition-transform duration-200"
                          title={`Subscribe to ${celebrity.name}'s YouTube channel`}
                        >
                          <SocialMediaIcon platform="youtube" size="md" className="text-white" />
                        </a>
                      )}
                      {celebrity.socialMedia.tiktok && (
                        <a
                          href={`https://tiktok.com/@${celebrity.socialMedia.tiktok}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-black text-white rounded-full hover:scale-110 transition-transform duration-200"
                          title={`Follow ${celebrity.name} on TikTok`}
                        >
                          <SocialMediaIcon platform="tiktok" size="md" className="text-white" />
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Detailed Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Age Breakdown */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Age Breakdown</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                  <p className="text-2xl font-bold text-blue-700 mb-1">{age.years}</p>
                  <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Years</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                  <p className="text-2xl font-bold text-purple-700 mb-1">{age.months}</p>
                  <p className="text-xs font-semibold text-purple-600 uppercase tracking-wide">Months</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
                  <p className="text-2xl font-bold text-green-700 mb-1">{age.days}</p>
                  <p className="text-xs font-semibold text-green-600 uppercase tracking-wide">Days</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border border-orange-200">
                  <p className="text-2xl font-bold text-orange-700 mb-1">{age.hours}</p>
                  <p className="text-xs font-semibold text-orange-600 uppercase tracking-wide">Hours</p>
                </div>
              </div>
              
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-lg font-bold text-gray-900">{age.totalDays.toLocaleString()}</p>
                  <p className="text-xs text-gray-600">Total Days Lived</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-lg font-bold text-gray-900">{age.totalHours.toLocaleString()}</p>
                  <p className="text-xs text-gray-600">Total Hours Lived</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-lg font-bold text-gray-900">{age.totalMinutes.toLocaleString()}</p>
                  <p className="text-xs text-gray-600">Total Minutes Lived</p>
                </div>
              </div>
            </div>

            {/* Biography */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Biography</h3>
              <p className="text-gray-700 leading-relaxed">{celebrity.bio}</p>
            </div>

            {/* Achievements */}
            {celebrity.achievements && celebrity.achievements.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Notable Achievements</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {celebrity.achievements.map((achievement, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gray-700">{achievement}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Career Status */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Career Status</h3>
              <div className="flex items-center gap-3">
                <div className={`w-4 h-4 rounded-full ${celebrity.isActive ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                <span className="text-lg font-medium text-gray-700">
                  {celebrity.isActive ? 'Active in Career' : 'Retired/Inactive'}
                </span>
              </div>
            </div>

            {/* Inline Ad */}
            <InlineAd format="rectangle" />
          </div>
        </div>
      </div>
    </div>
  );
}
