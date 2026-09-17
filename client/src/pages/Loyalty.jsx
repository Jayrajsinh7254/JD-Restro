import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Gift, Star, Award, TrendingUp } from 'lucide-react';
// import { useLoyalty } from '../hooks/useLoyalty';

const Loyalty = () => {
    // const { joinLoyalty, loading, member } = useLoyalty();
    const loading = false;
    const member = null;
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        birthday: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Join loyalty:", formData);
        // joinLoyalty(formData);
    };

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
                        <span className="eyebrow-tag border-white/20 text-cream2 mb-6">Drizzle Rewards</span>
                        <h1 className="h1-fluid mb-6">Loyalty Program</h1>
                        <p className="body-fluid text-white/70 max-w-2xl mx-auto">
                            Join our exclusive rewards program and turn every meal into a celebration. Earn points, unlock tiers, and enjoy special perks.
                        </p>
                    </motion.div>
                </div>
            </section>

            <section className="container-wide mt-16 lg:mt-24">
                {member ? (
                    /* Member Dashboard Mockup */
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="dark-card p-10 max-w-3xl mx-auto shadow-2xl relative overflow-hidden text-center"
                    >
                        <div className="absolute top-0 right-0 p-8 opacity-20"><Award size={120} /></div>
                        <h2 className="h2-fluid text-cream2 mb-2 relative z-10">Welcome back, {member.name}!</h2>
                        <p className="text-white/60 mb-8 relative z-10">Your current status: <strong className="text-red uppercase">{member.tier || 'Silver'} Tier</strong></p>

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
                            <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                                <p className="text-white/60 text-sm mb-2">Total Points</p>
                                <p className="text-4xl font-serif font-bold text-white">{member.points || 450}</p>
                            </div>
                            <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                                <p className="text-white/60 text-sm mb-2">Rewards</p>
                                <p className="text-4xl font-serif font-bold text-white">2</p>
                            </div>
                            <div className="bg-white/5 p-6 rounded-xl border border-white/10 lg:col-span-2 flex flex-col justify-center">
                                <p className="text-white/80 text-sm mb-2">Next Tier: Gold (500 pts)</p>
                                <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                                    <div className="h-full bg-red w-[90%] rounded-full"></div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

                        {/* Left: Perks */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <h2 className="h2-fluid text-dark mb-8">Why Join Drizzle Rewards?</h2>

                            <div className="space-y-8">
                                <div className="flex gap-6 items-start">
                                    <div className="w-14 h-14 rounded-full bg-[#c0392b]/10 flex items-center justify-center shrink-0">
                                        <Star className="text-red" size={24} />
                                    </div>
                                    <div>
                                        <h3 className="h3-fluid text-xl text-dark mb-2">Earn as you eat</h3>
                                        <p className="font-sans text-muted">Get 1 point for every $1 spent at Drizzle. Points never expire as long as you dine with us once a year.</p>
                                    </div>
                                </div>

                                <div className="flex gap-6 items-start">
                                    <div className="w-14 h-14 rounded-full bg-[#c0392b]/10 flex items-center justify-center shrink-0">
                                        <Gift className="text-red" size={24} />
                                    </div>
                                    <div>
                                        <h3 className="h3-fluid text-xl text-dark mb-2">Birthday Surprises</h3>
                                        <p className="font-sans text-muted">Celebrate your special day with a complimentary dessert and a glass of champagne on us.</p>
                                    </div>
                                </div>

                                <div className="flex gap-6 items-start">
                                    <div className="w-14 h-14 rounded-full bg-[#c0392b]/10 flex items-center justify-center shrink-0">
                                        <TrendingUp className="text-red" size={24} />
                                    </div>
                                    <div>
                                        <h3 className="h3-fluid text-xl text-dark mb-2">Tiered Benefits</h3>
                                        <p className="font-sans text-muted">Unlock Silver, Gold, and Platinum tiers. Higher tiers enjoy priority booking, off-menu tastings, and free valet.</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Right: Join Form */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <div className="glass-card p-10 bg-white shadow-card">
                                <div className="text-center mb-8">
                                    <h3 className="h3-fluid text-dark mb-2">Sign Up Now</h3>
                                    <p className="font-sans text-muted text-sm">Join today and receive 50 bonus points!</p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div>
                                        <input
                                            type="text"
                                            name="name"
                                            required
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="input-field"
                                            placeholder="Full Name"
                                        />
                                    </div>
                                    <div>
                                        <input
                                            type="email"
                                            name="email"
                                            required
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="input-field"
                                            placeholder="Email Address"
                                        />
                                    </div>
                                    <div>
                                        <input
                                            type="tel"
                                            name="phone"
                                            required
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="input-field"
                                            placeholder="Phone Number"
                                        />
                                    </div>
                                    <div>
                                        <input
                                            type="date"
                                            name="birthday"
                                            value={formData.birthday}
                                            onChange={handleChange}
                                            className="input-field text-muted"
                                            title="Birthday"
                                        />
                                        <p className="text-[10px] text-muted/60 mt-1 ml-2">For your special birthday reward</p>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="btn-primary w-full py-4 mt-4"
                                    >
                                        {loading ? 'Joining...' : 'Join Rewards Program'}
                                    </button>
                                    <p className="text-xs text-center text-muted/60 mt-4 leading-relaxed">
                                        By joining, you agree to our Terms & Conditions and Privacy Policy.
                                    </p>
                                </form>
                            </div>
                        </motion.div>

                    </div>
                )}
            </section>
        </div>
    );
};

export default Loyalty;
