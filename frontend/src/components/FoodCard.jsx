import React from 'react';
import { useCart } from '../context/CartContext';
import { Star, Clock, Plus, Minus } from 'lucide-react';

export default function FoodCard({ food }) {
  const { addToCart, removeFromCart, getItemQuantity } = useCart();
  const quantity = getItemQuantity(food.id);

  return (
    <div className="food-card">
      <div className="food-image-wrapper">
        <img
          src={food.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80'}
          alt={food.name}
          className="food-image"
          loading="lazy"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80';
          }}
        />
        <div className="food-badge-overlay">
          <span className={food.isVeg ? 'veg-badge' : 'non-veg-badge'} title={food.isVeg ? 'Pure Vegetarian' : 'Non-Vegetarian'} />
          <span className="category-pill">{food.category}</span>
        </div>
      </div>

      <div className="food-details">
        <div className="food-header-row">
          <h3 className="food-title">{food.name}</h3>
          <div className="food-rating">
            <Star size={14} fill="#eab308" color="#eab308" />
            <span>{food.rating || 4.5}</span>
          </div>
        </div>

        <div className="food-prep-row">
          <Clock size={13} color="#6b7280" />
          <span>{food.prepTime || '20-25 mins'}</span>
        </div>

        <p className="food-desc">{food.description}</p>

        <div className="food-footer">
          <div className="food-price-wrapper">
            <span className="currency">₹</span>
            <span className="food-price">{food.price}</span>
          </div>

          <div className="food-actions">
            {quantity === 0 ? (
              <button
                className="add-to-cart-btn"
                onClick={() => addToCart(food)}
              >
                <span>ADD</span>
                <Plus size={16} />
              </button>
            ) : (
              <div className="quantity-stepper">
                <button
                  className="step-btn minus"
                  onClick={() => removeFromCart(food.id)}
                  title="Decrease quantity"
                >
                  <Minus size={14} />
                </button>
                <span className="quantity-count">{quantity}</span>
                <button
                  className="step-btn plus"
                  onClick={() => addToCart(food)}
                  title="Increase quantity"
                >
                  <Plus size={14} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
