import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext'; // <-- NEW IMPORT
import App from './App'; // Modified: Removed .jsx extension
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* BrowserRouter must wrap the entire app */}
    <BrowserRouter>
      {/* AuthProvider must wrap anything that needs user data (including CartProvider if cart is user-specific) */}
      <AuthProvider>
        {/* CartProvider wraps the App to provide cart state globally */}
        <CartProvider> 
          <App />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);