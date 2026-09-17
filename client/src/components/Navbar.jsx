import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ShoppingBag, ArrowRight, Plus, Minus, Trash2, Calendar, Phone, Clock, ChevronRight, ShieldCheck, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/formatPrice';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const { cartItems, cartTotalItems, cartTotalAmount, updateQuantity, removeFromCart } = useCart();

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu and cart on route change
    useEffect(() => {
        setIsOpen(false);
        setIsCartOpen(false);
    }, [location.pathname]);

    // Manage body scroll lock
    useEffect(() => {
        if (isOpen || isCartOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, isCartOpen]);

    const leftNavLinks = [
        { name: 'Home', path: '/' },
        { name: 'Our Menu', path: '/menu' },
        { name: 'About Us', path: '/about' },
        { name: 'Journal', path: '/blog' },
    ];

    const rightNavLinks = [
        { name: 'Gallery', path: '/gallery' },
        { name: 'Reservations', path: '/reservations' },
        { name: 'Loyalty', path: '/loyalty' },
        { name: 'Contact', path: '/contact' },
    ];

    const allMobileLinks = [
        { name: 'Home', path: '/' },
        { name: 'Our Menu', path: '/menu' },
        { name: 'Order Online & Pickup', path: '/order' },
        { name: 'Reserve a Table', path: '/reservations' },
        { name: 'Journal & Stories', path: '/blog' },
        { name: 'About Drizzle', path: '/about' },
        { name: 'Atmosphere & Gallery', path: '/gallery' },
        { name: 'Loyalty Club', path: '/loyalty' },
        { name: 'Contact & Location', path: '/contact' },
    ];

    return (
        <>
            <header
                className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 ${
                    isScrolled
                        ? 'bg-[#fdf8f2]/95 backdrop-blur-md shadow-[0_4px_30px_rgba(26,14,6,0.06)] border-b border-[#e2d4c4]/80 py-2.5 sm:py-3'
                        : 'bg-[#fdf8f2]/90 backdrop-blur-sm border-b border-[#e2d4c4]/40 py-3 sm:py-4.5'
                }`}
            >
                <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
                    
                    {/* Desktop View (xl+: >= 1280px) Exact-Center 3-Column Grid */}
                    <div className="hidden xl:grid grid-cols-[1fr_auto_1fr] items-center w-full">
                        
                        {/* Column 1: Left Navigation Links */}
                        <nav className="flex items-center justify-start gap-6 2xl:gap-8">
                            {leftNavLinks.map((link) => {
                                const isActive = location.pathname === link.path;
                                return (
                                    <Link
                                        key={link.name}
                                        to={link.path}
                                        className={`text-[13px] tracking-wide font-sans font-bold transition-all relative py-1 group ${
                                            isActive ? 'text-red font-black' : 'text-brown/85 hover:text-red'
                                        }`}
                                    >
                                        {link.name}
                                        <span
                                            className={`absolute bottom-0 left-0 w-full h-[2px] bg-red transition-transform duration-300 origin-left rounded-full ${
                                                isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                                            }`}
                                        />
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* Column 2: Exact Geometric Center Logo */}
                        <Link
                            to="/"
                            className="flex flex-col items-center justify-center text-center px-6 group select-none transition-transform duration-300 hover:scale-[1.02]"
                        >
                            <span className="text-3xl font-serif font-black tracking-tight text-dark leading-none">
                                Drizzle<span className="text-red">.</span>
                            </span>
                            <span className="text-[8px] uppercase tracking-[0.35em] text-muted font-black mt-1">
                                Haute Cuisine & Bar
                            </span>
                        </Link>

                        {/* Column 3: Right Navigation Links & Action Controls */}
                        <div className="flex items-center justify-end gap-5 2xl:gap-6">
                            <nav className="flex items-center gap-5 2xl:gap-6">
                                {rightNavLinks.map((link) => {
                                    const isActive = location.pathname === link.path;
                                    return (
                                        <Link
                                            key={link.name}
                                            to={link.path}
                                            className={`text-[13px] tracking-wide font-sans font-bold transition-all relative py-1 group ${
                                                isActive ? 'text-red font-black' : 'text-brown/85 hover:text-red'
                                            }`}
                                        >
                                            {link.name}
                                            <span
                                                className={`absolute bottom-0 left-0 w-full h-[2px] bg-red transition-transform duration-300 origin-left rounded-full ${
                                                    isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                                                }`}
                                            />
                                        </Link>
                                    );
                                })}
                            </nav>

                            {/* Cart Bag Icon Trigger */}
                            <button
                                onClick={() => setIsCartOpen(true)}
                                aria-label="Open Shopping Bag"
                                className="relative p-2 rounded-xl hover:bg-cream2 text-dark transition-all hover:scale-105 border border-transparent hover:border-[#e2d4c4]"
                            >
                                <ShoppingBag size={19} />
                                {cartTotalItems > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-pulse">
                                        {cartTotalItems}
                                    </span>
                                )}
                            </button>

                            {/* Reserve CTA */}
                            <Link
                                to="/reservations"
                                className="bg-red hover:bg-red-hover text-white px-4 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all duration-300 shadow-md shadow-red/20 hover:shadow-lg hover:shadow-red/30 hover:-translate-y-0.5 active:translate-y-0 shrink-0"
                            >
                                Reserve Table
                            </Link>

                            {/* Admin Portal Direct Trigger */}
                            <Link
                                to="/admin/login"
                                className="p-2 rounded-xl text-dark/70 hover:text-red hover:bg-cream2 transition-colors text-xs font-bold flex items-center"
                                title="Switch to Admin Portal"
                            >
                                <ShieldCheck size={18} />
                            </Link>
                        </div>

                    </div>

                    {/* Tablet & Medium Screens (768px to 1279px) */}
                    <div className="hidden md:flex xl:hidden items-center justify-between w-full">
                        <Link to="/" className="text-2xl font-serif font-black text-dark tracking-tight flex items-baseline">
                            Drizzle<span className="text-red">.</span>
                        </Link>

                        <nav className="flex items-center gap-4 lg:gap-6">
                            <Link to="/menu" className={`text-xs lg:text-sm font-bold ${location.pathname === '/menu' ? 'text-red' : 'text-brown'}`}>Menu</Link>
                            <Link to="/order" className={`text-xs lg:text-sm font-bold ${location.pathname === '/order' ? 'text-red' : 'text-brown'}`}>Order</Link>
                            <Link to="/reservations" className={`text-xs lg:text-sm font-bold ${location.pathname === '/reservations' ? 'text-red' : 'text-brown'}`}>Book Table</Link>
                            <Link to="/blog" className={`text-xs lg:text-sm font-bold ${location.pathname === '/blog' ? 'text-red' : 'text-brown'}`}>Journal</Link>
                        </nav>

                        <div className="flex items-center gap-2.5">
                            <button
                                onClick={() => setIsCartOpen(true)}
                                className="relative p-2 text-dark hover:text-red rounded-xl hover:bg-cream2 transition-all"
                                aria-label="Open Cart"
                            >
                                <ShoppingBag size={20} />
                                {cartTotalItems > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                                        {cartTotalItems}
                                    </span>
                                )}
                            </button>

                            <Link
                                to="/admin/login"
                                className="p-2 text-muted hover:text-red"
                                title="Admin Portal"
                            >
                                <ShieldCheck size={18} />
                            </Link>

                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                className="p-2 text-dark hover:text-red rounded-xl hover:bg-cream2"
                                aria-label="Toggle menu"
                            >
                                {isOpen ? <X size={22} /> : <Menu size={22} />}
                            </button>
                        </div>
                    </div>

                    {/* Mobile View (< 768px: Smartphones & Mini Tablets) */}
                    <div className="flex md:hidden items-center justify-between w-full">
                        <Link
                            to="/"
                            className="text-2xl font-serif font-black tracking-tight text-dark flex items-baseline select-none"
                        >
                            Drizzle<span className="text-red">.</span>
                        </Link>

                        <div className="flex items-center gap-1 sm:gap-2">
                            <button
                                onClick={() => setIsCartOpen(true)}
                                className="relative p-2 text-dark hover:text-red transition-colors rounded-xl active:bg-cream2"
                                aria-label="Open Cart"
                            >
                                <ShoppingBag size={21} />
                                {cartTotalItems > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red text-white text-[10px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-sm">
                                        {cartTotalItems}
                                    </span>
                                )}
                            </button>

                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                className="p-2 text-dark hover:text-red transition-colors rounded-xl active:bg-cream2"
                                aria-label="Toggle navigation menu"
                            >
                                {isOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>

                </div>
            </header>

            {/* Mobile Navigation Drawer */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-dark/60 backdrop-blur-sm z-50 xl:hidden"
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 26, stiffness: 220 }}
                            className="fixed top-0 right-0 bottom-0 w-full sm:w-96 max-w-[100vw] bg-[#fdf8f2] z-50 shadow-2xl flex flex-col p-5 sm:p-6 overflow-y-auto xl:hidden"
                        >
                            <div className="flex justify-between items-center pb-4 border-b border-[#e2d4c4]">
                                <div>
                                    <Link
                                        to="/"
                                        onClick={() => setIsOpen(false)}
                                        className="text-2xl font-serif font-black text-dark"
                                    >
                                        Drizzle<span className="text-red">.</span>
                                    </Link>
                                    <p className="text-[10px] text-muted uppercase tracking-widest font-bold">Haute Cuisine</p>
                                </div>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 rounded-xl text-muted hover:text-red hover:bg-cream2 transition-colors"
                                >
                                    <X size={22} />
                                </button>
                            </div>

                            {/* Navigation Links */}
                            <ul className="flex flex-col space-y-1.5 py-5 flex-1">
                                {allMobileLinks.map((link, idx) => {
                                    const isActive = location.pathname === link.path;
                                    return (
                                        <motion.li
                                            key={link.name}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.025 }}
                                        >
                                            <Link
                                                to={link.path}
                                                onClick={() => setIsOpen(false)}
                                                className={`flex items-center justify-between py-2.5 px-3.5 rounded-xl font-serif font-bold text-sm sm:text-base transition-all ${
                                                    isActive
                                                        ? 'bg-red text-white shadow-md shadow-red/20'
                                                        : 'text-dark hover:bg-cream2 hover:text-red'
                                                }`}
                                            >
                                                <span>{link.name}</span>
                                                <ChevronRight size={16} className={isActive ? 'text-white' : 'text-muted'} />
                                            </Link>
                                        </motion.li>
                                    );
                                })}

                                <li className="pt-2">
                                    <Link
                                        to="/admin/login"
                                        onClick={() => setIsOpen(false)}
                                        className="flex items-center gap-2 py-2.5 px-3.5 rounded-xl font-sans font-bold text-xs text-muted hover:text-dark hover:bg-cream2 border border-[#e2d4c4]"
                                    >
                                        <ShieldCheck size={15} className="text-red" /> Staff / Admin Management
                                    </Link>
                                </li>
                            </ul>

                            {/* Mobile Drawer Bottom Actions */}
                            <div className="pt-4 border-t border-[#e2d4c4] space-y-2.5">
                                <Link
                                    to="/reservations"
                                    onClick={() => setIsOpen(false)}
                                    className="btn-primary w-full text-center py-3 text-xs font-bold rounded-xl shadow-md"
                                >
                                    Reserve a Table
                                </Link>
                                
                                <Link
                                    to="/order"
                                    onClick={() => setIsOpen(false)}
                                    className="btn-outline w-full text-center py-2.5 text-xs font-bold rounded-xl bg-white"
                                >
                                    Order Online & Takeout
                                </Link>

                                <div className="pt-2 text-center text-xs text-muted font-sans space-y-0.5">
                                    <p className="flex items-center justify-center gap-1.5 font-bold text-brown">
                                        <Phone size={12} className="text-red" /> +1 (212) 555-0123
                                    </p>
                                    <p className="text-[11px]">Daily: 5:00 PM – 11:30 PM</p>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Slide-over Cart Drawer */}
            <AnimatePresence>
                {isCartOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsCartOpen(false)}
                            className="fixed inset-0 bg-dark/60 backdrop-blur-sm z-50"
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                            className="fixed top-0 right-0 bottom-0 w-full sm:w-[420px] max-w-[100vw] bg-[#fdf8f2] z-50 shadow-2xl flex flex-col"
                        >
                            {/* Cart Drawer Header */}
                            <div className="p-5 sm:p-6 border-b border-[#e2d4c4] flex items-center justify-between bg-white shrink-0">
                                <div className="flex items-center gap-2">
                                    <ShoppingBag className="text-red" size={22} />
                                    <h3 className="font-serif font-black text-lg sm:text-xl text-dark">Your Order Bag</h3>
                                    <span className="text-xs bg-cream3 px-2.5 py-0.5 rounded-full font-bold text-brown">
                                        {cartTotalItems}
                                    </span>
                                </div>
                                <button
                                    onClick={() => setIsCartOpen(false)}
                                    className="p-1.5 rounded-lg hover:bg-cream text-muted hover:text-red transition-colors"
                                >
                                    <X size={22} />
                                </button>
                            </div>

                            {/* Cart Items List */}
                            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3.5 custom-scrollbar">
                                {cartItems.length > 0 ? (
                                    cartItems.map((item) => (
                                        <div
                                            key={item.menuItem}
                                            className="p-3.5 sm:p-4 bg-white rounded-xl border border-[#e2d4c4] flex gap-3 sm:gap-4 shadow-sm"
                                        >
                                            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg bg-cream3 overflow-hidden shrink-0 border border-border">
                                                <img
                                                    src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=600&auto=format&fit=crop'}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="flex-1 flex flex-col justify-between">
                                                <div className="flex justify-between items-start gap-2">
                                                    <h4 className="font-serif font-bold text-sm text-dark line-clamp-1">{item.name}</h4>
                                                    <button
                                                        onClick={() => removeFromCart(item.menuItem)}
                                                        className="text-muted hover:text-red transition-colors p-1"
                                                        title="Remove"
                                                    >
                                                        <Trash2 size={13} />
                                                    </button>
                                                </div>
                                                <div className="flex justify-between items-center mt-2">
                                                    <span className="font-serif font-black text-red text-sm">
                                                        {formatPrice(item.price * item.quantity)}
                                                    </span>
                                                    <div className="flex items-center gap-2 border border-border rounded-lg bg-cream px-2 py-0.5">
                                                        <button
                                                            onClick={() => updateQuantity(item.menuItem, item.quantity - 1)}
                                                            className="text-brown hover:text-red transition-colors p-0.5"
                                                        >
                                                            <Minus size={11} />
                                                        </button>
                                                        <span className="text-xs font-bold text-dark px-1">
                                                            {item.quantity}
                                                        </span>
                                                        <button
                                                            onClick={() => updateQuantity(item.menuItem, item.quantity + 1)}
                                                            className="text-brown hover:text-red transition-colors p-0.5"
                                                        >
                                                            <Plus size={11} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-center py-16 text-muted">
                                        <ShoppingBag size={48} className="opacity-20 mb-3" />
                                        <h4 className="font-serif font-black text-lg text-dark mb-1">Your bag is empty</h4>
                                        <p className="text-xs text-muted mb-6 max-w-xs">Discover our seasonal culinary creations from the menu.</p>
                                        <Link
                                            to="/menu"
                                            onClick={() => setIsCartOpen(false)}
                                            className="btn-primary text-xs py-2.5 px-6 rounded-xl"
                                        >
                                            Explore Menu
                                        </Link>
                                    </div>
                                )}
                            </div>

                            {/* Cart Drawer Footer */}
                            {cartItems.length > 0 && (
                                <div className="p-4 sm:p-6 border-t border-[#e2d4c4] bg-white space-y-3.5 shrink-0">
                                    <div className="space-y-1.5 text-xs font-sans">
                                        <div className="flex justify-between text-muted">
                                            <span>Subtotal</span>
                                            <span className="font-bold text-dark">{formatPrice(cartTotalAmount)}</span>
                                        </div>
                                        <div className="flex justify-between text-muted">
                                            <span>Estimated Tax & Service</span>
                                            <span className="font-bold text-dark">{formatPrice(cartTotalAmount * 0.08875)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm sm:text-base font-serif font-bold text-dark pt-2 border-t border-border">
                                            <span>Total Amount</span>
                                            <span className="text-red font-black text-base sm:text-lg">
                                                {formatPrice(cartTotalAmount * 1.08875)}
                                            </span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => {
                                            setIsCartOpen(false);
                                            navigate('/order');
                                        }}
                                        className="btn-primary w-full py-3.5 text-xs font-bold uppercase tracking-wider rounded-xl shadow-lg shadow-red/25 flex items-center justify-center gap-2"
                                    >
                                        Proceed to Checkout <ArrowRight size={15} />
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;
