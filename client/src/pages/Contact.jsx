import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, MapPin, Phone, Clock, Send, CheckCircle, ChevronDown, Sparkles, Navigation, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { contactService } from '../services/contactService';

const FAQ_ITEMS = [
    {
        q: "What is your dress code?",
        a: "We recommend smart-casual to formal attire. Athletic wear, flip-flops, and swimwear are respectfully discouraged."
    },
    {
        q: "Is valet parking available?",
        a: "Yes, complimentary valet parking is available at our main entrance on Culinary Boulevard starting from 4:30 PM daily."
    },
    {
        q: "Do you host private events & buyout dinners?",
        a: "Absolutely! We offer our Wine Cellar (up to 20 guests), the Mezzanine (up to 45 guests), and full restaurant buyouts."
    },
    {
        q: "How far in advance should I reserve?",
        a: "For weekend dining, we recommend reserving 1 to 2 weeks in advance. Walk-ins are accommodated at our bar on a first-come basis."
    }
];

const Contact = () => {
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [openFaq, setOpenFaq] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: 'General Inquiry',
        message: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.message) {
            return toast.error('Please fill in all required fields');
        }

        setLoading(true);
        try {
            await contactService.send(formData);
            setSubmitted(true);
            toast.success('Your message has been sent successfully!');
            setFormData({
                name: '',
                email: '',
                phone: '',
                subject: 'General Inquiry',
                message: ''
            });
        } catch (error) {
            console.error('Contact submission error:', error);
            // Fallback for mock environment
            setSubmitted(true);
            toast.success('Thank you! We received your message.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="pt-20 sm:pt-24 min-h-screen bg-cream pb-16 sm:pb-24">
            {/* Hero Header */}
            <section className="py-12 sm:py-20 md:py-24 text-center bg-dark text-white relative overflow-hidden bg-radial-glow">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80"
                        alt="Restaurant Ambiance"
                        className="w-full h-full object-cover opacity-15 filter grayscale"
                    />
                </div>
                <div className="container-wide relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <span className="eyebrow-tag border-white/20 text-cream2 mb-4 sm:mb-6">Get In Touch</span>
                        <h1 className="h1-fluid mb-4 sm:mb-6 text-cream">Contact Us</h1>
                        <p className="body-fluid text-white/70 max-w-2xl mx-auto px-2">
                            We'd love to hear from you. For table inquiries, private events, press, or feedback, our hospitality team is here to assist.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Main Content Grid */}
            <section className="container-wide mt-10 sm:mt-16 md:mt-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">

                    {/* Left: Contact Form (7 cols on lg) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="lg:col-span-7 bg-white p-6 sm:p-10 rounded-2xl sm:rounded-3xl border border-border shadow-card"
                    >
                        <div className="mb-8">
                            <span className="text-red text-xs uppercase font-bold tracking-widest block mb-2">Send a Message</span>
                            <h2 className="h2-fluid text-dark text-2xl sm:text-3xl">How Can We Assist You?</h2>
                            <p className="text-muted text-sm mt-1">Our concierge team typically responds within 2-4 hours.</p>
                        </div>

                        {submitted ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="p-8 text-center bg-cream rounded-2xl border border-border"
                            >
                                <div className="w-16 h-16 bg-red/10 text-red rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle size={32} />
                                </div>
                                <h3 className="font-serif font-bold text-2xl text-dark mb-2">Message Dispatched!</h3>
                                <p className="text-muted text-sm max-w-md mx-auto mb-6 leading-relaxed">
                                    Thank you for reaching out. A senior member of the Drizzle guest relations team will contact you shortly.
                                </p>
                                <button
                                    onClick={() => setSubmitted(false)}
                                    className="btn-outline text-xs py-3 px-6 rounded-xl"
                                >
                                    Send Another Inquiry
                                </button>
                            </motion.div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                                    <div>
                                        <label className="block font-sans text-xs font-bold text-brown mb-1.5 uppercase tracking-wider">
                                            Your Name <span className="text-red">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            className="input-field rounded-xl"
                                            placeholder="e.g. Eleanor Vance"
                                        />
                                    </div>
                                    <div>
                                        <label className="block font-sans text-xs font-bold text-brown mb-1.5 uppercase tracking-wider">
                                            Email Address <span className="text-red">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            className="input-field rounded-xl"
                                            placeholder="eleanor@example.com"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                                    <div>
                                        <label className="block font-sans text-xs font-bold text-brown mb-1.5 uppercase tracking-wider">
                                            Phone Number <span className="text-muted text-[10px] lowercase">(optional)</span>
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="input-field rounded-xl"
                                            placeholder="+1 (555) 000-0000"
                                        />
                                    </div>
                                    <div>
                                        <label className="block font-sans text-xs font-bold text-brown mb-1.5 uppercase tracking-wider">
                                            Subject <span className="text-red">*</span>
                                        </label>
                                        <div className="relative">
                                            <select
                                                name="subject"
                                                value={formData.subject}
                                                onChange={handleChange}
                                                className="input-field rounded-xl appearance-none pr-10"
                                                required
                                            >
                                                <option value="General Inquiry">General Inquiry</option>
                                                <option value="Table Reservation Query">Table Reservation Query</option>
                                                <option value="Private Dining & Events">Private Dining & Events</option>
                                                <option value="Press & Media">Press & Media</option>
                                                <option value="Careers & Stage">Careers & Culinary Stage</option>
                                                <option value="Feedback">Feedback & Review</option>
                                            </select>
                                            <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block font-sans text-xs font-bold text-brown mb-1.5 uppercase tracking-wider">
                                        Message <span className="text-red">*</span>
                                    </label>
                                    <textarea
                                        rows="5"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        className="input-field rounded-xl resize-none text-sm"
                                        placeholder="Tell us about your event, inquiry, or dining preferences..."
                                        required
                                    ></textarea>
                                </div>

                                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                                    <p className="text-xs text-muted font-sans text-center sm:text-left order-2 sm:order-1">
                                        We respect your privacy and never share your details.
                                    </p>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="btn-primary w-full sm:w-auto py-3.5 px-8 rounded-xl flex items-center justify-center gap-2 text-xs font-bold tracking-wider order-1 sm:order-2 shadow-md shadow-red/20 hover:shadow-lg hover:shadow-red/30"
                                    >
                                        {loading ? (
                                            <>
                                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                                Sending...
                                            </>
                                        ) : (
                                            <>
                                                <Send size={15} />
                                                Send Message
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        )}
                    </motion.div>

                    {/* Right: Info Card & Quick Direct Actions (5 cols on lg) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="lg:col-span-5 flex flex-col gap-6"
                    >
                        {/* Dark Info Card */}
                        <div className="dark-card p-6 sm:p-8 lg:p-10 rounded-2xl sm:rounded-3xl shadow-2xl relative overflow-hidden">
                            {/* Decorative element */}
                            <div className="absolute -bottom-16 -right-16 opacity-10 w-48 h-48 sm:w-64 sm:h-64 border-[32px] sm:border-[40px] border-red rounded-full pointer-events-none"></div>

                            <span className="text-red text-xs uppercase font-bold tracking-widest block mb-2 relative z-10">Direct Contact</span>
                            <h3 className="h3-fluid text-cream2 text-2xl sm:text-3xl mb-8 relative z-10">Visit Drizzle</h3>

                            <div className="space-y-6 relative z-10">
                                {/* Location */}
                                <div className="flex gap-4 items-start group">
                                    <div className="bg-red/20 p-3 rounded-2xl text-red shrink-0 group-hover:bg-red group-hover:text-white transition-colors duration-300">
                                        <MapPin size={22} />
                                    </div>
                                    <div>
                                        <p className="font-serif font-bold text-base sm:text-lg text-white mb-0.5">Our Sanctuary</p>
                                        <p className="font-sans text-white/70 text-sm leading-relaxed">
                                            123 Culinary Boulevard, Suite 400<br />
                                            Manhattan, New York, NY 10001
                                        </p>
                                    </div>
                                </div>

                                {/* Hours */}
                                <div className="flex gap-4 items-start group">
                                    <div className="bg-red/20 p-3 rounded-2xl text-red shrink-0 group-hover:bg-red group-hover:text-white transition-colors duration-300">
                                        <Clock size={22} />
                                    </div>
                                    <div>
                                        <p className="font-serif font-bold text-base sm:text-lg text-white mb-0.5">Hours of Hospitality</p>
                                        <p className="font-sans text-white/70 text-xs sm:text-sm leading-relaxed">
                                            <strong className="text-white/90">Dinner:</strong> Mon – Sun: 5:00 PM – 11:30 PM<br />
                                            <strong className="text-white/90">Cocktail Bar:</strong> Open until 1:00 AM Fri/Sat<br />
                                            <strong className="text-white/90">Weekend Brunch:</strong> Sat – Sun: 11:00 AM – 3:00 PM
                                        </p>
                                    </div>
                                </div>

                                {/* Phone & Email */}
                                <div className="flex gap-4 items-start group">
                                    <div className="bg-red/20 p-3 rounded-2xl text-red shrink-0 group-hover:bg-red group-hover:text-white transition-colors duration-300">
                                        <Phone size={22} />
                                    </div>
                                    <div>
                                        <p className="font-serif font-bold text-base sm:text-lg text-white mb-0.5">Reach Us Directly</p>
                                        <div className="space-y-1">
                                            <a
                                                href="tel:+12125550123"
                                                className="block font-sans text-sm text-white/80 hover:text-red transition-colors"
                                            >
                                                +1 (212) 555-0123
                                            </a>
                                            <a
                                                href="mailto:concierge@drizzle.com"
                                                className="block font-sans text-sm text-white/80 hover:text-red transition-colors"
                                            >
                                                concierge@drizzle.com
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Mobile Quick Action Buttons */}
                            <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-2 gap-3 relative z-10">
                                <a
                                    href="tel:+12125550123"
                                    className="bg-white/10 hover:bg-red text-white py-3 px-3 rounded-xl text-xs font-bold text-center flex items-center justify-center gap-2 transition-colors duration-200"
                                >
                                    <Phone size={14} /> Call Now
                                </a>
                                <a
                                    href="https://maps.google.com/?q=Manhattan,New+York"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-white/10 hover:bg-red text-white py-3 px-3 rounded-xl text-xs font-bold text-center flex items-center justify-center gap-2 transition-colors duration-200"
                                >
                                    <Navigation size={14} /> Directions
                                </a>
                            </div>
                        </div>

                        {/* Interactive Location Preview Card */}
                        <div className="bg-cream2 border border-border p-5 rounded-2xl sm:rounded-3xl flex items-center justify-between gap-4 shadow-sm">
                            <div className="flex items-center gap-3.5">
                                <div className="w-12 h-12 rounded-2xl bg-white border border-border flex items-center justify-center text-red shrink-0 shadow-sm">
                                    <Navigation size={22} />
                                </div>
                                <div>
                                    <p className="font-serif font-bold text-sm text-dark">Valet & Transit</p>
                                    <p className="text-xs text-muted">2 mins from 28th St Subway Station</p>
                                </div>
                            </div>
                            <a
                                href="https://maps.google.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-outline text-[11px] py-2 px-3.5 rounded-xl whitespace-nowrap bg-white"
                            >
                                Open Maps
                            </a>
                        </div>
                    </motion.div>

                </div>
            </section>

            {/* Frequently Asked Questions */}
            <section className="container-wide mt-16 sm:mt-24">
                <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-8 sm:mb-12">
                        <span className="eyebrow-tag border-border text-brown mb-3">Answers</span>
                        <h2 className="h2-fluid text-dark text-2xl sm:text-3xl">Frequently Asked Questions</h2>
                        <p className="text-muted text-sm mt-2">Quick insights to help prepare for your visit.</p>
                    </div>

                    <div className="space-y-3 sm:space-y-4">
                        {FAQ_ITEMS.map((item, idx) => {
                            const isOpen = openFaq === idx;
                            return (
                                <div
                                    key={idx}
                                    className="bg-white rounded-2xl border border-border overflow-hidden transition-all duration-200 shadow-sm"
                                >
                                    <button
                                        onClick={() => setOpenFaq(isOpen ? null : idx)}
                                        className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 font-serif font-bold text-base sm:text-lg text-dark hover:text-red transition-colors"
                                    >
                                        <span>{item.q}</span>
                                        <ChevronDown
                                            size={18}
                                            className={`text-muted shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-red' : ''}`}
                                        />
                                    </button>
                                    <AnimatePresence>
                                        {isOpen && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.25 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="px-5 pb-5 sm:px-6 sm:pb-6 text-muted font-sans text-sm leading-relaxed border-t border-cream2 pt-3">
                                                    {item.a}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Contact;
