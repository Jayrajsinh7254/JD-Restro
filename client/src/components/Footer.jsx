import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Linkedin, ArrowRight, ShieldCheck } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-dark text-white bg-radial-glow py-[clamp(40px,6vw,64px)] px-[clamp(20px,5vw,64px)]">
            <div className="container-wide">

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.6fr] gap-12 lg:gap-24 mb-16">

                    {/* Left Column: Brand & Socials */}
                    <div className="flex flex-col items-start">
                        <Link to="/" className="text-[68px] font-serif font-black tracking-tighter text-cream2 leading-none mb-4 inline-flex items-baseline">
                            Drizzle<span className="text-red text-6xl">.</span>
                        </Link>
                        <p className="font-serif italic text-muted text-xl mb-8 border-l border-red pl-4">
                            "Made with Love, Served with Joy."
                        </p>

                        <p className="font-sans text-sm text-cream3 mb-4 uppercase tracking-widest">
                            Social Media
                        </p>
                        <div className="flex gap-3">
                            <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-red hover:border-red transition-colors duration-300">
                                <Facebook size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-red hover:border-red transition-colors duration-300">
                                <Instagram size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-red hover:border-red transition-colors duration-300">
                                <Twitter size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-red hover:border-red transition-colors duration-300">
                                <Linkedin size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Right Column: Links & Newsletter */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">

                        {/* Col 1: Navigate */}
                        <div>
                            <h4 className="font-serif font-bold text-xl mb-6 text-cream2">Navigate</h4>
                            <ul className="space-y-4">
                                <li><Link to="/" className="text-white/60 hover:text-red transition-colors font-sans block">Home</Link></li>
                                <li><Link to="/about" className="text-white/60 hover:text-red transition-colors font-sans block">About Us</Link></li>
                                <li><Link to="/menu" className="text-white/60 hover:text-red transition-colors font-sans block">Our Menu</Link></li>
                                <li><Link to="/gallery" className="text-white/60 hover:text-red transition-colors font-sans block">Gallery</Link></li>
                                <li><Link to="/contact" className="text-white/60 hover:text-red transition-colors font-sans block">Contact</Link></li>
                            </ul>
                        </div>

                        {/* Col 2: Services */}
                        <div>
                            <h4 className="font-serif font-bold text-xl mb-6 text-cream2">Services</h4>
                            <ul className="space-y-4">
                                <li><Link to="/reservations" className="text-white/60 hover:text-red transition-colors font-sans block">Book a Table</Link></li>
                                <li><Link to="/order" className="text-white/60 hover:text-red transition-colors font-sans block">Order Online</Link></li>
                                <li><Link to="/loyalty" className="text-white/60 hover:text-red transition-colors font-sans block">Loyalty Program</Link></li>
                                <li><Link to="/blog" className="text-white/60 hover:text-red transition-colors font-sans block">Journal & Stories</Link></li>
                                <li><Link to="/admin/login" className="text-red hover:underline transition-colors font-sans flex items-center gap-1.5 font-bold"><ShieldCheck size={14} /> Admin Portal</Link></li>
                            </ul>
                        </div>

                        {/* Col 3: Newsletter */}
                        <div className="md:col-span-2 lg:col-span-1">
                            <h4 className="font-serif font-bold text-xl mb-4 text-cream2 leading-snug">Get tasty news straight to your inbox.</h4>
                            <p className="text-white/50 font-sans text-sm mb-6">
                                Subscribe to our newsletter and get a 10% discount on your next visit.
                            </p>

                            <form className="flex">
                                <input
                                    type="email"
                                    placeholder="Your email address"
                                    className="bg-white/5 border border-white/10 rounded-l-md px-4 py-3 text-white font-sans focus:outline-none focus:border-red w-full"
                                    required
                                />
                                <button
                                    type="submit"
                                    className="bg-red hover:bg-red-hover transition-colors px-4 rounded-r-md flex items-center justify-center -ml-[1px]"
                                >
                                    <ArrowRight size={20} />
                                </button>
                            </form>
                        </div>

                    </div>

                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-white/40 font-sans text-sm">
                        All rights reserved &copy; Drizzle {new Date().getFullYear()}
                    </p>
                    <div className="flex gap-6 text-white/40 font-sans text-sm items-center">
                        <Link to="/terms" className="hover:text-white transition-colors">Terms & Condition</Link>
                        <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link to="/admin/login" className="text-white/60 hover:text-red transition-colors flex items-center gap-1">
                            <ShieldCheck size={13} /> Admin
                        </Link>
                    </div>
                </div>

            </div>
        </footer>
    );
};

export default Footer;
