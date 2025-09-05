'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AboutUs() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="relative overflow-hidden bg-white shadow-sm">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push('/')}
              className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-sm font-medium">Back to Home</span>
            </button>
            
            <h1 className="text-xl font-bold text-gray-900">About Us</h1>
            
            <div className="w-24"></div> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          {/* Hero Section */}
          <div className="text-center mb-8">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mb-4">
              🎂
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">About Age Calculator</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Your trusted companion for precise age calculations and celebrity birthday discoveries.
            </p>
          </div>

          {/* Mission Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              At Age Calculator, we believe that knowing your exact age and discovering interesting facts about celebrities 
              should be simple, accurate, and fun. Our mission is to provide you with the most precise age calculations 
              and a comprehensive database of celebrity information.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Whether you&apos;re curious about your exact age in years, months, days, hours, and minutes, or you want to 
              explore the ages and birthdays of your favorite celebrities, we&apos;ve got you covered.
            </p>
          </div>

          {/* Features Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">What We Offer</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                <div className="text-2xl mb-3">⏰</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Precise Age Calculation</h3>
                <p className="text-gray-700">
                  Calculate your exact age down to the minute with our advanced age calculator. 
                  Get detailed breakdowns in years, months, days, hours, and minutes.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
                <div className="text-2xl mb-3">⭐</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Celebrity Database</h3>
                <p className="text-gray-700">
                  Explore our comprehensive database of 850+ celebrities including actors, musicians, 
                  athletes, entrepreneurs, and more with their ages and zodiac signs.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                <div className="text-2xl mb-3">🔍</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Smart Search</h3>
                <p className="text-gray-700">
                  Find celebrities by name, profession, nationality, or category. 
                  Get instant results with our powerful search functionality.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200">
                <div className="text-2xl mb-3">📱</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Mobile Friendly</h3>
                <p className="text-gray-700">
                  Enjoy a seamless experience across all devices. Our responsive design 
                  ensures perfect functionality on desktop, tablet, and mobile.
                </p>
              </div>
            </div>
          </div>

          {/* Technology Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Built with Modern Technology</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Our Age Calculator is built using cutting-edge web technologies to ensure fast, reliable, 
              and accurate calculations. We use Next.js for optimal performance, TypeScript for type safety, 
              and Tailwind CSS for beautiful, responsive design.
            </p>
            <div className="flex flex-wrap gap-3">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">Next.js</span>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">TypeScript</span>
              <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">Tailwind CSS</span>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">React</span>
              <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">Responsive Design</span>
            </div>
          </div>

          {/* Values Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Values</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h3 className="font-semibold text-gray-900">Accuracy</h3>
                  <p className="text-gray-700">We ensure all age calculations are precise and reliable.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h3 className="font-semibold text-gray-900">User Experience</h3>
                  <p className="text-gray-700">We prioritize simplicity and ease of use in everything we build.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h3 className="font-semibold text-gray-900">Privacy</h3>
                  <p className="text-gray-700">Your data is safe with us. We don&apos;t store personal information.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h3 className="font-semibold text-gray-900">Innovation</h3>
                  <p className="text-gray-700">We continuously improve our tools and add new features.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact CTA */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Get in Touch</h2>
            <p className="text-gray-700 mb-4">
              Have questions, suggestions, or feedback? We&apos;d love to hear from you!
            </p>
            <button
              onClick={() => router.push('/contact')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
            >
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
