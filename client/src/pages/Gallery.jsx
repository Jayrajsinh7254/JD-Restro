import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { galleryService } from '../services/galleryService';
import { X, ChevronLeft, ChevronRight, ZoomIn, Eye, Sparkles, Filter } from 'lucide-react';

const CATEGORIES = ['All', 'Interior', 'Food', 'Drinks', 'Events'];

const FALLBACK_IMAGES = [
    {
        _id: 'fb-1',
        title: 'Main Dining Room At Dusk',
        category: 'Interior',
        imageUrl: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?q=80&w=1200&auto=format&fit=crop',
        description: 'Atmospheric candlelight dining with custom leather booths and walnut accents.'
    },
    {
        _id: 'fb-2',
        title: 'A5 Miyazaki Wagyu Tenderloin',
        category: 'Food',
        imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200&auto=format&fit=crop',
        description: 'Charred over binchotan charcoal, served with black truffle jus and smoked shallot puree.'
    },
    {
        _id: 'fb-3',
        title: 'Smoked Rosemary Old Fashioned',
        category: 'Drinks',
        imageUrl: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=1200&auto=format&fit=crop',
        description: 'Handcrafted bourbon cocktail smoked with charred organic rosemary and aromatic bitters.'
    },
    {
        _id: 'fb-4',
        title: 'The Private Wine Cellar Vault',
        category: 'Interior',
        imageUrl: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=1200&auto=format&fit=crop',
        description: 'Our climate-controlled reserve cellar housing over 800 rare vintages.'
    },
    {
        _id: 'fb-5',
        title: 'Pan-Seared Hokkaido Scallops',
        category: 'Food',
        imageUrl: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?q=80&w=1200&auto=format&fit=crop',
        description: 'Golden crust with cauliflower velouté and Siberian royal caviar pearls.'
    },
    {
        _id: 'fb-6',
        title: 'Botanical Blossom Elixir',
        category: 'Drinks',
        imageUrl: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?q=80&w=1200&auto=format&fit=crop',
        description: 'Elderflower liqueur, artisanal gin, clarified lemon, and edible seasonal orchid.'
    },
    {
        _id: 'fb-7',
        title: 'Chef Marcus Plating in Action',
        category: 'Events',
        imageUrl: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?q=80&w=1200&auto=format&fit=crop',
        description: 'Precision artistry at the open kitchen counter during evening service.'
    },
    {
        _id: 'fb-8',
        title: 'Artisan Valrhona Chocolate Dome',
        category: 'Food',
        imageUrl: 'https://images.unsplash.com/photo-1579372786545-d24232daf58c?q=80&w=1200&auto=format&fit=crop',
        description: '70% dark chocolate shell, passion fruit coulis, and salted hazelnut praline.'
    },
    {
        _id: 'fb-9',
        title: 'Sommelier Harvest Gala Dinner',
        category: 'Events',
        imageUrl: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?q=80&w=1200&auto=format&fit=crop',
        description: 'Annual vineyard collaboration showcasing five-course seasonal pairings.'
    }
];

const Gallery = () => {
    const [activeCategory, setActiveCategory] = useState('All');
    const [selectedImage, setSelectedImage] = useState(null);
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGallery = async () => {
            try {
                const response = await galleryService.getAll();
                const fetched = response.data || [];
                if (fetched.length > 0) {
                    setImages(fetched);
                } else {
                    setImages(FALLBACK_IMAGES);
                }
            } catch (error) {
                console.error("Failed to load gallery:", error);
                setImages(FALLBACK_IMAGES);
            } finally {
                setLoading(false);
            }
        };
        fetchGallery();
    }, []);

    const filteredImages = images.filter(
        item => activeCategory === 'All' || item.category?.toLowerCase() === activeCategory.toLowerCase()
    );

    const activeIndex = selectedImage ? filteredImages.findIndex(img => (img._id === selectedImage._id || img.imageUrl === selectedImage.imageUrl)) : -1;

    const handlePrev = useCallback((e) => {
        if (e) e.stopPropagation();
        if (activeIndex > 0) {
            setSelectedImage(filteredImages[activeIndex - 1]);
        } else {
            setSelectedImage(filteredImages[filteredImages.length - 1]);
        }
    }, [activeIndex, filteredImages]);

    const handleNext = useCallback((e) => {
        if (e) e.stopPropagation();
        if (activeIndex < filteredImages.length - 1) {
            setSelectedImage(filteredImages[activeIndex + 1]);
        } else {
            setSelectedImage(filteredImages[0]);
        }
    }, [activeIndex, filteredImages]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!selectedImage) return;
            if (e.key === 'Escape') setSelectedImage(null);
            if (e.key === 'ArrowLeft') handlePrev();
            if (e.key === 'ArrowRight') handleNext();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedImage, handlePrev, handleNext]);

    return (
        <div className="pt-20 sm:pt-24 min-h-screen bg-cream pb-16 sm:pb-24">
            {/* Hero Header */}
            <section className="py-12 sm:py-20 md:py-24 text-center bg-dark text-white relative overflow-hidden bg-radial-glow">
                <div className="container-wide relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <span className="eyebrow-tag border-white/20 text-cream2 mb-4 sm:mb-6">Atmosphere & Artistry</span>
                        <h1 className="h1-fluid mb-4 sm:mb-6 text-cream">Visual Gallery</h1>
                        <p className="body-fluid text-white/70 max-w-2xl mx-auto px-2">
                            Step into the world of Drizzle. An intimate visual showcase of our culinary craftsmanship, ambient dining spaces, and memorable moments.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Gallery Section */}
            <section className="container-wide mt-8 sm:mt-12 md:mt-16">

                {/* Mobile Friendly Category Filter Bar */}
                <div className="mb-8 sm:mb-12">
                    <div className="flex items-center justify-between pb-3 sm:hidden text-xs text-muted font-bold uppercase tracking-wider">
                        <span className="flex items-center gap-1"><Filter size={13} /> Filter Categories</span>
                        <span>{filteredImages.length} Photographs</span>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto no-scrollbar py-2 px-0.5 justify-start sm:justify-center">
                        {CATEGORIES.map((category) => {
                            const count = category === 'All'
                                ? images.length
                                : images.filter(img => img.category?.toLowerCase() === category.toLowerCase()).length;
                            const isActive = activeCategory === category;

                            return (
                                <button
                                    key={category}
                                    onClick={() => setActiveCategory(category)}
                                    className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-full font-sans text-xs sm:text-sm font-bold transition-all duration-200 whitespace-nowrap shrink-0 flex items-center gap-2 ${
                                        isActive
                                            ? 'bg-dark text-white shadow-md shadow-dark/20 scale-[1.02]'
                                            : 'bg-white text-brown hover:text-red hover:bg-cream2 border border-border'
                                    }`}
                                >
                                    <span>{category}</span>
                                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                                        isActive ? 'bg-red text-white' : 'bg-cream2 text-muted'
                                    }`}>
                                        {count}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Loading State */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24 sm:py-32 text-muted gap-4">
                        <div className="w-12 h-12 border-3 border-red border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-xs font-bold uppercase tracking-widest text-brown">Curating Collection...</span>
                    </div>
                ) : (
                    /* Responsive Masonry / Grid */
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        <AnimatePresence>
                            {filteredImages.map((img, idx) => (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.35, delay: idx * 0.04 }}
                                    key={img._id || img.imageUrl}
                                    className="group relative bg-white rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
                                    onClick={() => setSelectedImage(img)}
                                >
                                    <div className="aspect-[4/3] sm:aspect-[4/3] overflow-hidden bg-dark/5">
                                        <img
                                            src={img.imageUrl}
                                            alt={img.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                            loading="lazy"
                                        />
                                    </div>

                                    {/* Mobile & Desktop Info Layer */}
                                    <div className="p-4 sm:p-5 flex items-center justify-between gap-3 bg-white">
                                        <div>
                                            <span className="text-[10px] uppercase font-bold text-red tracking-widest block mb-0.5">
                                                {img.category}
                                            </span>
                                            <h3 className="font-serif font-bold text-base sm:text-lg text-dark group-hover:text-red transition-colors line-clamp-1">
                                                {img.title}
                                            </h3>
                                        </div>
                                        <div className="w-8 h-8 rounded-full bg-cream flex items-center justify-center text-brown group-hover:bg-red group-hover:text-white transition-colors shrink-0">
                                            <Eye size={15} />
                                        </div>
                                    </div>

                                    {/* Desktop Hover Glow Effect */}
                                    <div className="absolute inset-0 bg-dark/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none hidden sm:flex items-center justify-center">
                                        <span className="bg-white/90 text-dark text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-full shadow-lg backdrop-blur-sm flex items-center gap-1.5">
                                            <ZoomIn size={14} className="text-red" /> View Fullscreen
                                        </span>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </section>

            {/* Mobile Optimized Lightbox Modal */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedImage(null)}
                        className="fixed inset-0 z-[100] bg-dark/95 backdrop-blur-md flex flex-col justify-between p-3 sm:p-6 select-none"
                    >
                        {/* Top Bar: Counter & Close Button */}
                        <div className="flex items-center justify-between w-full max-w-5xl mx-auto pt-2 pb-2 text-white z-20">
                            <div className="flex items-center gap-2">
                                <span className="bg-red text-white text-[11px] uppercase font-bold px-3 py-1 rounded-full">
                                    {selectedImage.category}
                                </span>
                                <span className="text-xs text-white/60 font-sans">
                                    {activeIndex + 1} of {filteredImages.length}
                                </span>
                            </div>

                            <button
                                className="w-10 h-10 rounded-full bg-white/10 hover:bg-red text-white flex items-center justify-center transition-colors shadow-lg"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedImage(null);
                                }}
                                aria-label="Close Lightbox"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Middle: Image Display with Previous / Next Arrows */}
                        <div className="relative flex-1 flex items-center justify-center max-w-5xl w-full mx-auto my-auto overflow-hidden">
                            {/* Prev Arrow */}
                            <button
                                onClick={handlePrev}
                                className="absolute left-2 sm:left-4 z-20 w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-black/60 hover:bg-red text-white flex items-center justify-center transition-colors backdrop-blur-sm shadow-md"
                                aria-label="Previous Image"
                            >
                                <ChevronLeft size={24} />
                            </button>

                            {/* Main Modal Image */}
                            <motion.img
                                key={selectedImage._id || selectedImage.imageUrl}
                                initial={{ opacity: 0, scale: 0.94 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.94 }}
                                transition={{ duration: 0.25 }}
                                src={selectedImage.imageUrl}
                                alt={selectedImage.title}
                                className="max-w-full max-h-[70vh] sm:max-h-[75vh] object-contain rounded-xl sm:rounded-2xl shadow-2xl"
                                onClick={(e) => e.stopPropagation()}
                            />

                            {/* Next Arrow */}
                            <button
                                onClick={handleNext}
                                className="absolute right-2 sm:right-4 z-20 w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-black/60 hover:bg-red text-white flex items-center justify-center transition-colors backdrop-blur-sm shadow-md"
                                aria-label="Next Image"
                            >
                                <ChevronRight size={24} />
                            </button>
                        </div>

                        {/* Bottom: Caption & Description */}
                        <div className="max-w-3xl mx-auto text-center w-full pb-2 pt-2 z-20">
                            <h3 className="font-serif font-bold text-lg sm:text-2xl text-white mb-1">
                                {selectedImage.title}
                            </h3>
                            {selectedImage.description && (
                                <p className="text-white/70 text-xs sm:text-sm font-sans line-clamp-2 max-w-xl mx-auto">
                                    {selectedImage.description}
                                </p>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Gallery;
