import React, { createContext, useState, useEffect, useContext } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is logged in
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
            setCurrentUser(JSON.parse(userInfo));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const data = await authService.login(email, password);
            if (data.success) {
                localStorage.setItem('userInfo', JSON.stringify(data.data));
                setCurrentUser(data.data);
                return { success: true };
            }
            return { success: false, error: 'Login failed' };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'An error occurred during login'
            };
        }
    };

    const logout = async () => {
        try {
            await authService.logout();
        } catch (error) {
            console.error('Logout error', error);
            // Still remove local info even if server call fails
            localStorage.removeItem('userInfo');
        }
        setCurrentUser(null);
    };

    const value = {
        currentUser,
        isAuthenticated: !!currentUser,
        isAdmin: currentUser?.role === 'admin',
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
