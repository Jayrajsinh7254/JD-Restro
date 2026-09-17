import api from './api';

export const contactService = {
    send: async (contactData) => {
        const response = await api.post('/contact', contactData);
        return response.data;
    },
    getAll: async () => {
        const response = await api.get('/contact');
        return response.data;
    }
};

export default contactService;
