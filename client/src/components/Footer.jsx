import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Linkedin, ArrowRight, ShieldCheck, MapPin, Phone, Mail } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-dark text-white bg-radial-glow py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-12 border-t border-white/10">
            <div className="container-wide">

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.6fr] gap-10 lg:gap-20 mb-12 sm:mb-16">

                    {/* Left Column: Brand & Socials */}
                    <div className="flex flex-col items-start">
                        <Link to="/" className="text-3xl sm:text-5xl lg:text-6xl font-serif font-black tracking-tighter text-cream2 leading-none mb-4 inline-flex items-baseline">
                            Drizzle<span className="text-red">.</span>
                        </Link>
                        <p className="font-serif italic text-white/70 text-base sm:text-lg mb-6 border-l-2 border-red pl-3 sm:pl-4 max-w-md">
                            "Made with Love, Served with Joy &mdash; Haute Cuisine & Sommelier Experience."
                        </p>

                        <div className="space-y-2 text-xs sm:text-sm text-white/60 mb-6 font-sans">
                            <p className="flex items-center gap-2">
                                <MapPin size={14} className="text-red shrink-0" /> 123 Culinary Boulevard, New York, NY 10001
                            </p>
                            <p className="flex items-center gap-2">
                                <Phone size={14} className="text-red shrink-0" /> +1 (212) 555-0123
                            </p>
                            <p className="flex items-center gap-2">
                                <Mail size={14} className="text-red shrink-0" /> reservations@drizzle.com
                            </p>
                        </div>

                        <p className="font-sans text-[11px] text-cream3 mb-3 uppercase tracking-widest font-bold">
                            Connect With Us
                        </p>
                        <div className="flex gap-2.5">
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center hover:bg-red hover:border-red transition-all duration-300">
                                <Facebook size={16} />
                            </a>
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center hover:bg-red hover:border-red transition-all duration-300">
                                <Instagram size={16} />
                            </a>
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center hover:bg-red hover:border-red transition-all duration-300">
                                <Twitter size={16} />
                            </a>
                            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center hover:bg-red hover:border-red transition-all duration-300">
                                <Linkedin size={16} />
                            </a>
                        </div>
                    </div>

                    {/* Right Column: Navigation, Services & Newsletter */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">

                        {/* Col 1: Explore */}
                        <div>
                            <h4 className="font-serif font-bold text-lg mb-4 sm:mb-6 text-cream2">Explore</h4>
                            <ul className="space-y-3 text-sm">
                                <li><Link to="/" className="text-white/60 hover:text-red transition-colors font-sans block">Home</Link></li>
                                <li><Link to="/about" className="text-white/60 hover:text-red transition-colors font-sans block">Our Story</Link></li>
                                <li><Link to="/menu" className="text-white/60 hover:text-red transition-colors font-sans block">Seasonal Menu</Link></li>
                                <li><Link to="/gallery" className="text-white/60 hover:text-red transition-colors font-sans block">Atmosphere & Gallery</Link></li>
                                <li><Link to="/contact" className="text-white/60 hover:text-red transition-colors font-sans block">Contact & Inquiries</Link></li>
                            </ul>
                        </div>

                        {/* Col 2: Dining & Hospitality */}
                        <div>
                            <h4 className="font-serif font-bold text-lg mb-4 sm:mb-6 text-cream2">Hospitality</h4>
                            <ul className="space-y-3 text-sm">
                                <li><Link to="/reservations" className="text-white/60 hover:text-red transition-colors font-sans block">Reserve a Table</Link></li>
                                <li><Link to="/order" className="text-white/60 hover:text-red transition-colors font-sans block">Order Online & Takeout</Link></li>
                                <li><Link to="/loyalty" className="text-white/60 hover:text-red transition-colors font-sans block">Drizzle Loyalty Club</Link></li>
                                <li><Link to="/blog" className="text-white/60 hover:text-red transition-colors font-sans block">Culinary Journal</Link></li>
                                <li>
                                    <Link to="/admin/login" className="text-red/90 hover:text-white transition-colors font-sans flex items-center gap-1.5 font-bold pt-1">
                                        <ShieldCheck size={14} className="text-red" /> Staff Portal
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Col 3: Newsletter */}
                        <div className="sm:col-span-2 lg:col-span-1">
                            <h4 className="font-serif font-bold text-lg mb-3 text-cream2 leading-snug">The Chef's Gazette</h4>
                            <p className="text-white/60 font-sans text-xs sm:text-sm mb-4 leading-relaxed">
                                Subscribe for private invitation tasting events, sommelier releases, and special seasonal offerings.
                            </p>

                            <form onSubmit={(e) => { e.preventDefault(); alert('Thank you for subscribing to Drizzle Gazette!'); }} className="flex flex-col sm:flex-row gap-2">
                                <input
                                    type="email"
                                    placeholder="Your email address"
                                    className="bg-white/10 border border-white/15 rounded-xl px-4 py-3 text-xs sm:text-sm text-white font-sans focus:outline-none focus:border-red w-full placeholder:text-white/40"
                                    required
                                />
                                <button
                                    type="submit"
                                    className="btn-primary py-3 px-5 rounded-xl text-xs font-bold uppercase tracking-wider shrink-0 flex items-center justify-center gap-1.5 shadow-md shadow-red/30"
                                >
                                    <span>Join</span> <ArrowRight size={14} />
                                </button>
                            </form>
                        </div>

                    </div>

                </div>

                {/* Bottom Bar */}
                <div className="pt-6 sm:pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
                    <p className="text-white/40 font-sans text-xs">
                        &copy; {new Date().getFullYear()} Drizzle Haute Cuisine. All rights reserved.
                    </p>
                    <div className="flex flex-wrap justify-center sm:justify-end gap-5 text-white/50 font-sans text-xs items-center">
                        <Link to="/about" className="hover:text-white transition-colors">Terms of Hospitality</Link>
                        <Link to="/contact" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link to="/admin/login" className="text-white/70 hover:text-red transition-colors flex items-center gap-1 font-bold">
                            <ShieldCheck size={12} className="text-red" /> Admin Access
                        </Link>
                    </div>
                </div>

            </div>
        </footer>
    );
};

export default Footer;
