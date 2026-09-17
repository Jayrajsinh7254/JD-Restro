import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag, Sparkles, Check } from 'lucide-react';
import { menuService } from '../../services/menuService';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../utils/formatPrice';

const MenuPreview = () => {
    const [dishes, setDishes] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();

    useEffect(() => {
        const fetchPreviewDishes = async () => {
            try {
                const response = await menuService.getAll();
                if (response.data && response.data.length > 0) {
                    setDishes(response.data.slice(0, 6));
                }
            } catch (err) {
                console.error('Failed to load menu preview dishes', err);
            } finally {
                setLoading(false);
            }
        };

        fetchPreviewDishes();
    }, []);

    const normalizeCat = (cat) => {
        if (!cat) return 'Main Course';
        const c = cat.toLowerCase();
        if (c.includes('start')) return 'Starter';
        if (c.includes('main')) return 'Main Course';
        if (c.includes('vegan')) return 'Plant-Based';
        if (c.includes('sea')) return 'Seafood';
        if (c.includes('dessert')) return 'Dessert';
        if (c.includes('drink')) return 'Beverage';
        return cat;
    };

    return (
        <section className="section-padding bg-cream3">
            <div className="container-wide">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        className="max-w-xl"
                    >
                        <div className="flex items-center gap-2 mb-4">
                            <Sparkles size={14} className="text-red" />
                            <span className="eyebrow-tag">Chef's Curated Selection</span>
                        </div>
                        <h2 className="h2-fluid">Your Next Favorite Meal Awaits</h2>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <Link to="/menu" className="btn-primary rounded-full px-8 shadow-md">
                            Discover Full Menu <ArrowRight size={14} />
                        </Link>
                    </motion.div>
                </div>

                {/* Dishes Grid */}
                {loading ? (
                    <div className="py-20 text-center text-muted font-bold">
                        Loading Seasonal Selections...
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {dishes.map((dish, idx) => (
                            <motion.div
                                key={dish._id || idx}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: idx * 0.08 }}
                                className="glass-card bg-white rounded-2xl border border-[#e2d4c4] p-6 flex flex-col justify-between group shadow-sm hover:shadow-card transition-all"
                            >
                                <div>
                                    <div className="h-52 rounded-xl overflow-hidden mb-5 relative bg-cream2">
                                        <img
                                            src={dish.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=600&auto=format&fit=crop'}
                                            alt={dish.name}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                                        />
                                        <span className="absolute top-3 left-3 bg-dark/85 backdrop-blur-sm text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md">
                                            {normalizeCat(dish.category)}
                                        </span>
                                    </div>

                                    <div className="flex justify-between items-baseline mb-2">
                                        <h3 className="font-serif font-black text-xl text-dark group-hover:text-red transition-colors">
                                            {dish.name}
                                        </h3>
                                        <span className="font-serif font-black text-lg text-red">
                                            {formatPrice(dish.price)}
                                        </span>
                                    </div>

                                    <p className="text-muted text-xs sm:text-sm line-clamp-2 mb-6 font-sans leading-relaxed">
                                        {dish.description}
                                    </p>
                                </div>

                                <div className="pt-4 border-t border-[#e2d4c4]/60 flex items-center justify-between gap-3">
                                    <button
                                        onClick={() => addToCart(dish)}
                                        className="btn-outline w-full text-center py-2.5 text-xs font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-red hover:text-white"
                                    >
                                        <ShoppingBag size={14} /> Add to Bag
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

            </div>
        </section>
    );
};

export default MenuPreview;
