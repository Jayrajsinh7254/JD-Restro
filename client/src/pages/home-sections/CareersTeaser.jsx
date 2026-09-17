import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const CareersTeaser = () => {
    return (
        <section className="section-padding bg-cream relative overflow-hidden flex items-center justify-center text-center">
            <div className="container-wide max-w-4xl mx-auto flex flex-col items-center relative z-10">

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-8"
                >
                    <span className="eyebrow-tag">Career Opportunity</span>
                </motion.div>

                <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="h2-fluid mb-12 leading-relaxed"
                >
                    We're always looking for passionate, dedicated people to join our growing team.
                </motion.h2>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                >
                    <Link to="/contact" className="btn-primary px-10 py-4 text-sm shadow-glow">
                        Apply Now
                    </Link>
                </motion.div>
            </div>

            {/* Decorative Icons */}
            <div className="absolute left-10 md:left-24 top-1/2 -translate-y-1/2 text-5xl md:text-7xl opacity-20 filter blur-[2px] -rotate-12 hidden sm:block">
                ☕
            </div>
            <div className="absolute right-10 md:right-24 top-1/2 -translate-y-1/2 text-5xl md:text-7xl opacity-20 filter blur-[2px] rotate-12 hidden sm:block">
                🍰
            </div>
        </section>
    );
};

export default CareersTeaser;
