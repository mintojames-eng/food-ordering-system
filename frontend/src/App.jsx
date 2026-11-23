import React, { useState, useEffect } from 'react';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import FoodList from './components/FoodList';
import OrderHistory from './components/OrderHistory';
import AdminPanel from './components/AdminPanel';
import CartDrawer from './components/CartDrawer';
import OrderSuccessModal from './components/OrderSuccessModal';
import { api } from './services/api';
import './App.css';

function MainApp() {
  const [activeTab, setActiveTab] = useState('menu'); // 'menu' | 'history' | 'admin'
  const [ordersCount, setOrdersCount] = useState(0);

  const fetchOrdersCount = async () => {
    try {
      const res = await api.getOrders();
      if (res.data) {
        setOrdersCount(res.data.length);
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    fetchOrdersCount();
  }, [activeTab]);

  return (
    <div className="app-container">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        ordersCount={ordersCount}
      />

      <main className="main-content">
        {activeTab === 'menu' && (
          <FoodList />
        )}

        {activeTab === 'history' && (
          <OrderHistory
            onStartOrdering={() => setActiveTab('menu')}
          />
        )}

        {activeTab === 'admin' && (
          <AdminPanel
            onMenuUpdated={fetchOrdersCount}
          />
        )}
      </main>

      {/* Cart Drawer */}
      <CartDrawer
        onOrderPlaced={() => {
          fetchOrdersCount();
        }}
      />

      {/* Order Confirmation Modal */}
      <OrderSuccessModal
        onNavigateToHistory={() => setActiveTab('history')}
      />
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <MainApp />
    </CartProvider>
  );
}
