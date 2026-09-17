import React, { createContext, useState, useContext } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

const LoyaltyContext = createContext();

export const useLoyalty = () => useContext(LoyaltyContext);

export const LoyaltyProvider = ({ children }) => {
    const [member, setMember] = useState(null);
    const [loading, setLoading] = useState(false);

    const checkStatus = async (email) => {
        setLoading(true);
        try {
            const response = await api.get(`/loyalty/${email}`);
            if (response.data.success) {
                setMember(response.data.data);
                return { success: true, data: response.data.data };
            }
        } catch (error) {
            console.error('Error fetching loyalty status:', error);
            return {
                success: false,
                error: error.response?.data?.message || 'Member not found'
            };
        } finally {
            setLoading(false);
        }
    };

    const joinLoyalty = async (userData) => {
        setLoading(true);
        try {
            const response = await api.post('/loyalty/join', userData);
            if (response.data.success) {
                setMember(response.data.data);
                toast.success(`Welcome to Drizzle Loyalty, ${response.data.data.name}!`);
                return { success: true, data: response.data.data };
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error joining program');
            return {
                success: false,
                error: error.response?.data?.message || 'An error occurred'
            };
        } finally {
            setLoading(false);
        }
    };

    const logoutMember = () => {
        setMember(null);
    };

    const value = {
        member,
        loading,
        checkStatus,
        joinLoyalty,
        logoutMember
    };

    return (
        <LoyaltyContext.Provider value={value}>
            {children}
        </LoyaltyContext.Provider>
    );
};
