import { Celebrity, CelebrityProfile } from '@/types/celebrity';
import { calculateAge } from './ageCalculator';

// Client-side cache for paginated data
const paginationCache = new Map<string, any>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

interface PaginatedResponse {
  celebrities: Celebrity[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface PaginationOptions {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Helper function to check if cache is valid
function isCacheValid(timestamp: number): boolean {
  return Date.now() - timestamp < CACHE_DURATION;
}

// Helper function to set cache
function setCache(key: string, data: any): void {
  paginationCache.set(key, {
    data,
    timestamp: Date.now()
  });
}

// Helper function to get cache
function getCache(key: string): any | null {
  const cached = paginationCache.get(key);
  if (cached && isCacheValid(cached.timestamp)) {
    return cached.data;
  }
  paginationCache.delete(key);
  return null;
}

// Convert Celebrity to CelebrityProfile
function convertToProfile(celebrity: Celebrity): CelebrityProfile {
  const age = calculateAge(new Date(celebrity.birthDate));
  const nextBirthday = getNextBirthday(celebrity.birthDate).toISOString().split('T')[0];
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

// Helper functions for birthday calculations
function getNextBirthday(birthDate: string): Date {
  const today = new Date();
  const birth = new Date(birthDate);
  const currentYear = today.getFullYear();
  
  let nextBirthday = new Date(currentYear, birth.getMonth(), birth.getDate());
  
  if (nextBirthday < today) {
    nextBirthday = new Date(currentYear + 1, birth.getMonth(), birth.getDate());
  }
  
  return nextBirthday;
}

function getDaysUntilBirthday(birthDate: string): number {
  const today = new Date();
  const nextBirthday = getNextBirthday(birthDate);
  const diffTime = nextBirthday.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

function isBirthdayToday(birthDate: string): boolean {
  const today = new Date();
  const birth = new Date(birthDate);
  return today.getMonth() === birth.getMonth() && today.getDate() === birth.getDate();
}

// Fetch paginated celebrities from API
export async function fetchPaginatedCelebrities(
  category: string,
  options: PaginationOptions = {}
): Promise<PaginatedResponse> {
  const {
    page = 1,
    limit = 20,
    search = '',
    sortBy = 'name',
    sortOrder = 'asc'
  } = options;

  const cacheKey = `${category}-${page}-${limit}-${search}-${sortBy}-${sortOrder}`;
  const cached = getCache(cacheKey);
  
  if (cached) {
    return cached;
  }

  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      search,
      sortBy,
      sortOrder
    });

    const response = await fetch(`/api/celebrities/${category}?${params}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch celebrities: ${response.statusText}`);
    }

    const data = await response.json();
    setCache(cacheKey, data);
    
    return data;
  } catch (error) {
    console.error('Error fetching paginated celebrities:', error);
    throw error;
  }
}

// Fetch paginated celebrity profiles (with age calculations)
export async function fetchPaginatedCelebrityProfiles(
  category: string,
  options: PaginationOptions = {}
): Promise<{ profiles: CelebrityProfile[]; pagination: PaginatedResponse['pagination'] }> {
  const data = await fetchPaginatedCelebrities(category, options);
  
  const profiles = data.celebrities.map(convertToProfile);
  
  return {
    profiles,
    pagination: data.pagination
  };
}

// Search across all categories
export async function searchAllCelebrities(
  searchTerm: string,
  options: PaginationOptions = {}
): Promise<{ profiles: CelebrityProfile[]; pagination: PaginatedResponse['pagination'] }> {
  const cacheKey = `search-${searchTerm}-${JSON.stringify(options)}`;
  const cached = getCache(cacheKey);
  
  if (cached) {
    return cached;
  }

  try {
    // Get all categories first
    const categoriesResponse = await fetch('/api/celebrities');
    const categoriesData = await categoriesResponse.json();
    
    // Search in each category
    const searchPromises = categoriesData.categories.map((category: any) =>
      fetchPaginatedCelebrities(category.id, {
        ...options,
        search: searchTerm,
        limit: 100 // Get more results for search
      })
    );

    const results = await Promise.all(searchPromises);
    
    // Combine and sort results
    let allCelebrities: Celebrity[] = [];
    results.forEach(result => {
      allCelebrities = allCelebrities.concat(result.celebrities);
    });

    // Apply pagination to combined results
    const { page = 1, limit = 20 } = options;
    const total = allCelebrities.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedCelebrities = allCelebrities.slice(startIndex, endIndex);

    const profiles = paginatedCelebrities.map(convertToProfile);
    
    const result = {
      profiles,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    };

    setCache(cacheKey, result);
    return result;
  } catch (error) {
    console.error('Error searching celebrities:', error);
    throw error;
  }
}

// Get featured celebrities (random selection)
export async function getFeaturedCelebrities(limit: number = 6): Promise<CelebrityProfile[]> {
  const cacheKey = `featured-${limit}`;
  const cached = getCache(cacheKey);
  
  if (cached) {
    return cached;
  }

  try {
    // Get a random category
    const categoriesResponse = await fetch('/api/celebrities');
    const categoriesData = await categoriesResponse.json();
    
    const randomCategory = categoriesData.categories[
      Math.floor(Math.random() * categoriesData.categories.length)
    ];

    // Get random celebrities from that category
    const data = await fetchPaginatedCelebrities(randomCategory.id, {
      limit: limit * 2 // Get more to randomize from
    });

    // Shuffle and take the requested amount
    const shuffled = data.celebrities.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, limit);
    
    const profiles = selected.map(convertToProfile);
    setCache(cacheKey, profiles);
    
    return profiles;
  } catch (error) {
    console.error('Error fetching featured celebrities:', error);
    return [];
  }
}

// Get birthday celebrities
export async function getBirthdayCelebrities(): Promise<CelebrityProfile[]> {
  const cacheKey = 'birthday-celebrities';
  const cached = getCache(cacheKey);
  
  if (cached) {
    return cached;
  }

  try {
    const today = new Date();
    const todayStr = `${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;
    
    // Search for celebrities with today's birthday
    const result = await searchAllCelebrities('', { limit: 100 });
    
    const birthdayCelebrities = result.profiles.filter(profile => {
      const birthDate = new Date(profile.celebrity.birthDate);
      const birthStr = `${(birthDate.getMonth() + 1).toString().padStart(2, '0')}-${birthDate.getDate().toString().padStart(2, '0')}`;
      return birthStr === todayStr;
    });

    setCache(cacheKey, birthdayCelebrities);
    return birthdayCelebrities;
  } catch (error) {
    console.error('Error fetching birthday celebrities:', error);
    return [];
  }
}

// Clear cache (useful for development)
export function clearPaginationCache(): void {
  paginationCache.clear();
}

// Get cache stats (useful for debugging)
export function getCacheStats(): { size: number; keys: string[] } {
  return {
    size: paginationCache.size,
    keys: Array.from(paginationCache.keys())
  };
}
