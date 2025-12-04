// src/types.ts

// --- 1. TYPE DEFINITIONS ---
export type MediaType = 'movie' | 'tv';

export type View = 'home' | 'list' | 'detail';

export interface Genre {
    id: number;
    name: string;
}

export interface MediaItem {
    id: number;
    title: string; // Đã chuẩn hóa
    name?: string; // Tên gốc của TV show (giữ lại cho API raw)
    poster_path: string | null;
    backdrop_path: string | null;
    overview: string;
    vote_average: number;
    release_date: string | undefined; // Đã chuẩn hóa
    first_air_date?: string; // Ngày phát sóng TV show (giữ lại cho API raw)
    media_type: MediaType | 'person'; // Bao gồm cả 'person' cho API search
}

export interface CastMember {
    id: number;
    name: string;
    character: string;
    profile_path: string | null;
}

export interface Video {
    id: string;
    key: string;
    name: string;
    site: string;
    type: string;
}

export interface MediaDetail extends MediaItem {
    runtime?: number;
    episode_run_time?: number[];
    genres: Genre[];
    tagline: string;
    credits: {
        cast: CastMember[];
    };
    videos: {
        results: Video[];
    };
    recommendations: {
        results: MediaItem[];
    };
}

export interface FetchParams {
    category: 'trending' | 'top_rated' | 'search';
    mediaType: MediaType;
    timeWindow?: 'day' | 'week';
    query?: string;
    page?: number;
}