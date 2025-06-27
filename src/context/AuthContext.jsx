// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';

// Create the AuthContext
export const AuthContext = createContext(null);

// Create a custom hook for easy access to the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

// AuthProvider component to wrap your application
export const AuthProvider = ({ children }) => {
  // State to hold user info and token
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true); // To indicate initial loading of auth state

  // Effect to load auth state from localStorage on initial render
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      } catch (e) {
        console.error("Failed to parse user data from localStorage", e);
        // Clear invalid data if parsing fails
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false); // Auth state has been loaded
  }, []);

  // Function to handle user login
  const login = (newToken, userData) => {
    setToken(newToken);
    setUser(userData);
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // Function to handle user logout
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  // The value provided to consumers of the context
  const authContextValue = {
    user,
    token,
    isAuthenticated: !!token, // Convenience boolean
    loading, // To indicate if initial auth state is still loading
    login,
    logout,
  };

  // Render children only after initial auth state is loaded
  if (loading) {
    return <div>Loading authentication...</div>; // Or a spinner/loading screen
  }

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};
