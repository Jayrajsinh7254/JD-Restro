import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const AboutStrip = () => {
    return (
        <section className="section-padding bg-cream">
            <div className="container-wide">
                <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] gap-12 lg:gap-20 items-center">

                    {/* Left Column */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8 }}
                        className="flex flex-col items-start"
                    >
                        <span className="eyebrow-tag mb-6">&uarr; Know About Us</span>

                        <h2 className="h2-fluid mb-6">
                            Blending tradition & innovation to create unforgettable dining experiences
                        </h2>

                        <p className="body-fluid text-muted mb-10 max-w-xl">
                            At Drizzle, we believe that great food is about more than just taste—it's about connection, memories, and the joy of sharing a meal with those you love. Our chefs carefully select the finest seasonal ingredients to craft dishes that honor timeless recipes while embracing modern culinary techniques.
                        </p>

                        <div className="flex flex-wrap gap-4 mb-12">
                            <Link to="/about" className="btn-primary">
                                Read Our Story
                            </Link>
                            <Link to="/menu" className="btn-outline">
                                View Menu
                            </Link>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="flex -space-x-4">
                                <img src="https://i.pravatar.cc/100?img=1" alt="Customer" className="w-12 h-12 rounded-full border-2 border-cream object-cover" />
                                <img src="https://i.pravatar.cc/100?img=2" alt="Customer" className="w-12 h-12 rounded-full border-2 border-cream object-cover" />
                                <img src="https://i.pravatar.cc/100?img=3" alt="Customer" className="w-12 h-12 rounded-full border-2 border-cream object-cover" />
                            </div>
                            <div className="text-sm">
                                <p className="font-bold text-dark">50,000+ Satisfied Customers</p>
                                <div className="text-yellow-500 text-xs">★★★★★</div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Column */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative"
                    >
                        {/* Floating Tag */}
                        <div className="absolute -top-6 -right-6 lg:-right-10 bg-white shadow-card rounded-full px-6 py-3 z-20 hidden md:block animate-bounce" style={{ animationDuration: '3s' }}>
                            <p className="text-xs font-medium text-dark flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-red"></span>
                                Experience the perfect harmony of heritage
                            </p>
                        </div>

                        {/* Main Image */}
                        <div className="relative rounded-[12px] overflow-hidden shadow-2xl w-full" style={{ aspectRatio: '4/3' }}>
                            <div className="absolute inset-0 bg-gradient-to-br from-orange-400/20 to-red/20 mix-blend-multiply z-10"></div>
                            <img
                                src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                                alt="Chef cooking"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 flex items-center justify-center z-10">
                                <span className="text-7xl filter drop-shadow-lg opacity-90">🥘</span>
                            </div>
                        </div>

                        {/* Badge Bottom Right */}
                        <div className="absolute -bottom-8 -left-4 md:-left-8 lg:-left-12 bg-white rounded-xl shadow-card p-6 border border-border z-20 flex flex-col items-center justify-center w-32 h-32 md:w-40 md:h-40">
                            <span className="text-4xl md:text-5xl font-serif font-black text-red mb-1">15+</span>
                            <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-muted text-center leading-tight">Years<br />Excellence</span>
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
};

export default AboutStrip;
