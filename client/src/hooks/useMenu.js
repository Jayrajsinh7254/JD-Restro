import { useState, useEffect, useCallback } from 'react';
import { menuService } from '../services/menuService';

export const useMenu = (initialCategory = null) => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [category, setCategory] = useState(initialCategory);

    const fetchMenu = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            let data;
            if (category && category !== 'All') {
                data = await menuService.getByCategory(category);
            } else {
                data = await menuService.getAll();
            }

            if (data && data.success) {
                setItems(data.data || []);
            } else {
                setError('Failed to fetch menu items');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Error fetching menu items');
        } finally {
            setLoading(false);
        }
    }, [category]);

    useEffect(() => {
        fetchMenu();
    }, [fetchMenu]);

    const changeCategory = (newCategory) => {
        setCategory(newCategory);
    };

    return { items, loading, error, category, changeCategory, setItems, refetch: fetchMenu };
};
