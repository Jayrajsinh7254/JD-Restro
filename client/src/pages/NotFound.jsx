import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="min-h-screen bg-dark flex flex-col justify-center items-center text-center p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-radial-glow opacity-50"></div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="relative z-10 flex flex-col items-center"
            >
                <span className="text-[120px] lg:text-[180px] leading-none mb-4 filter drop-shadow-2xl opacity-80">🍽️</span>
                <h1 className="font-serif font-black text-[120px] lg:text-[180px] text-red leading-none tracking-tighter mix-blend-screen opacity-50 absolute top-0 -z-10 blur-[2px]">
                    404
                </h1>

                <h2 className="h2-fluid text-cream2 mb-6 mt-8">Looks like this plate is empty</h2>
                <p className="font-sans text-white/60 max-w-md mb-12">
                    The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
                </p>

                <Link to="/" className="btn-primary">
                    Return Home
                </Link>
            </motion.div>
        </div>
    );
};

export default NotFound;
