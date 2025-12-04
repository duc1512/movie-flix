// src/components/MediaListSection.tsx

import React, { useState, useEffect, useMemo } from 'react';
import { fetchMediaList } from '../api/movieApi';
import { MediaItem, MediaType, FetchParams } from '../types/tmdb';
import MovieCard from './MovieCard';
import LoadingSpinner from './LoadingSpinner';

interface MediaListSectionProps {
  title: string;
  mediaType: MediaType;
  category: 'trending' | 'top_rated';
  timeWindow?: 'day' | 'week';
  onViewDetail: (id: number, mediaType: MediaType) => void;
  onViewAll?: (mediaType: MediaType) => void; 
}

const ITEMS_PER_PAGE = 6;
const ITEM_SHIFT_COUNT = 1;

const MediaListSection: React.FC<MediaListSectionProps> = ({
  title,
  mediaType,
  category,
  timeWindow,
  onViewDetail,
  onViewAll
}) => {
  const [list, setList] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [firstIndex, setFirstIndex] = useState(0);

  useEffect(() => {
    setLoading(true);
    const params: FetchParams = { category, mediaType, timeWindow, page: 1 };

    fetchMediaList(params)
      .then(({ results }) => setList(results.slice(0, 20)))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [category, mediaType, timeWindow]);

  const currentItems = useMemo(() => {
    return list.slice(firstIndex, firstIndex + ITEMS_PER_PAGE);
  }, [list, firstIndex]);

  const maxIndex = Math.max(0, list.length - ITEMS_PER_PAGE);
  const hasNext = firstIndex < maxIndex;
  const hasPrev = firstIndex > 0;

  const handleNext = () => setFirstIndex(prev => Math.min(prev + ITEM_SHIFT_COUNT, maxIndex));
  const handlePrev = () => setFirstIndex(prev => Math.max(prev - ITEM_SHIFT_COUNT, 0));

  return (
    <div className="w-full py-12 bg-gray-900">
      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12">
        {/* Header with Title and View More */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-0">
            {title}
          </h2>
          <button
            onClick={() => onViewAll ? onViewAll(mediaType) : console.log(`Navigating to all ${mediaType}`)}
            className="flex items-center text-xl text-red-400 hover:text-white text-sm font-medium transition-colors"
          >
            See all
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {loading ? (
        <div className="w-full flex justify-center py-12">
          <LoadingSpinner />
        </div>
        ) : (
          <div className="w-full">
            <div className="relative w-full">
              {/* Responsive Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                {currentItems.map(item => {
                  // Loại bỏ item không phải movie/tv để TypeScript không báo lỗi
                  if (item.media_type !== 'movie' && item.media_type !== 'tv') return null;
                  return (
                    <MovieCard
                      key={item.id}
                      item={{ ...item, media_type: item.media_type as MediaType }}
                      onViewDetail={onViewDetail}
                    />
                  );
                })}
              </div>

              {/* Navigation Buttons */}
              <button
                onClick={handlePrev}
                disabled={!hasPrev}
                className={`absolute left-0 top-1/2 -translate-y-1/2 p-2 bg-gray-800/80 hover:bg-gray-700/90 text-white rounded-full z-10 transition-all duration-300
                  ${hasPrev ? 'opacity-100' : 'opacity-0 cursor-not-allowed'}`}
                aria-label="Previous items"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <button
                onClick={handleNext}
                disabled={!hasNext}
                className={`absolute right-0 top-1/2 -translate-y-1/2 p-2 bg-gray-800/80 hover:bg-gray-700/90 text-white rounded-full z-10 transition-all duration-300
                  ${hasNext ? 'opacity-100' : 'opacity-0 cursor-not-allowed'}`}
                aria-label="Next items"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaListSection;
