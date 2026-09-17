import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone, Clock } from 'lucide-react';

const Contact = () => {
    return (
        <div className="pt-24 min-h-screen bg-cream pb-24">
            {/* Header */}
            <section className="py-16 md:py-24 text-center bg-dark text-white relative overflow-hidden bg-radial-glow">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80"
                        alt="Background"
                        className="w-full h-full object-cover opacity-10 filter grayscale"
                    />
                </div>
                <div className="container-wide relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="eyebrow-tag border-white/20 text-cream2 mb-6">Get In Touch</span>
                        <h1 className="h1-fluid mb-6">Contact Us</h1>
                        <p className="body-fluid text-white/70 max-w-2xl mx-auto">
                            We'd love to hear from you. For private events, catering, or general inquiries, please drop us a line.
                        </p>
                    </motion.div>
                </div>
            </section>

            <section className="container-wide mt-16 md:mt-24">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">

                    {/* Left: Form */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <h2 className="h2-fluid text-dark mb-8">Send us a message</h2>
                        <form className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block font-sans text-sm font-bold text-brown mb-2 uppercase tracking-wide">Name</label>
                                    <input type="text" className="input-field bg-white/50 backdrop-blur-sm" placeholder="Your name" required />
                                </div>
                                <div>
                                    <label className="block font-sans text-sm font-bold text-brown mb-2 uppercase tracking-wide">Email</label>
                                    <input type="email" className="input-field bg-white/50 backdrop-blur-sm" placeholder="Your email" required />
                                </div>
                            </div>
                            <div>
                                <label className="block font-sans text-sm font-bold text-brown mb-2 uppercase tracking-wide">Subject</label>
                                <select className="input-field bg-white/50 backdrop-blur-sm" required>
                                    <option value="">Select a subject...</option>
                                    <option value="general">General Inquiry</option>
                                    <option value="private_event">Private Event</option>
                                    <option value="careers">Careers</option>
                                    <option value="feedback">Feedback</option>
                                </select>
                            </div>
                            <div>
                                <label className="block font-sans text-sm font-bold text-brown mb-2 uppercase tracking-wide">Message</label>
                                <textarea rows="6" className="input-field bg-white/50 backdrop-blur-sm resize-none rounded-xl" placeholder="How can we help you?" required></textarea>
                            </div>
                            <button type="submit" className="btn-primary py-4 px-10">Send Message</button>
                        </form>
                    </motion.div>

                    {/* Right: Info */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="flex flex-col justify-center"
                    >
                        <div className="dark-card p-10 lg:p-14 shadow-2xl relative overflow-hidden">
                            {/* Decorative map abstract background */}
                            <div className="absolute -bottom-20 -right-20 opacity-10 w-64 h-64 border-[40px] border-red rounded-full"></div>

                            <h3 className="h3-fluid text-cream2 mb-10 relative z-10">Visit Drizzle</h3>

                            <div className="space-y-8 relative z-10">
                                <div className="flex gap-5 items-start">
                                    <div className="bg-red/20 p-3 rounded-full text-red shrink-0"><MapPin size={24} /></div>
                                    <div>
                                        <p className="font-serif font-bold text-lg text-white mb-1">Our Location</p>
                                        <p className="font-sans text-white/70 leading-relaxed">123 Culinary Boulevard,<br />New York, NY 10001<br />United States</p>
                                    </div>
                                </div>

                                <div className="flex gap-5 items-start">
                                    <div className="bg-red/20 p-3 rounded-full text-red shrink-0"><Clock size={24} /></div>
                                    <div>
                                        <p className="font-serif font-bold text-lg text-white mb-1">Hours of Operation</p>
                                        <p className="font-sans text-white/70">Mon - Thu: 5:00 PM - 10:00 PM<br />Fri - Sat: 5:00 PM - 11:30 PM<br />Sun: 4:00 PM - 9:30 PM</p>
                                    </div>
                                </div>

                                <div className="flex gap-5 items-start">
                                    <div className="bg-red/20 p-3 rounded-full text-red shrink-0"><Phone size={24} /></div>
                                    <div>
                                        <p className="font-serif font-bold text-lg text-white mb-1">Contact Details</p>
                                        <p className="font-sans text-white/70">+1 (212) 555-0123<br />hello@drizzlerestaurant.com</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                </div>
            </section>
        </div>
    );
};

export default Contact;
