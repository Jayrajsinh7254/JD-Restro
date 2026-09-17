import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, Users, Phone, Mail, MapPin, Sparkles, Check, Loader2, Heart, Award } from 'lucide-react';
import { reservationService } from '../services/reservationService';
import toast from 'react-hot-toast';

const Reservations = () => {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [confirmedBooking, setConfirmedBooking] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        date: '',
        time: '19:00',
        guests: 2,
        occasion: 'None',
        specialRequests: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.phone || !formData.date || !formData.time) {
            return toast.error('Please fill in all required fields');
        }

        setLoading(true);
        try {
            const parts = formData.name.trim().split(' ');
            const firstName = parts[0] || 'Guest';
            const lastName = parts.slice(1).join(' ') || 'Patron';

            const payload = {
                firstName,
                lastName,
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                date: formData.date,
                time: formData.time,
                partySize: parseInt(formData.guests, 10) || 2,
                occasion: formData.occasion,
                specialRequests: formData.specialRequests
            };

            const response = await reservationService.create(payload);
            if (response.success || response.data) {
                setConfirmedBooking(response.data || payload);
                setSuccess(true);
                
                // Broadcast instant live synchronization to admin tabs
                try {
                    const channel = new BroadcastChannel('drizzle_live_sync');
                    channel.postMessage({ type: 'NEW_RESERVATION', data: response.data || payload });
                    channel.close();
                } catch (e) {
                    // Fallback for environments without BroadcastChannel
                }

                toast.success('Table reservation confirmed! We look forward to hosting you.');
                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    date: '',
                    time: '19:00',
                    guests: 2,
                    occasion: 'None',
                    specialRequests: ''
                });
            }
        } catch (err) {
            console.error('Reservation error:', err);
            toast.error(err.response?.data?.message || 'Failed to submit reservation. Please check details.');
        } finally {
            setLoading(false);
        }
    };

    const formatDateText = (d) => {
        if (!d) return 'Today';
        try {
            if (typeof d === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d.trim())) {
                const [year, month, day] = d.trim().split('-').map(Number);
                const dateObj = new Date(year, month - 1, day);
                return dateObj.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
            }
            return new Date(d).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
        } catch (e) {
            return String(d);
        }
    };

    return (
        <div className="pt-20 min-h-screen bg-[#fdf8f2] pb-28">
            {/* Header */}
            <section className="py-20 md:py-28 text-center bg-[#1a0e06] text-white relative overflow-hidden bg-radial-glow">
                <div className="container-wide relative z-10 px-4 sm:px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="max-w-3xl mx-auto"
                    >
                        <span className="eyebrow-tag border-white/20 text-[#f5ede0] mb-6 inline-flex items-center gap-2">
                            <Sparkles size={13} className="text-red" /> Bespoke Table Hospitality
                        </span>
                        <h1 className="h1-fluid mb-6 text-[#fdf8f2]">Reserve Your Table</h1>
                        <p className="body-fluid text-white/70 max-w-2xl mx-auto leading-relaxed">
                            Experience exquisite seasonal tasting menus and sommelier pairings. We recommend reserving in advance for our candlelit dining rooms and chef's counter.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Content Container */}
            <section className="container-wide px-4 sm:px-6 lg:px-8 mt-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

                    {/* Reservation Form Column */}
                    <div className="lg:col-span-7">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="glass-card p-6 sm:p-10 shadow-card bg-white rounded-3xl border border-[#e2d4c4]"
                        >
                            <div className="flex justify-between items-center mb-8 pb-4 border-b border-[#e2d4c4]">
                                <div>
                                    <h2 className="font-serif font-black text-2xl text-dark">Book an Evening</h2>
                                    <p className="text-xs text-muted font-sans">Instant confirmation. No deposit required.</p>
                                </div>
                                <span className="text-xs font-black px-3 py-1 bg-cream3 text-brown rounded-full uppercase tracking-wider">
                                    Dine-In
                                </span>
                            </div>

                            <AnimatePresence mode="wait">
                                {success ? (
                                    <motion.div
                                        key="success-message"
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="bg-[#fcf9f5] border border-emerald-300 text-dark p-8 rounded-2xl text-center flex flex-col items-center shadow-sm"
                                    >
                                        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-4 shadow-inner">
                                            <Check size={32} />
                                        </div>
                                        <span className="text-xs font-black uppercase tracking-widest text-emerald-700 mb-1">Booking Confirmed</span>
                                        <h3 className="text-2xl font-black font-serif text-dark mb-2">We Look Forward to Hosting You</h3>
                                        <p className="font-sans text-xs text-muted max-w-md mb-6 leading-relaxed">
                                            Your table reservation for <strong className="text-dark">{confirmedBooking?.partySize || 2} Guests</strong> on <strong className="text-dark">{formatDateText(confirmedBooking?.date)} at {confirmedBooking?.time || '19:00'}</strong> has been registered in our system.
                                        </p>

                                        <div className="w-full bg-white p-4 rounded-xl border border-[#e2d4c4] text-left text-xs space-y-1.5 mb-6">
                                            <div className="flex justify-between"><span className="text-muted">Guest Name:</span> <span className="font-bold text-dark">{confirmedBooking?.firstName} {confirmedBooking?.lastName}</span></div>
                                            <div className="flex justify-between"><span className="text-muted">Contact:</span> <span className="font-bold text-dark">{confirmedBooking?.phone}</span></div>
                                            <div className="flex justify-between"><span className="text-muted">Occasion:</span> <span className="font-bold text-red">{confirmedBooking?.occasion || 'Standard Dining'}</span></div>
                                        </div>

                                        <button
                                            onClick={() => setSuccess(false)}
                                            className="btn-outline text-xs py-3 px-6 rounded-xl"
                                        >
                                            Make Another Reservation
                                        </button>
                                    </motion.div>
                                ) : (
                                    <motion.form
                                        key="booking-form"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        onSubmit={handleSubmit}
                                        className="space-y-5"
                                    >
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                            <div className="sm:col-span-2">
                                                <label className="block font-sans text-[11px] font-black text-brown mb-1 uppercase tracking-wider">
                                                    Full Name *
                                                </label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    required
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    className="input-field bg-cream text-sm"
                                                    placeholder="e.g. Johnathan Sterling"
                                                />
                                            </div>

                                            <div>
                                                <label className="block font-sans text-[11px] font-black text-brown mb-1 uppercase tracking-wider">
                                                    Email Address *
                                                </label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    required
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    className="input-field bg-cream text-sm"
                                                    placeholder="john@example.com"
                                                />
                                            </div>

                                            <div>
                                                <label className="block font-sans text-[11px] font-black text-brown mb-1 uppercase tracking-wider">
                                                    Phone Number *
                                                </label>
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    required
                                                    value={formData.phone}
                                                    onChange={handleChange}
                                                    className="input-field bg-cream text-sm"
                                                    placeholder="+1 (555) 234-5678"
                                                />
                                            </div>

                                            <div>
                                                <label className="block font-sans text-[11px] font-black text-brown mb-1 uppercase tracking-wider">
                                                    Party Size *
                                                </label>
                                                <div className="relative">
                                                    <Users size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                                                    <select
                                                        name="guests"
                                                        value={formData.guests}
                                                        onChange={handleChange}
                                                        className="input-field bg-cream pl-10 text-sm font-bold"
                                                    >
                                                        {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 16].map(num => (
                                                            <option key={num} value={num}>{num} {num === 1 ? 'Guest (Solo Dining)' : `Guests`}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block font-sans text-[11px] font-black text-brown mb-1 uppercase tracking-wider">
                                                    Special Occasion
                                                </label>
                                                <select
                                                    name="occasion"
                                                    value={formData.occasion}
                                                    onChange={handleChange}
                                                    className="input-field bg-cream text-sm font-bold"
                                                >
                                                    <option value="None">Casual Dining</option>
                                                    <option value="Birthday">Birthday Celebration</option>
                                                    <option value="Anniversary">Anniversary</option>
                                                    <option value="Business">Business Dinner</option>
                                                    <option value="Proposal">Romantic / Proposal</option>
                                                    <option value="Other">Other Milestone</option>
                                                </select>
                                            </div>

                                            <div>
                                                <label className="block font-sans text-[11px] font-black text-brown mb-1 uppercase tracking-wider">
                                                    Dining Date *
                                                </label>
                                                <div className="relative">
                                                    <Calendar size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                                                    <input
                                                        type="date"
                                                        name="date"
                                                        required
                                                        min={new Date().toISOString().split('T')[0]}
                                                        value={formData.date}
                                                        onChange={handleChange}
                                                        className="input-field bg-cream pl-10 text-sm font-bold"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block font-sans text-[11px] font-black text-brown mb-1 uppercase tracking-wider">
                                                    Preferred Time *
                                                </label>
                                                <div className="relative">
                                                    <Clock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                                                    <select
                                                        name="time"
                                                        required
                                                        value={formData.time}
                                                        onChange={handleChange}
                                                        className="input-field bg-cream pl-10 text-sm font-bold"
                                                    >
                                                        <option value="17:00">5:00 PM</option>
                                                        <option value="17:30">5:30 PM</option>
                                                        <option value="18:00">6:00 PM</option>
                                                        <option value="18:30">6:30 PM</option>
                                                        <option value="19:00">7:00 PM</option>
                                                        <option value="19:30">7:30 PM</option>
                                                        <option value="20:00">8:00 PM</option>
                                                        <option value="20:30">8:30 PM</option>
                                                        <option value="21:00">9:00 PM</option>
                                                        <option value="21:30">9:30 PM</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block font-sans text-[11px] font-black text-brown mb-1 uppercase tracking-wider">
                                                Dietary Preferences & Special Requests
                                            </label>
                                            <textarea
                                                name="specialRequests"
                                                value={formData.specialRequests}
                                                onChange={handleChange}
                                                rows="3"
                                                className="input-field bg-cream resize-none text-xs"
                                                placeholder="Allergies (nut, gluten, shellfish), booth preference, anniversary champagne request..."
                                            ></textarea>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="btn-primary w-full py-4 text-xs font-bold uppercase tracking-wider rounded-xl shadow-lg shadow-red/25 flex items-center justify-center gap-2 cursor-pointer"
                                        >
                                            {loading ? (
                                                <>
                                                    <Loader2 className="animate-spin" size={16} /> Reserving Table...
                                                </>
                                            ) : (
                                                <>
                                                    Confirm Table Booking
                                                </>
                                            )}
                                        </button>
                                    </motion.form>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    </div>

                    {/* Right Info Cards */}
                    <div className="lg:col-span-5 space-y-6">
                        {/* Highlights card */}
                        <div className="dark-card p-8 rounded-3xl bg-[#1a0e06] text-white space-y-5 shadow-xl">
                            <h3 className="font-serif font-black text-xl text-[#fdf8f2] border-b border-white/10 pb-4">
                                The Drizzle Experience
                            </h3>
                            <ul className="space-y-4 text-xs font-sans text-white/80">
                                <li className="flex items-start gap-3">
                                    <Sparkles size={16} className="text-red shrink-0 mt-0.5" />
                                    <span><strong>Chef's Tasting Menu</strong>: 7-course seasonal gastronomy with curated biodynamic wine pairings.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <Award size={16} className="text-red shrink-0 mt-0.5" />
                                    <span><strong>Dress Code</strong>: Smart elegant attire is appreciated.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <Clock size={16} className="text-red shrink-0 mt-0.5" />
                                    <span><strong>Grace Period</strong>: We hold reserved tables for up to 15 minutes past booking time.</span>
                                </li>
                            </ul>
                        </div>

                        {/* Location & Opening Hours */}
                        <div className="glass-card p-8 rounded-3xl bg-white border border-[#e2d4c4] space-y-5">
                            <h3 className="font-serif font-black text-lg text-dark border-b border-[#e2d4c4] pb-3">
                                Service & Hours
                            </h3>
                            <div className="space-y-3 text-xs font-sans text-brown">
                                <div className="flex justify-between py-1 border-b border-[#e2d4c4]/40">
                                    <span className="text-muted">Monday – Thursday</span>
                                    <span className="font-bold">5:00 PM – 10:30 PM</span>
                                </div>
                                <div className="flex justify-between py-1 border-b border-[#e2d4c4]/40">
                                    <span className="text-muted">Friday – Saturday</span>
                                    <span className="font-bold">5:00 PM – 11:30 PM</span>
                                </div>
                                <div className="flex justify-between py-1">
                                    <span className="text-muted">Sunday Dinner</span>
                                    <span className="font-bold">4:30 PM – 10:00 PM</span>
                                </div>
                            </div>

                            <div className="pt-3 border-t border-[#e2d4c4] flex items-center justify-between text-xs text-muted">
                                <span className="flex items-center gap-1.5 font-bold text-dark">
                                    <Phone size={13} className="text-red" /> +1 (212) 555-0123
                                </span>
                                <span>123 Culinary Blvd, NY</span>
                            </div>
                        </div>
                    </div>

                </div>
            </section>
        </div>
    );
};

export default Reservations;
