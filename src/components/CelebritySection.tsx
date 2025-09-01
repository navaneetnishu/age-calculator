'use client';

import { useState, useEffect } from 'react';
import { CelebrityProfile, CelebrityCategory } from '@/types/celebrity';
import { 
  getAllCelebrityProfiles, 
  getCelebritiesByCategory, 
  getCelebritiesBySearch,
  getBirthdayCelebrities,
  getUpcomingBirthdays,
  getCategories,
  getRandomCelebrities,
  getOldestCelebrities,
  getYoungestCelebrities
} from '@/utils/celebrityUtils';
import CelebrityCard from './CelebrityCard';

export default function CelebritySection() {
  const [profiles, setProfiles] = useState<CelebrityProfile[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'age' | 'birthday'>('name');
  const [loading, setLoading] = useState(true);

  const categories = getCategories();
  const birthdayCelebrities = getBirthdayCelebrities();
  const upcomingBirthdays = getUpcomingBirthdays(7);
  const randomCelebrities = getRandomCelebrities(6);
  const oldestCelebrities = getOldestCelebrities(3);
  const youngestCelebrities = getYoungestCelebrities(3);

  useEffect(() => {
    setLoading(true);
    
    let filteredProfiles: CelebrityProfile[];
    
    if (searchQuery.trim()) {
      filteredProfiles = getCelebritiesBySearch(searchQuery);
    } else if (selectedCategory === 'all') {
      filteredProfiles = getAllCelebrityProfiles();
    } else {
      filteredProfiles = getCelebritiesByCategory(selectedCategory as CelebrityCategory);
    }

    // Sort profiles
    filteredProfiles.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.celebrity.name.localeCompare(b.celebrity.name);
        case 'age':
          return b.age.years - a.age.years;
        case 'birthday':
          return a.daysUntilBirthday - b.daysUntilBirthday;
        default:
          return 0;
      }
    });

    setProfiles(filteredProfiles);
    setLoading(false);
  }, [selectedCategory, searchQuery, sortBy]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setSearchQuery('');
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setSelectedCategory('all');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="relative overflow-hidden bg-white shadow-sm">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg">
                <span className="text-4xl">⭐</span>
              </div>
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Famous People Birthdays
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Discover the ages of your favorite celebrities, actors, musicians, athletes, and more. 
              Find out who shares your birthday and who&apos;s celebrating today!
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search and Filters */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Search */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Search Celebrities</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by name, profession, or nationality..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <span className="text-gray-400">🔍</span>
                </div>
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200"
              >
                <option value="all">All Categories ({getAllCelebrityProfiles().length})</option>
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.icon} {category.label} ({category.count})
                  </option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'name' | 'age' | 'birthday')}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200"
              >
                <option value="name">Name A-Z</option>
                <option value="age">Age (Oldest First)</option>
                <option value="birthday">Next Birthday</option>
              </select>
            </div>
          </div>
        </div>

        {/* Birthday Highlights */}
        {birthdayCelebrities.length > 0 && (
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              🎂 <span className="bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
                Celebrating Today!
              </span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {birthdayCelebrities.map(profile => (
                <CelebrityCard key={profile.celebrity.id} profile={profile} showDetails={true} />
              ))}
            </div>
          </div>
        )}

        {/* Upcoming Birthdays */}
        {upcomingBirthdays.length > 0 && (
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              🎁 <span className="bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">
                Upcoming Birthdays (Next 7 Days)
              </span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingBirthdays.slice(0, 6).map(profile => (
                <CelebrityCard key={profile.celebrity.id} profile={profile} />
              ))}
            </div>
          </div>
        )}

        {/* Age Extremes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Oldest Celebrities */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              👴 Oldest Celebrities
            </h3>
            <div className="space-y-4">
              {oldestCelebrities.map(profile => (
                <div key={profile.celebrity.id} className="bg-white rounded-xl p-4 shadow-md">
                  <div className="flex items-center gap-4">
                    <img 
                      src={profile.celebrity.imageUrl} 
                      alt={profile.celebrity.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{profile.celebrity.name}</h4>
                      <p className="text-sm text-gray-600">{profile.celebrity.profession}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600">{profile.age.years}</div>
                      <div className="text-xs text-gray-500">years old</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Youngest Celebrities */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              👶 Youngest Celebrities
            </h3>
            <div className="space-y-4">
              {youngestCelebrities.map(profile => (
                <div key={profile.celebrity.id} className="bg-white rounded-xl p-4 shadow-md">
                  <div className="flex items-center gap-4">
                    <img 
                      src={profile.celebrity.imageUrl} 
                      alt={profile.celebrity.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{profile.celebrity.name}</h4>
                      <p className="text-sm text-gray-600">{profile.celebrity.profession}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">{profile.age.years}</div>
                      <div className="text-xs text-gray-500">years old</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Results */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-gray-900">
              {searchQuery ? `Search Results for "${searchQuery}"` : 
               selectedCategory === 'all' ? 'All Celebrities' : 
               `${categories.find(c => c.value === selectedCategory)?.label} (${profiles.length})`}
            </h2>
            
            {/* View Mode Toggle */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
              >
                📱
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
              >
                📋
              </button>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading celebrities...</p>
            </div>
          )}

          {/* Results Grid */}
          {!loading && (
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                : 'grid-cols-1'
            }`}>
              {profiles.map(profile => (
                <CelebrityCard 
                  key={profile.celebrity.id} 
                  profile={profile} 
                  showDetails={viewMode === 'list'}
                />
              ))}
            </div>
          )}

          {/* No Results */}
          {!loading && profiles.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No celebrities found</h3>
              <p className="text-gray-600">Try adjusting your search or category filter</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
