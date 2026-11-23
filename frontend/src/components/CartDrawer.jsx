import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { api } from '../services/api';
import { X, Plus, Minus, Trash2, Tag, ArrowRight, ShieldCheck, ShoppingBag, CheckCircle2 } from 'lucide-react';

export default function CartDrawer({ onOrderPlaced }) {
  const {
    cartItems,
    addToCart,
    removeFromCart,
    deleteItem,
    clearCart,
    subtotal,
    tax,
    deliveryFee,
    discountAmount,
    totalAmount,
    couponCode,
    setCouponCode,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    isCartOpen,
    setIsCartOpen,
    setOrderSuccessData
  } = useCart();

  const [customerName, setCustomerName] = useState('Rahul Verma');
  const [customerPhone, setCustomerPhone] = useState('9876543210');
  const [deliveryAddress, setDeliveryAddress] = useState('Flat 402, Green Valley Apartments, Indiranagar, Bengaluru');
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [couponMessage, setCouponMessage] = useState('');

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponCode) return;
    const res = applyCoupon(couponCode);
    setCouponMessage(res.message);
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (cartItems.length === 0) {
      setErrorMessage('Your cart is empty. Please add items to order.');
      return;
    }

    if (!customerName.trim()) {
      setErrorMessage('Please enter your full name for delivery.');
      return;
    }

    if (!deliveryAddress.trim()) {
      setErrorMessage('Please enter your complete delivery address.');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderPayload = {
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        deliveryAddress: deliveryAddress.trim(),
        paymentMethod: paymentMethod,
        discountCode: appliedCoupon,
        items: cartItems.map(item => ({
          foodId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        }))
      };

      const res = await api.createOrder(orderPayload);

      if (res.success && res.data) {
        clearCart();
        setIsCartOpen(false);
        setOrderSuccessData(res.data);
        if (onOrderPlaced) onOrderPlaced(res.data);
      }
    } catch (err) {
      console.error('Order creation error:', err);
      setErrorMessage(err.message || 'Failed to place order. Ensure Express backend is running.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="drawer-overlay" onClick={() => setIsCartOpen(false)}>
      <div className="drawer-container animate-slide-in" onClick={(e) => e.stopPropagation()}>
        {/* Drawer Header */}
        <div className="drawer-header">
          <div className="drawer-title-group">
            <ShoppingBag size={20} color="#fc8019" />
            <h2>Your Food Basket</h2>
            <span className="drawer-items-count">({cartItems.length} items)</span>
          </div>
          <button className="close-btn" onClick={() => setIsCartOpen(false)}>
            <X size={20} />
          </button>
        </div>

        {cartItems.length === 0 ? (
          <div className="cart-empty-view">
            <div className="empty-cart-illustration">🛒</div>
            <h3>Your cart is empty</h3>
            <p>Good food is always cooking! Go ahead and add some dishes from the menu.</p>
            <button className="browse-menu-btn" onClick={() => setIsCartOpen(false)}>
              Browse Food Menu
            </button>
          </div>
        ) : (
          <div className="drawer-body">
            {/* Free Delivery Banner */}
            <div className="free-delivery-tip">
              {subtotal >= 300 ? (
                <div className="free-delivery-unlocked">
                  <CheckCircle2 size={18} color="#16a34a" />
                  <span>Yay! You've unlocked <strong>FREE Delivery</strong></span>
                </div>
              ) : (
                <div className="free-delivery-progress">
                  <span>Add <strong>₹{300 - subtotal}</strong> more for <strong>FREE Delivery</strong></span>
                </div>
              )}
            </div>

            {/* Cart Items List */}
            <div className="cart-items-list">
              {cartItems.map((item) => (
                <div key={item.id} className="cart-item-row">
                  <div className="cart-item-info">
                    <span className={item.isVeg ? 'veg-badge' : 'non-veg-badge'} />
                    <div className="cart-item-text">
                      <h4 className="cart-item-name">{item.name}</h4>
                      <div className="cart-item-price">₹{item.price} each</div>
                    </div>
                  </div>

                  <div className="cart-item-actions">
                    <div className="quantity-stepper small">
                      <button
                        className="step-btn minus"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <Minus size={12} />
                      </button>
                      <span className="quantity-count">{item.quantity}</span>
                      <button
                        className="step-btn plus"
                        onClick={() => addToCart(item)}
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    <div className="cart-item-total">
                      ₹{item.price * item.quantity}
                    </div>

                    <button
                      className="delete-item-btn"
                      onClick={() => deleteItem(item.id)}
                      title="Remove dish"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Promo Code Coupon Section */}
            <div className="coupon-box">
              <div className="coupon-header">
                <Tag size={16} color="#fc8019" />
                <span>Apply Restaurant Coupon</span>
              </div>
              {appliedCoupon ? (
                <div className="applied-coupon-row">
                  <span className="coupon-tag-applied">✓ {appliedCoupon} applied (Save ₹{discountAmount})</span>
                  <button className="remove-coupon-btn" onClick={removeCoupon}>Remove</button>
                </div>
              ) : (
                <form className="coupon-form" onSubmit={handleApplyCoupon}>
                  <input
                    type="text"
                    placeholder="Enter SWIGGY50 or TASTY20"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="coupon-input"
                  />
                  <button type="submit" className="apply-coupon-btn">Apply</button>
                </form>
              )}
              {couponMessage && <div className="coupon-hint">{couponMessage}</div>}
            </div>

            {/* Delivery & Customer Details */}
            <div className="customer-details-card">
              <h3 className="section-subheading">Delivery Address & Details</h3>
              <div className="form-group">
                <label>Customer Name</label>
                <input
                  type="text"
                  placeholder="e.g. Rahul Verma"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group flex-1">
                  <label>Phone Number</label>
                  <input
                    type="text"
                    placeholder="9876543210"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="form-input"
                  />
                </div>
                <div className="form-group flex-1">
                  <label>Payment Mode</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="form-input"
                  >
                    <option value="Cash on Delivery">Cash on Delivery</option>
                    <option value="UPI / Card">UPI / Card Payment</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Delivery Address</label>
                <textarea
                  rows="2"
                  placeholder="Complete flat, street, and landmark"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="form-input"
                  required
                />
              </div>
            </div>

            {/* Bill Details */}
            <div className="bill-card">
              <h3 className="section-subheading">Bill Details</h3>
              <div className="bill-row">
                <span>Item Total</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="bill-row">
                <span>Delivery Fee</span>
                <span>{deliveryFee === 0 ? <strong className="text-green">FREE</strong> : `₹${deliveryFee}`}</span>
              </div>
              <div className="bill-row">
                <span>Taxes & Restaurant Charges (5% GST)</span>
                <span>₹{tax}</span>
              </div>
              {discountAmount > 0 && (
                <div className="bill-row discount">
                  <span>Coupon Discount</span>
                  <span className="text-green">- ₹{discountAmount}</span>
                </div>
              )}
              <div className="bill-divider" />
              <div className="bill-row grand-total">
                <div className="total-label-group">
                  <strong>TO PAY</strong>
                  <span className="savings-tag">Includes all taxes</span>
                </div>
                <strong className="grand-amount">₹{totalAmount}</strong>
              </div>
            </div>

            {errorMessage && (
              <div className="error-alert">
                ⚠️ {errorMessage}
              </div>
            )}
          </div>
        )}

        {/* Drawer Footer with Place Order CTA */}
        {cartItems.length > 0 && (
          <div className="drawer-footer">
            <button
              className="place-order-cta"
              onClick={handlePlaceOrder}
              disabled={isSubmitting}
            >
              <div className="cta-left">
                <span className="cta-total">₹{totalAmount}</span>
                <span className="cta-subtext">TOTAL TO PAY</span>
              </div>
              <div className="cta-right">
                <span>{isSubmitting ? 'PLACING ORDER...' : 'PLACE ORDER'}</span>
                <ArrowRight size={18} />
              </div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
