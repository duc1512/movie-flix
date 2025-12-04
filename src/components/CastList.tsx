// src/components/CastList.tsx

import React from 'react';
import { CastMember } from '../types/tmdb';
import { IMAGE_BASE_URL, DEFAULT_PROFILE_PLACEHOLDER } from '../api/movieApi';

interface CastListProps {
    cast: CastMember[];
}

const CastList: React.FC<CastListProps> = ({ cast }) => {
    return (
        <div className="mb-12">
            <h2 className="text-5xl font-bold border-l-4 border-red-500 pl-3 mb-6">Top Cast</h2>
            <div className="flex overflow-x-auto space-x-4 pb-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
                {cast.slice(0, 15).map(actor => (
                    <div key={actor.id} className="flex-shrink-0 w-32 text-center">
                        <img
                            src={actor.profile_path ? `${IMAGE_BASE_URL}w185${actor.profile_path}` : DEFAULT_PROFILE_PLACEHOLDER}
                            alt={actor.name}
                            className="w-53 h-33 object-cover rounded-full mx-auto mb-2 border-2 border-red-500 transition-transform duration-300 hover:scale-105"
                            loading="lazy"
                        />
                        <p className="text-sm font-semibold truncate text-white">{actor.name}</p>
                        <p className="text-xs text-gray-400 truncate">{actor.character}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CastList;