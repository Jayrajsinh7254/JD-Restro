import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const GalleryStrip = () => {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const xMovement = useTransform(scrollYProgress, [0, 1], ["0%", "-4%"]);

    const items = [
        { emoji: '🍚', label: 'Biryani & Curry', rt: '-2deg', gradient: 'from-orange-800 to-amber-600' },
        { emoji: '🍔', label: 'Wagyu Burger', rt: '2deg', gradient: 'from-red-800 to-rose-600' },
        { emoji: '🍖', label: 'Ribeye Steak', rt: '-1deg', gradient: 'from-stone-800 to-red-900' },
        { emoji: '🥗', label: 'Truffle Salad', rt: '2deg', gradient: 'from-emerald-800 to-teal-600' },
        { emoji: '🍝', label: 'Handmade Pasta', rt: '-2deg', gradient: 'from-red-700 to-orange-600' },
        { emoji: '🍣', label: 'Salmon Sashimi', rt: '1deg', gradient: 'from-slate-800 to-indigo-700' },
        { emoji: '🍰', label: 'Opera Dessert', rt: '-2deg', gradient: 'from-amber-900 to-yellow-600' }
    ];

    return (
        <section ref={containerRef} className="section-padding bg-dark overflow-hidden py-16 sm:py-24 lg:py-32 relative">
            <div className="absolute inset-0 bg-radial-glow opacity-30"></div>

            <div className="container-wide mb-10 sm:mb-16 text-center relative z-10 flex flex-col items-center px-4">
                <span className="eyebrow-tag border-white/20 text-cream2 mb-4 sm:mb-6">A Feast for the Senses</span>
                <h2 className="h2-fluid text-white">
                    Taste the vibes through <span className="italic text-white/50 font-light">our kitchen gallery</span>
                </h2>
            </div>

            <div className="w-full relative z-10 overflow-x-auto no-scrollbar pb-6 pt-2 px-4 cursor-grab active:cursor-grabbing">
                <motion.div
                    className="flex gap-4 sm:gap-6 lg:gap-8 w-max px-2 sm:px-6"
                    style={{ x: xMovement }}
                >
                    {items.map((item, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ rotate: item.rt, y: 0 }}
                            whileHover={{ rotate: '0deg', scale: 1.04, y: -8, zIndex: 20 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            className={`w-[140px] sm:w-[180px] md:w-[210px] lg:w-[240px] h-[200px] sm:h-[250px] md:h-[280px] lg:h-[320px] rounded-2xl flex-shrink-0 relative overflow-hidden shadow-[0_15px_30px_-10px_rgba(0,0,0,0.8)] border border-white/10 group bg-gradient-to-br ${item.gradient}`}
                        >
                            {/* Emoji Visual */}
                            <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-8">
                                <span className="text-[64px] sm:text-[80px] md:text-[100px] lg:text-[120px] filter drop-shadow-2xl group-hover:scale-110 transition-transform duration-500">
                                    {item.emoji}
                                </span>
                            </div>

                            {/* Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-dark/90 via-dark/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>

                            {/* Label */}
                            <div className="absolute bottom-0 left-0 p-4 sm:p-5 lg:p-6 w-full transform translate-y-1 sm:translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                <p className="text-white font-sans font-bold tracking-wide text-xs sm:text-sm md:text-base">{item.label}</p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default GalleryStrip;
