// src/components/Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import { useAuth } from '../context/AuthContext'; // Import the useAuth hook
import { useCart } from '../context/CartContext';
import './Navbar.css';

const Navbar = () => {
  // Destructure isAuthenticated, logout, and user from the AuthContext
  const { isAuthenticated, logout, user } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate(); // Hook for programmatic navigation

  // Function to handle logout button click
  const handleLogout = () => {
    logout(); // Call the logout function from AuthContext to clear state and localStorage
    navigate('/login'); // Redirect the user to the login page after logging out
  };

  return (
    <nav className="navbar">
      <div className="logo">QuickBite</div>
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        
        {/* Conditional rendering based on authentication status */}
        {!isAuthenticated ? (
          // If not authenticated, show Signup and Login links
          <>
            <li><Link to="/signup">Signup</Link></li>
            <li><Link to="/login">Login</Link></li>
          </>
        ) : (
          // If authenticated, show Profile, Settings, and Logout button
          <>
            {/* Optionally display user's name or email if available in the user object */}
            {user && user.name && <li>Hello, {user.name}!</li>}
            <li><Link to="/profile">Profile</Link></li>
            <li><Link to="/settings">Settings</Link></li>

            {/* Cart Link with Badge */}
            <li>
                <Link to="/cart" className="relative nav-cart-link">
                    {/* Placeholder Cart Icon - Replace 🛒 with a proper SVG/Font icon */}
                    <span className="cart-icon">🛒 Cart </span> 
                    {totalItems > 0 && (
                        <span className="cart-badge">
                            {totalItems}
                        </span>
                    )}
                </Link>
            </li>

            <li>
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;



