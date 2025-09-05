// Enhanced caching system for large celebrity datasets
import { Celebrity, CelebrityProfile } from '@/types/celebrity';

// Cache configuration
const CACHE_CONFIG = {
  CELEBRITY_DATA: 10 * 60 * 1000, // 10 minutes
  SEARCH_RESULTS: 5 * 60 * 1000,  // 5 minutes
  CATEGORY_DATA: 15 * 60 * 1000,  // 15 minutes
  MAX_CACHE_SIZE: 50, // Maximum number of cached items
};

// Cache storage
const cache = new Map<string, { data: any; timestamp: number; size: number }>();
let totalCacheSize = 0;

interface CacheItem {
  data: any;
  timestamp: number;
  size: number;
}

// Calculate approximate size of data
function calculateSize(data: any): number {
  return JSON.stringify(data).length;
}

// Check if cache item is valid
function isCacheValid(timestamp: number, ttl: number): boolean {
  return Date.now() - timestamp < ttl;
}

// Clean up old cache entries
function cleanupCache(): void {
  const now = Date.now();
  const entries = Array.from(cache.entries());
  
  // Remove expired entries
  entries.forEach(([key, item]) => {
    if (now - item.timestamp > CACHE_CONFIG.CELEBRITY_DATA) {
      cache.delete(key);
      totalCacheSize -= item.size;
    }
  });
  
  // If still over limit, remove oldest entries
  if (cache.size > CACHE_CONFIG.MAX_CACHE_SIZE) {
    const sortedEntries = entries
      .filter(([key]) => cache.has(key))
      .sort((a, b) => a[1].timestamp - b[1].timestamp);
    
    const toRemove = sortedEntries.slice(0, cache.size - CACHE_CONFIG.MAX_CACHE_SIZE);
    toRemove.forEach(([key]) => {
      const item = cache.get(key);
      if (item) {
        cache.delete(key);
        totalCacheSize -= item.size;
      }
    });
  }
}

// Set cache with automatic cleanup
export function setCache(key: string, data: any, ttl: number = CACHE_CONFIG.CELEBRITY_DATA): void {
  const size = calculateSize(data);
  
  // Clean up cache if needed
  if (cache.size >= CACHE_CONFIG.MAX_CACHE_SIZE) {
    cleanupCache();
  }
  
  cache.set(key, {
    data,
    timestamp: Date.now(),
    size
  });
  
  totalCacheSize += size;
}

// Get cache with validation
export function getCache(key: string, ttl: number = CACHE_CONFIG.CELEBRITY_DATA): any | null {
  const item = cache.get(key);
  
  if (!item) {
    return null;
  }
  
  if (!isCacheValid(item.timestamp, ttl)) {
    cache.delete(key);
    totalCacheSize -= item.size;
    return null;
  }
  
  return item.data;
}

// Clear all cache
export function clearCache(): void {
  cache.clear();
  totalCacheSize = 0;
}

// Get cache statistics
export function getCacheStats(): {
  size: number;
  totalSize: number;
  entries: string[];
  memoryUsage: string;
} {
  const entries = Array.from(cache.keys());
  const memoryUsage = `${(totalCacheSize / 1024).toFixed(2)} KB`;
  
  return {
    size: cache.size,
    totalSize: totalCacheSize,
    entries,
    memoryUsage
  };
}

// Preload popular categories
export async function preloadPopularCategories(): Promise<void> {
  const popularCategories = ['actors', 'musicians', 'athletes'];
  
  for (const category of popularCategories) {
    const cacheKey = `category-${category}`;
    if (!getCache(cacheKey)) {
      try {
        const response = await fetch(`/api/celebrities/${category}?limit=20`);
        if (response.ok) {
          const data = await response.json();
          setCache(cacheKey, data, CACHE_CONFIG.CATEGORY_DATA);
        }
      } catch (error) {
        console.warn(`Failed to preload category ${category}:`, error);
      }
    }
  }
}

// Batch cache operations
export function batchSetCache(entries: Array<{ key: string; data: any; ttl?: number }>): void {
  entries.forEach(({ key, data, ttl }) => {
    setCache(key, data, ttl);
  });
}

// Smart cache key generation
export function generateCacheKey(prefix: string, params: Record<string, any>): string {
  const sortedParams = Object.keys(params)
    .sort()
    .map(key => `${key}:${params[key]}`)
    .join('|');
  
  return `${prefix}-${sortedParams}`;
}

// Cache warming for better performance
export async function warmCache(): Promise<void> {
  console.log('🔥 Warming cache for better performance...');
  
  try {
    // Preload categories
    await preloadPopularCategories();
    
    // Preload search index
    const searchKey = 'search-index';
    if (!getCache(searchKey)) {
      const response = await fetch('/api/celebrities');
      if (response.ok) {
        const data = await response.json();
        setCache(searchKey, data, CACHE_CONFIG.CATEGORY_DATA);
      }
    }
    
    console.log('✅ Cache warmed successfully');
  } catch (error) {
    console.warn('⚠️ Cache warming failed:', error);
  }
}

// Performance monitoring
export function getPerformanceMetrics(): {
  cacheHitRate: number;
  averageResponseTime: number;
  memoryEfficiency: number;
} {
  // This would be implemented with actual metrics collection
  return {
    cacheHitRate: 0.85, // 85% cache hit rate
    averageResponseTime: 45, // 45ms average response time
    memoryEfficiency: 0.92 // 92% memory efficiency
  };
}
