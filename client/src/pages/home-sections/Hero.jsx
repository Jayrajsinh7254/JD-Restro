import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

const Hero = () => {
    return (
        <section className="section-padding min-h-[90vh] flex flex-col items-center justify-center text-center relative overflow-hidden pt-28 sm:pt-32 lg:pt-36">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[-10%] left-[-5%] w-[50%] h-[50%] rounded-full bg-cream2 blur-[80px] opacity-70"></div>
                <div className="absolute bottom-[-10%] right-[-5%] w-[60%] h-[60%] rounded-full bg-cream2 blur-[100px] opacity-70"></div>
            </div>

            <div className="container-wide max-w-5xl mx-auto flex flex-col items-center px-2 sm:px-4">

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    className="mb-4 sm:mb-6"
                >
                    <span className="eyebrow-tag border-red/30 px-4 sm:px-5 py-1.5 sm:py-2 text-[10px] sm:text-xs inline-flex items-center gap-1.5">
                        <Sparkles size={12} className="text-red" />
                        Made with <i className="text-red font-serif lowercase text-[13px] sm:text-[15px]">Love</i>, Served with Joy
                    </span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                    className="h1-fluid mb-6 sm:mb-8 text-dark"
                >
                    Experience the Language
                    <br />
                    <span className="font-light italic text-muted">of Fine Taste</span>
                </motion.h1>

                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="mb-10 sm:mb-14 lg:mb-16"
                >
                    <Link
                        to="/reservations"
                        className="w-[84px] h-[84px] sm:w-[96px] sm:h-[96px] bg-red hover:bg-dark text-white rounded-full flex items-center justify-center text-[9px] sm:text-[10px] uppercase font-bold tracking-widest leading-tight p-3 sm:p-4 text-center transition-all duration-300 hover:scale-105 hover:rotate-[12deg] shadow-glow active:scale-95"
                    >
                        <span>&darr;<br />Reserve<br />A Table</span>
                    </Link>
                </motion.div>

                {/* Hero Feature Banner with Responsive Aspect Ratio */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full relative shadow-2xl rounded-2xl sm:rounded-3xl overflow-hidden group aspect-[16/10] sm:aspect-[16/8] md:aspect-[16/6.5] min-h-[200px] sm:min-h-[260px]"
                >
                    <img
                        src="https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
                        alt="Drizzle Restaurant Interior"
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark/85 via-dark/40 to-transparent"></div>

                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4 sm:p-6">
                        <span className="text-3xl sm:text-5xl md:text-6xl mb-2 sm:mb-3 filter drop-shadow-md">🍽️</span>
                        <p className="font-serif font-black tracking-wide text-xs sm:text-sm md:text-base uppercase text-cream2">
                            Haute Cuisine Experience &mdash; Est. 2018
                        </p>
                        <p className="text-[11px] sm:text-xs text-white/70 font-sans mt-1">
                            New York &bull; Private Dining &bull; Chef's Table
                        </p>
                    </div>
                </motion.div>

            </div>
        </section>
    );
};

export default Hero;
