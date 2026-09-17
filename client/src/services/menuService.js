import api from './api';

const DEFAULT_MENU_ITEMS = [
    {
        _id: 'm1',
        name: 'Garden Bruschetta',
        description: 'Crisp crostini topped with fresh tomatoes, basil, garlic, and balsamic glaze.',
        category: 'starter',
        price: 12,
        tags: ['Veg', 'Popular'],
        image: 'https://images.unsplash.com/photo-1572695157366-5e585e50d53c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        isAvailable: true,
    },
    {
        _id: 'm2',
        name: 'Crispy Calamari',
        description: 'Lightly fried squid rings served with house-made marinara and lemon wedge.',
        category: 'starter',
        price: 16,
        tags: ['Spicy', 'New'],
        image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        isAvailable: true,
    },
    {
        _id: 'm3',
        name: 'French Onion Soup',
        description: 'Rich beef broth, caramelized onions, topped with croutons and melted gruyere.',
        category: 'starter',
        price: 14,
        tags: ['Popular'],
        image: 'https://images.unsplash.com/photo-1547592180-85f173990554?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        isAvailable: true,
    },
    {
        _id: 'm4',
        name: 'Grilled Ribeye Steak',
        description: '14oz premium cut, garlic herb butter, served with roasted root vegetables.',
        category: 'main',
        price: 48,
        tags: ['Popular', "Chef's Pick"],
        image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        isAvailable: true,
    },
    {
        _id: 'm5',
        name: 'Truffle Tagliolini',
        description: 'Handmade linguine tossed in wild mushroom cream sauce with black truffle shavings.',
        category: 'main',
        price: 28,
        tags: ['New'],
        image: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        isAvailable: true,
    },
    {
        _id: 'm6',
        name: 'Buddha Super Bowl',
        description: 'Quinoa, roasted sweet potato, avocado, kale, chickpeas with tahini dressing.',
        category: 'vegan',
        price: 22,
        tags: ['Vegan', 'Popular'],
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        isAvailable: true,
    },
    {
        _id: 'm7',
        name: 'Pan-Seared Atlantic Salmon',
        description: 'Wild salmon fillet, asparagus, lemon dill beurre blanc sauce.',
        category: 'seafood',
        price: 36,
        tags: ['Popular'],
        image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        isAvailable: true,
    },
    {
        _id: 'm8',
        name: 'Smoked Rosemary Old Fashioned',
        category: 'drinks',
        price: 18,
        tags: ['Popular'],
        image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        isAvailable: true,
        description: 'Bourbon, aromatic bitters, charred organic rosemary.'
    },
    {
        _id: 'm9',
        name: 'Valrhona Chocolate Molten Lava',
        category: 'dessert',
        price: 16,
        tags: ['Popular'],
        image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        isAvailable: true,
        description: 'Warm flowing dark chocolate center served with Madagascar vanilla gelato.'
    }
];

const getStoredMenu = () => {
    try {
        const stored = localStorage.getItem('drizzle_menu_items');
        if (stored) return JSON.parse(stored);
    } catch (e) {}
    return DEFAULT_MENU_ITEMS;
};

const setStoredMenu = (items) => {
    try {
        localStorage.setItem('drizzle_menu_items', JSON.stringify(items));
    } catch (e) {}
};

export const menuService = {
    getAll: async () => {
        try {
            const response = await api.get('/menu');
            if (response.data?.success && response.data.data?.length) {
                setStoredMenu(response.data.data);
                return response.data;
            }
        } catch (e) {
            console.warn('Backend menu fetch offline, using local store');
        }
        return { success: true, count: getStoredMenu().length, data: getStoredMenu() };
    },
    getByCategory: async (category) => {
        try {
            const response = await api.get(`/menu/${category}`);
            if (response.data?.success && response.data.data?.length) {
                return response.data;
            }
        } catch (e) {}
        const items = getStoredMenu().filter(i => i.category?.toLowerCase() === category?.toLowerCase());
        return { success: true, count: items.length, data: items };
    },
    create: async (data) => {
        try {
            const isFormData = data instanceof FormData;
            const config = isFormData
                ? { headers: { 'Content-Type': 'multipart/form-data' } }
                : { headers: { 'Content-Type': 'application/json' } };
            const response = await api.post('/menu', data, config);
            if (response.data?.success) return response.data;
        } catch (e) {}
        
        let newItem = data;
        if (data instanceof FormData) {
            newItem = {};
            for (let [key, val] of data.entries()) {
                newItem[key] = val;
            }
        }
        newItem._id = 'm_' + Date.now();
        newItem.isAvailable = true;
        const current = getStoredMenu();
        const updated = [newItem, ...current];
        setStoredMenu(updated);
        return { success: true, data: newItem };
    },
    update: async (id, data) => {
        try {
            const isFormData = data instanceof FormData;
            const config = isFormData
                ? { headers: { 'Content-Type': 'multipart/form-data' } }
                : { headers: { 'Content-Type': 'application/json' } };
            const response = await api.put(`/menu/${id}`, data, config);
            if (response.data?.success) return response.data;
        } catch (e) {}

        const current = getStoredMenu();
        const updated = current.map(item => item._id === id ? { ...item, ...data } : item);
        setStoredMenu(updated);
        return { success: true, data: updated.find(i => i._id === id) };
    },
    delete: async (id) => {
        try {
            const response = await api.delete(`/menu/${id}`);
            if (response.data?.success) return response.data;
        } catch (e) {}

        const current = getStoredMenu();
        const updated = current.filter(item => item._id !== id);
        setStoredMenu(updated);
        return { success: true, message: 'Item deleted' };
    },
};

export default menuService;
