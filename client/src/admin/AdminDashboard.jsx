import React, { useState, useEffect } from 'react';
import { Users, DollarSign, CalendarDays, TrendingUp, Utensils, Download, Loader2, RefreshCw, ShoppingBag, Clock, ArrowRight, CheckCircle2, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { orderService } from '../services/orderService';
import { reservationService } from '../services/reservationService';
import { formatPrice } from '../utils/formatPrice';

const AdminDashboard = () => {
    const [loading, setLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [stats, setStats] = useState([]);
    const [reservations, setReservations] = useState([]);
    const [recentOrders, setRecentOrders] = useState([]);
    const [lastSyncTime, setLastSyncTime] = useState(new Date());

    useEffect(() => {
        fetchDashboardData(false);

        // Fast Real-Time Live Polling every 4 seconds
        const interval = setInterval(() => {
            fetchDashboardData(true);
        }, 4000);

        // Instant Sub-millisecond Cross-Tab Broadcast Synchronization
        let channel;
        try {
            channel = new BroadcastChannel('drizzle_live_sync');
            channel.onmessage = () => {
                fetchDashboardData(true);
            };
        } catch (e) {}

        return () => {
            clearInterval(interval);
            if (channel) channel.close();
        };
    }, []);

    const fetchDashboardData = async (isBackground = false) => {
        try {
            if (!isBackground) setIsRefreshing(true);
            const [ordersData, reservationsData] = await Promise.all([
                orderService.getAll(),
                reservationService.getAll()
            ]);

            const orders = ordersData.data || [];
            const allReservations = reservationsData.data || [];

            // Calculate live stats
            const totalRevenue = orders.reduce((sum, order) => sum + (parseFloat(order.totalAmount) || 0), 0);
            const activeOrders = orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled').length;
            const confirmedReservations = allReservations.filter(r => r.status === 'confirmed').length;
            const pendingReservations = allReservations.filter(r => r.status === 'pending').length;

            setStats([
                {
                    title: "Total Revenue",
                    value: formatPrice(totalRevenue),
                    trend: `${orders.length} orders`,
                    isPositive: true,
                    icon: DollarSign,
                    color: "text-emerald-700 bg-emerald-100"
                },
                {
                    title: "Total Reservations",
                    value: allReservations.length.toString(),
                    trend: `${pendingReservations} pending`,
                    isPositive: true,
                    icon: CalendarDays,
                    color: "text-red bg-red/10"
                },
                {
                    title: "Confirmed Bookings",
                    value: confirmedReservations.toString(),
                    trend: "Active guests",
                    isPositive: true,
                    icon: Users,
                    color: "text-blue-700 bg-blue-100"
                },
                {
                    title: "Active Kitchen Orders",
                    value: activeOrders.toString(),
                    trend: "In progress",
                    isPositive: activeOrders > 0,
                    icon: Utensils,
                    color: "text-amber-700 bg-amber-100"
                },
            ]);

            setReservations(allReservations.slice(0, 5));
            setRecentOrders(orders.slice(0, 5));
            setLastSyncTime(new Date());
        } catch (error) {
            console.error("Dashboard fetch error:", error);
        } finally {
            setLoading(false);
            if (!isBackground) setIsRefreshing(false);
        }
    };

    const formatDateDisplay = (d) => {
        if (!d) return 'Today';
        try {
            if (typeof d === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d.trim())) {
                const [year, month, day] = d.trim().split('-').map(Number);
                const dateObj = new Date(year, month - 1, day);
                return dateObj.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
            }
            return new Date(d).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
        } catch (e) {
            return String(d);
        }
    };

    if (loading) {
        return (
            <div className="h-full flex items-center justify-center py-32">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 text-red animate-spin" />
                    <p className="text-muted font-bold text-xs uppercase tracking-widest animate-pulse">Loading live restaurant analytics...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="h2-fluid text-dark font-serif font-black">Executive Command Center</h1>
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full border border-emerald-300 text-[11px] font-black uppercase tracking-wider shadow-sm">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            Live Sync Active
                        </div>
                    </div>
                    <p className="text-muted text-xs sm:text-sm font-medium mt-1">
                        Real-time revenue, reservations, and kitchen operations &bull; Updated {lastSyncTime.toLocaleTimeString()}
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => fetchDashboardData(false)}
                        disabled={isRefreshing}
                        className="btn-outline bg-white py-2.5 px-4 text-xs font-bold flex items-center gap-2 border-[#e2d4c4] shadow-sm hover:border-red"
                    >
                        <RefreshCw size={14} className={isRefreshing ? 'animate-spin text-red' : ''} />
                        Refresh Data
                    </button>
                    <Link
                        to="/admin/reservations"
                        className="btn-primary py-2.5 px-4 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 rounded-xl shadow-md shadow-red/20"
                    >
                        Manage Bookings <ArrowRight size={14} />
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {stats.map((stat, idx) => {
                    const Icon = stat.icon;
                    return (
                        <motion.div
                            key={stat.title}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: idx * 0.08 }}
                            className="glass-card bg-white p-6 rounded-2xl border border-[#e2d4c4] shadow-sm hover:shadow-md transition-all"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-3 rounded-xl ${stat.color}`}>
                                    <Icon size={20} />
                                </div>
                                <span className="text-[11px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider bg-cream3 text-brown">
                                    {stat.trend}
                                </span>
                            </div>
                            <div>
                                <h3 className="text-3xl font-serif font-black text-dark tracking-tight">{stat.value}</h3>
                                <p className="text-[11px] font-sans text-muted font-black uppercase tracking-wider mt-1">{stat.title}</p>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Split Grids: Live Reservations & Live Orders */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Real-Time Upcoming Table Bookings */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className="glass-card bg-white p-6 rounded-2xl border border-[#e2d4c4] shadow-sm flex flex-col"
                >
                    <div className="flex justify-between items-center pb-4 mb-4 border-b border-[#e2d4c4]">
                        <div className="flex items-center gap-2">
                            <CalendarDays size={20} className="text-red" />
                            <h3 className="font-serif font-black text-xl text-dark">Live Table Reservations</h3>
                        </div>
                        <Link
                            to="/admin/reservations"
                            className="text-xs font-black uppercase tracking-wider text-red hover:underline flex items-center gap-1"
                        >
                            View All <ChevronRight size={14} />
                        </Link>
                    </div>

                    <div className="space-y-3 flex-1 overflow-y-auto max-h-[380px] custom-scrollbar pr-1">
                        {reservations.length > 0 ? (
                            reservations.map((res) => {
                                const initials = `${(res.firstName || 'G').charAt(0)}${(res.lastName || 'P').charAt(0)}`.toUpperCase();
                                return (
                                    <div
                                        key={res._id}
                                        className="flex items-center justify-between p-3.5 hover:bg-[#fcf9f5] rounded-xl transition-all border border-[#e2d4c4]/60 group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-cream3 text-dark flex items-center justify-center font-serif font-black text-xs border border-[#e2d4c4] shadow-xs group-hover:bg-red group-hover:text-white transition-all">
                                                {initials}
                                            </div>
                                            <div>
                                                <h4 className="font-sans font-bold text-sm text-dark">{res.firstName} {res.lastName}</h4>
                                                <p className="text-[11px] text-muted font-medium flex items-center gap-2 mt-0.5">
                                                    <span>{formatDateDisplay(res.date)} &bull; {res.time}</span>
                                                    <span className="font-bold text-brown">({res.partySize || 2} Guests)</span>
                                                </p>
                                            </div>
                                        </div>
                                        <div>
                                            <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-xs ${
                                                res.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                                                res.status === 'pending' ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                                                'bg-red-100 text-red-800 border border-red-300'
                                            }`}>
                                                {res.status}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="h-48 flex flex-col items-center justify-center text-muted gap-2">
                                <CalendarDays size={32} className="opacity-30" />
                                <span className="text-xs font-bold uppercase tracking-wider">No active reservations</span>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Real-Time Live Kitchen Orders */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="glass-card bg-white p-6 rounded-2xl border border-[#e2d4c4] shadow-sm flex flex-col"
                >
                    <div className="flex justify-between items-center pb-4 mb-4 border-b border-[#e2d4c4]">
                        <div className="flex items-center gap-2">
                            <ShoppingBag size={20} className="text-red" />
                            <h3 className="font-serif font-black text-xl text-dark">Live Kitchen Stream</h3>
                        </div>
                        <Link
                            to="/admin/orders"
                            className="text-xs font-black uppercase tracking-wider text-red hover:underline flex items-center gap-1"
                        >
                            View Kanban <ChevronRight size={14} />
                        </Link>
                    </div>

                    <div className="space-y-3 flex-1 overflow-y-auto max-h-[380px] custom-scrollbar pr-1">
                        {recentOrders.length > 0 ? (
                            recentOrders.map((order) => {
                                const customer = order.customerName || order.user?.name || 'Guest Patron';
                                const itemsCount = (order.items || []).length;
                                return (
                                    <div
                                        key={order._id}
                                        className="flex items-center justify-between p-3.5 hover:bg-[#fcf9f5] rounded-xl transition-all border border-[#e2d4c4]/60 group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-dark text-white flex items-center justify-center font-serif font-black text-xs shadow-xs group-hover:bg-red transition-all">
                                                #{order._id.slice(-3).toUpperCase()}
                                            </div>
                                            <div>
                                                <h4 className="font-sans font-bold text-sm text-dark">{customer}</h4>
                                                <p className="text-[11px] text-muted font-medium mt-0.5">
                                                    {itemsCount} dish{itemsCount !== 1 ? 'es' : ''} &bull; <strong className="text-red font-serif">{formatPrice(order.totalAmount)}</strong>
                                                </p>
                                            </div>
                                        </div>
                                        <div>
                                            <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-xs ${
                                                order.status === 'delivered' ? 'bg-emerald-100 text-emerald-800' :
                                                order.status === 'ready' ? 'bg-blue-100 text-blue-800' :
                                                order.status === 'preparing' ? 'bg-orange-100 text-orange-800' :
                                                'bg-amber-100 text-amber-800'
                                            }`}>
                                                {order.status || 'pending'}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="h-48 flex flex-col items-center justify-center text-muted gap-2">
                                <ShoppingBag size={32} className="opacity-30" />
                                <span className="text-xs font-bold uppercase tracking-wider">No active kitchen orders</span>
                            </div>
                        )}
                    </div>
                </motion.div>

            </div>
        </div>
    );
};

export default AdminDashboard;
