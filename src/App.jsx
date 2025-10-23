//import { useState } from 'react'
//import reactLogo from './assets/react.svg'
//import viteLogo from '/vite.svg'
import './App.css'

// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import React from 'react'; // Import React
import { AuthProvider } from './context/AuthContext'; // Import AuthProvider
import Profile from './pages/Profile'; // Import the new Profile component
import ProtectedRoute from './components/ProtectedRoute'; // Import ProtectedRoute

import Checkout from './pages/Checkout'; // <-- NEW IMPORT
import PaymentSuccess from './pages/PaymentSuccess'; // <-- NEW IMPORT
import PaymentCancel from './pages/PaymentCancel'; // <-- NEW IMPORT
import Cart from './pages/Cart';


function App() {
  return (
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} /> 
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/payment-cancel" element={<PaymentCancel />} />
          <Route path="/cart" element={<Cart />} />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile /> {/* The Profile component is now protected */}
              </ProtectedRoute>
            } 
          />
        </Routes>
  );
}

export default App;

