import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

const AboutStrip = () => {
    return (
        <section className="section-padding bg-cream overflow-hidden">
            <div className="container-wide">
                <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] gap-10 lg:gap-16 items-center">

                    {/* Left Column */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.8 }}
                        className="flex flex-col items-start"
                    >
                        <span className="eyebrow-tag mb-4 sm:mb-6 inline-flex items-center gap-1.5">
                            <Sparkles size={12} className="text-red" /> Know About Us
                        </span>

                        <h2 className="h2-fluid mb-4 sm:mb-6 text-dark">
                            Blending culinary heritage & modern innovation
                        </h2>

                        <p className="body-fluid text-muted mb-8 sm:mb-10 max-w-xl leading-relaxed">
                            At Drizzle, great food is about more than just flavor—it's connection, art, and the cherished memories shared across the table. Our culinary team partners with organic farms and biodynamic vineyards to craft dishes that honor timeless recipes while celebrating modern techniques.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8 sm:mb-10 w-full sm:w-auto">
                            <Link to="/about" className="btn-primary w-full sm:w-auto text-center rounded-xl">
                                Read Our Story <ArrowRight size={14} />
                            </Link>
                            <Link to="/menu" className="btn-outline w-full sm:w-auto text-center rounded-xl bg-transparent">
                                Explore Menu
                            </Link>
                        </div>

                        <div className="flex items-center gap-3 sm:gap-4 pt-2">
                            <div className="flex -space-x-3 sm:-space-x-4">
                                <img src="https://i.pravatar.cc/100?img=1" alt="Patron" className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-cream object-cover" />
                                <img src="https://i.pravatar.cc/100?img=2" alt="Patron" className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-cream object-cover" />
                                <img src="https://i.pravatar.cc/100?img=3" alt="Patron" className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-cream object-cover" />
                            </div>
                            <div className="text-xs sm:text-sm">
                                <p className="font-bold text-dark">50,000+ Delighted Guests</p>
                                <div className="text-amber-500 text-xs font-bold">★★★★★ <span className="text-muted font-sans text-[11px]">(4.9/5 Rating)</span></div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Column */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative mt-6 sm:mt-8 lg:mt-0"
                    >
                        {/* Floating Tag */}
                        <div className="absolute -top-4 -right-2 sm:-top-6 sm:-right-6 bg-white shadow-card rounded-full px-4 sm:px-6 py-2 sm:py-3 z-20 hidden md:block border border-[#e2d4c4]">
                            <p className="text-xs font-bold text-dark flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-red animate-pulse"></span>
                                Pure Organic & Seasonal Ingredients
                            </p>
                        </div>

                        {/* Main Image */}
                        <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl w-full aspect-[4/3]">
                            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-red/20 mix-blend-multiply z-10"></div>
                            <img
                                src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                                alt="Chef cooking"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 flex items-center justify-center z-10">
                                <span className="text-6xl sm:text-7xl filter drop-shadow-lg opacity-90">🥘</span>
                            </div>
                        </div>

                        {/* Badge Bottom Left */}
                        <div className="absolute -bottom-4 left-2 sm:-bottom-6 sm:left-4 md:-left-6 bg-white rounded-2xl shadow-xl p-4 sm:p-5 border border-border z-20 flex flex-col items-center justify-center min-w-[110px] sm:min-w-[130px]">
                            <span className="text-3xl sm:text-4xl font-serif font-black text-red leading-none mb-1">15+</span>
                            <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-muted text-center leading-tight">Years Of<br />Mastery</span>
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
};

export default AboutStrip;
