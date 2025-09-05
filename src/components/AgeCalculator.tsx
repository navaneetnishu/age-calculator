'use client';

import { useState, useEffect } from 'react';
import { calculateAge, formatAge, isValidDate, type AgeResult } from '@/utils/ageCalculator';
import { getZodiacSign } from '@/utils/zodiacUtils';
import { getCelebritiesByZodiacAndYear } from '@/utils/celebrityUtils';

// Modern Loading Component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center">
    <div className="relative">
      <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      <div className="absolute top-0 left-0 w-8 h-8 border-4 border-transparent border-t-purple-600 rounded-full animate-spin" style={{ animationDelay: '0.1s' }}></div>
    </div>
  </div>
);

// Modern Success Animation Component
const SuccessCheckmark = () => (
  <div className="flex items-center justify-center">
    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
      </svg>
    </div>
  </div>
);

// Celebrity Match Card Component
const CelebrityMatchCard = ({ celebrity, onCelebrityClick }: { celebrity: any, onCelebrityClick: (id: string) => void }) => {
  const birthDate = new Date(celebrity.birthDate);
  const age = calculateAge(new Date(celebrity.birthDate));
  
  return (
    <div 
      onClick={() => onCelebrityClick(celebrity.id)}
      className="bg-white rounded-xl p-4 border-2 border-gray-200 hover:border-blue-300 hover:shadow-lg transform hover:scale-105 transition-all duration-200 cursor-pointer group"
    >
      <div className="flex items-center space-x-3">
        {/* Avatar */}
        <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center text-lg font-bold text-blue-600 group-hover:from-blue-200 group-hover:to-purple-200 transition-colors">
          {celebrity.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
        </div>
        
        {/* Celebrity Info */}
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900 text-sm truncate group-hover:text-blue-600 transition-colors">
            {celebrity.name}
          </h4>
          <p className="text-xs text-gray-600 truncate">
            {celebrity.profession} • {age.years} years old
          </p>
          <div className="flex items-center space-x-2 mt-1">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
              {celebrity.zodiacSign}
            </span>
            <span className="text-xs text-gray-500">
              {birthDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          </div>
        </div>
        
        {/* Arrow Icon */}
        <div className="text-gray-400 group-hover:text-blue-500 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default function AgeCalculator() {
  const [birthDate, setBirthDate] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [age, setAge] = useState<AgeResult | null>(null);
  const [error, setError] = useState('');
  const [isCalculating, setIsCalculating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [matchingCelebrities, setMatchingCelebrities] = useState<any[]>([]);
  const [userZodiacSign, setUserZodiacSign] = useState<string>('');
  const [userBirthYear, setUserBirthYear] = useState<number | null>(null);

  // Set default target date to today
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setTargetDate(today);
  }, []);

  const handleBirthDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setBirthDate(value);
    
    // Clear previous matches and age results
    setMatchingCelebrities([]);
    setUserZodiacSign('');
    setUserBirthYear(null);
    setAge(null);
  };

  const handleTargetDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTargetDate(value);
  };

  const handleCalculate = async () => {
    if (!birthDate) {
      setError('Please enter your birth date');
      return;
    }

    const target = targetDate ? new Date(targetDate) : new Date();
    const birth = new Date(birthDate);

    if (birth > target) {
      setError('Birth date cannot be in the future');
      return;
    }

    setIsCalculating(true);
    setError('');
    setShowSuccess(false);

    try {
      // Simulate a small delay for better UX
      setTimeout(async () => {
        const result = calculateAge(birth, target);
        setAge(result);
        setIsCalculating(false);
        setShowSuccess(true);
        
        // Calculate zodiac sign and find matching celebrities
        const month = birth.getMonth() + 1; // getMonth() returns 0-11
        const day = birth.getDate();
        const year = birth.getFullYear();
        
        const zodiac = getZodiacSign(month, day);
        setUserZodiacSign(zodiac);
        setUserBirthYear(year);
        
        // Find matching celebrities using the new async function
        try {
          const matches = await getCelebritiesByZodiacAndYear(zodiac, year);
          setMatchingCelebrities(matches.slice(0, 6)); // Show top 6 matches
        } catch (error) {
          console.error('Error finding celebrity matches:', error);
          setMatchingCelebrities([]);
        }
        
        // Hide success animation after 2 seconds
        setTimeout(() => setShowSuccess(false), 2000);
      }, 1000);
    } catch (error) {
      setError('An error occurred while calculating age');
      setIsCalculating(false);
    }
  };

  const handleReset = () => {
    setBirthDate('');
    setTargetDate(new Date().toISOString().split('T')[0]);
    setAge(null);
    setError('');
    setShowSuccess(false);
    setMatchingCelebrities([]);
    setUserZodiacSign('');
    setUserBirthYear(null);
  };

  const handleCelebrityClick = (celebrityId: string) => {
    // Navigate to celebrity profile page
    window.location.href = `/celebrity/${celebrityId}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Modern Header with Animation */}
      <div className="relative overflow-hidden bg-white shadow-sm">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="text-center">
            <div className="flex justify-center mb-2 animate-bounce">
              <div className="p-1.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg transform hover:scale-110 transition-transform duration-300">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2 animate-fade-in">
              Age Calculator
            </h1>
            <p className="text-sm text-gray-600 max-w-xl mx-auto leading-relaxed">
              Discover your exact age with precision. Calculate years, months, days, hours, and minutes.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Input Section */}
          <div className="xl:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 transform hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="p-1.5 bg-blue-100 rounded-lg mr-3">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-900">Enter Your Details</h2>
              </div>
              
              <form onSubmit={(e) => { e.preventDefault(); handleCalculate(); }} className="space-y-4">
                {/* Birth Date Input */}
                <div className="space-y-2">
                  <label htmlFor="birthDate" className="block text-base font-semibold text-gray-700">
                    Date of Birth <span className="text-red-500">*</span>
                  </label>
                  <div className="relative group">
                    <input
                      type="date"
                      id="birthDate"
                      name="birthDate"
                      value={birthDate}
                      onChange={handleBirthDateChange}
                      className="w-full px-4 py-3 text-base border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 bg-white hover:bg-gray-50 group-hover:border-blue-300 cursor-pointer"
                      max={new Date().toISOString().split('T')[0]}
                      required
                      placeholder="Select your birth date"
                    />
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <svg className="w-4 h-4 text-gray-400 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                  {!birthDate && (
                    <p className="text-xs text-gray-500 flex items-center">
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Click to select your birth date
                    </p>
                  )}
                </div>

                {/* Target Date Input */}
                <div className="space-y-2">
                  <label htmlFor="targetDate" className="block text-base font-semibold text-gray-700">
                    Calculate Age As Of <span className="text-gray-500 text-xs">(Optional)</span>
                  </label>
                  <div className="relative group">
                    <input
                      type="date"
                      id="targetDate"
                      name="targetDate"
                      value={targetDate}
                      onChange={handleTargetDateChange}
                      className="w-full px-4 py-3 text-base border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 bg-white hover:bg-gray-50 group-hover:border-blue-300 cursor-pointer"
                      max={new Date().toISOString().split('T')[0]}
                      placeholder="Select target date"
                    />
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <svg className="w-4 h-4 text-gray-400 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 flex items-center">
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Leave empty to calculate age as of today
                  </p>
                </div>

                {/* Error Display */}
                {error && (
                  <div className="p-3 bg-red-50 border-2 border-red-200 rounded-xl flex items-center animate-shake">
                    <svg className="w-4 h-4 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-red-700 font-medium text-sm">{error}</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={isCalculating}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                    <div className="relative flex items-center justify-center">
                      {isCalculating ? (
                        <>
                          <LoadingSpinner />
                          <span className="ml-3">Calculating...</span>
                        </>
                      ) : showSuccess ? (
                        <>
                          <SuccessCheckmark />
                          <span className="ml-3">Calculated!</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                          Calculate Age
                        </>
                      )}
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 transform hover:scale-105"
                  >
                    Reset
                  </button>
                </div>
              </form>
            </div>

            {/* Celebrity Matches Section */}
            {age && matchingCelebrities.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mt-6 transform hover:shadow-xl transition-all duration-300">
                <div className="flex items-center mb-4">
                  <div className="p-1.5 bg-purple-100 rounded-lg mr-3">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Celebrity Matches</h2>
                    <p className="text-sm text-gray-600">
                      You share a personality match with these {matchingCelebrities.length} celebrities
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto">
                  {matchingCelebrities.map((celebrity) => (
                    <CelebrityMatchCard
                      key={celebrity.id}
                      celebrity={celebrity}
                      onCelebrityClick={handleCelebrityClick}
                    />
                  ))}
                </div>
                
                <div className="mt-4 text-center">
                  <p className="text-xs text-gray-500">
                    Showing your 4 closest personality matches. Click on any celebrity to view their full profile!
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Results Section */}
          <div className="xl:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 h-fit sticky top-8 transform hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="p-1.5 bg-purple-100 rounded-lg mr-3">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-900">Your Age</h2>
              </div>
              
              {age ? (
                <div className="space-y-4 animate-fade-in">
                  {/* Main Age Display */}
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl border-2 border-blue-100 transform hover:scale-105 transition-transform duration-300">
                    <p className="text-xs text-blue-600 font-semibold mb-2 uppercase tracking-wide">Your exact age is</p>
                    <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent leading-tight">
                      {formatAge(age)}
                    </p>
                  </div>

                  {/* Detailed Breakdown */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 transform hover:scale-105 transition-transform duration-300">
                      <p className="text-xl font-bold text-blue-700 mb-1">{age.years}</p>
                      <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Years</p>
                    </div>
                    <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200 transform hover:scale-105 transition-transform duration-300">
                      <p className="text-xl font-bold text-purple-700 mb-1">{age.months}</p>
                      <p className="text-xs font-semibold text-purple-600 uppercase tracking-wide">Months</p>
                    </div>
                    <div className="text-center p-3 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200 transform hover:scale-105 transition-transform duration-300">
                      <p className="text-xl font-bold text-green-700 mb-1">{age.days}</p>
                      <p className="text-xs font-semibold text-green-600 uppercase tracking-wide">Days</p>
                    </div>
                    <div className="text-center p-3 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border border-orange-200 transform hover:scale-105 transition-transform duration-300">
                      <p className="text-xl font-bold text-orange-700 mb-1">{age.hours}</p>
                      <p className="text-xs font-semibold text-orange-600 uppercase tracking-wide">Hours</p>
                    </div>
                  </div>

                  {/* Additional Stats */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-gray-900 mb-2">Life Statistics</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                        <span className="text-gray-600 font-medium text-xs">Total days lived:</span>
                        <span className="font-bold text-gray-900 text-sm">{age.totalDays.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                        <span className="text-gray-600 font-medium text-xs">Total hours lived:</span>
                        <span className="font-bold text-gray-900 text-sm">{age.totalHours.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                        <span className="text-gray-600 font-medium text-xs">Total minutes lived:</span>
                        <span className="font-bold text-gray-900 text-sm">{age.totalMinutes.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center animate-pulse">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-500 font-medium">Enter your birth date to see your age</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modern Footer */}
      <footer className="bg-white border-t border-gray-100 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <div className="flex justify-center mb-3">
              <div className="p-1.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg transform hover:scale-110 transition-transform duration-300">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
            <p className="text-gray-600 text-sm">
              © 2024 Age Calculator. A modern tool to calculate your exact age with precision and style.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
