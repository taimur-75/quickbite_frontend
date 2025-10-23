import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './Cart.css';

const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(amount);
};

const Cart = () => {
    const { cart, totalAmount, loading, error, updateQuantity, removeFromCart, clearCart } = useCart();
    const { token } = useAuth();
    const navigate = useNavigate();
    const [isSaving, setIsSaving] = useState(false);

    // --- 1️⃣ Loading state ---
    if (loading) {
        return (
            <>
                <Navbar />
                <div className="centered-message">
                    <p className="loading-message">Loading your cart...</p>
                </div>
                <Footer />
            </>
        );
    }

    // --- 2️⃣ Error state ---
    if (error) {
        return (
            <>
                <Navbar />
                <div className="centered-message">
                    <p className="error-message">Error loading cart: {error}</p>
                </div>
                <Footer />
            </>
        );
    }

    const isCartEmpty = cart.length === 0;

    // --- 3️⃣ Cart Item Component ---
    const CartItem = ({ item }) => {
        const [quantity, setQuantity] = useState(item.quantity);

        useEffect(() => {
            setQuantity(item.quantity);
        }, [item.quantity]);

        const handleChange = (delta) => {
            const newQuantity = quantity + delta;
            if (newQuantity < 1) return;
            setQuantity(newQuantity);
            updateQuantity(item.dish._id, delta);
        };

        return (
            <div className="cart-item">
                <div className="cart-item-info">
                    <img
                        src={item.dish.imageUrl || "https://placehold.co/80x80/ffe5b4/333?text=Dish"}
                        alt={item.dish.name}
                        onError={(e) => (e.target.src = "https://placehold.co/80x80/ffe5b4/333?text=Dish")}
                    />
                    <div>
                        <p className="dish-name">{item.dish.name}</p>
                        <p className="dish-price">{formatCurrency(item.dish.price)}</p>
                    </div>
                </div>

                <div className="cart-item-controls">
                    <div className="quantity-controls">
                        <button onClick={() => handleChange(-1)} className="decrease">-</button>
                        <span>{quantity}</span>
                        <button onClick={() => handleChange(1)} className="increase">+</button>
                    </div>
                    <p>{formatCurrency(item.dish.price * quantity)}</p>
                    <button
                        onClick={() => removeFromCart(item.dish._id)}
                        className="remove-btn"
                    >
                        ✕
                    </button>
                </div>
            </div>
        );
    };

    // --- 4️⃣ Save Cart + Proceed to Checkout ---
    const handleProceedToCheckout = async () => {
        try {
            if (!token) {
                alert("Please log in before proceeding to checkout.");
                return;
            }

            setIsSaving(true);

            // Transform cart for backend
            const formattedCart = cart.map(item => ({
                dish: item.dish._id,
                quantity: item.quantity,
            }));
            
            const API_BASE_URL = import.meta.env.VITE_APP_BACKEND_BASE_URL;

            const response = await fetch(`${API_BASE_URL}/api/cart`, { //...
                method: 'POST',
                headers: {  
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ items: formattedCart }),
            });

            const data = await response.json();
            console.log('🔍 Backend response:', data);

            if (!response.ok) {
                throw new Error(data.msg || data.error || 'Failed to save cart.');
            }

            console.log('✅ Cart saved successfully:', data);

            //clearCart(); // Optional: clear local cart after checkout
            navigate('/checkout');
        } catch (err) {
            console.error('❌ Failed to save cart before checkout:', err.message);
            alert('Could not save your cart. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="cart-page">
            <Navbar />
            <main className="cart-main">
                <h1 className="cart-title">Your Order Basket</h1>

                {isCartEmpty ? (
                    <div className="empty-cart">
                        <p>Your basket is empty! Time to get some QuickBites.</p>
                        <Link to="/">Browse Dishes</Link>
                    </div>
                ) : (
                    <div className="cart-container">
                        <div className="cart-items">
                            <h2>Review Items ({cart.length})</h2>
                            {cart.map((item) => (
                                <CartItem
                                    key={item.dish._id}
                                    item={item}
                                />
                            ))}
                        </div>

                        <div className="order-summary">
                            <h2>Order Summary</h2>
                            <div className="summary-row">
                                <span>Subtotal ({cart.length} items)</span>
                                <span>{formatCurrency(totalAmount)}</span>
                            </div>
                            <div className="summary-row">
                                <span>Delivery Fee</span>
                                <span>$5.00</span>
                            </div>
                            <div className="summary-total">
                                <span>Total</span>
                                <span>{formatCurrency(totalAmount + 5)}</span>
                            </div>

                            <button
                                className="checkout-btn"
                                onClick={handleProceedToCheckout}
                                disabled={isSaving}
                            >
                                {isSaving ? 'Saving Cart...' : 'Proceed to Checkout'}
                            </button>
                        </div>
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
};

export default Cart;
