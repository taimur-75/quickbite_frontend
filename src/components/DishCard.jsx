import React from 'react';
import { useCart } from '../context/CartContext'; // Correct path from src/components to src/context
import './DishCard.css'; // Correct path to the CSS file located in the same directory

const DishCard = ({ dish }) => {
    const { addToCart } = useCart(); // <-- USE CONTEXT

    return (
        <div className="dish-card">
            {/* Conditional rendering: Only render <img> if dish.image exists */}
            {dish.image ? (
                <img
                    src={dish.image}
                    alt={dish.name}
                    className="dish-image"
                    onError={(e) => {
                        e.target.style.display = 'none';
                    }}
                />
            ) : (
                <div className="no-image-available">No Image Available</div>
            )}
            <h3>{dish.name}</h3>
            <p>{dish.description}</p>
            <div className="dish-footer">
                <strong>$ {dish.price}</strong>
                {/* Add to Cart Button */}
                <button 
                    onClick={() => addToCart(dish)} 
                    className="add-to-cart-btn"
                >
                    Add to Cart
                </button>
            </div>
        </div>
    );
};

export default DishCard;
