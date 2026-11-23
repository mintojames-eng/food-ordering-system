import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('zwiggy_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [orderSuccessData, setOrderSuccessData] = useState(null);

  // Sync with LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('zwiggy_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [cartItems]);

  const addToCart = (food) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === food.id);
      if (existing) {
        return prev.map(item =>
          item.id === food.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, {
        id: food.id,
        foodId: food.id,
        name: food.name,
        price: food.price,
        image: food.image,
        isVeg: food.isVeg,
        quantity: 1
      }];
    });
  };

  const removeFromCart = (foodId) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === foodId);
      if (!existing) return prev;
      if (existing.quantity <= 1) {
        return prev.filter(item => item.id !== foodId);
      }
      return prev.map(item =>
        item.id === foodId ? { ...item, quantity: item.quantity - 1 } : item
      );
    });
  };

  const deleteItem = (foodId) => {
    setCartItems(prev => prev.filter(item => item.id !== foodId));
  };

  const clearCart = () => {
    setCartItems([]);
    setAppliedCoupon(null);
    setCouponCode('');
  };

  const getItemQuantity = (foodId) => {
    const item = cartItems.find(i => i.id === foodId);
    return item ? item.quantity : 0;
  };

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  
  // Tax 5%
  const tax = Math.round(subtotal * 0.05 * 100) / 100;
  
  // Free delivery above ₹300
  const deliveryFee = subtotal === 0 ? 0 : (subtotal >= 300 ? 0 : 40);

  // Discount calculation
  let discountAmount = 0;
  if (appliedCoupon === 'SWIGGY50' || appliedCoupon === 'ZOMATO50') {
    discountAmount = Math.min(Math.round(subtotal * 0.5), 100);
  } else if (appliedCoupon === 'TASTY20') {
    discountAmount = Math.round(subtotal * 0.2);
  }

  const totalAmount = Math.max(0, Math.round((subtotal + tax + deliveryFee - discountAmount) * 100) / 100);

  const applyCoupon = (code) => {
    const upper = code.trim().toUpperCase();
    if (upper === 'SWIGGY50' || upper === 'ZOMATO50' || upper === 'TASTY20') {
      setAppliedCoupon(upper);
      return { success: true, message: `Promo code ${upper} applied successfully!` };
    }
    return { success: false, message: 'Invalid coupon code. Try SWIGGY50 or TASTY20' };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      deleteItem,
      clearCart,
      getItemQuantity,
      cartCount,
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
      orderSuccessData,
      setOrderSuccessData
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
