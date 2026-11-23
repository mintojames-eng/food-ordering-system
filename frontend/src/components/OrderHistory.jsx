import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';
import {
  Package,
  Calendar,
  Clock,
  RotateCcw,
  XCircle,
  CheckCircle,
  Truck,
  ChefHat,
  RefreshCw,
  ShoppingBag
} from 'lucide-react';

export default function OrderHistory({ onStartOrdering }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('All');
  const [cancellingId, setCancellingId] = useState(null);

  const { addToCart, setIsCartOpen } = useCart();

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getOrders({
        status: statusFilter !== 'All' ? statusFilter : undefined
      });
      setOrders(res.data || []);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
      setError(err.message || 'Could not fetch order history from backend.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm(`Are you sure you want to cancel order #${orderId}?`)) return;
    setCancellingId(orderId);
    try {
      await api.updateOrderStatus(orderId, { status: 'Cancelled' });
      await fetchOrders();
    } catch (err) {
      alert(`Error cancelling order: ${err.message}`);
    } finally {
      setCancellingId(null);
    }
  };

  const handleDeletePermanently = async (orderId) => {
    if (!window.confirm(`Permanently delete order record #${orderId} from database?`)) return;
    try {
      await api.deleteOrder(orderId);
      await fetchOrders();
    } catch (err) {
      alert(`Error deleting order: ${err.message}`);
    }
  };

  const handleReorder = (order) => {
    if (!order.items || order.items.length === 0) return;
    order.items.forEach(item => {
      addToCart({
        id: item.foodId,
        name: item.name,
        price: item.price,
        image: item.image,
        isVeg: item.isVeg !== undefined ? item.isVeg : true
      });
    });
    setIsCartOpen(true);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Placed':
        return (
          <span className="status-pill placed">
            <Package size={13} /> Placed
          </span>
        );
      case 'Preparing':
        return (
          <span className="status-pill preparing">
            <ChefHat size={13} /> Preparing
          </span>
        );
      case 'Out for Delivery':
        return (
          <span className="status-pill transit">
            <Truck size={13} /> Out for Delivery
          </span>
        );
      case 'Delivered':
        return (
          <span className="status-pill delivered">
            <CheckCircle size={13} /> Delivered
          </span>
        );
      case 'Cancelled':
        return (
          <span className="status-pill cancelled">
            <XCircle size={13} /> Cancelled
          </span>
        );
      default:
        return <span className="status-pill">{status}</span>;
    }
  };

  const formatDate = (isoString) => {
    if (!isoString) return 'Just now';
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="order-history-container">
      <div className="history-header-row">
        <div>
          <h1 className="history-heading">Order History & Data Persistence</h1>
          <p className="history-subheading">
            Live orders retrieved directly from persistent database storage (Node.js/Express + SQLite/MongoDB).
          </p>
        </div>

        <div className="history-actions-row">
          <button className="refresh-btn" onClick={fetchOrders} title="Reload orders from database">
            <RefreshCw size={16} className={loading ? 'spin' : ''} />
            <span>Sync Database</span>
          </button>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="history-filters-row">
        {['All', 'Placed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'].map(st => (
          <button
            key={st}
            className={`history-filter-btn ${statusFilter === st ? 'active' : ''}`}
            onClick={() => setStatusFilter(st)}
          >
            {st}
          </button>
        ))}
      </div>

      {error && (
        <div className="error-alert">
          ⚠️ {error}
        </div>
      )}

      {loading ? (
        <div className="history-loading-list">
          {[1, 2, 3].map(n => (
            <div key={n} className="order-card-skeleton" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="empty-history-box">
          <Package size={56} color="#cbd5e1" />
          <h3>No Orders Found</h3>
          <p>
            {statusFilter === 'All'
              ? "You haven't placed any food orders yet. Pick your favorite dishes and place your first order!"
              : `No orders currently in '${statusFilter}' status.`}
          </p>
          <button className="browse-menu-btn" onClick={onStartOrdering}>
            <ShoppingBag size={18} />
            <span>Order Food Now</span>
          </button>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map(order => (
            <div key={order.id} className="order-history-card">
              <div className="order-card-top">
                <div className="order-id-meta">
                  <div className="order-id-code">
                    <span className="order-tag">ORDER</span>
                    <strong>#{order.id}</strong>
                  </div>
                  <div className="order-date">
                    <Calendar size={13} color="#6b7280" />
                    <span>{formatDate(order.createdAt)}</span>
                  </div>
                </div>

                <div className="order-status-wrapper">
                  {getStatusBadge(order.status)}
                </div>
              </div>

              {/* Items Table */}
              <div className="order-items-table">
                {order.items?.map((item, idx) => (
                  <div key={idx} className="order-item-line">
                    <div className="order-item-title-col">
                      <span className="item-qty-badge">{item.quantity}x</span>
                      <span className="item-name">{item.name}</span>
                    </div>
                    <div className="order-item-price-col">
                      ₹{item.price * item.quantity}
                    </div>
                  </div>
                ))}
              </div>

              {/* Customer & Address Details */}
              <div className="order-address-box">
                <div className="address-line">
                  <strong>Delivered to:</strong> {order.customerName} ({order.customerPhone || '9876543210'})
                </div>
                <div className="address-detail">{order.deliveryAddress}</div>
              </div>

              {/* Footer with Total and Actions */}
              <div className="order-card-footer">
                <div className="order-total-block">
                  <span className="total-label">Total Amount</span>
                  <span className="total-value">₹{order.totalAmount}</span>
                  {order.discount > 0 && (
                    <span className="discount-saved">(Saved ₹{order.discount})</span>
                  )}
                </div>

                <div className="order-action-buttons">
                  <button
                    className="reorder-btn"
                    onClick={() => handleReorder(order)}
                    title="Add all items from this order to cart"
                  >
                    <RotateCcw size={15} />
                    <span>Reorder</span>
                  </button>

                  {order.status !== 'Cancelled' && order.status !== 'Delivered' && (
                    <button
                      className="cancel-order-btn"
                      onClick={() => handleCancelOrder(order.id)}
                      disabled={cancellingId === order.id}
                    >
                      <XCircle size={15} />
                      <span>{cancellingId === order.id ? 'Cancelling...' : 'Cancel Order'}</span>
                    </button>
                  )}

                  <button
                    className="delete-permanently-btn"
                    onClick={() => handleDeletePermanently(order.id)}
                    title="Delete record from database"
                  >
                    Delete Record
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
