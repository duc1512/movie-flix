// src/components/common/LoadingSpinner.tsx

import React from 'react';

const LoadingSpinner: React.FC = () => (
    <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
    </div>
);

export default LoadingSpinner;