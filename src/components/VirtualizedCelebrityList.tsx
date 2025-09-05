'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { CelebrityProfile } from '@/types/celebrity';
import { fetchPaginatedCelebrityProfiles, PaginationOptions } from '@/utils/paginatedCelebrityUtils';
import CelebrityCard from './CelebrityCard';

interface VirtualizedCelebrityListProps {
  category: string;
  searchTerm?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  itemsPerPage?: number;
  height?: number;
  onCelebrityClick?: (celebrity: CelebrityProfile) => void;
}

const ITEM_HEIGHT = 120; // Height of each celebrity card
const BUFFER_SIZE = 5; // Extra items to render outside viewport

export default function VirtualizedCelebrityList({
  category,
  searchTerm = '',
  sortBy = 'name',
  sortOrder = 'asc',
  itemsPerPage = 20,
  height = 600,
  onCelebrityClick
}: VirtualizedCelebrityListProps) {
  const [profiles, setProfiles] = useState<CelebrityProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: itemsPerPage,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false
  });
  
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef(false);

  // Load celebrities
  const loadCelebrities = useCallback(async (page: number, append: boolean = false) => {
    if (loadingRef.current) return;
    
    loadingRef.current = true;
    setLoading(true);
    setError(null);

    try {
      const options: PaginationOptions = {
        page,
        limit: itemsPerPage,
        search: searchTerm,
        sortBy,
        sortOrder
      };

      const result = await fetchPaginatedCelebrityProfiles(category, options);
      
      if (append) {
        setProfiles(prev => [...prev, ...result.profiles]);
      } else {
        setProfiles(result.profiles);
      }
      
      setPagination(result.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load celebrities');
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  }, [category, searchTerm, sortBy, sortOrder, itemsPerPage]);

  // Load more celebrities when scrolling near bottom
  const loadMore = useCallback(() => {
    if (pagination.hasNext && !loading) {
      loadCelebrities(pagination.page + 1, true);
    }
  }, [pagination.hasNext, pagination.page, loading, loadCelebrities]);

  // Handle scroll
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    const newScrollTop = target.scrollTop;
    setScrollTop(newScrollTop);

    // Load more when near bottom
    const scrollHeight = target.scrollHeight;
    const clientHeight = target.clientHeight;
    const scrollPercentage = (newScrollTop + clientHeight) / scrollHeight;

    if (scrollPercentage > 0.8) {
      loadMore();
    }
  }, [loadMore]);

  // Load initial data
  useEffect(() => {
    loadCelebrities(1, false);
  }, [loadCelebrities]);

  // Calculate visible range
  const visibleStart = Math.max(0, Math.floor(scrollTop / ITEM_HEIGHT) - BUFFER_SIZE);
  const visibleEnd = Math.min(
    profiles.length,
    Math.ceil((scrollTop + height) / ITEM_HEIGHT) + BUFFER_SIZE
  );

  const visibleProfiles = profiles.slice(visibleStart, visibleEnd);
  const totalHeight = profiles.length * ITEM_HEIGHT;
  const offsetY = visibleStart * ITEM_HEIGHT;

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-red-500 text-lg font-semibold mb-2">Error Loading Celebrities</div>
          <div className="text-gray-600 mb-4">{error}</div>
          <button
            onClick={() => loadCelebrities(1, false)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header with stats */}
      <div className="mb-4 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing {profiles.length} of {pagination.total} celebrities
          </div>
          <div className="text-sm text-gray-500">
            Page {pagination.page} of {pagination.totalPages}
          </div>
        </div>
      </div>

      {/* Virtual scrolling container */}
      <div
        ref={containerRef}
        className="overflow-auto border border-gray-200 rounded-lg"
        style={{ height }}
        onScroll={handleScroll}
      >
        <div style={{ height: totalHeight, position: 'relative' }}>
          <div
            style={{
              transform: `translateY(${offsetY}px)`,
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0
            }}
          >
            {visibleProfiles.map((profile, index) => (
              <div
                key={profile.celebrity.id}
                style={{ height: ITEM_HEIGHT }}
                className="border-b border-gray-100 last:border-b-0"
              >
                <div className="p-3">
                  <CelebrityCard
                    profile={profile}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Loading indicator */}
        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
              <span className="text-gray-600">Loading more celebrities...</span>
            </div>
          </div>
        )}

        {/* End of list indicator */}
        {!pagination.hasNext && profiles.length > 0 && (
          <div className="flex items-center justify-center py-8">
            <div className="text-gray-500 text-sm">
              You&apos;ve reached the end of the list
            </div>
          </div>
        )}
      </div>

      {/* Load more button (fallback) */}
      {pagination.hasNext && !loading && (
        <div className="mt-4 text-center">
          <button
            onClick={loadMore}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Load More Celebrities
          </button>
        </div>
      )}
    </div>
  );
}
