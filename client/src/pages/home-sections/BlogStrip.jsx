import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, User, Sparkles } from 'lucide-react';
import { blogService } from '../../services/blogService';

const BlogStrip = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLatestPosts = async () => {
            try {
                const response = await blogService.getAll();
                if (response.data) {
                    setPosts(response.data.slice(0, 3));
                }
            } catch (err) {
                console.error('Failed to load home blog strip', err);
            } finally {
                setLoading(false);
            }
        };

        fetchLatestPosts();
    }, []);

    if (posts.length === 0 && !loading) return null;

    return (
        <section className="section-padding bg-[#fcf8f3] border-t border-[#e2d4c4]/60">
            <div className="container-wide">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="max-w-xl"
                    >
                        <div className="flex items-center gap-2 mb-4">
                            <Sparkles size={14} className="text-red" />
                            <span className="eyebrow-tag">Journal & Stories</span>
                        </div>
                        <h2 className="h2-fluid">Culinary Insights & Gastronomy</h2>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <Link to="/blog" className="btn-outline rounded-full px-8 bg-white hover:bg-red hover:text-white">
                            View All Stories <ArrowRight size={14} />
                        </Link>
                    </motion.div>
                </div>

                {/* Posts Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {posts.map((post, idx) => (
                        <motion.article
                            key={post._id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                            className="glass-card bg-white rounded-2xl border border-[#e2d4c4] overflow-hidden shadow-sm hover:shadow-card flex flex-col group"
                        >
                            <Link to="/blog" className="block h-52 relative overflow-hidden bg-cream3">
                                <img
                                    src={post.headerImage || 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=800&auto=format&fit=crop'}
                                    alt={post.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                                />
                                <span className="absolute top-4 left-4 bg-dark/85 backdrop-blur-sm text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
                                    {post.category}
                                </span>
                            </Link>

                            <div className="p-6 sm:p-7 flex flex-col flex-grow">
                                <div className="flex items-center gap-2 text-xs text-muted font-bold mb-3">
                                    <span className="flex items-center gap-1">
                                        <Clock size={12} /> {post.readTime || '5 min read'}
                                    </span>
                                    <span>•</span>
                                    <span>{new Date(post.publishedAt || Date.now()).toLocaleDateString()}</span>
                                </div>

                                <Link to="/blog">
                                    <h3 className="font-serif font-bold text-xl text-dark group-hover:text-red transition-colors line-clamp-2 mb-3 leading-snug">
                                        {post.title}
                                    </h3>
                                </Link>

                                <p className="text-muted text-xs sm:text-sm line-clamp-3 mb-6 font-sans leading-relaxed flex-grow">
                                    {post.excerpt}
                                </p>

                                <div className="pt-4 border-t border-[#e2d4c4]/60 flex items-center justify-between mt-auto">
                                    <span className="text-xs font-bold text-brown flex items-center gap-1.5">
                                        <User size={13} className="text-red" /> {post.author || 'Drizzle Team'}
                                    </span>

                                    <Link to="/blog" className="text-red font-bold text-xs flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                        Read Story <ArrowRight size={13} />
                                    </Link>
                                </div>
                            </div>
                        </motion.article>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default BlogStrip;
