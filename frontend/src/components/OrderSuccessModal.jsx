import React from 'react';
import { useCart } from '../context/CartContext';
import { CheckCircle2, Clock, MapPin, Receipt, ArrowRight, X } from 'lucide-react';

export default function OrderSuccessModal({ onNavigateToHistory }) {
  const { orderSuccessData, setOrderSuccessData } = useCart();

  if (!orderSuccessData) return null;

  return (
    <div className="modal-overlay animate-fade-in" onClick={() => setOrderSuccessData(null)}>
      <div className="modal-card animate-slide-in" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={() => setOrderSuccessData(null)}>
          <X size={20} />
        </button>

        <div className="success-header">
          <div className="success-icon-badge">
            <CheckCircle2 size={48} color="#16a34a" />
          </div>
          <h2 className="success-title">Order Placed Successfully!</h2>
          <p className="success-subtitle">
            The kitchen has accepted your order and started preparing your meal.
          </p>
        </div>

        <div className="order-summary-box">
          <div className="summary-row">
            <span className="summary-label">Order ID:</span>
            <span className="summary-val code">{orderSuccessData.id}</span>
          </div>
          <div className="summary-row">
            <span className="summary-label">Status:</span>
            <span className="order-status-badge placed">{orderSuccessData.status || 'Placed'}</span>
          </div>
          <div className="summary-row">
            <span className="summary-label">Estimated Delivery:</span>
            <span className="summary-val eta">
              <Clock size={14} color="#fc8019" />
              <span>30 - 35 mins</span>
            </span>
          </div>
          <div className="summary-row">
            <span className="summary-label">Delivering To:</span>
            <span className="summary-val address">{orderSuccessData.deliveryAddress}</span>
          </div>
        </div>

        <div className="order-items-preview">
          <h4>Items Ordered ({orderSuccessData.items?.length || 0})</h4>
          <div className="preview-items-list">
            {orderSuccessData.items?.map((item, idx) => (
              <div key={idx} className="preview-item-row">
                <span>{item.quantity} × {item.name}</span>
                <span>₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>

          <div className="preview-total-row">
            <span>Total Paid</span>
            <span className="preview-grand-total">₹{orderSuccessData.totalAmount}</span>
          </div>
        </div>

        <div className="modal-actions">
          <button
            className="track-orders-btn"
            onClick={() => {
              setOrderSuccessData(null);
              if (onNavigateToHistory) onNavigateToHistory();
            }}
          >
            <span>View Order History</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
