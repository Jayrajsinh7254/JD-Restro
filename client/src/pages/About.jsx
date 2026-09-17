import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const About = () => {
    return (
        <div className="pt-24 min-h-screen bg-cream2 pb-24">
            {/* Header */}
            <section className="py-16 md:py-24 text-center bg-dark text-white relative overflow-hidden bg-radial-glow">
                <div className="container-wide relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="eyebrow-tag border-white/20 text-cream2 mb-6">Our Story</span>
                        <h1 className="h1-fluid mb-6">About Drizzle</h1>
                        <p className="body-fluid text-white/70 max-w-2xl mx-auto">
                            A journey of passion, taste, and a commitment to culinary excellence since 2018.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Story Section */}
            <section className="section-padding">
                <div className="container-wide">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">

                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="relative rounded-2xl overflow-hidden shadow-2xl isolate">
                                <img
                                    src="https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?q=80&w=800&auto=format&fit=crop"
                                    alt="Head Chef"
                                    className="w-full h-auto object-cover"
                                />
                                <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-dark/90 to-transparent">
                                    <p className="font-serif italic text-white text-xl border-l-[3px] border-red pl-4">
                                        "Food is our common ground, a universal experience."
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            <span className="text-red font-serif font-bold text-lg mb-2 block">Our Heritage</span>
                            <h2 className="h2-fluid text-dark mb-6">From a small kitchen dream to a dining destination.</h2>
                            <div className="space-y-6 text-muted font-sans leading-relaxed">
                                <p>
                                    Founded by Chef Marcus Thorne in 2018, Drizzle was born out of a simple desire: to create a space where food is celebrated, not just consumed. What started as an intimate 20-seat bistro has blossomed into a beloved gastronomic hub in the heart of the city.
                                </p>
                                <p>
                                    Our philosophy is deeply rooted in respect for ingredients. We partner directly with local farmers, artisanal producers, and sustainable fisheries to source the absolute best of what each season offers. This direct relationship ensures that every plate we serve tells a story of the land and sea.
                                </p>
                                <p>
                                    But beyond the food, Drizzle is about the atmosphere. It's the warmth of the greeting when you walk in, the attentive yet unobtrusive service, and the feeling that you are a guest in our home.
                                </p>
                            </div>
                        </motion.div>

                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="section-padding bg-dark text-white text-center">
                <div className="container-wide">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="h2-fluid mb-16"
                    >
                        Our Core Values
                    </motion.h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="dark-card p-10 flex flex-col items-center"
                        >
                            <span className="text-5xl mb-6">🌱</span>
                            <h3 className="h3-fluid text-cream2 mb-4">Sustainability</h3>
                            <p className="font-sans text-white/60 text-sm">We are committed to eco-friendly practices, minimizing waste, and sourcing responsibly to protect our environment.</p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="dark-card p-10 flex flex-col items-center border-[1.5px] border-red/30 shadow-glow bg-dark/50"
                        >
                            <span className="text-5xl mb-6">🤝</span>
                            <h3 className="h3-fluid text-cream2 mb-4">Community</h3>
                            <p className="font-sans text-white/60 text-sm">We believe in giving back. From local charity dinners to supporting food banks, community is at our core.</p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="dark-card p-10 flex flex-col items-center"
                        >
                            <span className="text-5xl mb-6">🔪</span>
                            <h3 className="h3-fluid text-cream2 mb-4">Craftsmanship</h3>
                            <p className="font-sans text-white/60 text-sm">Every element on the plate is there for a reason. We honor traditional techniques while embracing modern innovation.</p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 text-center">
                <div className="container-wide">
                    <h2 className="h2-fluid mb-8 max-w-3xl mx-auto">Ready to experience Drizzle for yourself?</h2>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link to="/reservations" className="btn-primary">Book a Table</Link>
                        <Link to="/contact" className="btn-outline">Contact Us</Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
