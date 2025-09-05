'use client';

import React, { useState, useEffect } from 'react';
import { CelebrityProfile } from '@/types/celebrity';
import { 
  fetchPaginatedCelebrityProfiles, 
  searchAllCelebrities,
  getFeaturedCelebrities,
  getBirthdayCelebrities
} from '@/utils/paginatedCelebrityUtils';
import CelebrityCard from './CelebrityCard';
import VirtualizedCelebrityList from './VirtualizedCelebrityList';

interface Category {
  id: string;
  label: string;
  icon: string;
  description: string;
  count: number;
}

export default function OptimizedCelebritySection() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'virtualized'>('grid');
  const [loading, setLoading] = useState(true);
  const [searchResults, setSearchResults] = useState<CelebrityProfile[]>([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [featuredCelebrities, setFeaturedCelebrities] = useState<CelebrityProfile[]>([]);
  const [birthdayCelebrities, setBirthdayCelebrities] = useState<CelebrityProfile[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false
  });

  // Load categories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await fetch('/api/celebrities');
        const data = await response.json();
        setCategories(data.categories);
      } catch (error) {
        console.error('Error loading categories:', error);
      }
    };

    loadCategories();
  }, []);

  // Load featured celebrities
  useEffect(() => {
    const loadFeatured = async () => {
      try {
        const featured = await getFeaturedCelebrities(6);
        setFeaturedCelebrities(featured);
      } catch (error) {
        console.error('Error loading featured celebrities:', error);
      }
    };

    loadFeatured();
  }, []);

  // Load birthday celebrities
  useEffect(() => {
    const loadBirthday = async () => {
      try {
        const birthday = await getBirthdayCelebrities();
        setBirthdayCelebrities(birthday);
      } catch (error) {
        console.error('Error loading birthday celebrities:', error);
      }
    };

    loadBirthday();
  }, []);

  // Handle search
  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    setLoading(true);

    if (query.trim()) {
      try {
        const results = await searchAllCelebrities(query, { page: 1, limit: 20 });
        setSearchResults(results.profiles);
        setPagination(results.pagination);
        setShowSearchDropdown(true);
      } catch (error) {
        console.error('Error searching celebrities:', error);
        setSearchResults([]);
      }
    } else {
      setSearchResults([]);
      setShowSearchDropdown(false);
    }

    setLoading(false);
  };

  // Handle celebrity click
  const handleCelebrityClick = (celebrity: CelebrityProfile) => {
    window.location.href = `/celebrity/${celebrity.celebrity.id}`;
  };

  // Handle category change
  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSearchQuery('');
    setSearchResults([]);
    setShowSearchDropdown(false);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Celebrities Age</h1>
            <p className="text-gray-600">Discover celebrities and calculate their ages</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search celebrities..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full px-4 py-3 pl-10 pr-4 text-gray-900 placeholder-gray-500 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Search Results Dropdown */}
          {showSearchDropdown && searchResults.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-96 overflow-y-auto">
              {searchResults.map((celebrity) => (
                <div
                  key={celebrity.celebrity.id}
                  onClick={() => handleCelebrityClick(celebrity)}
                  className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {celebrity.celebrity.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{celebrity.celebrity.name}</div>
                      <div className="text-sm text-gray-500">{celebrity.celebrity.profession}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Category Filter */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleCategoryChange('all')}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              All Celebrities
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(category.id)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {category.icon} {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="mb-6 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                viewMode === 'grid'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Grid View
            </button>
            <button
              onClick={() => setViewMode('virtualized')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                viewMode === 'virtualized'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              List View
            </button>
          </div>
        </div>

        {/* Featured Celebrities */}
        {selectedCategory === 'all' && !searchQuery && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Featured Celebrities</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {featuredCelebrities.map((celebrity) => (
                <CelebrityCard
                  key={celebrity.celebrity.id}
                  profile={celebrity}
                />
              ))}
            </div>
          </div>
        )}

        {/* Birthday Celebrities */}
        {birthdayCelebrities.length > 0 && selectedCategory === 'all' && !searchQuery && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Today&apos;s Birthdays</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {birthdayCelebrities.slice(0, 6).map((celebrity) => (
                <CelebrityCard
                  key={celebrity.celebrity.id}
                  profile={celebrity}
                />
              ))}
            </div>
          </div>
        )}

        {/* Main Content */}
        {searchQuery ? (
          // Search Results
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Search Results for &quot;{searchQuery}&quot; ({pagination.total} found)
            </h2>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {searchResults.map((celebrity) => (
                  <CelebrityCard
                    key={celebrity.celebrity.id}
                    profile={celebrity}
                  />
                ))}
              </div>
            ) : (
              <VirtualizedCelebrityList
                category="search"
                searchTerm={searchQuery}
                onCelebrityClick={handleCelebrityClick}
              />
            )}
          </div>
        ) : selectedCategory === 'all' ? (
          // All Celebrities
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">All Celebrities</h2>
            {viewMode === 'grid' ? (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">Grid view not available for large datasets</p>
                <button
                  onClick={() => setViewMode('virtualized')}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Switch to List View
                </button>
              </div>
            ) : (
              <VirtualizedCelebrityList
                category="all"
                onCelebrityClick={handleCelebrityClick}
              />
            )}
          </div>
        ) : (
          // Category View
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {categories.find(c => c.id === selectedCategory)?.label} Celebrities
            </h2>
            {viewMode === 'grid' ? (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">Grid view not available for large datasets</p>
                <button
                  onClick={() => setViewMode('virtualized')}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Switch to List View
                </button>
              </div>
            ) : (
              <VirtualizedCelebrityList
                category={selectedCategory}
                onCelebrityClick={handleCelebrityClick}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
