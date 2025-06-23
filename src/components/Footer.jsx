// src/components/Footer.jsx
import React from 'react';
import './Footer.css';

const Footer = () => (
  <footer className="footer">
    <p>&copy; {new Date().getFullYear()} QuickBite. All rights reserved.</p>
  </footer>
);

export default Footer;
