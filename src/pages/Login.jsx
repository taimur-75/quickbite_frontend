// src/pages/Login.jsx
import React, { useState } from 'react'; // Import React
import { useNavigate, Link } from 'react-router-dom'; // Make sure Link is imported
import './Login.css'; // Link to the new Login.css

const Login = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false); // To show loading state
  const [error, setError] = useState(null);     // To display error messages
  const [successMessage, setSuccessMessage] = useState(null); // To display success messages

  const navigate = useNavigate();

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
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });

      const data = await res.json(); // Always parse JSON for error messages

      if (res.ok) { // Check if the response status is 2xx
        setSuccessMessage('Login successful! Redirecting...');
        
        // --- Store JWT Token and User Data in localStorage ---
        localStorage.setItem('token', data.token);
        // Your backend returns user object on login, store it too
        localStorage.setItem('user', JSON.stringify(data.user)); 

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