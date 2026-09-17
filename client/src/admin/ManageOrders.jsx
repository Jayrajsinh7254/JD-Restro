import React, { useState, useEffect, useRef } from 'react';
import { Truck, CheckCircle, Clock, Loader2, Package, User, MapPin, Phone, Trash2, ChevronRight, RefreshCw, AlertCircle, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { orderService } from '../services/orderService';
import { formatPrice } from '../utils/formatPrice';
import toast from 'react-hot-toast';

const STATUS_COLUMNS = [
    { id: 'pending', label: 'New / Pending', color: 'border-amber-400 bg-amber-50/40 text-amber-800' },
    { id: 'preparing', label: 'Preparing in Kitchen', color: 'border-orange-400 bg-orange-50/40 text-orange-800' },
    { id: 'ready', label: 'Ready for Dispatch / Pickup', color: 'border-blue-400 bg-blue-50/40 text-blue-800' },
    { id: 'delivered', label: 'Completed & Delivered', color: 'border-emerald-400 bg-emerald-50/40 text-emerald-800' }
];

const ManageOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [lastSyncTime, setLastSyncTime] = useState(new Date());

    const prevCountRef = useRef(0);

    const playNotificationChime = () => {
        if (!soundEnabled) return;
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
            osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
            osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2); // G5
            gain.gain.setValueAtTime(0.15, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.42);
        } catch (e) {}
    };

    useEffect(() => {
        fetchOrders(false);

        // Fast real-time polling every 3.5 seconds
        const interval = setInterval(() => {
            fetchOrders(true);
        }, 3500);

        // Instant cross-tab sync
        let channel;
        try {
            channel = new BroadcastChannel('drizzle_live_sync');
            channel.onmessage = (event) => {
                if (event.data?.type === 'NEW_ORDER') {
                    fetchOrders(true);
                    playNotificationChime();
                    toast.success(`🍽️ New incoming order from ${event.data.data?.customerName || 'Customer'}!`, {
                        duration: 4500,
                        icon: '🔥'
                    });
                }
            };
        } catch (e) {}

        return () => {
            clearInterval(interval);
            if (channel) channel.close();
        };
    }, [soundEnabled]);

    const fetchOrders = async (isBackground = false) => {
        try {
            if (!isBackground) setIsRefreshing(true);
            const response = await orderService.getAll();
            const data = response.data || [];

            if (isBackground && data.length > prevCountRef.current && prevCountRef.current > 0) {
                playNotificationChime();
                const latest = data[0];
                toast.success(`🍽️ New order received: ${latest.customerName} (${formatPrice(latest.totalAmount)})`);
            }
            prevCountRef.current = data.length;

            setOrders(data);
            setLastSyncTime(new Date());
        } catch (error) {
            console.error('Failed to fetch orders:', error);
            if (!isBackground && loading) toast.error('Failed to load orders');
        } finally {
            setLoading(false);
            if (!isBackground) setIsRefreshing(false);
        }
    };

    const handleUpdateStatus = async (id, newStatus) => {
        try {
            await orderService.updateStatus(id, newStatus);
            toast.success(`Order moved to ${newStatus}`);
            fetchOrders(false);
        } catch (error) {
            toast.error('Failed to update order status');
        }
    };

    const handleDeleteOrder = async (id) => {
        if (!window.confirm('Delete this order record permanently?')) return;
        try {
            await orderService.delete(id);
            toast.success('Order record deleted');
            fetchOrders(false);
        } catch (error) {
            toast.error('Failed to delete order');
        }
    };

    // Helper to get orders for column
    const getOrdersForStatus = (status) => {
        return orders.filter(o => {
            const s = (o.status || 'pending').toLowerCase();
            if (status === 'pending') return s === 'pending' || s === 'new';
            if (status === 'preparing') return s === 'preparing' || s === 'in_progress';
            if (status === 'ready') return s === 'ready' || s === 'dispatched';
            if (status === 'delivered') return s === 'delivered' || s === 'completed';
            return s === status;
        });
    };

    const getNextStatus = (currentStatus) => {
        const s = (currentStatus || 'pending').toLowerCase();
        if (s === 'pending' || s === 'new') return { status: 'preparing', label: 'Send to Kitchen' };
        if (s === 'preparing' || s === 'in_progress') return { status: 'ready', label: 'Mark Ready' };
        if (s === 'ready' || s === 'dispatched') return { status: 'delivered', label: 'Mark Delivered' };
        return null;
    };

    return (
        <div className="h-full flex flex-col space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="h2-fluid text-dark font-serif font-black">Live Order Stream</h1>
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full border border-emerald-300 text-[11px] font-black uppercase tracking-wider shadow-sm">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            Live Kitchen Feed
                        </div>
                    </div>
                    <p className="text-muted text-xs sm:text-sm font-medium mt-1">Real-time takeout & delivery fulfillment pipeline.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setSoundEnabled(!soundEnabled)}
                        className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all ${
                            soundEnabled ? 'bg-white border-[#e2d4c4] text-brown' : 'bg-cream3 border-border text-muted'
                        }`}
                        title={soundEnabled ? 'Order sound alert enabled' : 'Order sound alert muted'}
                    >
                        {soundEnabled ? <Volume2 size={16} className="text-red" /> : <VolumeX size={16} />}
                    </button>

                    <button
                        onClick={() => fetchOrders(false)}
                        disabled={isRefreshing}
                        className="btn-outline bg-white py-2.5 px-4 text-xs font-bold flex items-center gap-2 border-[#e2d4c4] shadow-sm hover:border-red"
                    >
                        <RefreshCw size={14} className={isRefreshing ? 'animate-spin text-red' : ''} />
                        Refresh Feed
                    </button>
                    <div className="flex items-center gap-2 px-3.5 py-2 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 text-xs font-black uppercase tracking-wider">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        {orders.length} Total Orders
                    </div>
                </div>
            </div>

            {/* Kanban Columns */}
            {loading ? (
                <div className="flex-1 flex flex-col items-center justify-center p-20 text-muted gap-4">
                    <Loader2 className="w-10 h-10 animate-spin text-red" />
                    <p className="text-xs font-bold uppercase tracking-widest text-brown">Syncing Kitchen Orders...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 flex-1 items-start">
                    {STATUS_COLUMNS.map(col => {
                        const colOrders = getOrdersForStatus(col.id);
                        return (
                            <div key={col.id} className="flex flex-col bg-cream rounded-2xl border border-[#e2d4c4] p-4 max-h-[800px] flex-1 shadow-sm">
                                {/* Column Header */}
                                <div className="flex justify-between items-center pb-3 mb-3 border-b border-[#e2d4c4]">
                                    <h3 className="font-serif font-bold text-dark text-sm">{col.label}</h3>
                                    <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-white border border-[#e2d4c4] text-brown shadow-xs">
                                        {colOrders.length}
                                    </span>
                                </div>

                                {/* Column Orders Card List */}
                                <div className="space-y-4 overflow-y-auto custom-scrollbar flex-1 pr-1">
                                    {colOrders.length > 0 ? (
                                        colOrders.map(order => {
                                            const nextAction = getNextStatus(order.status);
                                            const itemsList = order.items || order.orderItems || [];
                                            const customer = order.customerName || order.user?.name || 'Guest Patron';
                                            const address = order.deliveryAddress || order.shippingAddress?.address || 'Pickup at Restaurant';

                                            return (
                                                <div
                                                    key={order._id}
                                                    className="bg-white p-4 rounded-xl border border-[#e2d4c4] shadow-sm hover:shadow-md transition-all space-y-3"
                                                >
                                                    {/* Order Header */}
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <span className="text-[10px] font-black uppercase text-muted tracking-wider block">
                                                                Order #{order._id.slice(-5).toUpperCase()}
                                                            </span>
                                                            <h4 className="font-serif font-black text-dark text-sm flex items-center gap-1.5">
                                                                <User size={13} className="text-red" /> {customer}
                                                            </h4>
                                                        </div>
                                                        <span className="text-[10px] font-bold text-muted flex items-center gap-1 bg-cream2 px-2 py-0.5 rounded">
                                                            <Clock size={11} /> {new Date(order.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                    </div>

                                                    {/* Contact & Address */}
                                                    <div className="text-xs text-muted space-y-1 bg-cream2/60 p-2.5 rounded-lg">
                                                        {order.customerPhone && (
                                                            <p className="flex items-center gap-1 text-[11px] font-bold text-brown">
                                                                <Phone size={11} className="text-red" /> {order.customerPhone}
                                                            </p>
                                                        )}
                                                        <p className="flex items-start gap-1 text-[11px] leading-tight">
                                                            <MapPin size={11} className="shrink-0 text-muted mt-0.5" /> {address}
                                                        </p>
                                                    </div>

                                                    {/* Dishes in Order */}
                                                    <div className="space-y-1 border-t border-b border-[#e2d4c4]/60 py-2 text-xs">
                                                        {itemsList.map((item, idx) => (
                                                            <div key={idx} className="flex justify-between items-center text-brown font-medium">
                                                                <span>{item.quantity || 1}x {item.name}</span>
                                                                <span className="text-muted font-mono text-[11px]">{formatPrice((item.price || 0) * (item.quantity || 1))}</span>
                                                            </div>
                                                        ))}
                                                        <div className="flex justify-between items-center pt-1.5 font-bold text-dark text-xs">
                                                            <span>Total Due</span>
                                                            <span className="text-red font-serif font-black text-sm">{formatPrice(order.totalAmount)}</span>
                                                        </div>
                                                    </div>

                                                    {/* Action Controls */}
                                                    <div className="flex justify-between items-center pt-1">
                                                        <button
                                                            onClick={() => handleDeleteOrder(order._id)}
                                                            className="p-1.5 text-muted hover:text-red transition-colors rounded-lg hover:bg-cream"
                                                            title="Delete order"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>

                                                        {nextAction && (
                                                            <button
                                                                onClick={() => handleUpdateStatus(order._id, nextAction.status)}
                                                                className="btn-primary py-1.5 px-3 text-[10px] font-black uppercase tracking-wider rounded-lg flex items-center gap-1 shadow-sm"
                                                            >
                                                                {nextAction.label} <ChevronRight size={13} />
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div className="py-12 text-center text-muted text-xs font-bold">
                                            No orders in this phase
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default ManageOrders;
