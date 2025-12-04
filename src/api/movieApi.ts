// src/api/tmdb.ts

import { FetchParams, MediaItem, MediaDetail, MediaType } from '../types/tmdb';

// --- CONFIGURATION & CONSTANTS ---
const API_KEY = "4f85134e0e3de33d9af45eb9596b5735"; 
const BASE_URL = 'https://api.themoviedb.org/3';

// --- IMAGE & VIDEO URLS ---
export const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/';
export const YOUTUBE_BASE_URL = 'https://www.youtube.com/embed/';
export const DEFAULT_PLACEHOLDER = 'https://placehold.co/500x750/1e293b/cbd5e1?text=No+Image';
export const DEFAULT_PROFILE_PLACEHOLDER = 'https://placehold.co/128x192/475569/cbd5e1?text=No+Pic';


// Helper function to handle API calls with exponential backoff
const fetchWithRetry = async (url: string, retries = 3) => {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                // Throttle check (HTTP 429)
                if (response.status === 429 && i < retries - 1) {
                    const delay = Math.pow(2, i) * 1000 + (Math.random() * 1000); // Exponential backoff + jitter
                    await new Promise(resolve => setTimeout(resolve, delay));
                    continue;
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            if (i < retries - 1) {
                // Only log non-throttle-related errors during retry setup
                const delay = Math.pow(2, i) * 1000;
                await new Promise(resolve => setTimeout(resolve, delay));
                continue;
            }
            throw error; // Throw on final failure
        }
    }
};


/**
 * Normalizes raw TMDB data into a consistent MediaItem array.
 */
const normalizeMediaList = (rawResults: any[], defaultType: MediaType): MediaItem[] => {
    return rawResults
        .map((item: any) => ({
            ...item,
            // Sử dụng media_type từ item hoặc defaultType, chuẩn hóa title và release_date
            media_type: item.media_type || defaultType, 
            title: item.title || item.name || 'Untitled',
            release_date: item.release_date || item.first_air_date,
        }))
        // Lọc bỏ kết quả không phải 'movie' hoặc 'tv' (vd: 'person')
        .filter((item: any) => item.media_type === 'movie' || item.media_type === 'tv') as MediaItem[];
};


/**
 * Fetches a list of movies or TV shows based on category and type.
 */
export const fetchMediaList = async ({ category, mediaType, timeWindow = 'week', query, page = 1 }: FetchParams): Promise<{ results: MediaItem[], total_pages: number }> => {
    let url = '';
    const params = new URLSearchParams({ api_key: API_KEY, language: 'en-US', page: page.toString() });

    if (query) {
        url = `${BASE_URL}/search/${mediaType}?${params}&query=${encodeURIComponent(query)}`;
    } else if (category === 'trending') {
        url = `${BASE_URL}/trending/${mediaType}/${timeWindow}?${params}`;
    } else { // top_rated
        url = `${BASE_URL}/${mediaType}/${category}?${params}`;
    }

    try {
        const data = await fetchWithRetry(url);
        const results = normalizeMediaList(data.results, mediaType);
        return { results, total_pages: data.total_pages };
    } catch (error) {
        console.error('Error fetching media list:', error);
        return { results: [], total_pages: 0 };
    }
};

/**
 * Fetches detailed information for a specific movie or TV show.
 */
export const fetchMediaDetails = async (id: number, mediaType: MediaType): Promise<MediaDetail | null> => {
    const params = new URLSearchParams({
        api_key: API_KEY,
        language: 'en-US',
        append_to_response: 'credits,videos,recommendations'
    });
    const url = `${BASE_URL}/${mediaType}/${id}?${params}`;

    try {
        const data = await fetchWithRetry(url);
        // Normalize title
        data.title = data.title || data.name || 'Untitled';
        data.media_type = mediaType;
        
        // Normalize recommendations (since they might be missing type)
        if (data.recommendations?.results) {
            data.recommendations.results = normalizeMediaList(data.recommendations.results, mediaType);
        }

        return data as MediaDetail;
    } catch (error) {
        console.error(`Error fetching detail for ${mediaType} ${id}:`, error);
        return null;
    }
};