import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const ReserveStrip = () => {
    return (
        <section className="bg-cream">
            <div className="grid grid-cols-1 lg:grid-cols-2">

                {/* Left: Text Content */}
                <div className="p-[clamp(40px,6vw,100px)] flex flex-col justify-center items-start border-r border-border">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="eyebrow-tag mb-6">&uarr; Reserve your Table</span>

                        <h2 className="h2-fluid mb-6 text-dark leading-tight mt-6 max-w-lg">
                            Reserve your spot! ultimate joy of dining done right
                        </h2>

                        <p className="body-fluid text-muted mb-10 max-w-md">
                            Whether it's a romantic dinner for two, a family gathering, or a corporate event, we ensure your time with us is perfect.
                        </p>

                        <Link to="/reservations" className="btn-primary">
                            Reserve Your Table
                        </Link>
                    </motion.div>
                </div>

                {/* Right: Photo Grid */}
                <div className="grid grid-cols-2 aspect-square lg:aspect-auto h-full">
                    {/* Top Left */}
                    <div className="relative group overflow-hidden bg-gradient-to-br from-[#2c150b] to-[#1e0e06] flex items-center justify-center">
                        <span className="text-6xl md:text-8xl filter drop-shadow-2xl opacity-70 group-hover:scale-110 transition-transform duration-500">🍷</span>
                    </div>

                    {/* Top Right */}
                    <div className="relative group overflow-hidden flex items-center justify-center border-l border-b border-white/5">
                        <img
                            src="https://images.unsplash.com/photo-1544148103-0773bf10d330?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                            alt="Dining"
                            className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-dark/40"></div>
                        <span className="text-5xl md:text-7xl relative z-10 filter drop-shadow-2xl">👨‍👩‍👧</span>
                    </div>

                    {/* Bottom Left */}
                    <div className="relative group overflow-hidden flex items-center justify-center border-t border-r border-white/5">
                        <img
                            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                            alt="Cheers"
                            className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-dark/40"></div>
                        <span className="text-5xl md:text-7xl relative z-10 filter drop-shadow-2xl">🥂</span>
                    </div>

                    {/* Bottom Right */}
                    <div className="relative group overflow-hidden bg-gradient-to-tr from-[#3a1a0d] to-[#1e0e06] flex items-center justify-center">
                        <span className="text-6xl md:text-8xl filter drop-shadow-2xl opacity-70 group-hover:scale-110 transition-transform duration-500">🍝</span>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default ReserveStrip;
