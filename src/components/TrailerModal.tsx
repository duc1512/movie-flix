// src/components/common/TrailerModal.tsx

import React from 'react';
import { YOUTUBE_BASE_URL } from '../api/movieApi';

interface TrailerModalProps {
    videoKey: string | null;
    onClose: () => void;
}

const TrailerModal: React.FC<TrailerModalProps> = ({ videoKey, onClose }) => {
    if (!videoKey) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 p-4" onClick={onClose}>
            <div 
                className="relative w-full max-w-4xl bg-gray-900 rounded-xl overflow-hidden shadow-2xl"
                onClick={e => e.stopPropagation()} // Prevent closing when clicking inside the modal
            >
                <button 
                    onClick={onClose} 
                    className="absolute top-3 right-3 z-10 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-red-600 transition"
                    aria-label="Close trailer"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
                <div className="relative pt-[56.25%]"> {/* 16:9 Aspect Ratio */}
                    <iframe
                        className="absolute top-0 left-0 w-full h-full"
                        src={`${YOUTUBE_BASE_URL}${videoKey}?autoplay=1`}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title="Movie Trailer"
                    ></iframe>
                </div>
            </div>
        </div>
    );
};

export default TrailerModal;