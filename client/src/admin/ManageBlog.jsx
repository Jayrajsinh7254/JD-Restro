import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Image as ImageIcon, Loader2, Check, Search, Calendar, BookOpen, Clock, User } from 'lucide-react';
import { blogService } from '../services/blogService';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORIES = ['All', 'Recipe', 'Sustainability', 'Wine & Dine', 'Behind the Scenes', 'Events'];

const ManageBlog = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingPost, setEditingPost] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [imageMode, setImageMode] = useState('url'); // 'url' or 'file'

    const [formData, setFormData] = useState({
        title: '',
        category: 'Recipe',
        author: 'Executive Chef Marco',
        excerpt: '',
        content: '',
        readTime: '5 min read',
        headerImage: '',
        imageFile: null
    });

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            setLoading(true);
            const response = await blogService.getAll();
            setPosts(response.data || []);
        } catch (error) {
            toast.error('Failed to load blog articles');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenAdd = () => {
        setEditingPost(null);
        setImageMode('url');
        setFormData({
            title: '',
            category: 'Recipe',
            author: 'Executive Chef Marco',
            excerpt: '',
            content: '',
            readTime: '5 min read',
            headerImage: '',
            imageFile: null
        });
        setShowModal(true);
    };

    const handleEdit = (post) => {
        setEditingPost(post);
        setImageMode('url');
        setFormData({
            title: post.title || '',
            category: post.category || 'Recipe',
            author: post.author || 'Drizzle Team',
            excerpt: post.excerpt || '',
            content: post.content || '',
            readTime: post.readTime || '5 min read',
            headerImage: post.headerImage || '',
            imageFile: null
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this article permanently?')) return;
        try {
            await blogService.delete(id);
            toast.success('Article deleted successfully');
            fetchPosts();
        } catch (error) {
            toast.error('Failed to delete article');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title || !formData.content) {
            return toast.error('Title and content are required');
        }

        try {
            setIsSubmitting(true);

            let payload;
            if (formData.imageFile) {
                const data = new FormData();
                data.append('title', formData.title);
                data.append('category', formData.category);
                data.append('author', formData.author);
                data.append('excerpt', formData.excerpt);
                data.append('content', formData.content);
                data.append('readTime', formData.readTime);
                data.append('headerImage', formData.imageFile);
                payload = data;
            } else {
                payload = {
                    title: formData.title,
                    category: formData.category,
                    author: formData.author,
                    excerpt: formData.excerpt,
                    content: formData.content,
                    readTime: formData.readTime,
                    headerImage: formData.headerImage || 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=1200&auto=format&fit=crop'
                };
            }

            if (editingPost) {
                await blogService.update(editingPost._id, payload);
                toast.success('Article updated successfully!');
            } else {
                await blogService.create(payload);
                toast.success('New article published to journal!');
            }

            setShowModal(false);
            setEditingPost(null);
            fetchPosts();
        } catch (error) {
            toast.error(error.response?.data?.message || (editingPost ? 'Update failed' : 'Publishing failed'));
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const filteredPosts = posts.filter(post => {
        const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              (post.excerpt && post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())) ||
                              (post.author && post.author.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesCat = selectedCategory === 'All' || post.category === selectedCategory;
        return matchesSearch && matchesCat;
    });

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-red font-bold text-xs uppercase tracking-widest bg-red/10 px-2.5 py-0.5 rounded">Journal & Stories</span>
                    </div>
                    <h1 className="h2-fluid text-dark font-serif font-black">Editorial & Blog Posts</h1>
                    <p className="text-muted text-sm font-medium">Publish culinary stories, recipes, sommelier notes, and restaurant news.</p>
                </div>
                <button
                    onClick={handleOpenAdd}
                    className="btn-primary flex items-center gap-2 max-w-fit shadow-lg shadow-red/25 hover:shadow-xl transition-all"
                >
                    <Plus size={18} /> Compose New Article
                </button>
            </div>

            {/* Content Card */}
            <div className="flex-1 glass-card bg-white rounded-2xl border border-[#e2d4c4]/80 shadow-sm overflow-hidden flex flex-col">
                {/* Search & Category Filter Toolbar */}
                <div className="p-4 border-b border-[#e2d4c4]/60 bg-[#fcf9f5] flex flex-col sm:flex-row justify-between gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={18} />
                        <input
                            type="text"
                            placeholder="Search articles by title, author, or topic..."
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

                {/* Posts List */}
                {loading ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-16 text-muted gap-3">
                        <Loader2 className="w-8 h-8 animate-spin text-red" />
                        <span className="text-xs font-bold uppercase tracking-widest text-brown">Loading editorial stories...</span>
                    </div>
                ) : filteredPosts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 p-6 overflow-y-auto custom-scrollbar flex-1">
                        {filteredPosts.map((post) => (
                            <div
                                key={post._id}
                                className="bg-white rounded-xl border border-[#e2d4c4] overflow-hidden hover:shadow-card transition-all flex flex-col group relative"
                            >
                                <div className="h-48 relative overflow-hidden bg-cream3">
                                    <img
                                        src={post.headerImage || 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=800&auto=format&fit=crop'}
                                        alt={post.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <span className="absolute top-3 left-3 px-3 py-1 bg-dark/85 backdrop-blur-sm text-white rounded-full text-[10px] font-bold uppercase tracking-wider">
                                        {post.category}
                                    </span>
                                </div>

                                <div className="p-5 flex flex-col flex-1">
                                    <div className="flex items-center gap-3 text-xs text-muted mb-2 font-bold">
                                        <span className="flex items-center gap-1"><User size={12} /> {post.author || 'Drizzle Team'}</span>
                                        <span>•</span>
                                        <span className="flex items-center gap-1"><Clock size={12} /> {post.readTime || '5 min read'}</span>
                                    </div>

                                    <h3 className="font-serif font-bold text-lg text-dark group-hover:text-red transition-colors line-clamp-2 mb-2">
                                        {post.title}
                                    </h3>

                                    <p className="text-xs text-muted line-clamp-3 mb-6 font-sans leading-relaxed flex-1">
                                        {post.excerpt || post.content?.substring(0, 120) + '...'}
                                    </p>

                                    <div className="flex items-center justify-between pt-4 border-t border-[#e2d4c4]/60 mt-auto">
                                        <span className="text-[11px] text-muted font-bold">
                                            {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'Published'}
                                        </span>

                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEdit(post)}
                                                className="p-2 border border-[#e2d4c4] rounded-lg hover:bg-dark hover:text-white hover:border-dark transition-all text-dark"
                                                title="Edit Post"
                                            >
                                                <Edit2 size={14} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(post._id)}
                                                className="p-2 border border-[#e2d4c4] rounded-lg hover:bg-red hover:text-white hover:border-red transition-all text-red"
                                                title="Delete Post"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center p-16 text-muted">
                        <BookOpen size={40} className="opacity-30 mb-3" />
                        <h3 className="text-base font-serif font-black text-dark mb-1">No articles found</h3>
                        <p className="text-xs text-muted mb-4">Start by publishing your first culinary journal article.</p>
                        <button onClick={handleOpenAdd} className="btn-primary text-xs py-2 px-4">
                            Compose Article
                        </button>
                    </div>
                )}

                {/* Footer Bar */}
                <div className="p-4 border-t border-[#e2d4c4]/60 flex flex-col sm:flex-row justify-between items-center text-xs text-muted font-bold tracking-wider uppercase bg-[#fcf9f5] gap-2">
                    <span>Showing {filteredPosts.length} of {posts.length} articles</span>
                    <span className="text-emerald-700 font-black">Live on Blog and Homepage</span>
                </div>
            </div>

            {/* Compose / Edit Modal */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-dark/70 backdrop-blur-sm"
                            onClick={() => !isSubmitting && setShowModal(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-2xl bg-cream2 rounded-2xl shadow-2xl border border-white/20 overflow-hidden my-8 z-10"
                        >
                            <div className="p-6 border-b border-[#e2d4c4] flex justify-between items-center bg-white">
                                <div>
                                    <h2 className="text-xl font-serif font-black text-dark">
                                        {editingPost ? 'Edit Journal Article' : 'Compose New Journal Article'}
                                    </h2>
                                    <p className="text-xs text-muted">Published articles appear instantly on the public blog.</p>
                                </div>
                                <button
                                    onClick={() => !isSubmitting && setShowModal(false)}
                                    className="p-1 rounded-lg hover:bg-cream text-muted hover:text-red transition-colors"
                                >
                                    <X size={22} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto custom-scrollbar">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-[11px] font-black uppercase tracking-wider text-brown mb-1">
                                            Article Title *
                                        </label>
                                        <input
                                            required
                                            type="text"
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            className="input-field bg-white border-[#e2d4c4] focus:border-red font-serif font-bold text-base"
                                            placeholder="e.g. Mastering Handcrafted Truffle Pasta"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-[11px] font-black uppercase tracking-wider text-brown mb-1">
                                                Category *
                                            </label>
                                            <select
                                                className="input-field bg-white border-[#e2d4c4] focus:border-red font-bold text-xs"
                                                value={formData.category}
                                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            >
                                                <option value="Recipe">Recipe</option>
                                                <option value="Sustainability">Sustainability</option>
                                                <option value="Wine & Dine">Wine & Dine</option>
                                                <option value="Behind the Scenes">Behind the Scenes</option>
                                                <option value="Events">Events</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-[11px] font-black uppercase tracking-wider text-brown mb-1">
                                                Author Name
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.author}
                                                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                                                className="input-field bg-white border-[#e2d4c4] focus:border-red text-xs font-medium"
                                                placeholder="e.g. Chef Marco"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-[11px] font-black uppercase tracking-wider text-brown mb-1">
                                                Read Time
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.readTime}
                                                onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                                                className="input-field bg-white border-[#e2d4c4] focus:border-red text-xs font-medium"
                                                placeholder="e.g. 5 min read"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-black uppercase tracking-wider text-brown mb-1">
                                            Short Excerpt / Teaser
                                        </label>
                                        <textarea
                                            rows="2"
                                            value={formData.excerpt}
                                            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                            className="input-field bg-white border-[#e2d4c4] focus:border-red resize-none text-xs"
                                            placeholder="Catchy preview summary displayed on article cards..."
                                        ></textarea>
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-black uppercase tracking-wider text-brown mb-1">
                                            Full Article Body *
                                        </label>
                                        <textarea
                                            required
                                            rows="8"
                                            value={formData.content}
                                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                            className="input-field bg-white border-[#e2d4c4] focus:border-red resize-none text-sm font-sans"
                                            placeholder="Write the full story or recipe here. Markdown headings and paragraphs are supported..."
                                        ></textarea>
                                    </div>

                                    {/* Cover Image */}
                                    <div>
                                        <div className="flex justify-between items-center mb-1">
                                            <label className="block text-[11px] font-black uppercase tracking-wider text-brown">
                                                Header / Cover Image
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
                                                value={formData.headerImage}
                                                onChange={(e) => setFormData({ ...formData, headerImage: e.target.value })}
                                                className="input-field bg-white border-[#e2d4c4] focus:border-red text-xs"
                                                placeholder="https://images.unsplash.com/photo-..."
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
                                                        onChange={(e) => setFormData({ ...formData, imageFile: e.target.files[0] })}
                                                    />
                                                    {formData.imageFile && (
                                                        <p className="text-xs font-bold text-emerald-600 mt-1">
                                                            Selected: {formData.imageFile.name}
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
                                        onClick={() => !isSubmitting && setShowModal(false)}
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
                                        {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : (editingPost ? 'Save Updates' : 'Publish Article')}
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

export default ManageBlog;
