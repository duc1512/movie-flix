// src/App.tsx
"use client"
import React, { useState, useCallback, useEffect } from 'react';
import { View, MediaType } from '../src/types/tmdb';
import HomePage from './HomePage';
import ListPage from './ListPage';
import DetailPage from './DetailPage';
// ⭐ Import cho hiệu ứng chuyển trang
import { motion, AnimatePresence,Transition } from 'framer-motion'; 

// Variants cho hiệu ứng mờ dần (fade) và dịch chuyển nhẹ
const pageVariants = {
  initial: { opacity: 0, x: -50 },
  in: { opacity: 1, x: 0 },
  out: { opacity: 0, x: 50 }
};

const pageTransition: Transition = {
  type: "tween",
  // Sử dụng mảng bezier (Bezier Array) để đảm bảo type hợp lệ
  ease: [0.6, -0.05, 0.01, 0.99], 
  duration: 0.5
};  

const App: React.FC = () => {
    // State for simple routing simulation
    const [currentView, setCurrentView] = useState<View>('home');
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [selectedMediaType, setSelectedMediaType] = useState<MediaType>('movie');
    const [isScrolled, setIsScrolled] = useState(false);
    
    // Khắc phục lỗi: Thêm state để lưu trữ View trước đó
    const [previousView, setPreviousView] = useState<View>('home'); 

    // Navigation handlers
    const handleViewDetail = useCallback((id: number, mediaType: MediaType) => {
        setPreviousView(currentView); // Lưu trạng thái hiện tại trước khi chuyển sang 'detail'
        setSelectedId(id);
        setSelectedMediaType(mediaType);
        setCurrentView('detail');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [currentView]); 

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll();

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleNavigate = useCallback((view: View, type: MediaType = 'movie') => {
        setCurrentView(view);
        setSelectedMediaType(type);
        setSelectedId(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    // Render the appropriate page based on state
    const renderContent = () => {
        if (currentView === 'home') {
            return <HomePage onViewDetail={handleViewDetail} onNavigate={handleNavigate} />; 
        }

        if (currentView === 'list') {
            return <ListPage initialMediaType={selectedMediaType} onViewDetail={handleViewDetail} />;
        }

        if (currentView === 'detail' && selectedId) {
            return (
                <DetailPage 
                    id={selectedId} 
                    mediaType={selectedMediaType} 
                    onViewDetail={handleViewDetail} 
                    onBack={handleNavigate} 
                    currentViewType={previousView === 'list' ? 'list' : 'home'} 
                />
            );
        }

        // Fallback
        return <p className="text-white p-8">Lỗi điều hướng. Về trang chủ.</p>;
    };

    return (
        <div className="min-h-screen bg-gray-900 font-sans">
            {/* Navigation Bar */}
            <header
                className={`sticky top-0 z-50 transition-all duration-500 ease-in-out ${
                    isScrolled
                        ? 'bg-gray-900/90 backdrop-blur-sm shadow-md'
                        : 'bg-transparent backdrop-blur-0 shadow-none'
                }`}
            >
                <nav className="container mx-auto flex items-center justify-between p-5 sm:p-7">
                    <h1
                        className="text-4xl lg:text-5xl font-extrabold text-red-600 cursor-pointer transition hover:text-red-400"
                        onClick={() => handleNavigate('home')}
                    >
                        🎬 DukeMovie.
                    </h1>

                    {/* Buttons */}
                    <div className="flex space-x-8">
                        <button
                            onClick={() => handleNavigate('home')}
                            className={`text-2xl lg:text-3xl font-bold transition-colors ${
                                currentView === 'home' ? 'text-red-500' : 'text-white hover:text-red-300'
                            }`}
                        >
                            Home
                        </button>
                        <button
                            onClick={() => handleNavigate('list', 'movie')}
                            className={`text-2xl lg:text-3xl font-bold transition-colors ${
                                currentView === 'list' && selectedMediaType === 'movie'
                                    ? 'text-red-500'
                                    : 'text-white hover:text-red-300'
                            }`}
                        >
                            Movies
                        </button>
                        <button
                            onClick={() => handleNavigate('list', 'tv')}
                            className={`text-2xl lg:text-3xl font-bold transition-colors ${
                                currentView === 'list' && selectedMediaType === 'tv'
                                    ? 'text-red-500'
                                    : 'text-white hover:text-red-300'
                            }`}
                        >
                            TV Series
                        </button>
                    </div>
                </nav>
            </header>
            
            {/* ⭐ Main Content ĐÃ THÊM ANIMATION WRAPPER */}
            <main className="bg-gray-900">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentView} // Bắt buộc phải có để kích hoạt animation
                        initial="initial"
                        animate="in"
                        exit="out"
                        variants={pageVariants}
                        transition={pageTransition}
                        style={{ width: '100%' }}
                    >
                        {renderContent()}
                    </motion.div>
                </AnimatePresence>
            </main>

            {/* Footer */}
            <footer className="bg-gray-900 border-t border-gray-700 py-12">
                <div className="container mx-auto px-4">
                    <div className="text-center">
                        <h2 className="text-5xl font-bold text-red-500 mb-6">DukeMovie</h2>
                        <p className="text-gray-300 text-lg mb-8">
                            Khám phá bộ sưu tập phim và chương trình truyền hình đa dạng
                        </p>
                        <div className="flex justify-center space-x-10 mb-10">
                            <a href="#" className="text-gray-400 hover:text-white transition-colors transform hover:scale-110">
                                <span className="sr-only">Facebook</span>
                                <svg className="h-7 w-7" fill="currentColor" viewBox="0 0 24 24">
                                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                                </svg>
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors transform hover:scale-110">
                                <span className="sr-only">Twitter</span>
                                <svg className="h-7 w-7" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                                </svg>
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors transform hover:scale-110">
                                <span className="sr-only">Instagram</span>
                                <svg className="h-7 w-7" fill="currentColor" viewBox="0 0 24 24">
                                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.976.045-1.505.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.352-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.976.207 1.505.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.352.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.352.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                                </svg>
                            </a>
                        </div>
                        <p className="text-base text-gray-300">
                            © {new Date().getFullYear()} MovieHub. All rights reserved.
                        </p>
                        <p className="text-base text-gray-400 mt-4">
                            Dữ liệu được cung cấp bởi{' '}
                            <a
                                href="https://www.themoviedb.org/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-red-500 hover:text-red-300 transition-colors"
                            >
                                TMDB
                            </a>
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default App;