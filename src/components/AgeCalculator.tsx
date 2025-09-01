'use client';

import { useState, useEffect } from 'react';
import { calculateAge, formatAge, isValidDate, type AgeResult } from '@/utils/ageCalculator';

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

export default function AgeCalculator() {
  const [birthDate, setBirthDate] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [age, setAge] = useState<AgeResult | null>(null);
  const [error, setError] = useState('');
  const [isCalculating, setIsCalculating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [debugInfo, setDebugInfo] = useState('');

  // Set default target date to today
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setTargetDate(today);
    setDebugInfo(`Default target date set to: ${today}`);
  }, []);

  const handleBirthDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setBirthDate(value);
    setDebugInfo(`Birth date changed to: ${value}`);
  };

  const handleTargetDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTargetDate(value);
    setDebugInfo(`Target date changed to: ${value}`);
  };

  const handleCalculate = () => {
    if (!birthDate) {
      setError('Please enter your birth date');
      setDebugInfo('Error: No birth date entered');
      return;
    }

    if (!isValidDate(birthDate)) {
      setError('Please enter a valid birth date');
      setDebugInfo(`Error: Invalid birth date format: ${birthDate}`);
      return;
    }

    const target = targetDate ? new Date(targetDate) : new Date();
    const birth = new Date(birthDate);

    if (birth > target) {
      setError('Birth date cannot be in the future');
      setDebugInfo(`Error: Birth date ${birthDate} is in the future`);
      return;
    }

    setIsCalculating(true);
    setError('');
    setShowSuccess(false);
    setDebugInfo('Calculating age...');

    // Simulate a small delay for better UX
    setTimeout(() => {
      const result = calculateAge(birth, target);
      setAge(result);
      setIsCalculating(false);
      setShowSuccess(true);
      setDebugInfo(`Age calculated successfully: ${formatAge(result)}`);
      
      // Hide success animation after 2 seconds
      setTimeout(() => setShowSuccess(false), 2000);
    }, 1000);
  };

  const handleReset = () => {
    setBirthDate('');
    setTargetDate(new Date().toISOString().split('T')[0]);
    setAge(null);
    setError('');
    setShowSuccess(false);
    setDebugInfo('Form reset');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Debug Info */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed top-4 left-4 bg-black bg-opacity-75 text-white p-3 rounded-lg text-sm max-w-xs z-50">
          <div className="font-bold mb-2">Debug Info:</div>
          <div>{debugInfo}</div>
          <div className="mt-2 text-xs">
            <div>Birth Date: {birthDate || 'Not set'}</div>
            <div>Target Date: {targetDate || 'Not set'}</div>
          </div>
        </div>
      )}

      {/* Modern Header with Animation */}
      <div className="relative overflow-hidden bg-white shadow-sm">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex justify-center mb-6 animate-bounce">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg transform hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4 animate-fade-in">
              Age Calculator
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Discover your exact age with precision. Calculate years, months, days, hours, and minutes in a beautiful, modern interface.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Input Section */}
          <div className="xl:col-span-2">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 transform hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center mb-8">
                <div className="p-2 bg-blue-100 rounded-xl mr-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Enter Your Details</h2>
              </div>
              
              <form onSubmit={(e) => { e.preventDefault(); handleCalculate(); }} className="space-y-8">
                {/* Birth Date Input */}
                <div className="space-y-3">
                  <label htmlFor="birthDate" className="block text-lg font-semibold text-gray-700">
                    Date of Birth <span className="text-red-500">*</span>
                  </label>
                  <div className="relative group">
                    <input
                      type="date"
                      id="birthDate"
                      name="birthDate"
                      value={birthDate}
                      onChange={handleBirthDateChange}
                      className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 bg-white hover:bg-gray-50 group-hover:border-blue-300 cursor-pointer"
                      max={new Date().toISOString().split('T')[0]}
                      required
                      placeholder="Select your birth date"
                    />
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                  {!birthDate && (
                    <p className="text-sm text-gray-500 flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Click to select your birth date
                    </p>
                  )}
                </div>

                {/* Target Date Input */}
                <div className="space-y-3">
                  <label htmlFor="targetDate" className="block text-lg font-semibold text-gray-700">
                    Calculate Age As Of <span className="text-gray-500 text-sm">(Optional)</span>
                  </label>
                  <div className="relative group">
                    <input
                      type="date"
                      id="targetDate"
                      name="targetDate"
                      value={targetDate}
                      onChange={handleTargetDateChange}
                      className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 bg-white hover:bg-gray-50 group-hover:border-blue-300 cursor-pointer"
                      max={new Date().toISOString().split('T')[0]}
                      placeholder="Select target date"
                    />
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Leave empty to calculate age as of today
                  </p>
                </div>

                {/* Error Display */}
                {error && (
                  <div className="p-4 bg-red-50 border-2 border-red-200 rounded-2xl flex items-center animate-shake">
                    <svg className="w-5 h-5 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-red-700 font-medium">{error}</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={isCalculating}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden group"
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
                    className="px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-2xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 transform hover:scale-105"
                  >
                    Reset
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Results Section */}
          <div className="xl:col-span-1">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 h-fit sticky top-8 transform hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center mb-8">
                <div className="p-2 bg-purple-100 rounded-xl mr-4">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Your Age</h2>
              </div>
              
              {age ? (
                <div className="space-y-8 animate-fade-in">
                  {/* Main Age Display */}
                  <div className="text-center p-8 bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl border-2 border-blue-100 transform hover:scale-105 transition-transform duration-300">
                    <p className="text-sm text-blue-600 font-semibold mb-3 uppercase tracking-wide">Your exact age is</p>
                    <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent leading-tight">
                      {formatAge(age)}
                    </p>
                  </div>

                  {/* Detailed Breakdown */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border border-blue-200 transform hover:scale-105 transition-transform duration-300">
                      <p className="text-3xl font-bold text-blue-700 mb-2">{age.years}</p>
                      <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide">Years</p>
                    </div>
                    <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl border border-purple-200 transform hover:scale-105 transition-transform duration-300">
                      <p className="text-3xl font-bold text-purple-700 mb-2">{age.months}</p>
                      <p className="text-sm font-semibold text-purple-600 uppercase tracking-wide">Months</p>
                    </div>
                    <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl border border-green-200 transform hover:scale-105 transition-transform duration-300">
                      <p className="text-3xl font-bold text-green-700 mb-2">{age.days}</p>
                      <p className="text-sm font-semibold text-green-600 uppercase tracking-wide">Days</p>
                    </div>
                    <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl border border-orange-200 transform hover:scale-105 transition-transform duration-300">
                      <p className="text-3xl font-bold text-orange-700 mb-2">{age.hours}</p>
                      <p className="text-sm font-semibold text-orange-600 uppercase tracking-wide">Hours</p>
                    </div>
                  </div>

                  {/* Additional Stats */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Life Statistics</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center py-3 px-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200">
                        <span className="text-gray-600 font-medium">Total days lived:</span>
                        <span className="font-bold text-gray-900">{age.totalDays.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center py-3 px-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200">
                        <span className="text-gray-600 font-medium">Total hours lived:</span>
                        <span className="font-bold text-gray-900">{age.totalHours.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center py-3 px-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200">
                        <span className="text-gray-600 font-medium">Total minutes lived:</span>
                        <span className="font-bold text-gray-900">{age.totalMinutes.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center animate-pulse">
                    <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-lg text-gray-500 font-medium">Enter your birth date to see your age</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modern Footer */}
      <footer className="bg-white border-t border-gray-100 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl transform hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
            <p className="text-gray-600 text-lg">
              © 2024 Age Calculator. A modern tool to calculate your exact age with precision and style.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
