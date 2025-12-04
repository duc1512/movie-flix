// src/pages/ListPage.tsx
"use client "
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchMediaList } from '../src/api/movieApi';
import { MediaItem, MediaType, FetchParams } from '../src/types/tmdb';
import MovieCard from '../src/components/MovieCard';
import LoadingSpinner from '../src/components/LoadingSpinner';

interface ListPageProps {
 initialMediaType: MediaType;
 onViewDetail: (id: number, mediaType: MediaType) => void;
}

const ListPage: React.FC<ListPageProps> = ({ initialMediaType, onViewDetail }) => {
 // ⭐ CẬP NHẬT: Đảm bảo mediaType khởi tạo đúng
 const [mediaType, setMediaType] = useState<MediaType>(initialMediaType);
 const [query, setQuery] = useState('');
 const [searchTerm, setSearchTerm] = useState('');
 const [list, setList] = useState<MediaItem[]>([]);
 const [page, setPage] = useState(1);
 const [totalPages, setTotalPages] = useState(1);
 const [loading, setLoading] = useState(false);
 const hasMore = page < totalPages;
 const isSearching = searchTerm.length > 0;

 // ⭐ EFFECT ĐỂ CẬP NHẬT mediaType KHI initialMediaType THAY ĐỔI TỪ COMPONENT CHA
    // (Quan trọng để animation chuyển đổi giữa Movies/TV trong App.tsx hoạt động)
    useEffect(() => {
        setMediaType(initialMediaType);
    }, [initialMediaType]);

 const fetchMedia = useCallback(async (newPage: number, append: boolean = false) => {
  setLoading(true);
  try {
   const params: FetchParams = {
    // Use 'top_rated' for general list browsing, 'search' when there's a term
    category: isSearching ? 'search' : 'top_rated', 
    mediaType,
    query: searchTerm,
    page: newPage
   };

   const { results, total_pages } = await fetchMediaList(params);
   
   setList(prev => append ? [...prev, ...results] : results);
   setTotalPages(total_pages);
   setPage(newPage);
  } catch (e) {
   console.error(e);
  } finally {
   setLoading(false);
  }
 }, [mediaType, searchTerm, isSearching]); // mediaType là dependency quan trọng

 // Effect for initial load or when mediaType/searchTerm changes
 useEffect(() => {
  setPage(1); // Reset page number
  setList([]); // Clear list
  // Fetch media với các giá trị state hiện tại
  fetchMedia(1, false);
 }, [mediaType, searchTerm]); 
    // fetchMedia được loại bỏ khỏi dependency vì đã được khai báo với useCallback

 const handleSearchSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  setSearchTerm(query);
 };

 const handleLoadMore = () => {
  if (hasMore && !loading) {
   fetchMedia(page + 1, true);
  }
 };

    // ⭐ HÀM CHUYỂN ĐỔI MEDIA TYPE VÀ RESET SEARCH
    const handleMediaTypeChange = (newType: MediaType) => {
        setMediaType(newType);
        // Reset tìm kiếm khi chuyển loại nội dung
        setQuery('');
        setSearchTerm('');
    };

 return (
  <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-8">
   <h1 className="text-4xl font-bold mb-6 border-l-4 border-red-500 pl-3">
    {isSearching ? 'Search Results' : (mediaType === 'movie' ? 'All Movies' : 'All TV Series')}
   </h1>

   {/* Controls: Type Switch and Search */}
   <div className="flex flex-col md:flex-row justify-between items-center mb-8 space-y-4 md:space-y-0">
    <div className="flex space-x-4 relative">
     <div className="relative">
      <button
       onClick={() => handleMediaTypeChange('movie')}
       className={`relative z-10 text-xl px-4 py-2 rounded-full font-semibold transition-colors ${
        mediaType === 'movie' ? 'text-white' : 'text-gray-300 hover:text-white'
       }`}
      >
       Movies
      </button>
      {mediaType === 'movie' && (
       <motion.div 
        className="absolute bottom-0  left-0 w-full h-full bg-red-600 rounded-full z-0"
        layoutId="activeTab"
        transition={{
         type: 'spring',
         stiffness: 400,
         damping: 30,
         duration: 0.3
        }}
       />
      )}
     </div>
     <div className="relative">
      <button
       onClick={() => handleMediaTypeChange('tv')}
       className={`relative z-10 px-4 text-xl py-2 rounded-full font-semibold transition-colors ${
        mediaType === 'tv' ? 'text-white' : 'text-gray-300 hover:text-white'
       }`}
      >
       TV Series
      </button>
      {mediaType === 'tv' && (
       <motion.div 
        className="absolute bottom-0 left-0 w-full h-full bg-red-600 rounded-full z-0"
        layoutId="activeTab"
        transition={{
         type: 'spring',
         stiffness: 400,
         damping: 30,
         duration: 0.3
        }}
       />
      )}
     </div>
     <div className="absolute bottom-0 left-0 w-full h-px bg-gray-700 -z-10" />
    </div>
    
    <form onSubmit={handleSearchSubmit} className="w-full md:w-auto">
     <div className="relative">
      <input
       type="text"
       placeholder={`Search ${mediaType === 'movie' ? 'Movies' : 'TV Series'}...`}
       value={query}
       onChange={(e) => setQuery(e.target.value)}
       className="w-full md:w-80 p-3 pl-10 rounded-full bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 transition"
      />
      <button type="submit" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white" aria-label="Search">
       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
      </button>
     </div>
    </form>
   </div>

   {isSearching && (
    <p className="text-lg mb-6 text-gray-300">
     Results for: <span className="font-bold text-red-400">"{searchTerm}"</span>
    </p>
   )}

   {/* Movie Grid */}
   <AnimatePresence mode="wait">
    <motion.div 
     key={mediaType}
     initial={{ opacity: 0, y: 20 }}
     animate={{ opacity: 1, y: 0 }}
     exit={{ opacity: 0, y: -20 }}
     transition={{ duration: 0.3 }}
     className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mt-8"
    >
     {list.map((item) => (
      <motion.div
       key={`${item.id}-${mediaType}`}
       initial={{ opacity: 0, scale: 0.9 }}
       animate={{ opacity: 1, scale: 1 }}
       transition={{ duration: 0.3 }}
      >
       <MovieCard
        item={{ ...item, media_type: mediaType }}
        onViewDetail={onViewDetail}
       />
      </motion.div>
     ))}
    </motion.div>
   </AnimatePresence>

   {/* Loading / No Results */}
   {loading && list.length === 0 && <LoadingSpinner />}
   {!loading && list.length === 0 && (
    <div className="text-center py-12 text-gray-400">
     <p className="text-xl">Không tìm thấy kết quả nào.</p>
    </div>
   )}

   {/* Infinity Loading (Load More Button) */}
   <div className="flex justify-center mt-10">
    {hasMore && (
     <button
      onClick={handleLoadMore}
      disabled={loading}
      className={`px-8 py-3 rounded-full font-semibold transition-colors shadow-lg ${
       loading ? 'bg-gray-600 text-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700 text-white transform hover:scale-105'
      }`}
     >
      {loading ? 'Đang tải...' : `Tải thêm (Trang ${page} / ${totalPages})`}
     </button>
    )}
    {!hasMore && list.length > 0 && (
     <p className="text-gray-400">Bạn đã xem hết tất cả kết quả.</p>
    )}
   </div>
  </div>
 );
};

export default ListPage;