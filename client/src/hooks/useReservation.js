import { useState } from 'react';
import { reservationService } from '../services/reservationService';
import toast from 'react-hot-toast';

export const useReservation = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const makeReservation = async (reservationData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await reservationService.create(reservationData);
            if (response.success) {
                toast.success('Reservation request sent successfully!');
                return { success: true, data: response.data };
            }
            return { success: false };
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Error making reservation';
            setError(errorMsg);
            toast.error(errorMsg);
            return { success: false, error: errorMsg };
        } finally {
            setLoading(false);
        }
    };

    return { makeReservation, loading, error };
};
