import api from './api';

const DEFAULT_ORDERS = [
    {
        _id: 'ord_1001',
        orderNumber: 'ORD-8821',
        customerName: 'Marcus Vance',
        customerEmail: 'marcus.vance@gmail.com',
        customerPhone: '+1 (555) 234-5678',
        orderType: 'dine_in',
        tableNumber: 'Table 7',
        items: [
            { name: 'Grilled Ribeye Steak', price: 48, quantity: 2 },
            { name: 'Smoked Rosemary Old Fashioned', price: 18, quantity: 2 }
        ],
        totalAmount: 132,
        status: 'preparing',
        paymentStatus: 'paid',
        createdAt: new Date().toISOString()
    },
    {
        _id: 'ord_1002',
        orderNumber: 'ORD-8822',
        customerName: 'Eleanor Sterling',
        customerEmail: 'eleanor@sterling.com',
        customerPhone: '+1 (555) 876-5432',
        orderType: 'takeout',
        tableNumber: null,
        items: [
            { name: 'Pan-Seared Atlantic Salmon', price: 36, quantity: 1 },
            { name: 'Garden Bruschetta', price: 12, quantity: 1 },
            { name: 'Valrhona Chocolate Molten Lava', price: 16, quantity: 1 }
        ],
        totalAmount: 64,
        status: 'ready',
        paymentStatus: 'paid',
        createdAt: new Date().toISOString()
    }
];

const getStoredOrders = () => {
    try {
        const stored = localStorage.getItem('drizzle_orders');
        if (stored) return JSON.parse(stored);
    } catch (e) {}
    return DEFAULT_ORDERS;
};

const setStoredOrders = (items) => {
    try {
        localStorage.setItem('drizzle_orders', JSON.stringify(items));
    } catch (e) {}
};

export const orderService = {
    create: async (data) => {
        try {
            const response = await api.post('/orders', data);
            if (response.data?.success) return response.data;
        } catch (e) {
            console.warn('Backend order create offline, saving locally');
        }

        const newOrder = {
            _id: 'ord_' + Date.now(),
            orderNumber: 'ORD-' + Math.floor(1000 + Math.random() * 9000),
            ...data,
            status: 'preparing',
            paymentStatus: 'paid',
            createdAt: new Date().toISOString()
        };
        const current = getStoredOrders();
        const updated = [newOrder, ...current];
        setStoredOrders(updated);
        return { success: true, data: newOrder };
    },
    getAll: async () => {
        try {
            const response = await api.get('/orders');
            if (response.data?.success && response.data.data?.length) {
                setStoredOrders(response.data.data);
                return response.data;
            }
        } catch (e) {
            console.warn('Backend orders fetch offline, using local store');
        }
        return { success: true, count: getStoredOrders().length, data: getStoredOrders() };
    },
    updateStatus: async (id, status) => {
        try {
            const response = await api.put(`/orders/${id}`, { status });
            if (response.data?.success) return response.data;
        } catch (e) {}

        const current = getStoredOrders();
        const updated = current.map(o => o._id === id ? { ...o, status } : o);
        setStoredOrders(updated);
        return { success: true, data: updated.find(o => o._id === id) };
    },
    delete: async (id) => {
        try {
            const response = await api.delete(`/orders/${id}`);
            if (response.data?.success) return response.data;
        } catch (e) {}

        const current = getStoredOrders();
        const updated = current.filter(o => o._id !== id);
        setStoredOrders(updated);
        return { success: true, message: 'Order removed' };
    },
};

export default orderService;
