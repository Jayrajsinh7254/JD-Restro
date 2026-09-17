import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const GalleryStrip = () => {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    // Very subtle parallax/movement effect on scroll
    const xMovement = useTransform(scrollYProgress, [0, 1], ["0%", "-5%"]);

    const items = [
        { emoji: '🍚', label: 'Rice & Curry', rt: '-2deg', gradient: 'from-orange-800 to-amber-600' },
        { emoji: '🍔', label: 'Burger', rt: '3deg', gradient: 'from-red-800 to-rose-600' },
        { emoji: '🍖', label: 'Rice & Meat', rt: '-1deg', gradient: 'from-stone-800 to-red-900' },
        { emoji: '🥗', label: 'Salad & Soup', rt: '2deg', gradient: 'from-emerald-800 to-teal-600' },
        { emoji: '🍔', label: 'Special Burger', rt: '-3deg', gradient: 'from-yellow-700 to-orange-500' },
        { emoji: '🍝', label: 'Pasta', rt: '1deg', gradient: 'from-red-700 to-orange-600' },
        { emoji: '🍣', label: 'Sushi', rt: '-2deg', gradient: 'from-slate-800 to-indigo-700' },
    ];

    return (
        <section ref={containerRef} className="section-padding bg-dark overflow-hidden py-24 lg:py-32 relative">
            <div className="absolute inset-0 bg-radial-glow opacity-30"></div>

            <div className="container-wide mb-16 text-center relative z-10 flex flex-col items-center">
                <span className="eyebrow-tag border-white/20 text-cream2 mb-6">A Feast for the Eyes</span>
                <h2 className="h2-fluid text-white">
                    Taste the vibes through <span className="italic text-white/50 font-light">our gallery</span>
                </h2>
            </div>

            <div className="w-full relative z-10 overflow-x-auto no-scrollbar pb-12 pt-4 px-4 lg:px-12 -mx-4 lg:-mx-12 cursor-grab active:cursor-grabbing">
                <motion.div
                    className="flex gap-6 lg:gap-8 w-max px-8"
                    style={{ x: xMovement }}
                >
                    {items.map((item, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ rotate: item.rt, y: 0 }}
                            whileHover={{ rotate: '0deg', scale: 1.04, y: -10, zIndex: 20 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            className={`w-[160px] md:w-[200px] lg:w-[240px] h-[220px] md:h-[280px] lg:h-[320px] rounded-2xl flex-shrink-0 relative overflow-hidden shadow-[0_15px_30px_-10px_rgba(0,0,0,0.8)] border border-white/10 group bg-gradient-to-br ${item.gradient}`}
                        >
                            {/* Image / Emoji */}
                            <div className="absolute inset-0 flex items-center justify-center p-8">
                                <span className="text-[80px] md:text-[100px] lg:text-[120px] filter drop-shadow-2xl group-hover:scale-110 transition-transform duration-500">
                                    {item.emoji}
                                </span>
                            </div>

                            {/* Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-dark/90 via-dark/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>

                            {/* Label */}
                            <div className="absolute bottom-0 left-0 p-5 lg:p-6 w-full transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                <p className="text-white font-sans font-medium tracking-wide text-sm md:text-base">{item.label}</p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default GalleryStrip;
