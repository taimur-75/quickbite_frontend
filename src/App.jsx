import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import React from 'react'; // Import React
import { AuthProvider } from './context/AuthContext'; // Import AuthProvider

function App() {
  return (
    <Router>
      {/* Wrap your entire application with AuthProvider */}
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          {/* Add other routes like /profile, /settings, etc. later */}
          {/* Example of a protected route (you'd create a wrapper component for this) */}
          {/* <Route path="/profile" element={<ProtectedRoute element={<Profile />} />} /> */}
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;

