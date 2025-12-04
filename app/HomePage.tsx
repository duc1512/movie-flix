// src/pages/HomePage.tsx
'use client'
import React, { useState, useEffect } from 'react';
import { fetchMediaList } from '../src/api/movieApi';
import { MediaItem, MediaType, View } from '../src/types/tmdb'; // Import View
import LoadingSpinner from '../src/components/LoadingSpinner';
import MediaListSection from '../src/components/MediaListSection';
import { IMAGE_BASE_URL } from '../src/api/movieApi';
import { motion, AnimatePresence } from 'framer-motion';
import MovieCard from '../src/components/MovieCard';

interface HeroBannerProps {
  onViewDetail: (id: number, mediaType: MediaType) => void;
}

const HeroBanner: React.FC<HeroBannerProps> = ({ onViewDetail }) => {
  const [banners, setBanners] = useState<MediaItem[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [direction, setDirection] = useState(1); // 1 for next, -1 for previous

  useEffect(() => {
    setLoading(true);
    fetchMediaList({ category: 'trending', mediaType: 'movie', timeWindow: 'day' })
      .then(({ results }) => {
        setBanners(results.slice(0, 5));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Auto-slide effect
  useEffect(() => {
    if (banners.length === 0) return;
    const interval = setInterval(() => {
      setDirection(1);
      setActiveIndex(prev => (prev + 1) % banners.length);
    }, 8000); 
    return () => clearInterval(interval);
  }, [banners.length]);

  // Handle manual navigation
  const goToSlide = (newIndex: number) => {
    setDirection(newIndex > activeIndex ? 1 : -1);
    setActiveIndex(newIndex);
  };

  if (loading) {
    return <div className="h-[70vh] sm:h-[80vh] w-full bg-gray-900 flex items-center justify-center"><LoadingSpinner /></div>;
  }
  if (banners.length === 0) {
    return null; 
  }

  const currentItem = banners[activeIndex];
  const backdropUrl = currentItem?.backdrop_path
    ? `${IMAGE_BASE_URL}original${currentItem.backdrop_path}`
    : 'none'; 
  const title = currentItem?.title || currentItem?.name || 'Untitled';
  const mediaType: MediaType = (currentItem?.media_type as MediaType) || 'movie';

  const posterUrl = currentItem?.poster_path
    ? `${IMAGE_BASE_URL}w500${currentItem.poster_path}` 
    : 'https://via.placeholder.com/500x750?text=No+Poster';

  return (
    <div className="relative h-[50vh] sm:h-[95vh] overflow-hidden">
      {/* Background Image with Animation */}
      <AnimatePresence mode="wait" initial={false} custom={direction}>
        <motion.div
          key={activeIndex}
          className="absolute inset-0"
          custom={direction}
          initial={{ opacity: 0, x: direction > 0 ? 50 : -50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: direction > 0 ? -50 : 50 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${backdropUrl})` }}
          >
            {/* Gradient Overlay for Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent"></div>
          </div>
          
          {/* Content */}
          <div 
            className="relative z-10 h-full flex flex-row-reverse items-end p-6 pt-24 md:p-12 lg:p-20"
          >
            {/* POSTER (GIỜ Ở BÊN PHẢI) */}
            <div className="relative hidden md:block w-72 h-100 lg:w-125 lg:h-[750px] mb-50 mr-85 group">
              <img
                src={posterUrl}
                alt={title}
                className="
                  w-full h-full
                  object-cover rounded-xl 
                  shadow-[0_20px_40px_rgba(0,0,0,0.9)] 
                  flex-shrink-0 
                  transform 
                  transition-all duration-300 ease-out 
                  group-hover:scale-[1.05] 
                  group-hover:-translate-y-2 
                  group-hover:shadow-2xl
                "
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://via.placeholder.com/500x750?text=No+Poster';
                }}
              />
            </div>
            {/* KHỐI NỘI DUNG (GIỜ Ở BÊN TRÁI) */}
            <motion.div 
              key={`content-${activeIndex}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="relative z-10 h-full flex flex-col justify-end p-4 pb-90 mr-35 max-w-6xl"
            > 
              <motion.h1 
                className="text-5xl md:text-9xl mb-15 italic font-extrabold text-white mb-4 text-shadow"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                {title}
              </motion.h1>
              <motion.p 
                className="text-3xl text-gray-200 max-w-6xl mb-8 line-clamp-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                {currentItem?.overview}
              </motion.p>
              <div className="flex space-x-4 text-3xl">
                <motion.button
                  onClick={() => onViewDetail(currentItem.id, mediaType)}
                  className="group relative flex items-center justify-center h-19 px-37 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-full shadow-lg transition-all overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {/* Text - Hiển thị ban đầu */}
                  <span className="absolute flex items-center transition-all duration-300 group-hover:opacity-0 group-hover:-translate-y-4">
                    View Details
                  </span>
                  
                  {/* Icon - Ẩn ban đầu, hiện khi hover */}
                  <span className="absolute flex items-center justify-center w-full h-full transition-all duration-300 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 translate-y-4">
                    <svg 
                      className="w-8 h-8"
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path d="M6.3 2.841A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                    </svg>
                  </span>
                </motion.button>
              </div>
            </motion.div> 
          </div>
        </motion.div>
      </AnimatePresence>
      
      {/* Pagination Dots */}
      <div className="absolute bottom-4 right-10 z-20 flex space-x-2">
        {banners.map((_, index) => (
          <button
            key={`dot-${index}`}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === activeIndex ? 'bg-red-600 w-8' : 'bg-gray-400 opacity-50 hover:bg-gray-300'
            }`}
            aria-label={`Chuyển tới banner ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

// 8b. HomePage Component
interface HomePageProps {
  onViewDetail: (id: number, mediaType: MediaType) => void;
  onNavigate: (view: View, type: MediaType) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onViewDetail, onNavigate }) => {
return (
<>
{/* ĐẨY BANNER LÊN TRÊN */}
<div className="mt-[-28] md:mt-[-107]"> 
 <HeroBanner onViewDetail={onViewDetail} />
</div>

{/* Main content area with full width */}
<div className="w-full pt-8">
  {/* Media sections with full width */}
  <MediaListSection
    title="Trending Movies" // Đã đổi tiêu đề để khớp với ảnh
    mediaType="movie"
    category="trending"
    timeWindow="week"
    onViewDetail={onViewDetail}
    onViewAll={(type: MediaType) => onNavigate('list', type)} // Dẫn đến ListPage
  />
 
  <MediaListSection
    title="Top Rated TV Series"
    mediaType="tv"
    category="top_rated"
    onViewDetail={onViewDetail}
    onViewAll={(type: MediaType) => onNavigate('list', type)} // Dẫn đến ListPage
  />
  <MediaListSection
    title="Trending TV Series Today"
    mediaType="tv"
    category="trending"
    timeWindow="day"
    onViewDetail={onViewDetail}
    onViewAll={(type: MediaType) => onNavigate('list', type)} // Dẫn đến ListPage
  />
  <MediaListSection
    title="Top Rated Movies"
    mediaType="movie"
    category="top_rated"
    onViewDetail={onViewDetail}
    onViewAll={(type: MediaType) => onNavigate('list', type)} // Dẫn đến ListPage
  />
</div>
</>
);
};

export default HomePage;