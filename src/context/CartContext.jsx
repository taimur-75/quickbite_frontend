import React, { createContext, useContext, useState, useMemo, useCallback, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const { token } = useAuth();
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);

    // --- Fetch cart from backend on mount ---
    useEffect(() => {
        const fetchCart = async () => {
            if (!token) {
                setLoading(false);
                return;
            }

            const API_BASE_URL = import.meta.env.VITE_APP_BACKEND_BASE_URL;

            try {
                const res = await fetch(`${API_BASE_URL}/cart`, {
                    headers: { 
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                });
                const data = await res.json();

                if (res.ok && Array.isArray(data.items)) {
                    setCart(
                        data.items.map(item => ({
                            dish: {
                                _id: item.dishId,
                                name: item.dishName,
                                price: item.price,
                                category: item.category,
                            },
                            quantity: item.quantity,
                        }))
                    );
                }
            } catch (err) {
                console.error('Failed to fetch cart:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchCart();
    }, [token]);

    // --- Automatically sync cart changes to backend ---
    useEffect(() => {
        const syncCart = async () => {
            if (!token) return;
            if (cart.length === 0) return;

            const payload = cart.map(item => ({
                dish: item.dish._id,
                quantity: item.quantity
            }));

            const API_BASE_URL = import.meta.env.VITE_APP_BACKEND_BASE_URL;

            try {
                await fetch(`${API_BASE_URL}/api/cart`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ items: payload }),
                });
            } catch (err) {
                console.error('Failed to sync cart with backend:', err);
            }
        };

        syncCart();
    }, [cart, token]);

    // --- Cart Manipulation Functions ---
    const addToCart = useCallback((dish) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.dish._id === dish._id);
            if (existingItem) {
                return prevCart.map(item =>
                    item.dish._id === dish._id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prevCart, { dish, quantity: 1 }];
        });
    }, []);

    const updateQuantity = useCallback((dishId, delta) => {
        setCart(prevCart => prevCart
            .map(item =>
                item.dish._id === dishId
                    ? { ...item, quantity: item.quantity + delta }
                    : item
            )
            .filter(item => item.quantity > 0)
        );
    }, []);

    const clearCart = useCallback(() => setCart([]), []);

    // --- Derived Values ---
    const totalItems = useMemo(() => cart.reduce((acc, item) => acc + item.quantity, 0), [cart]);
    const totalAmount = useMemo(() => cart.reduce((acc, item) => acc + item.dish.price * item.quantity, 0), [cart]);

    const value = {
        cart,
        loading,
        totalItems,
        totalAmount,
        addToCart,
        updateQuantity,
        clearCart,
        setCart, // optional
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
