'use client';

import { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { CelebrityProfile, CelebrityCategory } from '@/types/celebrity';
import { 
  getAllCelebrities, 
  getCelebritiesByCategory, 
  getCelebritiesBySearch,
  getBirthdayCelebrities,
  getUpcomingBirthdays,
  loadCategories,
  getRandomCelebrities,
  getOldestCelebrities,
  getYoungestCelebrities,
  getCategoryTotalCount
} from '@/utils/celebrityUtils';
import CelebrityCard from './CelebrityCard';

const CelebritySection = memo(function CelebritySection() {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [loading, setLoading] = useState(true);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [birthdayCelebrities, setBirthdayCelebrities] = useState<any[]>([]);
  const [upcomingBirthdays, setUpcomingBirthdays] = useState<any[]>([]);
  const [randomCelebrities, setRandomCelebrities] = useState<any[]>([]);
  const [oldestCelebrities, setOldestCelebrities] = useState<any[]>([]);
  const [youngestCelebrities, setYoungestCelebrities] = useState<any[]>([]);
  const [categoryTotalCount, setCategoryTotalCount] = useState<number>(0);

  // Helper functions for age calculations
  const calculateAge = (birthDate: string) => {
    const birth = new Date(birthDate);
    
    // Check if the date is valid
    if (isNaN(birth.getTime())) {
      console.warn('Invalid birth date for age calculation:', birthDate);
      return { years: 0, months: 0, days: 0, hours: 0, minutes: 0 }; // Return 0 as fallback
    }
    
    const today = new Date();
    const age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      return { years: age - 1, months: 0, days: 0, hours: 0, minutes: 0 };
    }
    
    return { years: age, months: monthDiff, days: 0, hours: 0, minutes: 0 };
  };

  const getNextBirthday = (dateOfBirth: string): string => {
    const birthDate = new Date(dateOfBirth);
    
    // Check if the date is valid
    if (isNaN(birthDate.getTime())) {
      console.warn('Invalid birth date:', dateOfBirth);
      return new Date().toISOString().split('T')[0]; // Return today's date as fallback
    }
    
    const today = new Date();
    const nextBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
    
    if (nextBirthday < today) {
      nextBirthday.setFullYear(today.getFullYear() + 1);
    }
    
    return nextBirthday.toISOString().split('T')[0];
  };

  const getDaysUntilBirthday = (dateOfBirth: string): number => {
    const birthDate = new Date(dateOfBirth);
    
    // Check if the date is valid
    if (isNaN(birthDate.getTime())) {
      console.warn('Invalid birth date for days calculation:', dateOfBirth);
      return 0; // Return 0 as fallback
    }
    
    const today = new Date();
    const nextBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
    
    if (nextBirthday < today) {
      nextBirthday.setFullYear(today.getFullYear() + 1);
    }
    
    return Math.ceil((nextBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  };

  const isBirthdayToday = (dateOfBirth: string): boolean => {
    const birthDate = new Date(dateOfBirth);
    
    // Check if the date is valid
    if (isNaN(birthDate.getTime())) {
      console.warn('Invalid birth date for birthday check:', dateOfBirth);
      return false; // Return false as fallback
    }
    
    const today = new Date();
    return today.getMonth() === birthDate.getMonth() && today.getDate() === birthDate.getDate();
  };

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [categoriesData, birthdayData, upcomingData, randomData, oldestData, youngestData] = await Promise.all([
          loadCategories(),
          getBirthdayCelebrities(),
          getUpcomingBirthdays(7),
          getRandomCelebrities(),
          getOldestCelebrities(),
          getYoungestCelebrities()
        ]);

        setCategories(categoriesData.categories || []);
        setBirthdayCelebrities(birthdayData);
        setUpcomingBirthdays(upcomingData);
        setRandomCelebrities(randomData);
        setOldestCelebrities(oldestData);
        setYoungestCelebrities(youngestData);
      } catch (error) {
        console.error('Error loading initial data:', error);
      }
    };

    loadInitialData();
  }, []);

  useEffect(() => {
    const loadProfiles = async () => {
      setLoading(true);
      
      try {
        let filteredCelebrities: any[];
        
        if (searchQuery.trim()) {
          filteredCelebrities = await getCelebritiesBySearch(searchQuery);
        } else if (selectedCategory === 'all') {
          filteredCelebrities = await getAllCelebrities();
        } else {
          filteredCelebrities = await getCelebritiesByCategory(selectedCategory as CelebrityCategory);
        }

        // Convert to CelebrityProfile format with proper age calculations
        const profilesWithAge = filteredCelebrities.map(item => {
          // Check if item is already a CelebrityProfile (from search) or raw Celebrity
          if (item.celebrity && item.age) {
            // Already a CelebrityProfile, return as is
            return item;
          } else {
            // Raw Celebrity, convert to CelebrityProfile
            const celebrity = item;
            const age = calculateAge(celebrity.birthDate);
            const nextBirthday = getNextBirthday(celebrity.birthDate);
            const daysUntilBirthday = getDaysUntilBirthday(celebrity.birthDate);
            const isToday = isBirthdayToday(celebrity.birthDate);
            
            return {
              celebrity,
              age,
              nextBirthday,
              daysUntilBirthday,
              isBirthdayToday: isToday
            };
          }
        });

        // Sort by name by default
        profilesWithAge.sort((a, b) => {
          const nameA = a.celebrity?.name || a.name || '';
          const nameB = b.celebrity?.name || b.name || '';
          return nameA.localeCompare(nameB);
        });

        setProfiles(profilesWithAge);
        
        // Load total count for the category (only if not searching)
        if (!searchQuery.trim()) {
          try {
            const totalCount = await getCategoryTotalCount(selectedCategory);
            setCategoryTotalCount(totalCount);
          } catch (error) {
            console.error('Error loading category total count:', error);
            setCategoryTotalCount(profilesWithAge.length);
          }
        } else {
          setCategoryTotalCount(profilesWithAge.length);
        }
      } catch (error) {
        console.error('Error loading profiles:', error);
        setProfiles([]);
        setCategoryTotalCount(0);
      } finally {
        setLoading(false);
      }
    };

    loadProfiles();
  }, [selectedCategory, searchQuery]);

  // Handle real-time search
  useEffect(() => {
    const handleSearch = async () => {
      if (searchQuery.trim()) {
        try {
          const results = await getCelebritiesBySearch(searchQuery);
          setSearchResults(results.slice(0, 8)); // Show max 8 results in dropdown
          setShowSearchDropdown(true);
        } catch (error) {
          console.error('Error searching:', error);
          setSearchResults([]);
        }
      } else {
        setSearchResults([]);
        setShowSearchDropdown(false);
      }
    };

    handleSearch();
  }, [searchQuery]);

  const handleCategoryChange = useCallback((category: string) => {
    setSelectedCategory(category);
    setSearchQuery('');
    setShowSearchDropdown(false);
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setSelectedCategory('all');
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    // Show dropdown immediately when user starts typing
    if (query.trim()) {
      setSelectedCategory('all');
      setShowSearchDropdown(true);
    } else {
      setShowSearchDropdown(false);
    }
  };

  const handleSearchResultClick = (profile: CelebrityProfile) => {
    // Navigate to the celebrity profile page instead of just setting search query
    window.location.href = `/celebrity/${profile.celebrity?.id || (profile as any).id}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Compact Header */}
      <div className="relative overflow-hidden bg-white shadow-sm">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="text-center">
            <div className="flex justify-center mb-1">
              <div className="p-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-1">
              Celebrities Age
            </h1>
            <p className="text-xs text-gray-600 max-w-lg mx-auto">
              Discover ages of celebrities, actors, athletes, and notable personalities.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content - More Compact */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        {/* Compact Search Bar */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4 mb-3">
          <div className="max-w-2xl mx-auto">
            <label className="block text-xs font-semibold text-gray-700 mb-1">Search Celebrities</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Type to search celebrities (e.g., 'Tom Hanks', 'Actor', 'American')..."
                value={searchQuery}
                onChange={handleSearchInputChange}
                onFocus={() => {
                  if (searchQuery.trim()) {
                    setShowSearchDropdown(true);
                  }
                }}
                onBlur={() => {
                  setTimeout(() => setShowSearchDropdown(false), 200);
                }}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <span className="text-gray-400 text-sm">🔍</span>
              </div>
              
              {/* Search Dropdown */}
              {showSearchDropdown && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
                  <div className="p-2 bg-blue-50 border-b border-gray-200">
                    <p className="text-xs font-semibold text-blue-700">Search Results ({searchResults.length})</p>
                  </div>
                  {searchResults.map(profile => (
                    <div
                      key={profile.celebrity?.id || profile.id || Math.random()}
                      onClick={() => handleSearchResultClick(profile)}
                      className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors duration-200"
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {(profile.celebrity?.name || profile.name || '??').split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900 text-sm">{profile.celebrity?.name || profile.name || 'Unknown'}</div>
                        <div className="text-xs text-gray-600">{profile.celebrity?.profession || profile.profession || 'Unknown'}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-blue-600 text-sm">{profile.age?.years || 0}</div>
                        <div className="text-xs text-gray-500">years</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">💡 Search by name, profession, or nationality</p>
          </div>
        </div>

        {/* Compact Category Buttons */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-3 mb-4">
          <div className="text-center mb-2">
            <h3 className="text-sm font-semibold text-gray-700">Browse by Category</h3>
          </div>
          <div className="flex flex-wrap justify-center gap-1.5">
            {/* All Categories Button */}
            <button
              onClick={() => handleCategoryChange('all')}
              className={`px-2.5 py-1 rounded-md font-medium transition-all duration-200 text-xs ${
                selectedCategory === 'all'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            
            {/* Category Buttons */}
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(category.id)}
                className={`px-2.5 py-1 rounded-md font-medium transition-all duration-200 text-xs ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Search Results - Show at top when searching */}
        {searchQuery.trim() && !loading && (
          <div className="mb-4">
            <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
              🔍 <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                Search Results for &quot;{searchQuery}&quot;
              </span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {profiles.map(profile => (
                <CelebrityCard 
                  key={profile.celebrity?.id || profile.id || Math.random()} 
                  profile={profile} 
                  showDetails={false}
                />
              ))}
            </div>
            {profiles.length === 0 && (
              <div className="text-center py-6">
                <div className="text-4xl mb-2">🔍</div>
                <h3 className="text-base font-semibold text-gray-900 mb-1">No celebrities found</h3>
                <p className="text-gray-600 text-sm">Try adjusting your search terms</p>
              </div>
            )}
          </div>
        )}

        {/* Default View - Show when no search or category is selected */}
        {!searchQuery.trim() && selectedCategory === 'all' && !loading && (
          <div className="mb-4">
            <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
              🌟 <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                Featured Celebrities
              </span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {randomCelebrities.map(profile => (
                <CelebrityCard 
                  key={profile.celebrity?.id || profile.id || Math.random()} 
                  profile={profile} 
                  showDetails={false}
                />
              ))}
            </div>
          </div>
        )}

        {/* Category Results - Show when category is selected */}
        {!searchQuery.trim() && selectedCategory !== 'all' && !loading && (
          <div className="mb-4">
            <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
              📂 <span className="bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">
                {categories.find(c => c.id === selectedCategory)?.label} ({categoryTotalCount})
              </span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {profiles.map(profile => (
                <CelebrityCard 
                  key={profile.celebrity?.id || profile.id || Math.random()} 
                  profile={profile} 
                  showDetails={false}
                />
              ))}
            </div>
          </div>
        )}

        {/* Birthday Highlights - More Compact */}
        {birthdayCelebrities.length > 0 && (
          <div className="mb-4">
            <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
              🎂 <span className="bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
                Celebrating Today!
              </span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {birthdayCelebrities.map(profile => (
                <CelebrityCard key={profile.celebrity?.id || profile.id || Math.random()} profile={profile} showDetails={true} />
              ))}
            </div>
          </div>
        )}

        {/* Age Extremes - More Compact */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          {/* Oldest Celebrities */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
              👴 Oldest Celebrities
            </h3>
            <div className="space-y-2">
              {oldestCelebrities.map(profile => (
                <div key={profile.celebrity?.id || profile.id || Math.random()} className="bg-white rounded-lg p-2 shadow-md">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {(profile.celebrity?.name || profile.name || '??').split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 text-xs">{profile.celebrity?.name || profile.name || 'Unknown'}</h4>
                      <p className="text-xs text-gray-600">{profile.celebrity?.profession || profile.profession || 'Unknown'}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-blue-600">{profile.age?.years || 0}</div>
                      <div className="text-xs text-gray-500">years</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Youngest Celebrities */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
              👶 Youngest Celebrities
            </h3>
            <div className="space-y-2">
              {youngestCelebrities.map(profile => (
                <div key={profile.celebrity?.id || profile.id || Math.random()} className="bg-white rounded-lg p-2 shadow-md">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {(profile.celebrity?.name || profile.name || '??').split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 text-xs">{profile.celebrity?.name || profile.name || 'Unknown'}</h4>
                      <p className="text-xs text-gray-600">{profile.celebrity?.profession || profile.profession || 'Unknown'}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-600">{profile.age?.years || 0}</div>
                      <div className="text-xs text-gray-500">years</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Upcoming Birthdays - More Compact */}
        {upcomingBirthdays.length > 0 && (
          <div className="mb-4">
            <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
              🎁 <span className="bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">
                Upcoming Birthdays (Next 7 Days)
              </span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {upcomingBirthdays.slice(0, 8).map(profile => (
                <CelebrityCard key={profile.celebrity?.id || profile.id || Math.random()} profile={profile} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

export default CelebritySection;
