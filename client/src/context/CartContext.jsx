import React, { createContext, useState, useEffect, useContext } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        // Initialize from local storage
        const savedCart = localStorage.getItem('drizzle_cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    // Save to local storage whenever cart changes
    useEffect(() => {
        localStorage.setItem('drizzle_cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (item, quantity = 1) => {
        setCartItems((prevItems) => {
            const existingItem = prevItems.find((i) => i.menuItem === item._id);

            if (existingItem) {
                // Update quantity if already in cart
                return prevItems.map((i) =>
                    i.menuItem === item._id
                        ? { ...i, quantity: i.quantity + quantity }
                        : i
                );
            } else {
                // Add new item
                return [...prevItems, {
                    menuItem: item._id,
                    name: item.name,
                    price: item.price,
                    image: item.image,
                    quantity
                }];
            }
        });

        toast.success(`Add ${quantity}x ${item.name} to cart`);
    };

    const removeFromCart = (id) => {
        setCartItems((prevItems) => prevItems.filter((i) => i.menuItem !== id));
        toast.success('Item removed from cart');
    };

    const updateQuantity = (id, quantity) => {
        if (quantity <= 0) {
            removeFromCart(id);
            return;
        }

        setCartItems((prevItems) =>
            prevItems.map((i) =>
                i.menuItem === id ? { ...i, quantity } : i
            )
        );
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const cartTotalAmount = cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );

    const cartTotalItems = cartItems.reduce(
        (total, item) => total + item.quantity,
        0
    );

    const value = {
        cartItems,
        cartTotalAmount,
        cartTotalItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};
