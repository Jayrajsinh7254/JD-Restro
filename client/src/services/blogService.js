import api from './api';

const DEFAULT_BLOGS = [
    {
        _id: 'b1',
        title: 'The Art of Sourcing: From Farm to Fork',
        slug: 'art-of-sourcing-farm-to-fork',
        excerpt: 'An inside look at our partnerships with upstate New York biodynamic growers and coastal fisheries.',
        content: 'Every dish at Drizzle begins with respect for terroir. We travel across the region to meet farmers directly, tasting seasonal varietals at dawn before they ever reach our prep tables...',
        author: 'Chef Marcus Thorne',
        category: 'Culinary Philosophy',
        tags: ['Organic', 'Farm-to-Table', 'Sustainability'],
        coverImage: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80',
        readTime: 4,
        createdAt: new Date().toISOString()
    },
    {
        _id: 'b2',
        title: 'Curating the Cellar: The 2026 Wine Selection',
        slug: 'curating-the-cellar-2026',
        excerpt: 'Head Sommelier Julien Laurent breaks down this season’s most exciting natural and biodynamic allocations.',
        content: 'A thoughtful wine list is a narrative of place and time. This year, we spotlight rare low-intervention growers from Burgundy, Piedmont, and Oregon’s Willamette Valley...',
        author: 'Julien Laurent',
        category: 'Wine & Spirits',
        tags: ['Sommelier', 'Wine Pairing', 'Vintage'],
        coverImage: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&q=80',
        readTime: 6,
        createdAt: new Date().toISOString()
    }
];

const getStoredBlogs = () => {
    try {
        const stored = localStorage.getItem('drizzle_blog_posts');
        if (stored) return JSON.parse(stored);
    } catch (e) {}
    return DEFAULT_BLOGS;
};

const setStoredBlogs = (items) => {
    try {
        localStorage.setItem('drizzle_blog_posts', JSON.stringify(items));
    } catch (e) {}
};

export const blogService = {
    getAll: async () => {
        try {
            const response = await api.get('/blog');
            if (response.data?.success && response.data.data?.length) {
                setStoredBlogs(response.data.data);
                return response.data;
            }
        } catch (e) {
            console.warn('Backend blog fetch offline, using local store');
        }
        return { success: true, count: getStoredBlogs().length, data: getStoredBlogs() };
    },
    getBySlug: async (slug) => {
        try {
            const response = await api.get(`/blog/slug/${slug}`);
            if (response.data?.success) return response.data;
        } catch (e) {}
        const post = getStoredBlogs().find(b => b.slug === slug);
        return { success: true, data: post };
    },
    create: async (data) => {
        try {
            const isFormData = data instanceof FormData;
            const config = isFormData
                ? { headers: { 'Content-Type': 'multipart/form-data' } }
                : { headers: { 'Content-Type': 'application/json' } };
            const response = await api.post('/blog', data, config);
            if (response.data?.success) return response.data;
        } catch (e) {}

        const newPost = {
            _id: 'b_' + Date.now(),
            ...data,
            createdAt: new Date().toISOString()
        };
        const current = getStoredBlogs();
        const updated = [newPost, ...current];
        setStoredBlogs(updated);
        return { success: true, data: newPost };
    },
    update: async (id, data) => {
        try {
            const isFormData = data instanceof FormData;
            const config = isFormData
                ? { headers: { 'Content-Type': 'multipart/form-data' } }
                : { headers: { 'Content-Type': 'application/json' } };
            const response = await api.put(`/blog/${id}`, data, config);
            if (response.data?.success) return response.data;
        } catch (e) {}

        const current = getStoredBlogs();
        const updated = current.map(b => b._id === id ? { ...b, ...data } : b);
        setStoredBlogs(updated);
        return { success: true, data: updated.find(b => b._id === id) };
    },
    delete: async (id) => {
        try {
            const response = await api.delete(`/blog/${id}`);
            if (response.data?.success) return response.data;
        } catch (e) {}

        const current = getStoredBlogs();
        const updated = current.filter(b => b._id !== id);
        setStoredBlogs(updated);
        return { success: true, message: 'Post deleted' };
    },
};

export default blogService;
