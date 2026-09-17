// This hook is just a wrapper around the CartContext for consistency
import { useCart as useCartContext } from '../context/CartContext';

export const useCart = () => {
    return useCartContext();
};
