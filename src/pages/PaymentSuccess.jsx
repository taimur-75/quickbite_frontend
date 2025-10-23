import React, { useEffect } from 'react';
import { useCart } from '../context/CartContext';

const PaymentSuccess = () => {
    const { clearCart } = useCart();

    useEffect(() => {
        // Clear the cart when this page loads
        clearCart();
    }, [clearCart]);

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Payment Successful!</h1>
            <p style={styles.message}>
                Thank you for your order. Your payment has been completed successfully.
            </p>
        </div>
    );
};

const styles = {
    container: {
        minHeight: '50vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        padding: '2rem',
        backgroundColor: '#f0fdf4', // light green
        borderRadius: '1rem',
        margin: '2rem auto',
        maxWidth: '600px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    },
    title: {
        fontSize: '2.5rem',
        color: '#16a34a', // green
        marginBottom: '1rem',
    },
    message: {
        fontSize: '1.25rem',
        color: '#166534', // darker green
    },
};

export default PaymentSuccess;
