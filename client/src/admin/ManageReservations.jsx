import React, { useState, useEffect, useRef } from 'react';
import { Calendar, Filter, CheckCircle2, XCircle, Clock, Search, Loader2, Trash2, RefreshCw, Phone, Mail, Users, Sparkles, Plus, Check, User, AlertCircle, Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { reservationService } from '../services/reservationService';
import toast from 'react-hot-toast';

const ManageReservations = () => {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [statusFilter, setStatusFilter] = useState('all');
    const [dateFilter, setDateFilter] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [lastSyncTime, setLastSyncTime] = useState(new Date());

    const prevCountRef = useRef(0);

    // Form state for creating manual reservations (Walk-in / Phone)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        date: new Date().toISOString().split('T')[0],
        time: '19:00',
        partySize: 2,
        occasion: 'None',
        specialRequests: '',
        status: 'confirmed'
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Sound notification helper using Web Audio API (zero external assets needed)
    const playNotificationChime = () => {
        if (!soundEnabled) return;
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
            osc.frequency.setValueAtTime(880, ctx.currentTime + 0.12); // A5
            gain.gain.setValueAtTime(0.15, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.36);
        } catch (e) {
            // AudioContext not allowed before user interaction
        }
    };

    useEffect(() => {
        fetchReservations(false);

        // Fast Real-Time Live Polling every 3.5 seconds
        const pollInterval = setInterval(() => {
            fetchReservations(true);
        }, 3500);

        // Instant Sub-millisecond Cross-Tab Broadcast Synchronization
        let channel;
        try {
            channel = new BroadcastChannel('drizzle_live_sync');
            channel.onmessage = (event) => {
                if (event.data?.type === 'NEW_RESERVATION') {
                    fetchReservations(true);
                    playNotificationChime();
                    toast.success(`🛎️ Live update: New table booked by ${event.data.data?.firstName || 'Guest'}!`, {
                        duration: 4000,
                        icon: '✨'
                    });
                }
            };
        } catch (e) {
            // Fallback
        }

        return () => {
            clearInterval(pollInterval);
            if (channel) channel.close();
        };
    }, [soundEnabled]);

    const fetchReservations = async (isBackground = false) => {
        try {
            if (!isBackground) setIsRefreshing(true);
            const response = await reservationService.getAll();
            const data = response.data || [];
            
            // Check if new reservation came in while active
            if (isBackground && data.length > prevCountRef.current && prevCountRef.current > 0) {
                playNotificationChime();
                const latest = data[0];
                toast.success(`🛎️ New booking: ${latest.firstName} ${latest.lastName} (${latest.partySize} guests)`, {
                    duration: 4000
                });
            }
            prevCountRef.current = data.length;

            setReservations(data);
            setLastSyncTime(new Date());
        } catch (error) {
            console.error('Failed to fetch reservations:', error);
            if (!isBackground && loading) {
                toast.error('Failed to load reservations. Please check connection.');
            }
        } finally {
            setLoading(false);
            if (!isBackground) setIsRefreshing(false);
        }
    };

    const handleUpdateStatus = async (id, status) => {
        try {
            await reservationService.updateStatus(id, status);
            toast.success(`Booking status updated to ${status}`);
            fetchReservations(false);
        } catch (error) {
            toast.error(`Failed to update status to ${status}`);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to permanently delete this reservation?')) return;
        try {
            await reservationService.delete(id);
            toast.success('Reservation record removed');
            fetchReservations(false);
        } catch (error) {
            toast.error('Failed to delete reservation');
        }
    };

    const handleCreateManualReservation = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.date || !formData.time) {
            return toast.error('Please fill required fields');
        }

        setIsSubmitting(true);
        try {
            const parts = formData.name.trim().split(' ');
            const firstName = parts[0] || 'Guest';
            const lastName = parts.slice(1).join(' ') || 'Patron';

            const payload = {
                firstName,
                lastName,
                name: formData.name,
                email: formData.email || 'walkin@drizzle.com',
                phone: formData.phone || '+1 (555) 000-0000',
                date: formData.date,
                time: formData.time,
                partySize: parseInt(formData.partySize, 10) || 2,
                occasion: formData.occasion,
                specialRequests: formData.specialRequests,
                status: formData.status
            };

            await reservationService.create(payload);
            toast.success('Reservation created and confirmed!');
            setIsAddModalOpen(false);
            setFormData({
                name: '',
                email: '',
                phone: '',
                date: new Date().toISOString().split('T')[0],
                time: '19:00',
                partySize: 2,
                occasion: 'None',
                specialRequests: '',
                status: 'confirmed'
            });
            fetchReservations(false);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to create reservation');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Timezone-safe date extraction helper
    const getCleanDateString = (d) => {
        if (!d) return '';
        if (typeof d === 'string') return d.split('T')[0];
        try {
            return new Date(d).toISOString().split('T')[0];
        } catch (e) {
            return '';
        }
    };

    const formatDateDisplay = (d) => {
        if (!d) return 'N/A';
        try {
            const clean = getCleanDateString(d);
            if (clean && /^\d{4}-\d{2}-\d{2}$/.test(clean)) {
                const [year, month, day] = clean.split('-').map(Number);
                const dateObj = new Date(year, month - 1, day);
                return dateObj.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
            }
            return new Date(d).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
        } catch (e) {
            return String(d);
        }
    };

    const filteredReservations = reservations.filter(res => {
        const matchesStatus = statusFilter === 'all' || res.status === statusFilter;
        
        let matchesDate = true;
        if (dateFilter) {
            const resCleanDate = getCleanDateString(res.date);
            matchesDate = resCleanDate === dateFilter;
        }

        const fullName = `${res.firstName || ''} ${res.lastName || ''}`.toLowerCase();
        const emailStr = (res.email || '').toLowerCase();
        const phoneStr = (res.phone || '').toLowerCase();
        const notesStr = (res.specialRequests || '').toLowerCase();
        const occasionStr = (res.occasion || '').toLowerCase();
        const query = searchQuery.toLowerCase().trim();

        const matchesSearch = !query || 
            fullName.includes(query) || 
            emailStr.includes(query) || 
            phoneStr.includes(query) || 
            notesStr.includes(query) ||
            occasionStr.includes(query);

        return matchesStatus && matchesDate && matchesSearch;
    });

    const pendingCount = reservations.filter(r => r.status === 'pending').length;
    const confirmedCount = reservations.filter(r => r.status === 'confirmed').length;
    const cancelledCount = reservations.filter(r => r.status === 'cancelled').length;

    const todayStr = new Date().toISOString().split('T')[0];
    const todayCount = reservations.filter(r => getCleanDateString(r.date) === todayStr).length;

    return (
        <div className="h-full flex flex-col space-y-6">
            {/* Header & Live Stream Status */}
            <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="h2-fluid text-dark font-serif font-black">Guest Table Bookings</h1>
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full border border-emerald-300 text-[11px] font-black uppercase tracking-wider shadow-sm">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            Live Syncing
                        </div>
                    </div>
                    <p className="text-muted text-xs sm:text-sm font-medium mt-1">
                        Real-time table hospitality pipeline. All guest reservations sync instantly across devices.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                    {/* Sound Toggle */}
                    <button
                        onClick={() => setSoundEnabled(!soundEnabled)}
                        className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all ${
                            soundEnabled ? 'bg-white border-[#e2d4c4] text-brown' : 'bg-cream3 border-border text-muted'
                        }`}
                        title={soundEnabled ? 'Chime sound enabled' : 'Chime sound muted'}
                    >
                        {soundEnabled ? <Volume2 size={16} className="text-red" /> : <VolumeX size={16} />}
                    </button>

                    {/* Refresh Button */}
                    <button
                        onClick={() => fetchReservations(false)}
                        disabled={isRefreshing}
                        className="btn-outline bg-white py-2.5 px-4 text-xs font-bold flex items-center gap-2 border-[#e2d4c4] shadow-sm hover:border-red"
                    >
                        <RefreshCw size={14} className={isRefreshing ? 'animate-spin text-red' : ''} />
                        Sync Now
                    </button>

                    {/* Manual Reservation Button */}
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="btn-primary py-2.5 px-4 text-xs font-black uppercase tracking-wider flex items-center gap-2 rounded-xl shadow-md shadow-red/20"
                    >
                        <Plus size={16} /> New Table Booking
                    </button>
                </div>
            </div>

            {/* Quick Stat Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-[#e2d4c4] shadow-sm flex items-center justify-between">
                    <div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-muted block">Total Bookings</span>
                        <span className="text-2xl font-serif font-black text-dark">{reservations.length}</span>
                    </div>
                    <div className="p-2.5 bg-cream3 rounded-xl text-brown">
                        <Calendar size={18} />
                    </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-amber-200 bg-amber-50/30 shadow-sm flex items-center justify-between">
                    <div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 block">Pending Requests</span>
                        <span className="text-2xl font-serif font-black text-amber-900">{pendingCount}</span>
                    </div>
                    <div className="p-2.5 bg-amber-100 rounded-xl text-amber-800">
                        <Clock size={18} />
                    </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-emerald-200 bg-emerald-50/30 shadow-sm flex items-center justify-between">
                    <div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 block">Confirmed Tables</span>
                        <span className="text-2xl font-serif font-black text-emerald-900">{confirmedCount}</span>
                    </div>
                    <div className="p-2.5 bg-emerald-100 rounded-xl text-emerald-800">
                        <CheckCircle2 size={18} />
                    </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-red/20 bg-red/5 shadow-sm flex items-center justify-between">
                    <div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-red block">Today's Schedule</span>
                        <span className="text-2xl font-serif font-black text-red">{todayCount}</span>
                    </div>
                    <div className="p-2.5 bg-red/10 rounded-xl text-red">
                        <Sparkles size={18} />
                    </div>
                </div>
            </div>

            {/* Main Table Card */}
            <div className="glass-card bg-white rounded-2xl border border-[#e2d4c4] shadow-sm flex-1 overflow-hidden flex flex-col">
                {/* Search & Filter Toolbar */}
                <div className="p-4 border-b border-[#e2d4c4] flex flex-col md:flex-row justify-between gap-4 bg-[#fcf9f5]">
                    <div className="flex flex-wrap gap-3 items-center flex-1">
                        {/* Search Input */}
                        <div className="relative flex-1 min-w-[240px] max-w-md">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" size={16} />
                            <input
                                type="text"
                                placeholder="Search by guest name, email, phone, notes..."
                                className="pl-10 input-field py-2.5 text-xs bg-white border-[#e2d4c4] focus:border-red w-full rounded-xl"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted hover:text-red font-bold"
                                >
                                    ✕
                                </button>
                            )}
                        </div>

                        {/* Date Filter */}
                        <div className="flex gap-2 items-center bg-white px-3 py-2 rounded-xl border border-[#e2d4c4]">
                            <Calendar className="text-muted" size={15} />
                            <input
                                type="date"
                                className="text-xs bg-transparent font-sans font-bold text-brown focus:outline-none"
                                value={dateFilter}
                                onChange={(e) => setDateFilter(e.target.value)}
                            />
                            {dateFilter && (
                                <button onClick={() => setDateFilter('')} className="text-[10px] text-muted hover:text-red font-bold">
                                    ✕
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Status Filter Tabs */}
                    <div className="flex p-1 bg-cream3 rounded-xl border border-[#e2d4c4]/60 self-start md:self-auto overflow-x-auto">
                        {[
                            { id: 'all', label: `All (${reservations.length})` },
                            { id: 'pending', label: `Pending (${pendingCount})` },
                            { id: 'confirmed', label: `Confirmed (${confirmedCount})` },
                            { id: 'cancelled', label: `Cancelled (${cancelledCount})` },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setStatusFilter(tab.id)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                                    statusFilter === tab.id
                                        ? 'bg-dark text-white shadow-sm'
                                        : 'text-brown hover:text-dark'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Table Content */}
                {loading ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-20 text-muted gap-3">
                        <Loader2 className="w-8 h-8 animate-spin text-red" />
                        <span className="text-xs font-bold uppercase tracking-widest text-brown">Syncing live reservations...</span>
                    </div>
                ) : (
                    <div className="overflow-x-auto flex-1 custom-scrollbar">
                        <table className="w-full text-left font-sans text-sm">
                            <thead className="bg-dark text-white uppercase text-[11px] tracking-wider font-bold sticky top-0 z-10">
                                <tr>
                                    <th className="px-6 py-4">Guest Details</th>
                                    <th className="px-6 py-4">Contact Info</th>
                                    <th className="px-6 py-4">Reservation Date & Time</th>
                                    <th className="px-6 py-4">Party & Occasion</th>
                                    <th className="px-6 py-4">Current Status</th>
                                    <th className="px-6 py-4 text-right">Quick Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#e2d4c4]/60 bg-white">
                                {filteredReservations.length > 0 ? (
                                    filteredReservations.map((res) => {
                                        const initials = `${(res.firstName || 'G').charAt(0)}${(res.lastName || 'P').charAt(0)}`.toUpperCase();
                                        return (
                                            <tr key={res._id} className="hover:bg-[#fcf9f5] transition-colors group">
                                                {/* Guest Name & Notes */}
                                                <td className="px-6 py-4">
                                                    <div className="flex items-start gap-3">
                                                        <div className="w-10 h-10 rounded-xl bg-cream3 text-dark flex items-center justify-center font-serif font-black text-sm border border-[#e2d4c4] shadow-sm shrink-0 mt-0.5">
                                                            {initials}
                                                        </div>
                                                        <div>
                                                            <span className="font-serif font-black text-dark text-base block">
                                                                {res.firstName} {res.lastName}
                                                            </span>
                                                            {res.specialRequests ? (
                                                                <p className="text-xs text-muted italic mt-0.5 max-w-xs leading-tight">
                                                                    "{res.specialRequests}"
                                                                </p>
                                                            ) : (
                                                                <span className="text-[11px] text-muted/60 font-sans">No special notes</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Contact */}
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col text-xs space-y-1">
                                                        <a
                                                            href={`mailto:${res.email}`}
                                                            className="font-bold text-dark hover:text-red flex items-center gap-1.5 transition-colors"
                                                        >
                                                            <Mail size={13} className="text-muted" /> {res.email}
                                                        </a>
                                                        <a
                                                            href={`tel:${res.phone}`}
                                                            className="text-brown hover:text-red font-medium flex items-center gap-1.5 transition-colors"
                                                        >
                                                            <Phone size={13} className="text-red" /> {res.phone}
                                                        </a>
                                                    </div>
                                                </td>

                                                {/* Date & Time */}
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-dark text-sm">
                                                            {formatDateDisplay(res.date)}
                                                        </span>
                                                        <span className="text-red font-serif font-black text-xs flex items-center gap-1 mt-0.5">
                                                            <Clock size={12} /> {res.time}
                                                        </span>
                                                    </div>
                                                </td>

                                                {/* Party & Occasion */}
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col gap-1 items-start">
                                                        <span className="font-bold text-dark text-xs sm:text-sm flex items-center gap-1.5 bg-cream px-2.5 py-1 rounded-lg border border-[#e2d4c4]">
                                                            <Users size={14} className="text-red" /> {res.partySize || 2} Guests
                                                        </span>
                                                        {res.occasion && res.occasion !== 'None' && (
                                                            <span className="text-[10px] font-black text-red uppercase tracking-wider bg-red/10 px-2 py-0.5 rounded">
                                                                {res.occasion}
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>

                                                {/* Status Badge */}
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm ${
                                                        res.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                                                        res.status === 'pending' ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                                                        'bg-red-100 text-red-800 border border-red-300'
                                                    }`}>
                                                        <span className={`w-2 h-2 rounded-full ${
                                                            res.status === 'confirmed' ? 'bg-emerald-600' :
                                                            res.status === 'pending' ? 'bg-amber-600 animate-ping' : 'bg-red-600'
                                                        }`}></span>
                                                        {res.status}
                                                    </span>
                                                </td>

                                                {/* Actions */}
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex justify-end items-center gap-1.5">
                                                        {res.status !== 'confirmed' && (
                                                            <button
                                                                onClick={() => handleUpdateStatus(res._id, 'confirmed')}
                                                                className="px-2.5 py-1.5 border border-emerald-300 bg-emerald-50 text-emerald-800 rounded-lg hover:bg-emerald-600 hover:text-white transition-all text-xs font-bold flex items-center gap-1 shadow-sm"
                                                                title="Confirm Reservation"
                                                            >
                                                                <CheckCircle2 size={13} /> Confirm
                                                            </button>
                                                        )}
                                                        {res.status !== 'pending' && (
                                                            <button
                                                                onClick={() => handleUpdateStatus(res._id, 'pending')}
                                                                className="px-2.5 py-1.5 border border-amber-300 bg-amber-50 text-amber-800 rounded-lg hover:bg-amber-600 hover:text-white transition-all text-xs font-bold flex items-center gap-1 shadow-sm"
                                                                title="Set to Pending"
                                                            >
                                                                <Clock size={13} /> Pending
                                                            </button>
                                                        )}
                                                        {res.status !== 'cancelled' && (
                                                            <button
                                                                onClick={() => handleUpdateStatus(res._id, 'cancelled')}
                                                                className="px-2 py-1.5 border border-red/30 bg-red/5 text-red rounded-lg hover:bg-red hover:text-white transition-all text-xs font-bold flex items-center gap-1"
                                                                title="Cancel Reservation"
                                                            >
                                                                <XCircle size={13} /> Cancel
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => handleDelete(res._id)}
                                                            className="p-1.5 border border-[#e2d4c4] rounded-lg text-muted hover:bg-dark hover:text-white transition-all ml-1"
                                                            title="Delete Record"
                                                        >
                                                            <Trash2 size={13} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-24 text-center text-muted">
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="w-14 h-14 rounded-full bg-cream3 flex items-center justify-center text-muted">
                                                    <Calendar size={28} />
                                                </div>
                                                <span className="text-sm font-bold uppercase tracking-widest text-dark">No reservations found</span>
                                                <p className="text-xs text-muted max-w-sm">No reservations match your current filters or query.</p>
                                                <button
                                                    onClick={() => { setSearchQuery(''); setDateFilter(''); setStatusFilter('all'); }}
                                                    className="btn-primary text-xs py-2 px-5 mt-2"
                                                >
                                                    Clear All Filters
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Footer Sync Status */}
                <div className="p-4 border-t border-[#e2d4c4] flex flex-col sm:flex-row justify-between items-center text-xs text-muted font-bold tracking-wider uppercase bg-[#fcf9f5] gap-2">
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        <span>Showing {filteredReservations.length} of {reservations.length} bookings &bull; Last synchronized {lastSyncTime.toLocaleTimeString()}</span>
                    </div>
                    <div className="flex gap-4">
                        <span className="text-emerald-700 font-black">Confirmed: {confirmedCount}</span>
                        <span className="text-amber-700 font-black">Pending: {pendingCount}</span>
                        <span className="text-red font-black">Cancelled: {cancelledCount}</span>
                    </div>
                </div>
            </div>

            {/* Modal: Create Manual / Walk-in Booking */}
            <AnimatePresence>
                {isAddModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-dark/75 backdrop-blur-sm"
                            onClick={() => !isSubmitting && setIsAddModalOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-lg bg-[#fdf8f2] rounded-3xl shadow-2xl border border-white/20 overflow-hidden my-8 z-10"
                        >
                            <div className="p-6 border-b border-[#e2d4c4] bg-white flex justify-between items-center">
                                <div>
                                    <h3 className="font-serif font-black text-xl text-dark">
                                        Manual Table Reservation
                                    </h3>
                                    <p className="text-xs text-muted">Add phone or in-person walk-in guest reservation directly.</p>
                                </div>
                                <button
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="p-1 text-muted hover:text-red"
                                >
                                    ✕
                                </button>
                            </div>

                            <form onSubmit={handleCreateManualReservation} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-[11px] font-black uppercase tracking-wider text-brown mb-1">
                                        Guest Full Name *
                                    </label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="input-field bg-white border-[#e2d4c4] text-sm"
                                        placeholder="e.g. Robert Smith"
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[11px] font-black uppercase tracking-wider text-brown mb-1">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="input-field bg-white border-[#e2d4c4] text-sm"
                                            placeholder="guest@example.com"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-black uppercase tracking-wider text-brown mb-1">
                                            Phone Number
                                        </label>
                                        <input
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="input-field bg-white border-[#e2d4c4] text-sm"
                                            placeholder="+1 (555) 000-0000"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-[11px] font-black uppercase tracking-wider text-brown mb-1">
                                            Date *
                                        </label>
                                        <input
                                            required
                                            type="date"
                                            value={formData.date}
                                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                            className="input-field bg-white border-[#e2d4c4] text-xs font-bold"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-black uppercase tracking-wider text-brown mb-1">
                                            Time *
                                        </label>
                                        <select
                                            value={formData.time}
                                            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                            className="input-field bg-white border-[#e2d4c4] text-xs font-bold"
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
                                    <div>
                                        <label className="block text-[11px] font-black uppercase tracking-wider text-brown mb-1">
                                            Party Size *
                                        </label>
                                        <select
                                            value={formData.partySize}
                                            onChange={(e) => setFormData({ ...formData, partySize: e.target.value })}
                                            className="input-field bg-white border-[#e2d4c4] text-xs font-bold"
                                        >
                                            {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 16].map(n => (
                                                <option key={n} value={n}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[11px] font-black uppercase tracking-wider text-brown mb-1">
                                            Occasion
                                        </label>
                                        <select
                                            value={formData.occasion}
                                            onChange={(e) => setFormData({ ...formData, occasion: e.target.value })}
                                            className="input-field bg-white border-[#e2d4c4] text-xs font-bold"
                                        >
                                            <option value="None">None / Standard</option>
                                            <option value="Birthday">Birthday</option>
                                            <option value="Anniversary">Anniversary</option>
                                            <option value="Business">Business Dinner</option>
                                            <option value="Proposal">Proposal</option>
                                            <option value="Other">Other Celebration</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-black uppercase tracking-wider text-brown mb-1">
                                            Initial Status
                                        </label>
                                        <select
                                            value={formData.status}
                                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                            className="input-field bg-white border-[#e2d4c4] text-xs font-bold"
                                        >
                                            <option value="confirmed">Confirmed</option>
                                            <option value="pending">Pending</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[11px] font-black uppercase tracking-wider text-brown mb-1">
                                        Special Requests / Table Notes
                                    </label>
                                    <textarea
                                        rows="2"
                                        value={formData.specialRequests}
                                        onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                                        className="input-field bg-white border-[#e2d4c4] resize-none text-xs"
                                        placeholder="Table preference, dietary allergies, VIP guest..."
                                    ></textarea>
                                </div>

                                <div className="pt-3 flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setIsAddModalOpen(false)}
                                        className="flex-1 btn-outline bg-white py-3 border-[#e2d4c4]"
                                        disabled={isSubmitting}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="flex-1 btn-primary py-3 flex items-center justify-center gap-2 shadow-lg shadow-red/25"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="animate-spin" size={16} /> Creating...
                                            </>
                                        ) : (
                                            <>
                                                <Check size={16} /> Save Table Booking
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ManageReservations;
