import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Hero = () => {
    return (
        <section className="section-padding min-h-screen flex flex-col items-center justify-center text-center relative overflow-hidden pt-32">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] rounded-full bg-cream2 blur-[80px] opacity-70"></div>
                <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] rounded-full bg-cream2 blur-[100px] opacity-70"></div>
            </div>

            <div className="container-wide max-w-5xl mx-auto flex flex-col items-center">

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="mb-6"
                >
                    <span className="eyebrow-tag border-red/30 px-5 py-2">
                        Made with <i className="text-red font-serif lowercase text-[14px]">Love</i>, Served with Joy
                    </span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                    className="h1-fluid mb-10"
                >
                    Experience the Language
                    <br />
                    <span className="font-light italic text-muted">of Taste</span>
                </motion.h1>

                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="mb-16 lg:mb-24"
                >
                    <Link
                        to="/reservations"
                        className="w-[90px] h-[90px] bg-red hover:bg-dark text-white rounded-full flex items-center justify-center text-[10px] uppercase font-bold tracking-widest leading-tight p-4 text-center transition-all duration-300 hover:scale-105 hover:rotate-[15deg] shadow-glow"
                    >
                        <span>&darr;<br />Reserve<br />A Table</span>
                    </Link>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full relative shadow-2xl rounded-[18px] overflow-hidden group"
                    style={{ aspectRatio: '16/6.5' }}
                >
                    <img
                        src="https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
                        alt="Drizzle Restaurant Interior"
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-dark/30 to-transparent"></div>

                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6">
                        <span className="text-4xl md:text-6xl mb-4 filter drop-shadow-md">🍽️</span>
                        <p className="font-sans font-medium tracking-wide text-sm md:text-base uppercase">
                            Fine Dining Experience &mdash; Est. 2018
                        </p>
                    </div>
                </motion.div>

            </div>
        </section>
    );
};

export default Hero;
