    // src/pages/DetailPage.tsx
    "use client"

    import React, { useState, useEffect, useMemo } from 'react';
    import { fetchMediaDetails } from '../src/api/movieApi';
    import { MediaDetail, MediaType, Video, MediaItem, View } from '../src/types/tmdb';
    import LoadingSpinner from '../src/components/LoadingSpinner';
    import TrailerModal from '../src/components/TrailerModal';
    import MovieCard from '../src/components/MovieCard';
    import CastList from '../src/components/CastList';
    import { IMAGE_BASE_URL, DEFAULT_PLACEHOLDER } from '../src/api/movieApi';

    interface DetailPageProps {
        id: number;
        mediaType: MediaType;
        onViewDetail: (id: number, mediaType: MediaType) => void;
        // Thêm prop onBack để quay lại trang trước
        onBack: (view: View, type: MediaType) => void; 
        // Thêm prop to check current view for navigation logic
        currentViewType: 'list' | 'home'; 
    }

    // Cập nhật component để nhận prop onBack và currentViewType
    const DetailPage: React.FC<DetailPageProps> = ({ id, mediaType, onViewDetail, onBack, currentViewType }) => {
        const [detail, setDetail] = useState<MediaDetail | null>(null);
        const [loading, setLoading] = useState(true);
        const [trailerKey, setTrailerKey] = useState<string | null>(null);

        // Fetch details whenever ID or Type changes
        useEffect(() => {
            setLoading(true);
            setDetail(null); 
            fetchMediaDetails(id, mediaType)
                .then(data => {
                    setDetail(data);
                    setLoading(false);
                })
                .catch(e => {
                    console.error(e);
                    setLoading(false);
                });
        }, [id, mediaType]);

        // Derived Data
        const backdropUrl = detail?.backdrop_path
            ? `${IMAGE_BASE_URL}original${detail.backdrop_path}`
            : 'none';
        const posterUrl = detail?.poster_path
            ? `${IMAGE_BASE_URL}w500${detail.poster_path}`
            : DEFAULT_PLACEHOLDER;
        const title = detail?.title || detail?.name || 'Loading...';

        const trailerVideo = useMemo<Video | null>(() => {
            if (!detail?.videos?.results) return null;
            const videos = detail.videos.results.filter(v => v.site === 'YouTube');
            return videos.find(v => v.type === 'Trailer') || videos.find(v => v.type === 'Teaser') || videos[0] || null;
        }, [detail]);

        const runtime = useMemo(() => {
            if (mediaType === 'movie' && detail?.runtime) return `${detail.runtime} minutes`;
            if (mediaType === 'tv' && detail?.episode_run_time?.[0]) return `${detail.episode_run_time[0]} mins/ep`;
            return 'N/A';
        }, [detail, mediaType]);

        const releaseDate = useMemo(() => {
            return detail?.release_date || detail?.first_air_date;
        }, [detail]);

        if (loading) return <LoadingSpinner />;
        if (!detail) return <div className="text-white p-8 text-center">Không tìm thấy thông tin.</div>;

        // Use a temporary normalized list for recommendations in the component
        const normalizedRecommendations = detail.recommendations.results.map(item => ({
            ...item, 
            media_type: item.media_type === 'movie' || item.media_type === 'tv' ? item.media_type : mediaType
        } as MediaItem));

        // Logic để xác định trang trở về
        const backToView: View = currentViewType === 'list' ? 'list' : 'home';

        return (
            <>
                <div className="relative min-h-screen">
                    {/* Header/Banner Section */}
                    {backdropUrl !== 'none' && (
                        <div
className="relative h-[75vh] md:h-[90vh] bg-cover bg-center" 
style={{ backgroundImage: `url(${backdropUrl})` }}
                        >
{/* Dark Overlay và Gradient Sâu */}
<div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
<div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-black/30"></div>

{/* NÚT TRỞ VỀ */}
<button
    onClick={() => onBack(backToView, mediaType)}
    className="absolute top-6 left-6 z-30 flex items-center px-4 py-2 bg-black/50 hover:bg-black/80 text-white rounded-full transition-colors font-semibold"
>
    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
    Back
</button>


{/* DETAIL CONTENT SIDE-BY-SIDE TRÊN BANNER */}
<div className="absolute inset-0 flex items-center p-18 md:p-38 text-white">
    
    {/* POSTER LỚN (LEFT) */}
    <img
        src={posterUrl}
        alt={title}
        className="w-48 h-72 md:w-135 md:h-[750px] object-cover rounded-xl shadow-[0_20px_40px_rgba(0,0,0,0.9)] transition-transform duration-500 hover:scale-[1.02] flex-shrink-0"
        onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = DEFAULT_PLACEHOLDER;
        }}
    />
    
    {/* THÔNG TIN CHÍNH (RIGHT) */}
    <div className="mt-6 md:mt-0 md:ml-35 max-w-2xl">
        {/* TIÊU ĐỀ RẤT LỚN VÀ NỔI BẬT */}
        <h1 className="text-6xl md:text-8xl font-extrabold mb-4 text-shadow-lg leading-tight">{title}</h1>
        
        <p className="italic text-3xl text-gray-200 mb-6">{detail.tagline}</p>

        {/* METADATA (Rating, Runtime, Date) */}
        <div className="flex items-center space-x-6 text-2xl mb-8">
            <span className="flex items-center text-yellow-400 font-extrabold text-3xl">
                <svg className="w-8 h-8 mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.381-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                {detail.vote_average.toFixed(1)}
            </span>
            <span className="bg-gray-700 px-4 py-1 rounded-full text-base font-medium">
                {runtime}
            </span>
            <span className="text-lg font-medium text-gray-300">
                {releaseDate?.substring(0, 4)}
            </span>
        </div>

        {/* GENRES */}
        <div className="flex flex-wrap gap-3 mb-8">
            {detail.genres.map(genre => (
                <span key={genre.id} className="text-sm font-semibold px-7 py-4 rounded-full bg-red-600 hover:bg-red-700 text-white transition-colors">
                    {genre.name}
                </span>
            ))}
        </div>

        {/* NÚT TRAILER */}
        {trailerVideo && (
            <button
                onClick={() => setTrailerKey(trailerVideo.key)}
                className="flex items-center px-15 py-7 bg-red-600 text-white font-bold rounded-full shadow-2xl hover:bg-red-700 transition-all transform hover:scale-105"
            >
               <svg className="w-7 h-7 mr-2" fill="currentColor" viewBox="0 0 24 24">
    <path d="M8 5v14l11-7z" /> 
</svg>
                Watch Trailer
            </button>
        )}
    </div>
</div>
                        </div>
                    )}
                    
                    {/* Body Content (Overview, Cast, Related) */}
                    <div className="bg-gray-900 text-white p-9 md:p-16 pb-20"> 
                        {/* Overview */}
                        <div className="mb-12">
<h2 className="text-5xl font-bold border-l-4 border-red-500 pl-3 mb-6">Overview</h2> 
<p className="text-gray-300 text-3xl leading-relaxed">{detail.overview}</p>
                        </div>

                        {/* Actor List */}
                        <CastList cast={detail.credits.cast} />

                        {/* Related Movies */}
                        <div className="mb-12">
<h2 className="text-5xl font-bold border-l-4 border-red-500 pl-3 mb-6">Related {mediaType === 'movie' ? 'Movies' : 'TV Series'}</h2>
<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
    {normalizedRecommendations.slice(0, 10).map(item => (
        <MovieCard 
            key={item.id} 
            item={item} 
            onViewDetail={onViewDetail} 
        />
    ))}
    {normalizedRecommendations.length === 0 && (
        <p className="col-span-full text-gray-400">Không có đề xuất liên quan.</p>
    )}
</div>
                        </div>
                    </div>
                </div>
                <TrailerModal videoKey={trailerKey} onClose={() => setTrailerKey(null)} />
            </>
        );
    };

    export default DetailPage;