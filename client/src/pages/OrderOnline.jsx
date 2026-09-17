import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Search, Plus, Minus, Check, ArrowRight, Sparkles, MapPin, Clock, Truck, ShieldCheck, Leaf } from 'lucide-react';
import { useMenu } from '../hooks/useMenu';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/formatPrice';
import { orderService } from '../services/orderService';
import toast from 'react-hot-toast';

const CATEGORIES = [
    { id: 'All', label: 'All Items' },
    { id: 'Starters', label: 'Starters' },
    { id: 'Main Course', label: 'Mains & Steaks' },
    { id: 'Vegan', label: 'Plant-Based' },
    { id: 'Seafood', label: 'Seafood' },
    { id: 'Desserts', label: 'Desserts' },
    { id: 'Drinks', label: 'Beverages' }
];

const OrderOnline = () => {
    const { items, loading } = useMenu();
    const { cartItems, cartTotalAmount, cartTotalItems, addToCart, updateQuantity, removeFromCart, clearCart } = useCart();

    const [activeCategory, setActiveCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [orderType, setOrderType] = useState('delivery'); // 'delivery' or 'pickup'
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        deliveryAddress: '',
        instructions: ''
    });

    const normalizeCat = (cat) => {
        if (!cat) return 'Main Course';
        const c = cat.toLowerCase();
        if (c.includes('start')) return 'Starters';
        if (c.includes('main')) return 'Main Course';
        if (c.includes('vegan')) return 'Vegan';
        if (c.includes('sea')) return 'Seafood';
        if (c.includes('dessert')) return 'Desserts';
        if (c.includes('drink')) return 'Drinks';
        return cat;
    };

    const filteredItems = items.filter(item => {
        const itemCat = normalizeCat(item.category);
        const matchesCat = activeCategory === 'All' || itemCat === activeCategory || item.category === activeCategory;
        const matchesSearch = !searchQuery ||
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesCat && matchesSearch;
    });

    const handleCheckoutSubmit = async (e) => {
        e.preventDefault();
        if (cartItems.length === 0) return toast.error('Your order bag is empty');

        setIsSubmitting(true);
        try {
            const orderPayload = {
                items: cartItems.map(i => ({
                    menuItem: i.menuItem,
                    name: i.name,
                    price: i.price,
                    quantity: i.quantity
                })),
                totalAmount: cartTotalAmount * 1.08875,
                customerName: formData.customerName,
                customerEmail: formData.customerEmail,
                customerPhone: formData.customerPhone,
                deliveryAddress: orderType === 'delivery' ? formData.deliveryAddress : 'Customer Pickup at Restaurant',
                specialInstructions: formData.instructions
            };

            const res = await orderService.create(orderPayload);
            
            // Broadcast instant live synchronization to admin tabs
            try {
                const channel = new BroadcastChannel('drizzle_live_sync');
                channel.postMessage({ type: 'NEW_ORDER', data: res.data || orderPayload });
                channel.close();
            } catch (e) {
                // BroadcastChannel fallback
            }

            toast.success('Order placed successfully! We are preparing your meal.');
            clearCart();
            setIsCheckingOut(false);
            setFormData({
                customerName: '',
                customerEmail: '',
                customerPhone: '',
                deliveryAddress: '',
                instructions: ''
            });
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to place order. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="pt-20 min-h-screen bg-[#fdf8f2] pb-28">
            {/* Header */}
            <section className="py-16 md:py-20 text-center bg-[#1a0e06] text-white relative overflow-hidden bg-radial-glow">
                <div className="container-wide relative z-10 px-4 sm:px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="max-w-2xl mx-auto"
                    >
                        <span className="eyebrow-tag border-white/20 text-[#f5ede0] mb-4 inline-flex items-center gap-2">
                            <Truck size={13} className="text-red" /> Direct Dining & Takeout Service
                        </span>
                        <h1 className="h1-fluid mb-4 text-[#fdf8f2]">Order Online</h1>
                        <p className="body-fluid text-white/70 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
                            Enjoy Drizzle’s signature haute cuisine from the comfort of your home or private gathering.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Main Order Layout (Dishes List + Sticky Cart Summary) */}
            <div className="container-wide px-4 sm:px-6 lg:px-8 mt-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* Left Column: Category Pills & Menu Dish Cards */}
                    <div className="lg:col-span-8 space-y-6">
                        
                        {/* Order Type & Search Bar */}
                        <div className="glass-card bg-white p-4 sm:p-6 rounded-2xl border border-[#e2d4c4] space-y-4">
                            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                                {/* Delivery / Pickup Toggle */}
                                <div className="flex p-1 bg-cream3 rounded-xl w-full sm:w-auto">
                                    <button
                                        onClick={() => setOrderType('delivery')}
                                        className={`flex-1 sm:flex-initial px-6 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                                            orderType === 'delivery' ? 'bg-dark text-white shadow-sm' : 'text-brown hover:text-dark'
                                        }`}
                                    >
                                        <Truck size={14} /> Contactless Delivery
                                    </button>
                                    <button
                                        onClick={() => setOrderType('pickup')}
                                        className={`flex-1 sm:flex-initial px-6 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                                            orderType === 'pickup' ? 'bg-dark text-white shadow-sm' : 'text-brown hover:text-dark'
                                        }`}
                                    >
                                        <MapPin size={14} /> Restaurant Pickup
                                    </button>
                                </div>

                                {/* Search */}
                                <div className="relative w-full sm:w-64">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={16} />
                                    <input
                                        type="text"
                                        placeholder="Search dishes..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-9 pr-3 py-2 input-field text-xs bg-[#fdf8f2] border-[#e2d4c4]"
                                    />
                                </div>
                            </div>

                            {/* Category Filter Pills */}
                            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-2 border-t border-[#e2d4c4]/60">
                                {CATEGORIES.map(cat => (
                                    <button
                                        key={cat.id}
                                        onClick={() => setActiveCategory(cat.id)}
                                        className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                                            activeCategory === cat.id
                                                ? 'bg-red text-white shadow-sm'
                                                : 'bg-cream text-brown hover:bg-cream2 border border-border'
                                        }`}
                                    >
                                        {cat.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Food Cards Grid */}
                        {loading ? (
                            <div className="py-24 text-center text-muted font-bold">
                                Loading Dishes from Kitchen...
                            </div>
                        ) : filteredItems.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {filteredItems.map(item => (
                                    <div
                                        key={item._id}
                                        className="bg-white rounded-2xl border border-[#e2d4c4] p-5 flex flex-col justify-between shadow-sm hover:shadow-card transition-all group"
                                    >
                                        <div>
                                            <div className="h-44 rounded-xl overflow-hidden mb-4 relative bg-cream3">
                                                <img
                                                    src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=600&auto=format&fit=crop'}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                />
                                                <div className="absolute top-2.5 left-2.5 flex gap-1">
                                                    {item.isVegetarian && (
                                                        <span className="bg-emerald-600 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded">
                                                            Veg
                                                        </span>
                                                    )}
                                                    {item.isGlutenFree && (
                                                        <span className="bg-amber-600 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded">
                                                            GF
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex justify-between items-baseline mb-1.5">
                                                <h3 className="font-serif font-bold text-lg text-dark group-hover:text-red transition-colors">
                                                    {item.name}
                                                </h3>
                                                <span className="font-serif font-black text-red text-base">
                                                    {formatPrice(item.price)}
                                                </span>
                                            </div>

                                            <p className="text-muted text-xs line-clamp-2 mb-5 leading-relaxed font-sans">
                                                {item.description}
                                            </p>
                                        </div>

                                        <button
                                            onClick={() => addToCart(item)}
                                            className="w-full btn-outline py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-red hover:text-white"
                                        >
                                            <Plus size={14} /> Add to Bag
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white rounded-2xl border border-dashed border-border p-12 text-center text-muted">
                                <p className="font-serif font-bold text-dark text-lg mb-2">No items found in this section</p>
                                <button
                                    onClick={() => { setActiveCategory('All'); setSearchQuery(''); }}
                                    className="btn-primary text-xs py-2 px-5 mt-2"
                                >
                                    View All Dishes
                                </button>
                            </div>
                        )}

                    </div>

                    {/* Right Column: Sticky Order Summary & Checkout Trigger */}
                    <div className="lg:col-span-4 sticky top-24 space-y-6">
                        <div className="bg-white rounded-2xl border border-[#e2d4c4] p-6 shadow-lg">
                            <div className="flex justify-between items-center pb-4 border-b border-[#e2d4c4]">
                                <div className="flex items-center gap-2">
                                    <ShoppingBag className="text-red" size={20} />
                                    <h3 className="font-serif font-black text-lg text-dark">Order Bag</h3>
                                </div>
                                <span className="text-xs bg-cream3 px-2.5 py-0.5 rounded-full font-bold text-brown">
                                    {cartTotalItems} items
                                </span>
                            </div>

                            {/* Bag Items list */}
                            <div className="py-4 space-y-3 max-h-80 overflow-y-auto custom-scrollbar">
                                {cartItems.length > 0 ? (
                                    cartItems.map(item => (
                                        <div key={item.menuItem} className="flex justify-between items-center text-sm py-2 border-b border-[#e2d4c4]/40">
                                            <div className="flex-1 pr-2">
                                                <p className="font-bold text-dark text-xs">{item.name}</p>
                                                <p className="text-muted text-[11px]">{formatPrice(item.price)} each</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => updateQuantity(item.menuItem, item.quantity - 1)}
                                                    className="w-6 h-6 rounded bg-cream2 hover:bg-cream3 flex items-center justify-center text-dark"
                                                >
                                                    <Minus size={11} />
                                                </button>
                                                <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.menuItem, item.quantity + 1)}
                                                    className="w-6 h-6 rounded bg-cream2 hover:bg-cream3 flex items-center justify-center text-dark"
                                                >
                                                    <Plus size={11} />
                                                </button>
                                            </div>
                                            <span className="font-serif font-bold text-xs text-red w-16 text-right">
                                                {formatPrice(item.price * item.quantity)}
                                            </span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="py-8 text-center text-muted text-xs">
                                        Your order bag is currently empty.
                                    </div>
                                )}
                            </div>

                            {/* Pricing Calculation */}
                            {cartItems.length > 0 && (
                                <div className="pt-4 border-t border-[#e2d4c4] space-y-2 text-xs">
                                    <div className="flex justify-between text-muted">
                                        <span>Subtotal</span>
                                        <span className="font-bold text-dark">{formatPrice(cartTotalAmount)}</span>
                                    </div>
                                    <div className="flex justify-between text-muted">
                                        <span>Taxes & Kitchen Service</span>
                                        <span className="font-bold text-dark">{formatPrice(cartTotalAmount * 0.08875)}</span>
                                    </div>
                                    {orderType === 'delivery' && (
                                        <div className="flex justify-between text-muted">
                                            <span>Delivery Fee</span>
                                            <span className="font-bold text-emerald-700">Complimentary</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-sm font-serif font-black text-dark pt-3 border-t border-border">
                                        <span>Total</span>
                                        <span className="text-red text-base">{formatPrice(cartTotalAmount * 1.08875)}</span>
                                    </div>

                                    <button
                                        onClick={() => setIsCheckingOut(true)}
                                        className="btn-primary w-full py-3.5 mt-4 text-xs font-bold uppercase tracking-wider rounded-xl shadow-lg shadow-red/25 flex items-center justify-center gap-2"
                                    >
                                        Proceed to Place Order <ArrowRight size={15} />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>

            {/* Checkout Modal */}
            <AnimatePresence>
                {isCheckingOut && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-dark/75 backdrop-blur-sm"
                            onClick={() => !isSubmitting && setIsCheckingOut(false)}
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
                                        {orderType === 'delivery' ? 'Delivery Details' : 'Pickup Information'}
                                    </h3>
                                    <p className="text-xs text-muted">Complete your dining order with Drizzle.</p>
                                </div>
                                <button
                                    onClick={() => setIsCheckingOut(false)}
                                    className="p-1 text-muted hover:text-red"
                                >
                                    ✕
                                </button>
                            </div>

                            <form onSubmit={handleCheckoutSubmit} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-[11px] font-black uppercase tracking-wider text-brown mb-1">
                                        Full Name *
                                    </label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.customerName}
                                        onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                                        className="input-field bg-white border-[#e2d4c4]"
                                        placeholder="e.g. Eleanor Vance"
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[11px] font-black uppercase tracking-wider text-brown mb-1">
                                            Email Address *
                                        </label>
                                        <input
                                            required
                                            type="email"
                                            value={formData.customerEmail}
                                            onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                                            className="input-field bg-white border-[#e2d4c4]"
                                            placeholder="eleanor@example.com"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-black uppercase tracking-wider text-brown mb-1">
                                            Phone Number *
                                        </label>
                                        <input
                                            required
                                            type="tel"
                                            value={formData.customerPhone}
                                            onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                                            className="input-field bg-white border-[#e2d4c4]"
                                            placeholder="+1 (555) 019-2834"
                                        />
                                    </div>
                                </div>

                                {orderType === 'delivery' && (
                                    <div>
                                        <label className="block text-[11px] font-black uppercase tracking-wider text-brown mb-1">
                                            Delivery Street Address *
                                        </label>
                                        <input
                                            required
                                            type="text"
                                            value={formData.deliveryAddress}
                                            onChange={(e) => setFormData({ ...formData, deliveryAddress: e.target.value })}
                                            className="input-field bg-white border-[#e2d4c4]"
                                            placeholder="Apartment, suite, street address"
                                        />
                                    </div>
                                )}

                                <div>
                                    <label className="block text-[11px] font-black uppercase tracking-wider text-brown mb-1">
                                        Special Culinary or Delivery Instructions
                                    </label>
                                    <textarea
                                        rows="2"
                                        value={formData.instructions}
                                        onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                                        className="input-field bg-white border-[#e2d4c4] resize-none text-xs"
                                        placeholder="Allergies, gate codes, preferred packaging..."
                                    ></textarea>
                                </div>

                                <div className="pt-4 border-t border-[#e2d4c4] flex justify-between items-center text-sm font-serif font-black text-dark">
                                    <span>Total to Pay:</span>
                                    <span className="text-red text-xl font-bold">{formatPrice(cartTotalAmount * 1.08875)}</span>
                                </div>

                                <div className="pt-2 flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setIsCheckingOut(false)}
                                        className="flex-1 btn-outline bg-white py-3 border-[#e2d4c4]"
                                        disabled={isSubmitting}
                                    >
                                        Back
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="flex-1 btn-primary py-3 flex items-center justify-center gap-2 shadow-lg shadow-red/25"
                                    >
                                        {isSubmitting ? 'Placing Order...' : 'Confirm Order'}
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

export default OrderOnline;
