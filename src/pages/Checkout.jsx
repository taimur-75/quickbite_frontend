import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { loadStripe } from '@stripe/stripe-js';
import './Checkout.css';

const API_BASE_URL = 'http://localhost:5000/api';

const Checkout = () => {
    const { cart, totalAmount, updateQuantity, clearCart } = useCart();
    const { token } = useAuth(); 
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState(null);
    const [stripe, setStripe] = useState(null);

    // Load Stripe on mount
    useEffect(() => {
        const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
        if (!STRIPE_PUBLISHABLE_KEY) {
            console.error("Stripe publishable key is missing in .env file!");
            setError("Stripe is not configured properly.");
            setLoading(false);
            return;
        }

        loadStripe(STRIPE_PUBLISHABLE_KEY)
            .then((stripeInstance) => {
                setStripe(stripeInstance);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Failed to load Stripe:", err);
                setError("Failed to load Stripe.");
                setLoading(false);
            });
    }, []);

    // Redirect if cart is empty
    useEffect(() => {
        if (!loading && cart.length === 0) {
            navigate('/');
        }
    }, [cart, loading, navigate]);

    const handleCheckout = async () => {
    if (!token) {
        setError("Authentication token is missing. Please log in.");
        return;
    }
    if (!stripe) {
        setError("Stripe is not initialized. Please try again.");
        return;
    }

    setIsProcessing(true);
    setError(null);

    try {
        // ✅ Handle both populated and unpopulated cart items
        const orderItemsPayload = cart.map(item => ({
            dish: typeof item.dish === 'object' ? item.dish._id : item.dish,
            quantity: item.quantity,
        }));

        // 🧾 Place order
        const orderResponse = await fetch(`${API_BASE_URL}/orders`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ items: orderItemsPayload }),
        });

        const orderResult = await orderResponse.json();
        if (!orderResponse.ok) throw new Error(orderResult.msg || 'Failed to place order.');


        let orderId;

if (orderResult._id) {
    orderId = orderResult._id;
} else if (orderResult.data && orderResult.data._id) {
    orderId = orderResult.data._id;
} else {
    throw new Error('Invalid order response format.');
}


        // 💳 Create Stripe session
        const sessionResponse = await fetch(`${API_BASE_URL}/payments/create-checkout-session`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ orderId }),
        });

        const sessionResult = await sessionResponse.json();
        if (!sessionResponse.ok) throw new Error(sessionResult.error || 'Failed to create payment session.');

        if (!sessionResult.url) {
        throw new Error("Stripe checkout URL missing from backend response.");
        }

        // ✅ Redirect to the hosted Stripe checkout page
        window.location.href = sessionResult.url;

    } catch (err) {
        console.error('Checkout failed:', err);
        setError(err.message);
        setIsProcessing(false);
    }
};

    if (loading || isProcessing || cart.length === 0) {
        return (
            <div className="centered-message">
                {loading && <p className="loading-text">Initializing Stripe...</p>}
                {isProcessing && <p className="loading-text">Processing Order and Payment...</p>}
                {error && <p className="error-text">{error}</p>}
            </div>
        );
    }

    return (
        <div className="checkout-page">
            <h1 className="checkout-title">Checkout Summary</h1>
            <div className="checkout-grid">
                {/* Cart Items */}
                <div className="cart-items">
                    <h2>Order Items</h2>
                    {cart.map(item => (
                        <div key={item.dish._id} className="cart-item">
                            <div className="cart-item-details">
                                <p className="item-name">{item.dish.name} (x{item.quantity})</p>
                                <p className="item-price">₹{item.dish.price.toFixed(2)} / unit</p>
                            </div>
                            <div className="cart-item-total">
                                <span>₹{(item.dish.price * item.quantity).toFixed(2)}</span>
                                <button onClick={() => updateQuantity(item.dish._id, -item.quantity)}>Remove</button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Order Summary */}
                <div className="order-summary">
                    <h2>Order Total</h2>
                    <div className="summary-total">
                        <span>Total Payable</span>
                        <span>₹{totalAmount.toFixed(2)}</span>
                    </div>
                    {error && <p className="error-text">{error}</p>}
                    <button 
                        className="checkout-btn" 
                        onClick={handleCheckout} 
                        disabled={isProcessing || totalAmount === 0}
                    >
                        Pay ₹{totalAmount.toFixed(2)}
                    </button>
                    <button className="clear-cart-btn" onClick={clearCart}>Clear Cart</button>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
