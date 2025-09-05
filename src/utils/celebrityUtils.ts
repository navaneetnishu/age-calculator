import { calculateAge } from '@/utils/ageCalculator';
import type { Celebrity } from '@/types/celebrity';
import { apiCache } from '@/utils/performanceUtils';

// Cache for storing loaded celebrity data
const celebrityCache = new Map<string, any>();
const cacheExpiry = new Map<string, number>();
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

// Helper function to check if cache is valid
const isCacheValid = (key: string): boolean => {
  const expiry = cacheExpiry.get(key);
  return expiry ? Date.now() < expiry : false;
};

// Helper function to set cache with expiry
const setCache = (key: string, data: any) => {
  celebrityCache.set(key, data);
  cacheExpiry.set(key, Date.now() + CACHE_DURATION);
};

// Load celebrities from JSON file with caching
const loadCelebritiesFromFile = async (category: string): Promise<{celebrities: Celebrity[], total: number}> => {
  const cacheKey = `celebrities_${category}`;
  
  // Check cache first
  if (isCacheValid(cacheKey)) {
    return celebrityCache.get(cacheKey);
  }
  
  try {
    // Load from JSON file with high limit to get all celebrities
    const response = await fetch(`/api/celebrities/${category}?limit=1000`);
    if (!response.ok) {
      throw new Error(`Failed to load ${category} celebrities`);
    }
    
    const data = await response.json();
    const celebrities = data.celebrities || [];
    const total = data.pagination?.total || celebrities.length;
    
    const result = { celebrities, total };
    
    // Cache the result
    setCache(cacheKey, result);
    
    return result;
  } catch (error) {
    console.error(`Error loading ${category} celebrities:`, error);
    return { celebrities: [], total: 0 };
  }
};

// Load all categories metadata
export const loadCategories = async () => {
  const cacheKey = 'categories_metadata';
  
  if (isCacheValid(cacheKey)) {
    return celebrityCache.get(cacheKey);
  }
  
  try {
    const response = await fetch('/api/celebrities');
    if (!response.ok) {
      throw new Error('Failed to load categories');
    }
    
    const data = await response.json();
    setCache(cacheKey, data);
    
    return data;
  } catch (error) {
    console.error('Error loading categories:', error);
    return { categories: [], totalCelebrities: 0 };
  }
};

// Get all celebrities (combines all categories)
export const getAllCelebrities = async (): Promise<Celebrity[]> => {
  try {
    const categories = await loadCategories();
    const allCelebrities: Celebrity[] = [];
    
    // Use a Set to track seen IDs and avoid duplicates
    const seenIds = new Set<string>();
    
    for (const category of categories.categories) {
      try {
        const categoryResult = await loadCelebritiesFromFile(category.id);
        if (categoryResult && categoryResult.celebrities && Array.isArray(categoryResult.celebrities)) {
          // Only add celebrities that haven't been seen before
          for (const celebrity of categoryResult.celebrities) {
            if (!seenIds.has(celebrity.id)) {
              seenIds.add(celebrity.id);
              allCelebrities.push(celebrity);
            }
          }
        }
      } catch (error) {
        console.error(`Error loading category ${category.id}:`, error);
      }
    }
    
    return allCelebrities;
  } catch (error) {
    console.error('Error getting all celebrities:', error);
    return [];
  }
};

// Get celebrities by category
export const getCelebritiesByCategory = async (category: string): Promise<Celebrity[]> => {
  if (category === 'all') {
    return getAllCelebrities();
  }
  
  const result = await loadCelebritiesFromFile(category);
  return result.celebrities;
};

// Get total count for a category
export const getCategoryTotalCount = async (category: string): Promise<number> => {
  if (category === 'all') {
    const allCelebrities = await getAllCelebrities();
    return allCelebrities.length;
  }
  
  const result = await loadCelebritiesFromFile(category);
  return result.total;
};

// Search celebrities across all categories
export const getCelebritiesBySearch = async (query: string): Promise<any[]> => {
  const cacheKey = `search_${query.toLowerCase()}`;
  
  // Check both caches
  const cachedResult = apiCache.get(cacheKey) || (isCacheValid(cacheKey) ? celebrityCache.get(cacheKey) : null);
  if (cachedResult) {
    return cachedResult;
  }
  
  try {
    const allCelebrities = await getAllCelebrities();
    const lowercaseQuery = query.toLowerCase();
    
    // Optimize search with early termination
    const results = allCelebrities.filter(celebrity => {
      const name = celebrity.name.toLowerCase();
      const profession = celebrity.profession.toLowerCase();
      const category = celebrity.category.toLowerCase();
      const nationality = celebrity.nationality.toLowerCase();
      
      return name.includes(lowercaseQuery) ||
             profession.includes(lowercaseQuery) ||
             category.includes(lowercaseQuery) ||
             nationality.includes(lowercaseQuery);
    });
    
    // Convert to CelebrityProfile format with age calculations
    const profilesWithAge = results.map(celebrity => ({
      celebrity,
      age: calculateAge(new Date(celebrity.birthDate)),
      nextBirthday: getNextBirthday(celebrity.birthDate),
      daysUntilBirthday: getDaysUntilBirthday(celebrity.birthDate),
      isBirthdayToday: isBirthdayToday(celebrity.birthDate)
    }));
    
    // Cache in both systems
    setCache(cacheKey, profilesWithAge);
    apiCache.set(cacheKey, profilesWithAge, 300000); // 5 minutes
    
    return profilesWithAge;
  } catch (error) {
    console.error('Error searching celebrities:', error);
    return [];
  }
};

// Get celebrity by ID
export const getCelebrityById = async (id: string): Promise<Celebrity | undefined> => {
  const cacheKey = `celebrity_${id}`;
  
  if (isCacheValid(cacheKey)) {
    return celebrityCache.get(cacheKey);
  }
  
  try {
    const allCelebrities = await getAllCelebrities();
    const celebrity = allCelebrities.find(c => c.id === id);
    
    if (celebrity) {
      setCache(cacheKey, celebrity);
    }
    
    return celebrity;
  } catch (error) {
    console.error('Error finding celebrity by ID:', error);
    return undefined;
  }
};

// Get celebrities by zodiac sign and birth year
export const getCelebritiesByZodiacAndYear = async (zodiacSign: string, birthYear: number): Promise<Celebrity[]> => {
  const cacheKey = `zodiac_${zodiacSign}_${birthYear}`;
  
  if (isCacheValid(cacheKey)) {
    return celebrityCache.get(cacheKey);
  }
  
  try {
    const allCelebrities = await getAllCelebrities();
    
    // Find celebrities with the same zodiac sign
    const zodiacMatches = allCelebrities.filter(celebrity => 
      celebrity.zodiacSign === zodiacSign
    );
    
    // Sort by how close their birth year is to the user's birth year
    const sortedMatches = zodiacMatches.sort((a, b) => {
      const aYear = new Date(a.birthDate).getFullYear();
      const bYear = new Date(b.birthDate).getFullYear();
      
      const aDiff = Math.abs(aYear - birthYear);
      const bDiff = Math.abs(bYear - birthYear);
      
      return aDiff - bDiff;
    });
    
    // Return only the 4 closest matches to prevent cluttering
    const results = sortedMatches.slice(0, 4);
    setCache(cacheKey, results);
    
    return results;
  } catch (error) {
    console.error('Error finding zodiac matches:', error);
    return [];
  }
};

// Get birthday celebrities
export const getBirthdayCelebrities = async (): Promise<any[]> => {
  try {
    const allCelebrities = await getAllCelebrities();
    const today = new Date();
    
    const birthdayCelebrities = allCelebrities.filter(celebrity => {
      const birthDate = new Date(celebrity.birthDate);
      return today.getMonth() === birthDate.getMonth() && today.getDate() === birthDate.getDate();
    });
    
    return birthdayCelebrities.map(celebrity => ({
      celebrity,
      age: calculateAge(new Date(celebrity.birthDate)),
      nextBirthday: getNextBirthday(celebrity.birthDate),
      daysUntilBirthday: getDaysUntilBirthday(celebrity.birthDate),
      isBirthdayToday: true
    }));
  } catch (error) {
    console.error('Error getting birthday celebrities:', error);
    return [];
  }
};

// Get upcoming birthdays
export const getUpcomingBirthdays = async (days: number = 30): Promise<any[]> => {
  try {
    const allCelebrities = await getAllCelebrities();
    const today = new Date();
    const upcoming = new Date(today.getTime() + days * 24 * 60 * 60 * 1000);
    
    const upcomingBirthdays = allCelebrities.filter(celebrity => {
      const birthDate = new Date(celebrity.birthDate);
      const nextBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
      
      if (nextBirthday < today) {
        nextBirthday.setFullYear(today.getFullYear() + 1);
      }
      
      return nextBirthday <= upcoming;
    });
    
    return upcomingBirthdays.map(celebrity => ({
      celebrity,
      age: calculateAge(new Date(celebrity.birthDate)),
      nextBirthday: getNextBirthday(celebrity.birthDate),
      daysUntilBirthday: getDaysUntilBirthday(celebrity.birthDate),
      isBirthdayToday: isBirthdayToday(celebrity.birthDate)
    })).sort((a, b) => a.daysUntilBirthday - b.daysUntilBirthday);
  } catch (error) {
    console.error('Error getting upcoming birthdays:', error);
    return [];
  }
};

// Get random celebrities
export const getRandomCelebrities = async (count: number = 5): Promise<any[]> => {
  try {
    const allCelebrities = await getAllCelebrities();
    const shuffled = [...allCelebrities].sort(() => 0.5 - Math.random());
    
    return shuffled.slice(0, count).map(celebrity => ({
      celebrity,
      age: calculateAge(new Date(celebrity.birthDate)),
      nextBirthday: getNextBirthday(celebrity.birthDate),
      daysUntilBirthday: getDaysUntilBirthday(celebrity.birthDate),
      isBirthdayToday: isBirthdayToday(celebrity.birthDate)
    }));
  } catch (error) {
    console.error('Error getting random celebrities:', error);
    return [];
  }
};

// Get oldest celebrities
export const getOldestCelebrities = async (): Promise<any[]> => {
  try {
    const allCelebrities = await getAllCelebrities();
    
    // Calculate age for each celebrity and sort by age (oldest first)
    const celebritiesWithAge = allCelebrities.map(celebrity => ({
      celebrity,
      age: calculateAge(new Date(celebrity.birthDate)),
      nextBirthday: getNextBirthday(celebrity.birthDate),
      daysUntilBirthday: getDaysUntilBirthday(celebrity.birthDate),
      isBirthdayToday: isBirthdayToday(celebrity.birthDate)
    }));
    
    return celebritiesWithAge
      .sort((a, b) => b.age.years - a.age.years) // Sort by age descending (oldest first)
      .slice(0, 5);
  } catch (error) {
    console.error('Error getting oldest celebrities:', error);
    return [];
  }
};

// Get youngest celebrities
export const getYoungestCelebrities = async (): Promise<any[]> => {
  try {
    const allCelebrities = await getAllCelebrities();
    
    // Calculate age for each celebrity and sort by age (youngest first)
    const celebritiesWithAge = allCelebrities.map(celebrity => ({
      celebrity,
      age: calculateAge(new Date(celebrity.birthDate)),
      nextBirthday: getNextBirthday(celebrity.birthDate),
      daysUntilBirthday: getDaysUntilBirthday(celebrity.birthDate),
      isBirthdayToday: isBirthdayToday(celebrity.birthDate)
    }));
    
    return celebritiesWithAge
      .sort((a, b) => a.age.years - b.age.years) // Sort by age ascending (youngest first)
      .slice(0, 5);
  } catch (error) {
    console.error('Error getting youngest celebrities:', error);
    return [];
  }
};

// Helper functions
function getNextBirthday(dateOfBirth: string): string {
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
}

function getDaysUntilBirthday(dateOfBirth: string): number {
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
}

function isBirthdayToday(dateOfBirth: string): boolean {
  const birthDate = new Date(dateOfBirth);
  
  // Check if the date is valid
  if (isNaN(birthDate.getTime())) {
    console.warn('Invalid birth date for birthday check:', dateOfBirth);
    return false; // Return false as fallback
  }
  
  const today = new Date();
  return today.getMonth() === birthDate.getMonth() && today.getDate() === birthDate.getDate();
}

// Clear cache (useful for development or when data updates)
export const clearCelebrityCache = () => {
  celebrityCache.clear();
  cacheExpiry.clear();
};

// Get cache statistics (useful for debugging)
export const getCacheStats = () => {
  return {
    cacheSize: celebrityCache.size,
    cacheKeys: Array.from(celebrityCache.keys()),
    expiryTimes: Array.from(cacheExpiry.entries()).map(([key, time]) => ({
      key,
      expiresIn: time - Date.now()
    }))
  };
};
