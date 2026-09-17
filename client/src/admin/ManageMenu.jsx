import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, Image as ImageIcon, Loader2, X, Check, Sparkles, Filter, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { menuService } from '../services/menuService';
import { formatPrice } from '../utils/formatPrice';
import toast from 'react-hot-toast';

const CATEGORIES = ['All', 'Starters', 'Main Course', 'Vegan', 'Seafood', 'Desserts', 'Drinks'];

const ManageMenu = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    // Modal states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [imageMode, setImageMode] = useState('url'); // 'url' or 'file'
    const [currentItem, setCurrentItem] = useState({
        name: '',
        price: '',
        category: 'Main Course',
        description: '',
        isVegetarian: false,
        isGlutenFree: false,
        tags: 'Popular',
        image: '',
        imageFile: null
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchMenuItems();
    }, []);

    const fetchMenuItems = async () => {
        try {
            setLoading(true);
            const response = await menuService.getAll();
            setItems(response.data || []);
        } catch (error) {
            toast.error('Failed to load menu items');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this dish permanently?')) return;

        try {
            await menuService.delete(id);
            toast.success('Dish removed from menu');
            fetchMenuItems();
        } catch (error) {
            toast.error('Failed to delete item');
        }
    };

    const handleOpenAddModal = () => {
        setIsEditing(false);
        setImageMode('url');
        setCurrentItem({
            name: '',
            price: '',
            category: 'Main Course',
            description: '',
            isVegetarian: false,
            isGlutenFree: false,
            tags: 'Popular',
            image: '',
            imageFile: null
        });
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (item) => {
        setIsEditing(true);
        setImageMode('url');
        setCurrentItem({
            ...item,
            tags: Array.isArray(item.tags) ? item.tags.join(', ') : (item.tags || ''),
            imageFile: null
        });
        setIsModalOpen(true);
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        if (!currentItem.name || !currentItem.price) {
            return toast.error('Please provide item name and price');
        }

        setIsSubmitting(true);
        try {
            let payload;
            if (currentItem.imageFile) {
                const formData = new FormData();
                formData.append('name', currentItem.name);
                formData.append('price', currentItem.price);
                formData.append('category', currentItem.category);
                formData.append('description', currentItem.description || '');
                formData.append('isVegetarian', currentItem.isVegetarian);
                formData.append('isGlutenFree', currentItem.isGlutenFree);
                formData.append('tags', currentItem.tags);
                formData.append('image', currentItem.imageFile);
                payload = formData;
            } else {
                payload = {
                    name: currentItem.name,
                    price: parseFloat(currentItem.price),
                    category: currentItem.category,
                    description: currentItem.description || '',
                    isVegetarian: currentItem.isVegetarian,
                    isGlutenFree: currentItem.isGlutenFree,
                    tags: currentItem.tags ? currentItem.tags.split(',').map(t => t.trim()) : [],
                    image: currentItem.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop'
                };
            }

            if (isEditing) {
                await menuService.update(currentItem._id, payload);
                toast.success('Menu item updated successfully!');
            } else {
                await menuService.create(payload);
                toast.success('New dish added to menu!');
            }

            setIsModalOpen(false);
            fetchMenuItems();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Operation failed');
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

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
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
        const itemCat = normalizeCat(item.category);
        const matchesCategory = selectedCategory === 'All' || itemCat === selectedCategory || item.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="h-full flex flex-col">
            {/* Top Header */}
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-red font-bold text-xs uppercase tracking-widest bg-red/10 px-2.5 py-0.5 rounded">Live Menu Catalog</span>
                    </div>
                    <h1 className="h2-fluid text-dark font-serif font-black">Menu Items Management</h1>
                    <p className="text-muted text-sm font-medium">Add, modify, or retire items from the restaurant menu in real-time.</p>
                </div>
                <button
                    onClick={handleOpenAddModal}
                    className="btn-primary flex items-center gap-2 max-w-fit shadow-lg shadow-red/25 hover:shadow-xl transition-all"
                >
                    <Plus size={18} /> Add New Dish
                </button>
            </div>

            {/* Main Card Container */}
            <div className="glass-card bg-white rounded-2xl border border-[#e2d4c4]/80 shadow-sm flex-1 overflow-hidden flex flex-col">
                {/* Search & Category Filter Toolbar */}
                <div className="p-4 border-b border-[#e2d4c4]/60 flex flex-col sm:flex-row justify-between gap-4 bg-[#fcf9f5]">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={18} />
                        <input
                            type="text"
                            placeholder="Search dishes by name or ingredients..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 input-field py-2.5 text-sm bg-white border-[#e2d4c4] focus:border-red"
                        />
                    </div>
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                                    selectedCategory === cat
                                        ? 'bg-dark text-white shadow-sm'
                                        : 'bg-white text-brown/80 hover:bg-cream2 border border-[#e2d4c4]'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Table Content */}
                {loading ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-16 text-muted gap-3">
                        <Loader2 className="w-8 h-8 animate-spin text-red" />
                        <span className="text-xs font-bold uppercase tracking-widest text-brown">Syncing Menu Items...</span>
                    </div>
                ) : (
                    <div className="overflow-x-auto flex-1 custom-scrollbar">
                        <table className="w-full text-left font-sans text-sm">
                            <thead className="bg-[#1a0e06] text-white uppercase text-[11px] tracking-wider font-bold sticky top-0 z-10">
                                <tr>
                                    <th className="px-6 py-4">Dish</th>
                                    <th className="px-6 py-4">Category</th>
                                    <th className="px-6 py-4">Price</th>
                                    <th className="px-6 py-4">Dietary / Tags</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#e2d4c4]/60 bg-white">
                                {filteredItems.length > 0 ? (
                                    filteredItems.map((item) => (
                                        <tr key={item._id} className="hover:bg-[#fbf7f2] transition-colors group text-dark font-medium">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-14 h-14 rounded-xl bg-cream3 overflow-hidden border border-[#e2d4c4] shrink-0 shadow-sm relative group">
                                                        <img
                                                            src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=600&auto=format&fit=crop'}
                                                            alt={item.name}
                                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                        />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-serif font-black text-dark text-base">{item.name}</h4>
                                                        <p className="text-muted text-xs line-clamp-1 max-w-sm">{item.description}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="px-3 py-1 bg-cream3 rounded-full text-[11px] font-bold uppercase border border-[#e2d4c4] text-brown">
                                                    {normalizeCat(item.category)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="font-serif font-black text-base text-red">{formatPrice(item.price)}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-wrap gap-1.5 max-w-[200px]">
                                                    {item.isVegetarian && (
                                                        <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-green-100 text-green-800 border border-green-200">
                                                            Veg
                                                        </span>
                                                    )}
                                                    {item.isGlutenFree && (
                                                        <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-200">
                                                            GF
                                                        </span>
                                                    )}
                                                    {item.tags && (Array.isArray(item.tags) ? item.tags : [item.tags]).map((tag, idx) => (
                                                        <span key={idx} className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-cream2 text-muted border border-border">
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Available
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => handleOpenEditModal(item)}
                                                        className="p-2 border border-[#e2d4c4] rounded-lg bg-white hover:bg-dark hover:text-white hover:border-dark transition-all shadow-sm"
                                                        title="Edit Dish"
                                                    >
                                                        <Edit2 size={15} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(item._id)}
                                                        className="p-2 border border-[#e2d4c4] rounded-lg bg-white hover:bg-red hover:text-white hover:border-red transition-all text-red shadow-sm"
                                                        title="Delete Dish"
                                                    >
                                                        <Trash2 size={15} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-20 text-center text-muted">
                                            <div className="flex flex-col items-center gap-3">
                                                <Search size={36} className="opacity-30" />
                                                <span className="text-sm font-bold uppercase tracking-widest text-dark">No dishes match your filters</span>
                                                <button
                                                    onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                                                    className="text-red underline text-xs font-bold"
                                                >
                                                    Clear filters
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Footer Bar */}
                <div className="p-4 border-t border-[#e2d4c4]/60 flex flex-col sm:flex-row justify-between items-center text-xs text-muted font-bold tracking-wider uppercase bg-[#fcf9f5] gap-2">
                    <span>Showing {filteredItems.length} of {items.length} total dishes</span>
                    <span className="text-emerald-700 font-black">Changes sync instantly across public site</span>
                </div>
            </div>

            {/* Add / Edit Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-dark/70 backdrop-blur-sm"
                            onClick={() => !isSubmitting && setIsModalOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-xl bg-cream2 rounded-2xl shadow-2xl border border-white/20 overflow-hidden my-8 z-10"
                        >
                            <div className="p-6 border-b border-[#e2d4c4] flex justify-between items-center bg-white">
                                <div>
                                    <h2 className="text-xl font-serif font-black text-dark">
                                        {isEditing ? 'Edit Dish Details' : 'Create New Menu Item'}
                                    </h2>
                                    <p className="text-xs text-muted font-sans">This item will be visible immediately on the live frontend menu.</p>
                                </div>
                                <button
                                    onClick={() => !isSubmitting && setIsModalOpen(false)}
                                    className="p-1 rounded-lg hover:bg-cream text-muted hover:text-red transition-colors"
                                >
                                    <X size={22} />
                                </button>
                            </div>

                            <form onSubmit={handleFormSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto custom-scrollbar">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="sm:col-span-2">
                                        <label className="block text-[11px] font-black uppercase tracking-wider text-brown mb-1">
                                            Dish Name *
                                        </label>
                                        <input
                                            required
                                            type="text"
                                            value={currentItem.name}
                                            onChange={(e) => setCurrentItem({ ...currentItem, name: e.target.value })}
                                            className="input-field bg-white border-[#e2d4c4] focus:border-red"
                                            placeholder="e.g. Handmade Truffle Pasta"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-black uppercase tracking-wider text-brown mb-1">
                                            Price ($ USD) *
                                        </label>
                                        <input
                                            required
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={currentItem.price}
                                            onChange={(e) => setCurrentItem({ ...currentItem, price: e.target.value })}
                                            className="input-field bg-white border-[#e2d4c4] focus:border-red font-bold"
                                            placeholder="28.00"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-black uppercase tracking-wider text-brown mb-1">
                                            Category *
                                        </label>
                                        <select
                                            className="input-field bg-white border-[#e2d4c4] focus:border-red font-bold"
                                            value={currentItem.category}
                                            onChange={(e) => setCurrentItem({ ...currentItem, category: e.target.value })}
                                        >
                                            <option value="Starters">Starters / Appetizers</option>
                                            <option value="Main Course">Main Course</option>
                                            <option value="Vegan">Vegan & Plant-Based</option>
                                            <option value="Seafood">Seafood</option>
                                            <option value="Desserts">Desserts</option>
                                            <option value="Drinks">Drinks & Beverages</option>
                                        </select>
                                    </div>

                                    <div className="sm:col-span-2">
                                        <label className="block text-[11px] font-black uppercase tracking-wider text-brown mb-1">
                                            Description & Ingredients
                                        </label>
                                        <textarea
                                            rows="3"
                                            value={currentItem.description}
                                            onChange={(e) => setCurrentItem({ ...currentItem, description: e.target.value })}
                                            className="input-field bg-white border-[#e2d4c4] focus:border-red resize-none text-sm"
                                            placeholder="Fresh pasta with wild mushrooms, black truffle shavings, and parmesan..."
                                        ></textarea>
                                    </div>

                                    <div className="sm:col-span-2">
                                        <label className="block text-[11px] font-black uppercase tracking-wider text-brown mb-1">
                                            Tags (comma-separated)
                                        </label>
                                        <input
                                            type="text"
                                            value={currentItem.tags}
                                            onChange={(e) => setCurrentItem({ ...currentItem, tags: e.target.value })}
                                            className="input-field bg-white border-[#e2d4c4] focus:border-red text-sm"
                                            placeholder="e.g. Popular, Chef's Pick, Spicy, New"
                                        />
                                    </div>

                                    {/* Dietary Toggles */}
                                    <div className="sm:col-span-2 flex flex-wrap gap-6 p-4 bg-white rounded-xl border border-border">
                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={currentItem.isVegetarian}
                                                onChange={(e) => setCurrentItem({ ...currentItem, isVegetarian: e.target.checked })}
                                                className="w-4 h-4 text-red rounded border-border focus:ring-red"
                                            />
                                            <span className="text-xs font-black uppercase tracking-wider text-dark">Vegetarian</span>
                                        </label>

                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={currentItem.isGlutenFree}
                                                onChange={(e) => setCurrentItem({ ...currentItem, isGlutenFree: e.target.checked })}
                                                className="w-4 h-4 text-red rounded border-border focus:ring-red"
                                            />
                                            <span className="text-xs font-black uppercase tracking-wider text-dark">Gluten-Free</span>
                                        </label>
                                    </div>

                                    {/* Image Selection */}
                                    <div className="sm:col-span-2">
                                        <div className="flex justify-between items-center mb-1">
                                            <label className="block text-[11px] font-black uppercase tracking-wider text-brown">
                                                Dish Photo
                                            </label>
                                            <div className="flex gap-2 text-xs font-bold">
                                                <button
                                                    type="button"
                                                    onClick={() => setImageMode('url')}
                                                    className={`px-2 py-0.5 rounded ${imageMode === 'url' ? 'bg-dark text-white' : 'text-muted'}`}
                                                >
                                                    Image URL
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setImageMode('file')}
                                                    className={`px-2 py-0.5 rounded ${imageMode === 'file' ? 'bg-dark text-white' : 'text-muted'}`}
                                                >
                                                    Upload File
                                                </button>
                                            </div>
                                        </div>

                                        {imageMode === 'url' ? (
                                            <input
                                                type="url"
                                                value={currentItem.image || ''}
                                                onChange={(e) => setCurrentItem({ ...currentItem, image: e.target.value })}
                                                className="input-field bg-white border-[#e2d4c4] focus:border-red text-sm"
                                                placeholder="https://images.unsplash.com/..."
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center p-4 border-2 border-[#e2d4c4] border-dashed rounded-xl bg-white hover:border-red transition-all">
                                                <label className="cursor-pointer text-center">
                                                    <ImageIcon className="mx-auto h-8 w-8 text-muted mb-1" />
                                                    <span className="text-xs font-black text-red">Choose image file</span>
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        className="sr-only"
                                                        onChange={(e) => setCurrentItem({ ...currentItem, imageFile: e.target.files[0] })}
                                                    />
                                                    {currentItem.imageFile && (
                                                        <p className="text-xs font-bold text-emerald-600 mt-1">
                                                            Selected: {currentItem.imageFile.name}
                                                        </p>
                                                    )}
                                                </label>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="pt-4 flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => !isSubmitting && setIsModalOpen(false)}
                                        className="flex-1 btn-outline bg-white py-3 border-[#e2d4c4] hover:border-dark"
                                        disabled={isSubmitting}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 btn-primary py-3 flex items-center justify-center gap-2 shadow-lg shadow-red/25"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : (isEditing ? 'Save Changes' : 'Create & Publish Dish')}
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

export default ManageMenu;
