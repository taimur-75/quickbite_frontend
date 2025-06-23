// src/components/DishCard.jsx
import React from 'react';
import './DishCard.css';

const DishCard = ({ dish }) => (
  <div className="dish-card">
    <img src={`http://localhost:5000/${dish.image}`} alt={dish.name} className="dish-image" />
    <h3>{dish.name}</h3>
    <p>{dish.description}</p>
    <strong>₹ {dish.price}</strong>
  </div>
);

export default DishCard;

