import api from './api';

const DEFAULT_RESERVATIONS = [
    {
        _id: 'r_101',
        name: 'Alexander Wright',
        firstName: 'Alexander',
        lastName: 'Wright',
        email: 'alex.wright@luxury.com',
        phone: '+1 (212) 555-8832',
        date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        time: '19:30',
        guests: 4,
        partySize: 4,
        occasion: 'Anniversary',
        specialRequests: 'Quiet corner table with candle arrangement please.',
        status: 'confirmed',
        createdAt: new Date().toISOString()
    },
    {
        _id: 'r_102',
        name: 'Sophia Laurent',
        firstName: 'Sophia',
        lastName: 'Laurent',
        email: 'sophia@laurent.co',
        phone: '+1 (212) 555-1994',
        date: new Date(Date.now() + 172800000).toISOString().split('T')[0],
        time: '20:00',
        guests: 2,
        partySize: 2,
        occasion: 'Birthday',
        specialRequests: 'Wine cellar tour after dinner.',
        status: 'pending',
        createdAt: new Date().toISOString()
    }
];

const getStoredReservations = () => {
    try {
        const stored = localStorage.getItem('drizzle_reservations');
        if (stored) return JSON.parse(stored);
    } catch (e) {}
    return DEFAULT_RESERVATIONS;
};

const setStoredReservations = (items) => {
    try {
        localStorage.setItem('drizzle_reservations', JSON.stringify(items));
    } catch (e) {}
};

export const reservationService = {
    create: async (data) => {
        try {
            const response = await api.post('/reservations', data);
            if (response.data?.success) return response.data;
        } catch (e) {
            console.warn('Backend reservation create offline, storing locally');
        }

        const newRes = {
            _id: 'r_' + Date.now(),
            ...data,
            status: 'pending',
            createdAt: new Date().toISOString()
        };
        const current = getStoredReservations();
        const updated = [newRes, ...current];
        setStoredReservations(updated);
        return { success: true, data: newRes };
    },
    getAll: async () => {
        try {
            const response = await api.get('/reservations');
            if (response.data?.success && response.data.data?.length) {
                setStoredReservations(response.data.data);
                return response.data;
            }
        } catch (e) {
            console.warn('Backend reservations fetch offline, using local store');
        }
        return { success: true, count: getStoredReservations().length, data: getStoredReservations() };
    },
    updateStatus: async (id, status) => {
        try {
            const response = await api.put(`/reservations/${id}`, { status });
            if (response.data?.success) return response.data;
        } catch (e) {}

        const current = getStoredReservations();
        const updated = current.map(r => r._id === id ? { ...r, status } : r);
        setStoredReservations(updated);
        return { success: true, data: updated.find(r => r._id === id) };
    },
    delete: async (id) => {
        try {
            const response = await api.delete(`/reservations/${id}`);
            if (response.data?.success) return response.data;
        } catch (e) {}

        const current = getStoredReservations();
        const updated = current.filter(r => r._id !== id);
        setStoredReservations(updated);
        return { success: true, message: 'Reservation removed' };
    },
};

export default reservationService;
