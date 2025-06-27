// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import the useAuth hook

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth(); // Get authentication status and loading state from context

  // If the authentication status is still being determined (e.g., checking localStorage)
  // You can render a loading indicator or a simple message.
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh', // Take full viewport height
        fontSize: '1.5rem',
        color: '#555',
        backgroundColor: '#f8f8f8' // Light background
      }}>
        Loading user authentication...
      </div>
    );
  }

  // If the user is NOT authenticated, redirect them to the login page.
  // `replace` prop ensures that the login page replaces the current entry in the history stack,
  // so the user can't just hit the back button to bypass the protection.
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If the user IS authenticated, render the children components (the protected content).
  return children;
};

export default ProtectedRoute;
