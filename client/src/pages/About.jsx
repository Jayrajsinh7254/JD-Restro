import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, Award, Heart, Leaf, UtensilsCrossed, Wine, Compass, ArrowRight, ShieldCheck } from 'lucide-react';

const STATS = [
    { value: '2018', label: 'Year Established', sub: 'Manhattan, NYC' },
    { value: '3 Stars', label: 'Michelin Guide Honor', sub: 'Excellence in Gastronomy' },
    { value: '100%', label: 'Seasonal & Organic', sub: 'Direct Farm-to-Table' },
    { value: '50K+', label: 'Delighted Guests', sub: 'From Around the World' }
];

const LEADERSHIP = [
    {
        name: 'Chef Marcus Thorne',
        role: 'Executive Chef & Founder',
        image: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?q=80&w=800&auto=format&fit=crop',
        bio: 'Trained in Paris and Tokyo, Chef Marcus synthesizes classical French gastronomy with modern Japanese balance.'
    },
    {
        name: 'Elena Rostova',
        role: 'Head Pastry Chef',
        image: 'https://images.unsplash.com/photo-1583394293214-28ded15ee548?q=80&w=800&auto=format&fit=crop',
        bio: 'Master of architectural desserts, blending rich Valrhona chocolates with rare botanical infusions.'
    },
    {
        name: 'Julien Laurent',
        role: 'Head Sommelier',
        image: 'https://images.unsplash.com/photo-1581299894007-aaa50297cf16?q=80&w=800&auto=format&fit=crop',
        bio: 'Curator of our 800+ bottle climate-controlled cellar, pairing biodynamic vintages with each course.'
    }
];

const About = () => {
    return (
        <div className="pt-20 sm:pt-24 min-h-screen bg-cream pb-16 sm:pb-24">
            {/* Hero Header */}
            <section className="py-12 sm:py-20 md:py-24 text-center bg-dark text-white relative overflow-hidden bg-radial-glow">
                <div className="container-wide relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <span className="eyebrow-tag border-white/20 text-cream2 mb-4 sm:mb-6">Our Heritage</span>
                        <h1 className="h1-fluid mb-4 sm:mb-6 text-cream">About Drizzle</h1>
                        <p className="body-fluid text-white/70 max-w-2xl mx-auto px-2">
                            A culinary journey born of relentless passion, timeless craftsmanship, and the belief that every meal should be a memorable celebration.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Quick Stats Strip */}
            <section className="bg-cream2 border-y border-border py-8 sm:py-12">
                <div className="container-wide">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 text-center">
                        {STATS.map((stat, i) => (
                            <div key={i} className="p-3 sm:p-4">
                                <p className="font-serif font-black text-3xl sm:text-4xl lg:text-5xl text-red mb-1">
                                    {stat.value}
                                </p>
                                <p className="font-serif font-bold text-sm sm:text-base text-dark">{stat.label}</p>
                                <p className="text-xs text-muted font-sans mt-0.5">{stat.sub}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Story & Philosophy Section */}
            <section className="py-12 sm:py-20">
                <div className="container-wide">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">

                        {/* Image Left */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="lg:col-span-5"
                        >
                            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-border">
                                <img
                                    src="https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?q=80&w=800&auto=format&fit=crop"
                                    alt="Drizzle Culinary Kitchen"
                                    className="w-full h-auto aspect-[4/5] object-cover"
                                />
                                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8 bg-gradient-to-t from-dark/95 via-dark/70 to-transparent">
                                    <p className="font-serif italic text-white text-base sm:text-lg border-l-2 border-red pl-3 leading-snug">
                                        "Food is our common ground, a universal experience that connects souls across tables."
                                    </p>
                                    <p className="text-xs text-white/60 font-sans uppercase tracking-widest mt-2 pl-3">
                                        — Marcus Thorne, Executive Chef
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Text Content Right */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.15 }}
                            className="lg:col-span-7 space-y-4 sm:space-y-6"
                        >
                            <div>
                                <span className="text-red font-serif font-bold text-base sm:text-lg block mb-1">Born in Manhattan</span>
                                <h2 className="h2-fluid text-dark text-2xl sm:text-3xl lg:text-4xl">
                                    From an intimate dream to an award-winning dining destination.
                                </h2>
                            </div>

                            <div className="space-y-4 text-muted font-sans text-sm sm:text-base leading-relaxed">
                                <p>
                                    Founded in 2018, Drizzle was envisioned as an antidote to hurried modern dining. We set out to build a sanctuary where ingredients are revered, hospitality is heartfelt, and every guest feels like an honored patron in our home.
                                </p>
                                <p>
                                    Our kitchen partners directly with biodynamic farms in upstate New York, day-boat fishermen along the Atlantic seaboard, and artisanal producers worldwide. By allowing seasonal micro-climates to dictate our rotating menus, we deliver flavors at their absolute peak of vibrancy.
                                </p>
                                <p>
                                    Every detail in our space—from the ambient amber lighting and custom acoustic zoning to our hand-thrown stoneware ceramics—is curated to immerse you in an unforgettable multisensory experience.
                                </p>
                            </div>

                            <div className="pt-4 flex flex-wrap items-center gap-4 sm:gap-6 border-t border-border">
                                <div className="flex items-center gap-2 text-xs font-bold text-brown uppercase tracking-wider">
                                    <Sparkles size={16} className="text-red" /> Sustainable Sourcing
                                </div>
                                <div className="flex items-center gap-2 text-xs font-bold text-brown uppercase tracking-wider">
                                    <Wine size={16} className="text-red" /> Curated Cellar
                                </div>
                                <div className="flex items-center gap-2 text-xs font-bold text-brown uppercase tracking-wider">
                                    <UtensilsCrossed size={16} className="text-red" /> Seasonal Menus
                                </div>
                            </div>
                        </motion.div>

                    </div>
                </div>
            </section>

            {/* Core Values Section */}
            <section className="py-12 sm:py-20 bg-dark text-white relative overflow-hidden bg-radial-glow">
                <div className="container-wide relative z-10">
                    <div className="text-center mb-10 sm:mb-16">
                        <span className="eyebrow-tag border-white/20 text-cream2 mb-3">Our Principles</span>
                        <h2 className="h2-fluid text-cream text-2xl sm:text-3xl lg:text-4xl">Guiding Philosophies</h2>
                        <p className="text-white/60 text-sm max-w-xl mx-auto mt-2">
                            The pillars that shape our kitchen craft and guest hospitality every single day.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="dark-card p-6 sm:p-8 rounded-2xl flex flex-col justify-between"
                        >
                            <div>
                                <div className="w-12 h-12 rounded-2xl bg-red/20 text-red flex items-center justify-center mb-5">
                                    <Leaf size={24} />
                                </div>
                                <h3 className="font-serif font-bold text-xl text-cream2 mb-2">Earth-First Stewardship</h3>
                                <p className="text-white/60 font-sans text-xs sm:text-sm leading-relaxed">
                                    We run a zero-waste vegetable program, compost 100% of organic trimmings, and only serve sustainably harvested seafood approved by ocean conservation funds.
                                </p>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="dark-card p-6 sm:p-8 rounded-2xl flex flex-col justify-between border-2 border-red/40 shadow-glow"
                        >
                            <div>
                                <div className="w-12 h-12 rounded-2xl bg-red text-white flex items-center justify-center mb-5 shadow-md">
                                    <Award size={24} />
                                </div>
                                <h3 className="font-serif font-bold text-xl text-cream2 mb-2">Uncompromising Craft</h3>
                                <p className="text-white/60 font-sans text-xs sm:text-sm leading-relaxed">
                                    From 48-hour demi-glace reductions to artisanal sourdough baked fresh daily at dawn, we never take shortcuts with culinary fundamentals.
                                </p>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="dark-card p-6 sm:p-8 rounded-2xl flex flex-col justify-between"
                        >
                            <div>
                                <div className="w-12 h-12 rounded-2xl bg-red/20 text-red flex items-center justify-center mb-5">
                                    <Heart size={24} />
                                </div>
                                <h3 className="font-serif font-bold text-xl text-cream2 mb-2">Warm, Genuine Care</h3>
                                <p className="text-white/60 font-sans text-xs sm:text-sm leading-relaxed">
                                    True fine dining should be inviting, never stiff. Our team is trained to anticipate your needs with warmth, humor, and gracious hospitality.
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Culinary Leadership Showcase */}
            <section className="py-12 sm:py-20">
                <div className="container-wide">
                    <div className="text-center mb-10 sm:mb-14">
                        <span className="eyebrow-tag border-border text-brown mb-3">Mastery</span>
                        <h2 className="h2-fluid text-dark text-2xl sm:text-3xl lg:text-4xl">Meet the Artisans</h2>
                        <p className="text-muted text-sm max-w-xl mx-auto mt-2">
                            The creative minds crafting every aroma, texture, and pour at Drizzle.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                        {LEADERSHIP.map((leader, idx) => (
                            <div
                                key={idx}
                                className="bg-white rounded-2xl sm:rounded-3xl overflow-hidden border border-border shadow-sm hover:shadow-card transition-all duration-300 flex flex-col justify-between"
                            >
                                <div>
                                    <div className="aspect-[4/3] overflow-hidden bg-dark/5">
                                        <img
                                            src={leader.image}
                                            alt={leader.name}
                                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                                        />
                                    </div>
                                    <div className="p-6">
                                        <span className="text-[11px] uppercase font-bold text-red tracking-wider block mb-1">
                                            {leader.role}
                                        </span>
                                        <h3 className="font-serif font-bold text-xl text-dark mb-3">{leader.name}</h3>
                                        <p className="font-sans text-muted text-xs sm:text-sm leading-relaxed">
                                            {leader.bio}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Call to Action Bar */}
            <section className="container-wide mt-6 sm:mt-12">
                <div className="bg-white border border-border rounded-2xl sm:rounded-3xl p-8 sm:p-12 lg:p-16 text-center shadow-card relative overflow-hidden">
                    <div className="max-w-2xl mx-auto space-y-6">
                        <span className="text-red font-serif font-bold text-lg block">Reserve Your Table</span>
                        <h2 className="h2-fluid text-dark text-2xl sm:text-3xl lg:text-4xl">
                            Ready to experience the culinary world of Drizzle?
                        </h2>
                        <p className="text-muted text-sm sm:text-base leading-relaxed">
                            Join us for an evening of unmatched flavors, rare vintage wines, and exceptional dining memories.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-2">
                            <Link to="/reservations" className="btn-primary w-full sm:w-auto py-3.5 px-8 rounded-xl text-xs font-bold">
                                Reserve a Table
                            </Link>
                            <Link to="/menu" className="btn-outline w-full sm:w-auto py-3.5 px-8 rounded-xl text-xs font-bold bg-white">
                                View Full Menu
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
