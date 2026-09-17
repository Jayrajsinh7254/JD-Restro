import api from './api';

const DEFAULT_GALLERY = [
    {
        _id: 'g1',
        title: 'Main Dining Room At Dusk',
        category: 'Interior',
        imageUrl: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?q=80&w=1200&auto=format&fit=crop',
        description: 'Atmospheric candlelight dining with custom leather booths and walnut accents.'
    },
    {
        _id: 'g2',
        title: 'A5 Miyazaki Wagyu Tenderloin',
        category: 'Food',
        imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200&auto=format&fit=crop',
        description: 'Charred over binchotan charcoal, served with black truffle jus and smoked shallot puree.'
    },
    {
        _id: 'g3',
        title: 'Smoked Rosemary Old Fashioned',
        category: 'Drinks',
        imageUrl: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=1200&auto=format&fit=crop',
        description: 'Handcrafted bourbon cocktail smoked with charred organic rosemary and aromatic bitters.'
    },
    {
        _id: 'g4',
        title: 'The Private Wine Cellar Vault',
        category: 'Interior',
        imageUrl: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=1200&auto=format&fit=crop',
        description: 'Our climate-controlled reserve cellar housing over 800 rare vintages.'
    },
    {
        _id: 'g5',
        title: 'Pan-Seared Hokkaido Scallops',
        category: 'Food',
        imageUrl: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?q=80&w=1200&auto=format&fit=crop',
        description: 'Golden crust with cauliflower velouté and Siberian royal caviar pearls.'
    }
];

const getStoredGallery = () => {
    try {
        const stored = localStorage.getItem('drizzle_gallery');
        if (stored) return JSON.parse(stored);
    } catch (e) {}
    return DEFAULT_GALLERY;
};

const setStoredGallery = (items) => {
    try {
        localStorage.setItem('drizzle_gallery', JSON.stringify(items));
    } catch (e) {}
};

export const galleryService = {
    getAll: async () => {
        try {
            const response = await api.get('/gallery');
            if (response.data?.success && response.data.data?.length) {
                setStoredGallery(response.data.data);
                return response.data;
            }
        } catch (e) {
            console.warn('Backend gallery fetch offline, using local store');
        }
        return { success: true, count: getStoredGallery().length, data: getStoredGallery() };
    },
    create: async (formData) => {
        try {
            const response = await api.post('/gallery', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            if (response.data?.success) return response.data;
        } catch (e) {}

        const newItem = {
            _id: 'g_' + Date.now(),
            title: formData.get ? formData.get('title') : (formData.title || 'New Gallery Item'),
            category: formData.get ? formData.get('category') : (formData.category || 'Food'),
            imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80',
            description: formData.get ? formData.get('description') : ''
        };
        const current = getStoredGallery();
        const updated = [newItem, ...current];
        setStoredGallery(updated);
        return { success: true, data: newItem };
    },
    delete: async (id) => {
        try {
            const response = await api.delete(`/gallery/${id}`);
            if (response.data?.success) return response.data;
        } catch (e) {}

        const current = getStoredGallery();
        const updated = current.filter(g => g._id !== id);
        setStoredGallery(updated);
        return { success: true, message: 'Item deleted' };
    }
};

export default galleryService;
