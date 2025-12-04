// src/components/MovieCard.tsx

import React from 'react';
import { MediaItem, MediaType } from '../types/tmdb';
import { IMAGE_BASE_URL, DEFAULT_PLACEHOLDER } from '../api/movieApi';

interface MovieCardProps {
  item: MediaItem & { genre_ids?: number[] }; // Add genre_ids to the type
  onViewDetail: (id: number, mediaType: MediaType) => void;
}

const MovieCard: React.FC<MovieCardProps> = React.memo(({ item, onViewDetail }) => {
  // Ensure mediaType is valid
  const rawMediaType = item.media_type;
  if (rawMediaType !== 'movie' && rawMediaType !== 'tv') {
    return null;
  }
  const mediaType: MediaType = rawMediaType;

  const posterUrl = item.poster_path
    ? `${IMAGE_BASE_URL}w500${item.poster_path}` // Increased image quality
    : DEFAULT_PLACEHOLDER;

  const title = item.title || item.name || 'Untitled';
  const rating = item.vote_average ? item.vote_average.toFixed(1) : 'N/A';
  const releaseYear = item.release_date?.split('-')[0] || item.first_air_date?.split('-')[0] || 'N/A';

  return (
    <div 
      className="group relative cursor-pointer rounded-lg overflow-hidden bg-gray-800 w-full h-full flex flex-col hover:opacity-90 transition-all duration-300"
      onClick={() => onViewDetail(item.id, mediaType)}
    >
      {/* Image Container */}
      <div className="relative pt-[150%] overflow-hidden">
        {/* Poster Image */}
        <img 
          src={posterUrl} 
          alt={title} 
          className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
          loading="lazy"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = DEFAULT_PLACEHOLDER;
          }}
        />

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center space-y-4">
          {/* Play Button */}
          <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            <div className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-500 transition-colors">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6.3 2.841A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
              </svg>
            </div>
          </div>
          
          {/* Star Rating */}
          <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-100">
            <div className="flex items-center bg-black/80 px-3 py-1.5 rounded-full">
              <svg className="w-5 h-5 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-white font-semibold text-sm">{rating}</span>
              <span className="text-gray-300 text-xs ml-1">/10</span>
            </div>
          </div>
        </div>

        {/* Rating Badge - Only visible when not hovering */}
        <div className="absolute top-2 right-2 bg-black/70 text-white text-xs font-medium px-2 py-1 rounded-full flex items-center group-hover:opacity-0 transition-opacity duration-300">
          ⭐ {rating}
        </div>
      </div>

      {/* Content */}
      <div className="p-3">
        <h3 className="text-white font-medium text-sm mb-1 line-clamp-2">{title}</h3>
        <div className="flex items-center text-gray-400 text-xs">
          <span>{releaseYear}</span>
          <span className="mx-1">•</span>
          <span className="capitalize">{mediaType}</span>
        </div>
      </div>
    </div>
  );
});

export default MovieCard;