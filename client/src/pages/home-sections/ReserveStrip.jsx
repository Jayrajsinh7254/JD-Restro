import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CalendarDays, ArrowRight, Sparkles } from 'lucide-react';

const ReserveStrip = () => {
    return (
        <section className="bg-cream border-t border-b border-[#e2d4c4]/60 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">

                {/* Left: Text Content */}
                <div className="p-6 sm:p-10 md:p-14 lg:p-16 xl:p-20 flex flex-col justify-center items-start border-b lg:border-b-0 lg:border-r border-[#e2d4c4]">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="w-full max-w-lg"
                    >
                        <span className="eyebrow-tag mb-4 sm:mb-6 inline-flex items-center gap-1.5">
                            <Sparkles size={12} className="text-red" /> Bespoke Dining Reservations
                        </span>

                        <h2 className="h2-fluid mb-4 sm:mb-6 text-dark leading-tight">
                            Reserve your spot for an unforgettable evening
                        </h2>

                        <p className="body-fluid text-muted mb-8 sm:mb-10 leading-relaxed">
                            Whether it's an intimate candlelit dinner for two, a family milestone, or a private corporate gathering, we ensure every detail is tailored to perfection.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                            <Link to="/reservations" className="btn-primary w-full sm:w-auto text-center rounded-xl shadow-md shadow-red/20">
                                Reserve Your Table <ArrowRight size={14} />
                            </Link>
                            <Link to="/contact" className="btn-outline w-full sm:w-auto text-center rounded-xl bg-white">
                                Private Events Inquiries
                            </Link>
                        </div>
                    </motion.div>
                </div>

                {/* Right: Photo & Sensory Grid */}
                <div className="grid grid-cols-2 aspect-square sm:aspect-[16/9] lg:aspect-auto h-full min-h-[260px] sm:min-h-[340px]">
                    {/* Top Left */}
                    <div className="relative group overflow-hidden bg-gradient-to-br from-[#2c150b] to-[#1e0e06] flex items-center justify-center p-4">
                        <span className="text-5xl sm:text-7xl lg:text-8xl filter drop-shadow-2xl opacity-75 group-hover:scale-110 transition-transform duration-500">🍷</span>
                        <span className="absolute bottom-3 left-3 text-[10px] uppercase font-bold text-white/60 tracking-widest hidden sm:block">Fine Vintages</span>
                    </div>

                    {/* Top Right */}
                    <div className="relative group overflow-hidden flex items-center justify-center border-l border-b border-white/10">
                        <img
                            src="https://images.unsplash.com/photo-1544148103-0773bf10d330?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                            alt="Dining Room"
                            className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-dark/40"></div>
                        <span className="text-4xl sm:text-6xl lg:text-7xl relative z-10 filter drop-shadow-2xl">👨‍👩‍👧</span>
                        <span className="absolute bottom-3 left-3 text-[10px] uppercase font-bold text-white/80 tracking-widest relative z-10 hidden sm:block">Intimate Ambiance</span>
                    </div>

                    {/* Bottom Left */}
                    <div className="relative group overflow-hidden flex items-center justify-center border-t border-r border-white/10">
                        <img
                            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                            alt="Cheers"
                            className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-dark/40"></div>
                        <span className="text-4xl sm:text-6xl lg:text-7xl relative z-10 filter drop-shadow-2xl">🥂</span>
                        <span className="absolute bottom-3 left-3 text-[10px] uppercase font-bold text-white/80 tracking-widest relative z-10 hidden sm:block">Celebrations</span>
                    </div>

                    {/* Bottom Right */}
                    <div className="relative group overflow-hidden bg-gradient-to-tr from-[#3a1a0d] to-[#1e0e06] flex items-center justify-center p-4">
                        <span className="text-5xl sm:text-7xl lg:text-8xl filter drop-shadow-2xl opacity-75 group-hover:scale-110 transition-transform duration-500">🍝</span>
                        <span className="absolute bottom-3 left-3 text-[10px] uppercase font-bold text-white/60 tracking-widest hidden sm:block">Artisanal Pasta</span>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default ReserveStrip;
