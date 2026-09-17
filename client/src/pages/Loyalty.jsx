import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Star, Award, TrendingUp, Sparkles, CheckCircle2, ShieldCheck, ArrowRight, UserCheck, Lock, ChevronRight, Cake, Wine, Coffee } from 'lucide-react';
import { useLoyalty } from '../context/LoyaltyContext';
import toast from 'react-hot-toast';

const TIERS = [
    {
        name: 'Silver',
        points: '0 - 499 Points',
        tag: 'Entry Member',
        color: 'from-zinc-400 to-zinc-600',
        borderColor: 'border-zinc-300',
        perks: [
            '1 Point per $1 spent on dining & takeout',
            'Complimentary birthday dessert',
            'Member-only seasonal menu previews',
            'Digital points & rewards wallet'
        ]
    },
    {
        name: 'Gold',
        points: '500 - 1,499 Points',
        tag: 'Distinguished',
        color: 'from-amber-400 to-amber-600',
        borderColor: 'border-amber-400',
        featured: true,
        perks: [
            '1.25x Points multiplier on all dining',
            'Complimentary glass of Champagne on birthdays',
            'Priority table reservations (48h notice)',
            'Invitation to semi-annual tasting evenings',
            'Complimentary valet parking'
        ]
    },
    {
        name: 'Platinum',
        points: '1,500+ Points',
        tag: 'Epicurean Elite',
        color: 'from-red to-red-hover',
        borderColor: 'border-red',
        perks: [
            '1.5x Points multiplier',
            'Personal Sommelier consultation on visits',
            'Guaranteed same-day table reservation',
            'Private Chef’s table invitation yearly',
            'Custom engraved member privileges'
        ]
    }
];

const REWARDS_CATALOG = [
    { id: 1, title: 'Artisanal Dessert', cost: 150, icon: Cake, desc: 'Any handcrafted dessert from our pastry kitchen.' },
    { id: 2, title: 'Sommelier Wine Flight', cost: 300, icon: Wine, desc: '3 premium curated reserve wine tastings.' },
    { id: 3, title: 'Chef’s Amuse-Bouche Course', cost: 450, icon: Sparkles, desc: 'Exclusive off-menu pre-dinner creation.' },
    { id: 4, title: '$50 Dining Voucher', cost: 600, icon: Gift, desc: 'Applied directly to your next dining experience.' },
];

const Loyalty = () => {
    const { member, loading, joinLoyalty, checkStatus, logoutMember } = useLoyalty();
    const [lookupEmail, setLookupEmail] = useState('');
    const [isLookingUp, setIsLookingUp] = useState(false);
    const [activeTab, setActiveTab] = useState('join'); // 'join' | 'lookup'

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        birthday: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleJoinSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.phone) {
            return toast.error('Please provide name, email, and phone number');
        }

        const res = await joinLoyalty(formData);
        if (res?.success) {
            toast.success('Congratulations! 50 Welcome Points added to your account!');
        }
    };

    const handleLookupSubmit = async (e) => {
        e.preventDefault();
        if (!lookupEmail) {
            return toast.error('Please enter your registered email');
        }
        setIsLookingUp(true);
        const res = await checkStatus(lookupEmail);
        setIsLookingUp(false);
        if (!res?.success) {
            toast.error(res?.error || 'No loyalty member found with this email');
        }
    };

    const handleRedeem = (reward) => {
        if (!member) return;
        const currentPoints = member.points || 150;
        if (currentPoints < reward.cost) {
            return toast.error(`You need ${reward.cost - currentPoints} more points to redeem ${reward.title}`);
        }
        toast.success(`Reward "${reward.title}" redeemed! Show this confirmation to your server.`);
    };

    return (
        <div className="pt-20 sm:pt-24 min-h-screen bg-cream2 pb-16 sm:pb-24">
            {/* Hero Header */}
            <section className="py-12 sm:py-20 md:py-24 text-center bg-dark text-white relative overflow-hidden bg-radial-glow">
                <div className="container-wide relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <span className="eyebrow-tag border-white/20 text-cream2 mb-4 sm:mb-6">Drizzle Privileges</span>
                        <h1 className="h1-fluid mb-4 sm:mb-6 text-cream">Loyalty & Rewards</h1>
                        <p className="body-fluid text-white/70 max-w-2xl mx-auto px-2">
                            Elevate your dining journey. Collect points with every culinary experience, unlock prestigious tiers, and indulge in member-exclusive privileges.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Main Interactive Section */}
            <section className="container-wide mt-10 sm:mt-16 md:mt-20">
                {member ? (
                    /* Active Member Dashboard */
                    <motion.div
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4 }}
                        className="max-w-4xl mx-auto space-y-8"
                    >
                        {/* Member Header Card */}
                        <div className="dark-card p-6 sm:p-10 rounded-2xl sm:rounded-3xl shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-6 sm:p-10 opacity-10 pointer-events-none">
                                <Award size={140} />
                            </div>

                            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-white/10">
                                <div>
                                    <span className="text-red text-xs uppercase font-bold tracking-widest block mb-1">
                                        Active Member Card
                                    </span>
                                    <h2 className="font-serif font-black text-2xl sm:text-3xl text-cream2">
                                        Welcome, {member.name || 'Valued Guest'}
                                    </h2>
                                    <p className="text-white/60 text-xs sm:text-sm mt-0.5">{member.email}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="bg-red/20 border border-red/40 px-4 py-2 rounded-xl text-center">
                                        <p className="text-[10px] uppercase font-bold text-red tracking-wider">Current Tier</p>
                                        <p className="font-serif font-bold text-lg text-white">{member.tier || 'Silver'} Member</p>
                                    </div>
                                    <button
                                        onClick={logoutMember}
                                        className="text-xs text-white/50 hover:text-white underline px-2 py-1"
                                    >
                                        Log Out
                                    </button>
                                </div>
                            </div>

                            {/* Points Metrics Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mt-8 relative z-10">
                                <div className="bg-white/5 p-5 sm:p-6 rounded-2xl border border-white/10 flex flex-col justify-between">
                                    <p className="text-white/60 text-xs uppercase font-bold tracking-wider">Available Points</p>
                                    <p className="font-serif font-bold text-3xl sm:text-4xl text-white mt-2">
                                        {member.points || 150} <span className="text-xs font-sans font-normal text-white/50">pts</span>
                                    </p>
                                </div>
                                <div className="bg-white/5 p-5 sm:p-6 rounded-2xl border border-white/10 flex flex-col justify-between">
                                    <p className="text-white/60 text-xs uppercase font-bold tracking-wider">Rewards Available</p>
                                    <p className="font-serif font-bold text-3xl sm:text-4xl text-white mt-2">
                                        {(member.points || 150) >= 150 ? '1+' : '0'} <span className="text-xs font-sans font-normal text-white/50">ready</span>
                                    </p>
                                </div>
                                <div className="bg-white/5 p-5 sm:p-6 rounded-2xl border border-white/10 flex flex-col justify-between">
                                    <p className="text-white/60 text-xs uppercase font-bold tracking-wider">Next Milestone</p>
                                    <div>
                                        <div className="flex justify-between text-[11px] text-white/70 mb-1.5 mt-2">
                                            <span>Progress to Gold</span>
                                            <span>{member.points || 150} / 500</span>
                                        </div>
                                        <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-red rounded-full transition-all duration-500"
                                                style={{ width: `${Math.min(100, (((member.points || 150) / 500) * 100))}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Redeem Rewards Catalog */}
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="font-serif font-bold text-2xl text-dark">Redeem Perks</h3>
                                    <p className="text-xs sm:text-sm text-muted">Exchange your points for culinary privileges.</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                {REWARDS_CATALOG.map((reward) => {
                                    const Icon = reward.icon;
                                    const canRedeem = (member.points || 150) >= reward.cost;
                                    return (
                                        <div
                                            key={reward.id}
                                            className="bg-white p-5 sm:p-6 rounded-2xl border border-border flex flex-col justify-between gap-4 shadow-sm hover:shadow-card transition-all"
                                        >
                                            <div className="flex items-start gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-cream flex items-center justify-center text-red shrink-0 border border-border">
                                                    <Icon size={24} />
                                                </div>
                                                <div>
                                                    <h4 className="font-serif font-bold text-base text-dark">{reward.title}</h4>
                                                    <p className="text-xs text-muted mt-1 leading-relaxed">{reward.desc}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between pt-3 border-t border-cream2">
                                                <span className="font-serif font-bold text-red text-sm">
                                                    {reward.cost} pts
                                                </span>
                                                <button
                                                    onClick={() => handleRedeem(reward)}
                                                    disabled={!canRedeem}
                                                    className={`text-xs py-2 px-4 rounded-xl font-bold transition-colors ${
                                                        canRedeem
                                                            ? 'bg-red hover:bg-red-hover text-white shadow-sm'
                                                            : 'bg-cream text-muted/50 cursor-not-allowed border border-border'
                                                    }`}
                                                >
                                                    {canRedeem ? 'Redeem Now' : 'Not Enough Points'}
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    /* Join or Lookup Grid */
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">

                        {/* Left: Why Join Benefits (7 cols on lg) */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="lg:col-span-7 space-y-6 sm:space-y-8"
                        >
                            <div>
                                <span className="text-red text-xs uppercase font-bold tracking-widest block mb-2">Member Privileges</span>
                                <h2 className="h2-fluid text-dark text-2xl sm:text-3xl">Why Join Drizzle Rewards?</h2>
                                <p className="text-muted text-sm sm:text-base mt-2">
                                    Our loyalty program is built as a genuine celebration of your patronage. Every course you order brings you closer to bespoke dining experiences.
                                </p>
                            </div>

                            <div className="space-y-4 sm:space-y-5">
                                <div className="bg-white p-5 sm:p-6 rounded-2xl border border-border shadow-sm flex gap-4 sm:gap-5 items-start">
                                    <div className="w-12 h-12 rounded-2xl bg-red/10 flex items-center justify-center text-red shrink-0">
                                        <Star size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-serif font-bold text-lg text-dark mb-1">Earn As You Dine</h3>
                                        <p className="font-sans text-muted text-xs sm:text-sm leading-relaxed">
                                            Earn 1 point for every $1 spent across our dining room, bar, and private events. Points never expire as long as you visit once a year.
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-white p-5 sm:p-6 rounded-2xl border border-border shadow-sm flex gap-4 sm:gap-5 items-start">
                                    <div className="w-12 h-12 rounded-2xl bg-red/10 flex items-center justify-center text-red shrink-0">
                                        <Gift size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-serif font-bold text-lg text-dark mb-1">Birthday & Anniversary Treats</h3>
                                        <p className="font-sans text-muted text-xs sm:text-sm leading-relaxed">
                                            Toast to another wonderful year with a complimentary dessert creation and a vintage champagne pour on the house.
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-white p-5 sm:p-6 rounded-2xl border border-border shadow-sm flex gap-4 sm:gap-5 items-start">
                                    <div className="w-12 h-12 rounded-2xl bg-red/10 flex items-center justify-center text-red shrink-0">
                                        <TrendingUp size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-serif font-bold text-lg text-dark mb-1">Priority Reservations & Secret Menus</h3>
                                        <p className="font-sans text-muted text-xs sm:text-sm leading-relaxed">
                                            Gold and Platinum members enjoy direct concierge table bookings and access to secret off-menu seasonal courses.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Right: Join / Status Card (5 cols on lg) */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="lg:col-span-5 bg-white p-6 sm:p-10 rounded-2xl sm:rounded-3xl border border-border shadow-card"
                        >
                            {/* Toggle Tabs */}
                            <div className="flex bg-cream p-1 rounded-xl border border-border mb-8">
                                <button
                                    onClick={() => setActiveTab('join')}
                                    className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all ${
                                        activeTab === 'join'
                                            ? 'bg-dark text-white shadow-sm'
                                            : 'text-brown hover:text-red'
                                    }`}
                                >
                                    Join Program
                                </button>
                                <button
                                    onClick={() => setActiveTab('lookup')}
                                    className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all ${
                                        activeTab === 'lookup'
                                            ? 'bg-dark text-white shadow-sm'
                                            : 'text-brown hover:text-red'
                                    }`}
                                >
                                    Check Points
                                </button>
                            </div>

                            {activeTab === 'join' ? (
                                <div>
                                    <div className="text-center mb-6">
                                        <span className="inline-flex items-center gap-1 text-[11px] bg-red/10 text-red font-bold px-3 py-1 rounded-full mb-2">
                                            <Sparkles size={12} /> Instant 50 Welcome Points
                                        </span>
                                        <h3 className="font-serif font-bold text-2xl text-dark">Join Drizzle Club</h3>
                                        <p className="text-xs text-muted mt-1">Free to join. Instant privileges start today.</p>
                                    </div>

                                    <form onSubmit={handleJoinSubmit} className="space-y-4">
                                        <div>
                                            <label className="block text-xs font-bold text-brown uppercase mb-1">Full Name *</label>
                                            <input
                                                type="text"
                                                name="name"
                                                required
                                                value={formData.name}
                                                onChange={handleChange}
                                                className="input-field rounded-xl"
                                                placeholder="e.g. Liam Parker"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-brown uppercase mb-1">Email Address *</label>
                                            <input
                                                type="email"
                                                name="email"
                                                required
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="input-field rounded-xl"
                                                placeholder="liam@example.com"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-brown uppercase mb-1">Phone Number *</label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                required
                                                value={formData.phone}
                                                onChange={handleChange}
                                                className="input-field rounded-xl"
                                                placeholder="+1 (555) 123-4567"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-brown uppercase mb-1">
                                                Birthday <span className="text-muted text-[10px] lowercase">(for annual gift)</span>
                                            </label>
                                            <input
                                                type="date"
                                                name="birthday"
                                                value={formData.birthday}
                                                onChange={handleChange}
                                                className="input-field rounded-xl text-brown"
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="btn-primary w-full py-4 rounded-xl mt-4 text-xs font-bold shadow-md shadow-red/20"
                                        >
                                            {loading ? 'Registering...' : 'Enroll & Claim 50 Bonus Pts'}
                                        </button>

                                        <p className="text-[11px] text-center text-muted/70 pt-2 leading-relaxed">
                                            By enrolling, you agree to our Terms of Service and Dining Rewards guidelines.
                                        </p>
                                    </form>
                                </div>
                            ) : (
                                <div>
                                    <div className="text-center mb-6">
                                        <div className="w-12 h-12 bg-cream text-red rounded-full flex items-center justify-center mx-auto mb-3 border border-border">
                                            <UserCheck size={24} />
                                        </div>
                                        <h3 className="font-serif font-bold text-2xl text-dark">Member Status</h3>
                                        <p className="text-xs text-muted mt-1">Enter your registered email to view your current points and tier.</p>
                                    </div>

                                    <form onSubmit={handleLookupSubmit} className="space-y-4">
                                        <div>
                                            <label className="block text-xs font-bold text-brown uppercase mb-1">Registered Email *</label>
                                            <input
                                                type="email"
                                                required
                                                value={lookupEmail}
                                                onChange={(e) => setLookupEmail(e.target.value)}
                                                className="input-field rounded-xl"
                                                placeholder="Enter your email address"
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={isLookingUp}
                                            className="btn-primary w-full py-4 rounded-xl text-xs font-bold shadow-md"
                                        >
                                            {isLookingUp ? 'Searching...' : 'Check My Rewards'}
                                        </button>
                                    </form>
                                </div>
                            )}
                        </motion.div>

                    </div>
                )}
            </section>

            {/* Loyalty Tiers Showcase */}
            <section className="container-wide mt-16 sm:mt-24">
                <div className="text-center mb-10 sm:mb-14">
                    <span className="eyebrow-tag border-border text-brown mb-3">Progression</span>
                    <h2 className="h2-fluid text-dark text-2xl sm:text-3xl">Membership Tiers</h2>
                    <p className="text-muted text-sm max-w-xl mx-auto mt-2">
                        Unlock greater rewards and dining privileges as you collect points throughout the year.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
                    {TIERS.map((tier, idx) => (
                        <div
                            key={tier.name}
                            className={`rounded-2xl sm:rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 relative overflow-hidden ${
                                tier.featured
                                    ? 'bg-dark text-white border-2 border-red shadow-xl scale-[1.02]'
                                    : 'bg-white text-dark border border-border shadow-sm'
                            }`}
                        >
                            {tier.featured && (
                                <div className="absolute top-4 right-4 bg-red text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">
                                    Most Popular
                                </div>
                            )}

                            <div>
                                <span className={`text-[11px] uppercase font-bold tracking-widest block mb-2 ${tier.featured ? 'text-red' : 'text-muted'}`}>
                                    {tier.tag}
                                </span>
                                <h3 className="font-serif font-black text-2xl sm:text-3xl mb-1">{tier.name}</h3>
                                <p className={`text-xs font-sans font-bold mb-6 ${tier.featured ? 'text-white/60' : 'text-muted'}`}>
                                    {tier.points}
                                </p>

                                <ul className="space-y-3 pt-4 border-t border-border/30">
                                    {tier.perks.map((perk, i) => (
                                        <li key={i} className="flex items-start gap-3 text-xs sm:text-sm">
                                            <CheckCircle2 size={16} className={`shrink-0 mt-0.5 ${tier.featured ? 'text-red' : 'text-red'}`} />
                                            <span className={tier.featured ? 'text-white/80' : 'text-brown/85'}>{perk}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="pt-8">
                                <button
                                    onClick={() => {
                                        window.scrollTo({ top: 300, behavior: 'smooth' });
                                    }}
                                    className={`w-full py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors ${
                                        tier.featured
                                            ? 'btn-primary'
                                            : 'btn-outline bg-transparent'
                                    }`}
                                >
                                    {member ? 'View Benefits' : 'Join Now'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Loyalty;
