import React, { useState, useEffect } from 'react';
import FoodCard from './FoodCard';
import { api } from '../services/api';
import { Search, SlidersHorizontal, Sparkles, AlertCircle } from 'lucide-react';

const CATEGORIES = ['All', 'Biryani', 'Pizza', 'Burgers', 'Asian', 'North Indian', 'Desserts', 'Beverages'];

export default function FoodList() {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [vegOnly, setVegOnly] = useState(false);
  const [sortBy, setSortBy] = useState('');

  useEffect(() => {
    fetchFoods();
  }, [selectedCategory, vegOnly, sortBy]);

  const fetchFoods = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getFoods({
        category: selectedCategory,
        vegOnly: vegOnly,
        search: searchTerm,
        sortBy: sortBy
      });
      setFoods(res.data || []);
    } catch (err) {
      console.error('Failed to load foods:', err);
      setError(err.message || 'Could not connect to Express backend. Please ensure the server is running on port 5000.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchFoods();
  };

  return (
    <div className="food-list-container">
      {/* Hero Banner */}
      <section className="hero-banner">
        <div className="hero-content">
          <div className="hero-badge">
            <Sparkles size={16} color="#fc8019" />
            <span>Fastest Food Delivery in 30 Mins</span>
          </div>
          <h1 className="hero-title">
            Order delicious food from your favorite restaurants
          </h1>
          <p className="hero-subtitle">
            Explore authentic cuisines, gourmet burgers, wood-fired pizzas, and decadent desserts.
          </p>

          {/* Search Box */}
          <form className="search-form" onSubmit={handleSearchSubmit}>
            <div className="search-input-wrapper">
              <Search size={20} color="#9ca3af" />
              <input
                type="text"
                placeholder="Search for biryani, pizza, burger, pasta..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              {searchTerm && (
                <button
                  type="button"
                  className="clear-search-btn"
                  onClick={() => { setSearchTerm(''); setTimeout(fetchFoods, 50); }}
                >
                  ✕
                </button>
              )}
            </div>
            <button type="submit" className="search-submit-btn">
              Find Food
            </button>
          </form>
        </div>
      </section>

      {/* Filter and Category Controls */}
      <section className="filter-section">
        {/* Category Pills */}
        <div className="category-scroll">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`category-btn ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Secondary Filters */}
        <div className="filter-controls-row">
          <label className={`veg-toggle-label ${vegOnly ? 'active' : ''}`}>
            <input
              type="checkbox"
              checked={vegOnly}
              onChange={(e) => setVegOnly(e.target.checked)}
              className="veg-checkbox"
            />
            <span className="veg-badge" />
            <span>Pure Veg Only</span>
          </label>

          <div className="sort-dropdown-wrapper">
            <SlidersHorizontal size={16} color="#6b7280" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="">Featured / Newest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Top Rated (★)</option>
            </select>
          </div>
        </div>
      </section>

      {/* Menu Grid Section */}
      <section className="menu-grid-section">
        <div className="menu-header">
          <h2 className="menu-heading">
            {selectedCategory === 'All' ? 'Popular Dishes' : `${selectedCategory} Specials`}
          </h2>
          <span className="items-count-badge">
            {foods.length} {foods.length === 1 ? 'item' : 'items'} available
          </span>
        </div>

        {error && (
          <div className="error-banner">
            <AlertCircle size={20} color="#ef4444" />
            <div>
              <strong>Connection Notice:</strong> {error}
            </div>
          </div>
        )}

        {loading ? (
          <div className="loading-grid">
            {[1, 2, 3, 4, 5, 6].map(n => (
              <div key={n} className="food-skeleton">
                <div className="skeleton-image" />
                <div className="skeleton-line title" />
                <div className="skeleton-line desc" />
                <div className="skeleton-line price" />
              </div>
            ))}
          </div>
        ) : foods.length === 0 ? (
          <div className="empty-state">
            <img
              src="https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=400&q=80"
              alt="No food found"
              className="empty-image"
            />
            <h3>No dishes found</h3>
            <p>Try clearing filters or search with another term like "Biryani" or "Burger".</p>
            <button
              className="reset-filters-btn"
              onClick={() => {
                setSelectedCategory('All');
                setSearchTerm('');
                setVegOnly(false);
                setSortBy('');
              }}
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="foods-grid">
            {foods.map(food => (
              <FoodCard key={food.id} food={food} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
