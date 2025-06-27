// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import useAuth hook
import './Login.css'; // Link to the Login.css

const Login = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const navigate = useNavigate();
  const { login } = useAuth(); // Get the login function from context

  // Using Vite's environment variables for backend URL
  // Ensure you have VITE_APP_BACKEND_BASE_URL defined in your .env file (e.g., VITE_APP_BACKEND_BASE_URL=http://localhost:5000)
  const BACKEND_BASE_URL = import.meta.env.VITE_APP_BACKEND_BASE_URL;

  const handleChange = e => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
    // Clear previous error/success messages on input change
    setError(null);
    setSuccessMessage(null);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true); // Start loading state
    setError(null);     // Clear previous errors
    setSuccessMessage(null); // Clear previous success messages

    // --- Client-Side Validation (Basic) ---
    const { email, password } = credentials;

    if (!email || !password) {
      setError('Please enter both email and password.');
      setLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        setError('Please enter a valid email address.');
        setLoading(false);
        return;
    }

    try {
      const res = await fetch(`${BACKEND_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });

      const data = await res.json(); // Always parse JSON for error messages

      if (res.ok) { // Check if the response status is 2xx
        setSuccessMessage('Login successful! Redirecting...');
        
        // --- Use AuthContext's login function ---
        // This single call handles both setting state AND storing in localStorage.
        // No need for separate localStorage.setItem calls here.
        login(data.token, data.user); 

        // Redirect to homepage or dashboard after a short delay
        setTimeout(() => {
          navigate('/'); // Navigate to home page
        }, 1500); // Give user time to see success message

      } else {
        // Backend typically sends 'msg' for errors
        setError(data.msg || 'Login failed. Invalid credentials.');
      }
    } catch (err) {
      console.error('Network error during login:', err); // Log full error for debugging
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false); // Stop loading state regardless of outcome
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form className="auth-form" onSubmit={handleSubmit}>
        {/* Display error and success messages conditionally */}
        {error && <p className="error-message">{error}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            name="email"
            type="email"
            id="email"
            placeholder="Enter your email"
            value={credentials.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            name="password"
            type="password"
            id="password"
            placeholder="Enter your password"
            value={credentials.password}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Logging In...' : 'Log In'}
        </button>
      </form>
      <p className="auth-link-text">
        <Link to="/forgot-password">Forgot Password?</Link>
      </p>
      <p className="auth-link-text">
        Don't have an account? <Link to="/signup">Sign Up here</Link>
      </p>
    </div>
  );
};

export default Login;
