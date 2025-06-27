
// src/components/DishCard.jsx
import React from 'react';
import './DishCard.css';

const DishCard = ({ dish }) => (
  <div className="dish-card">
    {/* Conditional rendering: Only render <img> if dish.image exists (is not null/undefined/empty string) */}
    {dish.image ? (
      <img
        src={dish.image}
        alt={dish.name}
        className="dish-image"
        onError={(e) => {
          // If a valid image URL from the backend (proxy URL) fails to load,
          // simply hide the broken image to prevent further errors or loops.
          e.target.style.display = 'none';
          // You could also add a class to indicate a broken image if you want to style it
          // e.target.classList.add('broken-image');
        }}
      />
    ) : (
      // Optional: Render a placeholder div or message when no image is available.
      // If you want absolutely nothing to appear, you can remove this entire `else` block.
      <div className="no-image-available">No Image Available</div>
    )}
    <h3>{dish.name}</h3>
    <p>{dish.description}</p>
    <strong>₹ {dish.price}</strong>
  </div>
);

export default DishCard;