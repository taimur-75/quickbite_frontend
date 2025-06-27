// src/pages/Signup.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Make sure Link is imported
import './Signup.css';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '' // Essential for client-side check
  });
  const [loading, setLoading] = useState(false); // To show loading state
  const [error, setError] = useState(null);     // To display error messages
  const [successMessage, setSuccessMessage] = useState(null); // To display success messages

  const navigate = useNavigate();

  const BACKEND_BASE_URL = import.meta.env.VITE_APP_BACKEND_BASE_URL;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear any previous error/success messages when user starts typing again
    setError(null);
    setSuccessMessage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading state
    setError(null);     // Clear previous errors
    setSuccessMessage(null); // Clear previous success messages

    // --- Client-Side Validation ---
    const { name, email, password, confirmPassword } = formData;

    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    if (password.length < 6) { // Matches backend minlength
      setError('Password must be at least 6 characters long.');
      setLoading(false);
      return;
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        setError('Please enter a valid email address.');
        setLoading(false);
        return;
    }

    try {
      // Backend endpoint is /api/auth/signup
      const res = await fetch(`${BACKEND_BASE_URL}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        // Send only the data the backend expects
        body: JSON.stringify({ name, email, password })
      });

      const data = await res.json(); // Always parse response, even for errors

      if (res.ok) { // Check if the response status is 2xx
        setSuccessMessage('Signup successful! Please log in.');
        // No auto-login: Do NOT store data.token in localStorage here.

        // Redirect to login page after a short delay
        setTimeout(() => {
          navigate('/login');
        }, 2000); // Give user time to read the success message
      } else {
        // Handle backend validation/error messages
        setError(data.msg || 'Signup failed. Please try again.');
      }
    } catch (err) {
      console.error('Network error during signup:', err); // Log full error for debugging
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false); // Stop loading state regardless of outcome
    }
  };

  return (
    <div className="auth-container">
      <h2>Sign Up</h2>
      <form className="auth-form" onSubmit={handleSubmit}>
        {/* Display error and success messages conditionally */}
        {error && <p className="error-message">{error}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}

        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            name="name"
            type="text"
            id="name"
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleChange}
            required // HTML5 validation (good for basic UX)
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            name="email"
            type="email"
            id="email"
            placeholder="Enter your email"
            value={formData.email}
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
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            name="confirmPassword"
            type="password"
            id="confirmPassword"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Signing Up...' : 'Sign Up'}
        </button>
      </form>
      <p className="auth-link-text">
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </div>
  );
};

export default Signup;