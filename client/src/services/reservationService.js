import api from './api';

export const reservationService = {
    create: async (data) => {
        const response = await api.post('/reservations', data);
        return response.data;
    },
    getAll: async () => {
        const response = await api.get('/reservations');
        return response.data;
    },
    updateStatus: async (id, status) => {
        const response = await api.put(`/reservations/${id}`, { status });
        return response.data;
    },
    delete: async (id) => {
        const response = await api.delete(`/reservations/${id}`);
        return response.data;
    },
};
