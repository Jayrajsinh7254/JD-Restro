import api from './api';

export const blogService = {
    getAll: async () => {
        const response = await api.get('/blog');
        return response.data;
    },
    getBySlug: async (slug) => {
        const response = await api.get(`/blog/slug/${slug}`);
        return response.data;
    },
    create: async (data) => {
        const isFormData = data instanceof FormData;
        const config = isFormData
            ? { headers: { 'Content-Type': 'multipart/form-data' } }
            : { headers: { 'Content-Type': 'application/json' } };
        const response = await api.post('/blog', data, config);
        return response.data;
    },
    update: async (id, data) => {
        const isFormData = data instanceof FormData;
        const config = isFormData
            ? { headers: { 'Content-Type': 'multipart/form-data' } }
            : { headers: { 'Content-Type': 'application/json' } };
        const response = await api.put(`/blog/${id}`, data, config);
        return response.data;
    },
    delete: async (id) => {
        const response = await api.delete(`/blog/${id}`);
        return response.data;
    },
};
