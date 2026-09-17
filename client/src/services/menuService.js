import api from './api';

export const menuService = {
    getAll: async () => {
        const response = await api.get('/menu');
        return response.data;
    },
    getByCategory: async (category) => {
        const response = await api.get(`/menu/${category}`);
        return response.data;
    },
    create: async (data) => {
        const isFormData = data instanceof FormData;
        const config = isFormData
            ? { headers: { 'Content-Type': 'multipart/form-data' } }
            : { headers: { 'Content-Type': 'application/json' } };
        const response = await api.post('/menu', data, config);
        return response.data;
    },
    update: async (id, data) => {
        const isFormData = data instanceof FormData;
        const config = isFormData
            ? { headers: { 'Content-Type': 'multipart/form-data' } }
            : { headers: { 'Content-Type': 'application/json' } };
        const response = await api.put(`/menu/${id}`, data, config);
        return response.data;
    },
    delete: async (id) => {
        const response = await api.delete(`/menu/${id}`);
        return response.data;
    },
};
