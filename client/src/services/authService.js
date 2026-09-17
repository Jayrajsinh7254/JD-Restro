import api from './api';

export const authService = {
    login: async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        if (response.data.success) {
            localStorage.setItem('userInfo', JSON.stringify(response.data.data));
        }
        return response.data;
    },
    logout: async () => {
        localStorage.removeItem('userInfo');
        await api.post('/auth/logout');
    },
};
