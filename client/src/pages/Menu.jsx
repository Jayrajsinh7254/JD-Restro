import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Search, Sparkles, Check, Leaf, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatPrice } from '../utils/formatPrice';
import { useMenu } from '../hooks/useMenu';
import { useCart } from '../context/CartContext';

const CATEGORIES = [
    { id: 'All', label: 'All Offerings' },
    { id: 'Starters', label: 'Starters' },
    { id: 'Main Course', label: 'Mains & Steaks' },
    { id: 'Vegan', label: 'Plant-Based' },
    { id: 'Seafood', label: 'Seafood Catch' },
    { id: 'Desserts', label: 'Desserts' },
    { id: 'Drinks', label: 'Wines & Spirits' }
];

const DIETARY_FILTERS = [
    { id: 'all', label: 'All Diets' },
    { id: 'veg', label: 'Vegetarian Only', icon: Leaf },
    { id: 'gf', label: 'Gluten-Free Only', icon: ShieldCheck }
];

const Menu = () => {
    const [activeCategory, setActiveCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [dietaryFilter, setDietaryFilter] = useState('all');

    const { items, loading, error, refetch } = useMenu();
    const { addToCart } = useCart();

    const handleAddToCart = (item) => {
        addToCart(item);
    };

    // Category normalizer to handle any backend category variations
    const normalizeCat = (cat) => {
        if (!cat) return 'Main Course';
        const c = cat.toLowerCase();
        if (c.includes('start') || c.includes('appetiz')) return 'Starters';
        if (c.includes('main') || c.includes('entree') || c.includes('steak')) return 'Main Course';
        if (c.includes('vegan') || c.includes('plant')) return 'Vegan';
        if (c.includes('sea') || c.includes('fish')) return 'Seafood';
        if (c.includes('dessert') || c.includes('sweet')) return 'Desserts';
        if (c.includes('drink') || c.includes('bever') || c.includes('wine')) return 'Drinks';
        return cat;
    };

    const filteredItems = items.filter(item => {
        // Category check
        const itemCat = normalizeCat(item.category);
        const matchesCategory = activeCategory === 'All' || itemCat === activeCategory || item.category === activeCategory;

        // Search check
        const matchesSearch = !searchQuery ||
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (item.tags && item.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));

        // Dietary check
        const matchesDiet =
            dietaryFilter === 'all' ||
            (dietaryFilter === 'veg' && item.isVegetarian) ||
            (dietaryFilter === 'gf' && item.isGlutenFree);

        return matchesCategory && matchesSearch && matchesDiet;
    });

    return (
        <div className="pt-20 min-h-screen bg-[#fdf8f2] pb-28">
            {/* Editorial Hero Header */}
            <section className="py-20 md:py-28 text-center bg-[#1a0e06] text-white relative overflow-hidden bg-radial-glow">
                <div className="container-wide relative z-10 px-4 sm:px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="max-w-3xl mx-auto"
                    >
                        <span className="eyebrow-tag border-white/20 text-[#f5ede0] mb-6 inline-flex items-center gap-2">
                            <Sparkles size={13} className="text-red" /> Artisanal Culinary Masterpieces
                        </span>
                        <h1 className="h1-fluid mb-6 text-[#fdf8f2]">The Dining Experience</h1>
                        <p className="body-fluid text-white/70 max-w-2xl mx-auto leading-relaxed">
                            Each dish is an homage to world-class gastronomy, crafted with organic ingredients, seasonal harvests, and culinary innovation.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Filter & Interactive Controls Bar */}
            <section className="container-wide px-4 sm:px-6 lg:px-8 -mt-7 relative z-20">
                <div className="glass-card bg-white p-4 sm:p-6 rounded-2xl shadow-xl border border-[#e2d4c4] space-y-4">
                    {/* Top Row: Search & Dietary Pills */}
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="relative w-full md:max-w-md">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" size={18} />
                            <input
                                type="text"
                                placeholder="Search by dish name, truffle, wagyu, seafood..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 pr-4 py-2.5 input-field text-sm bg-[#fdf8f2] border-[#e2d4c4] focus:bg-white"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted hover:text-red"
                                >
                                    Clear
                                </button>
                            )}
                        </div>

                        {/* Dietary Filter Buttons */}
                        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto no-scrollbar pb-1 md:pb-0">
                            {DIETARY_FILTERS.map((df) => {
                                const Icon = df.icon;
                                const isSelected = dietaryFilter === df.id;
                                return (
                                    <button
                                        key={df.id}
                                        onClick={() => setDietaryFilter(df.id)}
                                        className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                                            isSelected
                                                ? 'bg-dark text-white shadow-md'
                                                : 'bg-cream2 text-brown hover:bg-cream3 border border-border'
                                        }`}
                                    >
                                        {Icon && <Icon size={14} className={isSelected ? 'text-red' : 'text-muted'} />}
                                        <span>{df.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Bottom Row: Category Tabs */}
                    <div className="pt-2 border-t border-[#e2d4c4]/60 flex items-center gap-2 overflow-x-auto no-scrollbar">
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.id)}
                                className={`px-5 py-2.5 rounded-full font-sans text-xs sm:text-sm font-bold tracking-wide transition-all whitespace-nowrap ${
                                    activeCategory === cat.id
                                        ? 'bg-red text-white shadow-md shadow-red/25'
                                        : 'bg-cream text-brown hover:bg-cream2 border border-border/70'
                                }`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Menu Dish Cards Grid */}
            <section className="container-wide px-4 sm:px-6 lg:px-8 mt-12">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 text-muted gap-4">
                        <div className="relative">
                            <div className="w-12 h-12 border-3 border-red border-t-transparent rounded-full animate-spin"></div>
                        </div>
                        <span className="text-xs font-bold uppercase tracking-widest text-brown">
                            Curating the Chef's Menu...
                        </span>
                    </div>
                ) : error ? (
                    <div className="text-center py-20">
                        <p className="text-red font-bold mb-4">{error}</p>
                        <button onClick={() => refetch()} className="btn-outline py-2 px-5 text-xs">
                            Try Again
                        </button>
                    </div>
                ) : filteredItems.length > 0 ? (
                    <motion.div
                        layout
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        <AnimatePresence>
                            {filteredItems.map(item => (
                                <motion.div
                                    key={item._id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.3 }}
                                    className="glass-card flex flex-col h-full bg-white rounded-2xl shadow-sm hover:shadow-card border border-[#e2d4c4] group overflow-hidden"
                                >
                                    {/* Dish Image Container */}
                                    <div className="relative h-64 overflow-hidden bg-cream3">
                                        <img
                                            src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=600&auto=format&fit=crop'}
                                            alt={item.name}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-dark/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                        {/* Dietary & Category Badges */}
                                        <div className="absolute top-4 left-4 flex flex-wrap gap-1.5 z-10">
                                            {item.isVegetarian && (
                                                <span className="bg-emerald-600/95 backdrop-blur-sm text-white text-[10px] uppercase font-black px-2.5 py-1 rounded-md shadow-sm">
                                                    Veg
                                                </span>
                                            )}
                                            {item.isGlutenFree && (
                                                <span className="bg-amber-600/95 backdrop-blur-sm text-white text-[10px] uppercase font-black px-2.5 py-1 rounded-md shadow-sm">
                                                    GF
                                                </span>
                                            )}
                                            {item.tags && (Array.isArray(item.tags) ? item.tags : [item.tags]).map((tag, idx) => (
                                                <span
                                                    key={idx}
                                                    className="bg-dark/85 backdrop-blur-sm text-white text-[10px] uppercase font-black px-2.5 py-1 rounded-md shadow-sm"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>

                                        {/* Category Pill on Image */}
                                        <div className="absolute bottom-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <span className="bg-white/90 backdrop-blur-sm text-dark text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm">
                                                {normalizeCat(item.category)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Dish Content Body */}
                                    <div className="p-6 sm:p-7 flex flex-col flex-grow">
                                        <div className="flex justify-between items-start mb-2.5 gap-4">
                                            <h3 className="font-serif font-black text-xl text-dark leading-snug group-hover:text-red transition-colors">
                                                {item.name}
                                            </h3>
                                            <span className="font-serif font-black text-xl text-red whitespace-nowrap">
                                                {formatPrice(item.price)}
                                            </span>
                                        </div>

                                        <p className="font-sans text-muted text-sm mb-6 flex-grow leading-relaxed">
                                            {item.description}
                                        </p>

                                        {/* Add to Bag Button */}
                                        <button
                                            onClick={() => handleAddToCart(item)}
                                            className="w-full mt-auto flex items-center justify-center gap-2.5 bg-cream2 hover:bg-red text-dark hover:text-white border border-[#e2d4c4] hover:border-red py-3.5 rounded-xl transition-all duration-300 font-sans font-bold text-xs uppercase tracking-wider shadow-sm group-hover:shadow-md active:scale-[0.98]"
                                        >
                                            <ShoppingBag size={16} />
                                            <span>Add to Order Bag</span>
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                ) : (
                    <div className="text-center py-24 bg-white rounded-2xl border border-dashed border-border p-8">
                        <span className="text-4xl mb-4 block">🔍</span>
                        <h3 className="font-serif font-black text-xl text-dark mb-2">No matching dishes found</h3>
                        <p className="text-muted text-sm max-w-md mx-auto mb-6">
                            Try adjusting your search query or selecting a different category or dietary filter.
                        </p>
                        <button
                            onClick={() => {
                                setActiveCategory('All');
                                setSearchQuery('');
                                setDietaryFilter('all');
                            }}
                            className="btn-primary text-xs py-2.5 px-6"
                        >
                            Reset All Filters
                        </button>
                    </div>
                )}
            </section>
        </div>
    );
};

export default Menu;
