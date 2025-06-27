// src/pages/Home.jsx
import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import DishCard from '../components/DishCard';
import './Home.css';

const Home = () => {
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);

  const BACKEND_BASE_URL = import.meta.env.VITE_APP_BACKEND_BASE_URL;

  useEffect(() => {
    const fetchDishes = async () => {
      try {
        const res = await fetch(`${BACKEND_BASE_URL}/api/dishes`);
        const result = await res.json();
        setDishes(result.data);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch dishes:', err);
        setLoading(false);
      }
    };

    fetchDishes();
  }, []);

  return (
    <div className="home-wrapper">
      <Navbar />

      <main className="home-container">
        <h2 className="home-title">Explore The Classical Taste 🍽️</h2>
        {loading ? (
          <p className="loading-text">Loading...</p>
        ) : (
          <div className="dish-list">
            {dishes.length > 0 ? (
              dishes.map((dish) => <DishCard key={dish._id} dish={dish} />)
            ) : (
              <p>No dishes found</p>
            )}
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Home;
