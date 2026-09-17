import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { galleryService } from '../services/galleryService';

const CATEGORIES = ['All', 'Interior', 'Food', 'Drinks', 'Events'];

const Gallery = () => {
    const [activeCategory, setActiveCategory] = useState('All');
    const [selectedImage, setSelectedImage] = useState(null);
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGallery = async () => {
            try {
                const response = await galleryService.getAll();
                setImages(response.data || []);
            } catch (error) {
                console.error("Failed to load gallery:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchGallery();
    }, []);

    const filteredImages = images.filter(
        item => activeCategory === 'All' || item.category.toLowerCase() === activeCategory.toLowerCase()
    );

    return (
        <div className="pt-24 min-h-screen bg-cream pb-24">
            {/* Header */}
            <section className="py-16 md:py-24 text-center bg-dark text-white relative overflow-hidden bg-radial-glow">
                <div className="container-wide relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="eyebrow-tag border-white/20 text-cream2 mb-6">Visual Journey</span>
                        <h1 className="h1-fluid mb-6">Our Gallery</h1>
                        <p className="body-fluid text-white/70 max-w-2xl mx-auto">
                            Immense yourself in the visual splendor of our dishes, our elegant ambiance, and the unforgettable moments shared here.
                        </p>
                    </motion.div>
                </div>
            </section>

            <section className="container-wide mt-12">
                {/* Category Filters */}
                <div className="flex flex-wrap justify-center gap-3 mb-12">
                    {CATEGORIES.map(category => (
                        <button
                            key={category}
                            onClick={() => setActiveCategory(category)}
                            className={`px-6 py-2 rounded-full font-sans text-sm transition-colors duration-300 ${activeCategory === category
                                ? 'bg-dark text-white'
                                : 'bg-transparent text-brown hover:bg-black/5 border border-[#e2d4c4]/60'
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* Masonry Grid Layout */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 text-muted gap-4">
                        <div className="relative">
                            <div className="absolute inset-0 border-t-2 border-red rounded-full animate-spin"></div>
                            <div className="w-16 h-16 border-4 border-[#e2d4c4]/30 rounded-full"></div>
                        </div>
                        <span className="text-sm font-bold uppercase tracking-widest text-brown">Curating Gallery...</span>
                    </div>
                ) : (
                    <div className="masonry-grid">
                        <AnimatePresence>
                            {filteredImages.map((img) => (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.3 }}
                                    key={img._id}
                                    className="masonry-item relative group overflow-hidden rounded-xl cursor-pointer"
                                    onClick={() => setSelectedImage(img)}
                                >
                                    <img
                                        src={img.imageUrl}
                                        alt={img.title}
                                        className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                                        loading="lazy"
                                    />

                                    {/* Hover Overlay */}
                                    <div className="absolute inset-0 bg-dark/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                                        <span className="text-white/80 font-sans text-xs uppercase tracking-widest block mb-1">
                                            {img.category}
                                        </span>
                                        <span className="text-white font-serif text-xl font-medium">
                                            {img.title}
                                        </span>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </section>

            {/* Lightbox Modal */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedImage(null)}
                        className="fixed inset-0 z-[100] bg-dark/95 backdrop-blur-sm flex items-center justify-center p-4 cursor-zoom-out"
                    >
                        {/* Close Button */}
                        <button
                            className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors"
                            onClick={() => setSelectedImage(null)}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>

                        <motion.img
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.9 }}
                            src={selectedImage.imageUrl}
                            alt={selectedImage.title}
                            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Gallery;
