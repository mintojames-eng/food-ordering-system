import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import {
  Database,
  PlusCircle,
  Edit2,
  Trash2,
  TrendingUp,
  Package,
  Layers,
  Check,
  X,
  RefreshCw,
  AlertCircle
} from 'lucide-react';

const CATEGORIES = ['Biryani', 'Pizza', 'Burgers', 'Asian', 'North Indian', 'South Indian', 'Desserts', 'Beverages', 'Other'];

export default function AdminPanel({ onMenuUpdated }) {
  const [foods, setFoods] = useState([]);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeAdminSubTab, setActiveAdminSubTab] = useState('foods'); // 'foods' | 'orders'

  // Modal State for Add / Edit Food
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFood, setEditingFood] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Pizza',
    price: '',
    description: '',
    image: '',
    isVeg: true,
    rating: 4.5,
    prepTime: '20-25 mins'
  });

  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [foodsRes, ordersRes, statsRes] = await Promise.all([
        api.getFoods({}),
        api.getOrders({}),
        api.getStats()
      ]);
      setFoods(foodsRes.data || []);
      setOrders(ordersRes.data || []);
      setStats(statsRes.data || null);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingFood(null);
    setFormData({
      name: '',
      category: 'Pizza',
      price: '',
      description: '',
      image: '',
      isVeg: true,
      rating: 4.5,
      prepTime: '20-25 mins'
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (food) => {
    setEditingFood(food);
    setFormData({
      name: food.name,
      category: food.category,
      price: food.price,
      description: food.description || '',
      image: food.image || '',
      isVeg: Boolean(food.isVeg),
      rating: food.rating || 4.5,
      prepTime: food.prepTime || '20-25 mins'
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.name.trim()) {
      setFormError('Please enter dish name.');
      return;
    }
    if (!formData.price || isNaN(formData.price) || Number(formData.price) <= 0) {
      setFormError('Please enter a valid positive price.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingFood) {
        // UPDATE (PUT)
        await api.updateFood(editingFood.id, formData);
      } else {
        // CREATE (POST)
        await api.createFood(formData);
      }
      setIsModalOpen(false);
      await loadAllData();
      if (onMenuUpdated) onMenuUpdated();
    } catch (err) {
      setFormError(err.message || 'Failed to save food item.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteFood = async (food) => {
    if (!window.confirm(`Are you sure you want to delete "${food.name}" from database?`)) return;
    try {
      await api.deleteFood(food.id);
      await loadAllData();
      if (onMenuUpdated) onMenuUpdated();
    } catch (err) {
      alert(`Delete failed: ${err.message}`);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.updateOrderStatus(orderId, { status: newStatus });
      await loadAllData();
    } catch (err) {
      alert(`Status update failed: ${err.message}`);
    }
  };

  const handleResetFoods = async () => {
    if (!window.confirm('Reset food menu to the default sample dishes? Any custom foods will be overwritten.')) return;
    try {
      await api.resetFoods();
      await loadAllData();
      if (onMenuUpdated) onMenuUpdated();
      alert('Menu restored to default 12 items!');
    } catch (err) {
      alert(`Reset failed: ${err.message}`);
    }
  };

  return (
    <div className="admin-container">
      {/* Admin Header */}
      <div className="admin-header-row">
        <div>
          <h1 className="admin-title">Admin Management & CRUD Center</h1>
          <p className="admin-subtitle">
            Demonstrating direct Create, Read, Update, and Delete operations with persistent Express APIs.
          </p>
        </div>

        <div className="admin-top-actions">
          <button className="reset-data-btn" onClick={handleResetFoods} title="Restore sample menu items">
            <RefreshCw size={15} />
            <span>Reset Sample Menu</span>
          </button>
          <button className="add-food-btn" onClick={handleOpenAddModal}>
            <PlusCircle size={18} />
            <span>Add New Dish (Create)</span>
          </button>
        </div>
      </div>

      {/* Database & Metric Cards */}
      <div className="metrics-grid">
        <div className="metric-card db-status">
          <div className="metric-icon-box db">
            <Database size={24} color="#3b82f6" />
          </div>
          <div>
            <div className="metric-label">Active Database Engine</div>
            <div className="metric-value capitalize">
              {stats?.databaseEngine || 'SQLite'} <span className="status-live-tag">Active</span>
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-box foods">
            <Layers size={24} color="#fc8019" />
          </div>
          <div>
            <div className="metric-label">Total Menu Dishes</div>
            <div className="metric-value">{stats?.totalFoods ?? foods.length}</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-box orders">
            <Package size={24} color="#8b5cf6" />
          </div>
          <div>
            <div className="metric-label">Total Orders Stored</div>
            <div className="metric-value">{stats?.totalOrders ?? orders.length}</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-box revenue">
            <TrendingUp size={24} color="#10b981" />
          </div>
          <div>
            <div className="metric-label">Gross Order Revenue</div>
            <div className="metric-value text-green">₹{stats?.totalRevenue ?? 0}</div>
          </div>
        </div>
      </div>

      {/* Sub tabs: Foods CRUD vs Orders Management */}
      <div className="admin-subtabs-row">
        <button
          className={`admin-subtab ${activeAdminSubTab === 'foods' ? 'active' : ''}`}
          onClick={() => setActiveAdminSubTab('foods')}
        >
          Food Items Database ({foods.length})
        </button>
        <button
          className={`admin-subtab ${activeAdminSubTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveAdminSubTab('orders')}
        >
          Customer Orders Management ({orders.length})
        </button>
      </div>

      {/* Foods Table (CRUD) */}
      {activeAdminSubTab === 'foods' && (
        <div className="admin-table-card">
          <div className="table-header-bar">
            <h3>Menu Dishes (Full CRUD)</h3>
            <span className="api-badge">API: /api/foods</span>
          </div>

          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Dish</th>
                  <th>Category</th>
                  <th>Type</th>
                  <th>Price</th>
                  <th>Rating</th>
                  <th>Actions (Update / Delete)</th>
                </tr>
              </thead>
              <tbody>
                {foods.map(food => (
                  <tr key={food.id}>
                    <td>
                      <div className="dish-table-cell">
                        <img
                          src={food.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80'}
                          alt={food.name}
                          className="table-dish-img"
                        />
                        <div>
                          <div className="table-dish-name">{food.name}</div>
                          <div className="table-dish-id">ID: {food.id}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="table-category-pill">{food.category}</span>
                    </td>
                    <td>
                      <span className={food.isVeg ? 'veg-badge' : 'non-veg-badge'} title={food.isVeg ? 'Veg' : 'Non-Veg'} />
                    </td>
                    <td>
                      <strong>₹{food.price}</strong>
                    </td>
                    <td>⭐ {food.rating || 4.5}</td>
                    <td>
                      <div className="table-action-btns">
                        <button
                          className="table-edit-btn"
                          onClick={() => handleOpenEditModal(food)}
                          title="Edit this dish (Update)"
                        >
                          <Edit2 size={14} />
                          <span>Edit</span>
                        </button>
                        <button
                          className="table-delete-btn"
                          onClick={() => handleDeleteFood(food)}
                          title="Delete this dish (Delete)"
                        >
                          <Trash2 size={14} />
                          <span>Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Orders Table */}
      {activeAdminSubTab === 'orders' && (
        <div className="admin-table-card">
          <div className="table-header-bar">
            <h3>Stored Customer Orders</h3>
            <span className="api-badge">API: /api/orders</span>
          </div>

          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Items & Quantities</th>
                  <th>Total Amount</th>
                  <th>Current Status</th>
                  <th>Change Status (PUT)</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '30px' }}>
                      No customer orders placed yet. Place an order in the "Order Food" tab!
                    </td>
                  </tr>
                ) : (
                  orders.map(order => (
                    <tr key={order.id}>
                      <td>
                        <strong>#{order.id}</strong>
                      </td>
                      <td>
                        <div>{order.customerName}</div>
                        <small style={{ color: '#6b7280' }}>{order.customerPhone}</small>
                      </td>
                      <td>
                        <div className="order-items-compact">
                          {order.items?.map((it, idx) => (
                            <span key={idx} className="order-item-chip">
                              {it.quantity}x {it.name}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td>
                        <strong className="text-green">₹{order.totalAmount}</strong>
                      </td>
                      <td>
                        <span className={`status-pill ${order.status.toLowerCase().replace(/ /g, '-')}`}>
                          {order.status}
                        </span>
                      </td>
                      <td>
                        <select
                          className="status-select-inline"
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        >
                          <option value="Placed">Placed</option>
                          <option value="Preparing">Preparing</option>
                          <option value="Out for Delivery">Out for Delivery</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Food Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-card admin-modal animate-slide-in" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingFood ? 'Edit Food Item (Update)' : 'Add New Food Item (Create)'}</h2>
              <button className="modal-close-btn" onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="admin-form">
              {formError && (
                <div className="error-alert">
                  <AlertCircle size={16} />
                  <span>{formError}</span>
                </div>
              )}

              <div className="form-group">
                <label>Dish Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Sourdough Truffle Pizza"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group flex-1">
                  <label>Category *</label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    className="form-input"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group flex-1">
                  <label>Price (₹) *</label>
                  <input
                    type="number"
                    min="1"
                    placeholder="299"
                    value={formData.price}
                    onChange={e => setFormData({ ...formData, price: e.target.value })}
                    className="form-input"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group flex-1">
                  <label>Dietary Type</label>
                  <select
                    value={formData.isVeg ? 'veg' : 'non-veg'}
                    onChange={e => setFormData({ ...formData, isVeg: e.target.value === 'veg' })}
                    className="form-input"
                  >
                    <option value="veg">Pure Vegetarian</option>
                    <option value="non-veg">Non-Vegetarian</option>
                  </select>
                </div>

                <div className="form-group flex-1">
                  <label>Rating (0-5)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={formData.rating}
                    onChange={e => setFormData({ ...formData, rating: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Image URL (Optional)</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={formData.image}
                  onChange={e => setFormData({ ...formData, image: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  rows="2"
                  placeholder="Ingredients, preparation details, flavors..."
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="modal-actions-bar">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving...' : editingFood ? 'Update Food' : 'Create Food'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
