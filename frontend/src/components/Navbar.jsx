import React from 'react';
import { useCart } from '../context/CartContext';
import { ShoppingBag, Utensils, History, ShieldCheck, MapPin } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, ordersCount }) {
  const { cartCount, totalAmount, setIsCartOpen } = useCart();

  return (
    <header className="navbar-container">
      <div className="navbar-content">
        {/* Brand Logo */}
        <div className="navbar-brand" onClick={() => setActiveTab('menu')}>
          <div className="logo-icon">
            <Utensils size={24} color="#ffffff" />
          </div>
          <div>
            <div className="brand-title">
              <span className="brand-orange">Zwiggy</span>
              <span className="brand-dark">Foodies</span>
            </div>
            <div className="brand-location">
              <MapPin size={12} color="#fc8019" />
              <span>Indiranagar, Bengaluru</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="nav-tabs">
          <button
            className={`nav-tab-btn ${activeTab === 'menu' ? 'active' : ''}`}
            onClick={() => setActiveTab('menu')}
          >
            <Utensils size={18} />
            <span>Order Food</span>
          </button>

          <button
            className={`nav-tab-btn ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            <History size={18} />
            <span>Order History</span>
            {ordersCount > 0 && <span className="tab-badge">{ordersCount}</span>}
          </button>

          <button
            className={`nav-tab-btn ${activeTab === 'admin' ? 'active' : ''}`}
            onClick={() => setActiveTab('admin')}
          >
            <ShieldCheck size={18} />
            <span>Admin CRUD</span>
          </button>
        </nav>

        {/* Cart Floating Button */}
        <div className="navbar-actions">
          <button
            className={`cart-btn ${cartCount > 0 ? 'has-items' : ''}`}
            onClick={() => setIsCartOpen(true)}
          >
            <div className="cart-icon-wrapper">
              <ShoppingBag size={20} />
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </div>
            <div className="cart-label">
              <span className="cart-text">My Cart</span>
              {cartCount > 0 && (
                <span className="cart-total">₹{totalAmount}</span>
              )}
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}
