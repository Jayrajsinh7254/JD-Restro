import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Clock, User, Calendar, ArrowRight, X, Sparkles, BookOpen, Share2, Tag, ChevronRight } from 'lucide-react';
import { blogService } from '../services/blogService';
import toast from 'react-hot-toast';

const CATEGORIES = ['All', 'Recipe', 'Sustainability', 'Wine & Dine', 'Behind the Scenes', 'Events'];

const Blog = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeCategory, setActiveCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedPost, setSelectedPost] = useState(null);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await blogService.getAll();
            setPosts(response.data || []);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load culinary stories');
        } finally {
            setLoading(false);
        }
    };

    const filteredPosts = posts.filter(post => {
        const matchesCategory = activeCategory === 'All' || post.category === activeCategory;
        const matchesSearch = !searchQuery ||
            post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (post.excerpt && post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (post.content && post.content.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (post.author && post.author.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesCategory && matchesSearch;
    });

    const featuredPost = posts.length > 0 ? posts[0] : null;
    const gridPosts = activeCategory === 'All' && !searchQuery ? filteredPosts.slice(1) : filteredPosts;

    const handleShare = (post) => {
        if (navigator.share) {
            navigator.share({
                title: post.title,
                text: post.excerpt,
                url: window.location.href,
            }).catch(() => {});
        } else {
            navigator.clipboard.writeText(window.location.href);
            toast.success('Article link copied to clipboard!');
        }
    };

    return (
        <div className="pt-20 min-h-screen bg-[#fdf8f2] pb-28">
            {/* Header */}
            <section className="py-20 md:py-28 text-center bg-[#1a0e06] text-white relative overflow-hidden bg-radial-glow">
                <div className="container-wide relative z-10 px-4 sm:px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="max-w-3xl mx-auto"
                    >
                        <span className="eyebrow-tag border-white/20 text-[#f5ede0] mb-6 inline-flex items-center gap-2">
                            <Sparkles size={13} className="text-red" /> The Drizzle Journal & Gazette
                        </span>
                        <h1 className="h1-fluid mb-6 text-[#fdf8f2]">Stories, Vintages & Flavors</h1>
                        <p className="body-fluid text-white/70 max-w-2xl mx-auto leading-relaxed">
                            Insights from our executive chefs, sommelier pairing notes, sustainable fine dining philosophies, and secret kitchen techniques.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Filter Bar */}
            <section className="container-wide px-4 sm:px-6 lg:px-8 -mt-7 relative z-20">
                <div className="glass-card bg-white p-4 sm:p-6 rounded-2xl shadow-xl border border-[#e2d4c4] flex flex-col md:flex-row justify-between items-center gap-4">
                    {/* Search */}
                    <div className="relative w-full md:max-w-md">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" size={18} />
                        <input
                            type="text"
                            placeholder="Search recipes, sustainability, wine pairings..."
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

                    {/* Category Buttons */}
                    <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto no-scrollbar pb-1 md:pb-0">
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                                    activeCategory === cat
                                        ? 'bg-red text-white shadow-md shadow-red/20'
                                        : 'bg-cream text-brown hover:bg-cream2 border border-border'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Main Content Area */}
            <main className="container-wide px-4 sm:px-6 lg:px-8 mt-12">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 text-muted gap-4">
                        <div className="w-12 h-12 border-3 border-red border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-xs font-bold uppercase tracking-widest text-brown">
                            Fetching Editorial Stories...
                        </span>
                    </div>
                ) : error ? (
                    <div className="text-center py-20">
                        <p className="text-red font-bold mb-4">{error}</p>
                        <button onClick={fetchPosts} className="btn-outline py-2 px-5 text-xs">
                            Reload Journal
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Featured Hero Article (Show on All category without search) */}
                        {featuredPost && activeCategory === 'All' && !searchQuery && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-14 bg-white rounded-3xl border border-[#e2d4c4] overflow-hidden shadow-lg hover:shadow-2xl transition-all group grid grid-cols-1 lg:grid-cols-12 cursor-pointer"
                                onClick={() => setSelectedPost(featuredPost)}
                            >
                                <div className="lg:col-span-7 h-72 lg:h-[480px] relative overflow-hidden bg-cream3">
                                    <img
                                        src={featuredPost.headerImage || 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'}
                                        alt={featuredPost.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute top-4 left-4">
                                        <span className="bg-red text-white text-[11px] font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow-md">
                                            Featured Story
                                        </span>
                                    </div>
                                </div>

                                <div className="lg:col-span-5 p-8 sm:p-12 flex flex-col justify-between bg-gradient-to-br from-white to-[#fbf7f2]">
                                    <div>
                                        <div className="flex items-center gap-3 text-xs text-muted font-bold mb-4">
                                            <span className="px-2.5 py-0.5 bg-cream3 rounded text-brown uppercase text-[10px] tracking-wider">
                                                {featuredPost.category}
                                            </span>
                                            <span>•</span>
                                            <span className="flex items-center gap-1">
                                                <Clock size={13} /> {featuredPost.readTime || '5 min read'}
                                            </span>
                                        </div>

                                        <h2 className="font-serif font-black text-2xl sm:text-3xl text-dark mb-4 leading-tight group-hover:text-red transition-colors">
                                            {featuredPost.title}
                                        </h2>

                                        <p className="text-muted text-sm sm:text-base leading-relaxed mb-6 font-sans line-clamp-4">
                                            {featuredPost.excerpt}
                                        </p>
                                    </div>

                                    <div className="pt-6 border-t border-[#e2d4c4] flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-cream3 border border-border flex items-center justify-center font-serif font-bold text-dark text-sm">
                                                {featuredPost.author ? featuredPost.author[0] : 'D'}
                                            </div>
                                            <div>
                                                <p className="text-xs font-black text-dark">{featuredPost.author || 'Drizzle Team'}</p>
                                                <p className="text-[10px] text-muted">{new Date(featuredPost.publishedAt || Date.now()).toLocaleDateString()}</p>
                                            </div>
                                        </div>

                                        <span className="btn-primary py-2.5 px-5 text-xs rounded-xl inline-flex items-center gap-2 group-hover:bg-red-hover">
                                            Read Story <ArrowRight size={14} />
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Article Grid */}
                        {gridPosts.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                <AnimatePresence>
                                    {gridPosts.map((post) => (
                                        <motion.article
                                            key={post._id}
                                            layout
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{ duration: 0.3 }}
                                            onClick={() => setSelectedPost(post)}
                                            className="glass-card bg-white rounded-2xl border border-[#e2d4c4] overflow-hidden shadow-sm hover:shadow-card transition-all flex flex-col group cursor-pointer"
                                        >
                                            {/* Article Header Image */}
                                            <div className="h-56 relative overflow-hidden bg-cream3">
                                                <img
                                                    src={post.headerImage || 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=800&auto=format&fit=crop'}
                                                    alt={post.title}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                                                />
                                                <span className="absolute top-4 left-4 bg-dark/85 backdrop-blur-sm text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
                                                    {post.category}
                                                </span>
                                            </div>

                                            {/* Body */}
                                            <div className="p-6 sm:p-7 flex flex-col flex-grow">
                                                <div className="flex items-center gap-2 text-xs text-muted font-bold mb-3">
                                                    <span className="flex items-center gap-1">
                                                        <Clock size={12} /> {post.readTime || '4 min read'}
                                                    </span>
                                                    <span>•</span>
                                                    <span>{new Date(post.publishedAt || Date.now()).toLocaleDateString()}</span>
                                                </div>

                                                <h3 className="font-serif font-black text-xl text-dark group-hover:text-red transition-colors line-clamp-2 mb-3 leading-snug">
                                                    {post.title}
                                                </h3>

                                                <p className="text-muted text-sm line-clamp-3 mb-6 font-sans leading-relaxed flex-grow">
                                                    {post.excerpt}
                                                </p>

                                                <div className="pt-4 border-t border-[#e2d4c4]/60 flex items-center justify-between mt-auto">
                                                    <span className="text-xs font-bold text-brown flex items-center gap-1.5">
                                                        <User size={13} className="text-red" /> {post.author || 'Drizzle Team'}
                                                    </span>

                                                    <span className="text-red font-bold text-xs flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                                        Read <ChevronRight size={14} />
                                                    </span>
                                                </div>
                                            </div>
                                        </motion.article>
                                    ))}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <div className="text-center py-24 bg-white rounded-2xl border border-dashed border-border p-8">
                                <BookOpen size={48} className="opacity-30 mx-auto mb-3" />
                                <h3 className="font-serif font-black text-xl text-dark mb-2">No articles match your criteria</h3>
                                <p className="text-muted text-sm max-w-md mx-auto mb-6">
                                    Try selecting a different topic category or resetting your search term.
                                </p>
                                <button
                                    onClick={() => { setActiveCategory('All'); setSearchQuery(''); }}
                                    className="btn-primary text-xs py-2.5 px-6"
                                >
                                    Reset Filters
                                </button>
                            </div>
                        )}
                    </>
                )}
            </main>

            {/* Interactive Full Article Reader Modal */}
            <AnimatePresence>
                {selectedPost && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-dark/75 backdrop-blur-md"
                            onClick={() => setSelectedPost(null)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-3xl bg-[#fdf8f2] rounded-3xl shadow-2xl border border-white/30 overflow-hidden my-8 z-10 max-h-[90vh] flex flex-col"
                        >
                            {/* Modal Sticky Header */}
                            <div className="p-4 sm:p-6 border-b border-[#e2d4c4] bg-white flex items-center justify-between shrink-0">
                                <div className="flex items-center gap-2">
                                    <span className="px-3 py-1 bg-cream3 rounded-full text-[10px] font-black uppercase tracking-wider text-brown">
                                        {selectedPost.category}
                                    </span>
                                    <span className="text-xs text-muted font-bold">
                                        {selectedPost.readTime || '5 min read'}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleShare(selectedPost)}
                                        className="p-2 rounded-lg hover:bg-cream text-muted hover:text-dark transition-colors"
                                        title="Share Article"
                                    >
                                        <Share2 size={18} />
                                    </button>
                                    <button
                                        onClick={() => setSelectedPost(null)}
                                        className="p-2 rounded-lg hover:bg-cream text-muted hover:text-red transition-colors"
                                    >
                                        <X size={22} />
                                    </button>
                                </div>
                            </div>

                            {/* Article Body */}
                            <div className="p-6 sm:p-10 overflow-y-auto custom-scrollbar space-y-6">
                                {/* Large Cover Image */}
                                <div className="w-full h-72 sm:h-96 rounded-2xl overflow-hidden shadow-inner relative">
                                    <img
                                        src={selectedPost.headerImage || 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=1200&auto=format&fit=crop'}
                                        alt={selectedPost.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                <div>
                                    <h1 className="font-serif font-black text-2xl sm:text-4xl text-dark leading-tight mb-4">
                                        {selectedPost.title}
                                    </h1>

                                    <div className="flex items-center gap-3 text-xs text-muted pb-6 border-b border-[#e2d4c4]">
                                        <span className="font-black text-dark">By {selectedPost.author || 'Drizzle Culinary Team'}</span>
                                        <span>•</span>
                                        <span>{new Date(selectedPost.publishedAt || Date.now()).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                                    </div>
                                </div>

                                {/* Formatted Content */}
                                <div className="prose prose-stone max-w-none font-sans text-brown/90 leading-relaxed sm:text-base space-y-4">
                                    {selectedPost.content ? (
                                        selectedPost.content.split('\n\n').map((paragraph, index) => {
                                            if (paragraph.startsWith('### ')) {
                                                return <h3 key={index} className="font-serif font-black text-xl text-dark pt-4">{paragraph.replace('### ', '')}</h3>;
                                            }
                                            if (paragraph.startsWith('1. ') || paragraph.startsWith('2. ') || paragraph.startsWith('3. ')) {
                                                return <p key={index} className="pl-4 border-l-2 border-red italic">{paragraph}</p>;
                                            }
                                            return <p key={index}>{paragraph}</p>;
                                        })
                                    ) : (
                                        <p>{selectedPost.excerpt}</p>
                                    )}
                                </div>

                                {/* Author Signature Box */}
                                <div className="p-6 bg-white rounded-2xl border border-[#e2d4c4] flex items-center gap-4 mt-8">
                                    <div className="w-14 h-14 rounded-full bg-cream3 border border-border flex items-center justify-center font-serif font-black text-xl text-dark shrink-0">
                                        {selectedPost.author ? selectedPost.author[0] : 'D'}
                                    </div>
                                    <div>
                                        <h4 className="font-serif font-black text-base text-dark">{selectedPost.author || 'Drizzle Culinary Team'}</h4>
                                        <p className="text-xs text-muted">Curator & contributor to Drizzle Haute Cuisine & Sommelier Journal.</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Blog;
