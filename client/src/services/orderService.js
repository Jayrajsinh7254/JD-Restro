import api from './api';

export const orderService = {
    create: async (data) => {
        const response = await api.post('/orders', data);
        return response.data;
    },
    getAll: async () => {
        const response = await api.get('/orders');
        return response.data;
    },
    updateStatus: async (id, status) => {
        const response = await api.put(`/orders/${id}`, { status });
        return response.data;
    },
    delete: async (id) => {
        const response = await api.delete(`/orders/${id}`);
        return response.data;
    },
};
