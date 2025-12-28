// Main App component - the root of our React application
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import ProductList from './components/ProductList';
import ProductDetail from './components/ProductDetail';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import OrderHistory from './components/OrderHistory';
import Login from './components/Login';
import Signup from './components/Signup';
import { useAuth } from './context/AuthContext';
import { useCart } from './context/CartContext';
import './App.css';

// Header component - extracted for reuse
function Header() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { getCartCount } = useCart();

  return (
    <header className="App-header">
      <div className="header-content">
        <h1 onClick={() => navigate('/')} style={{cursor: 'pointer'}}>
          My Ecommerce Store
        </h1>
        
        <div className="header-actions">
          <span className="user-greeting">
            Hello, {user?.first_name || 'User'}!
          </span>
          
          {/* Orders link */}
          <button className="orders-btn" onClick={() => navigate('/orders')}>
            Orders
          </button>
          
          <div className="cart-icon" onClick={() => navigate('/cart')}>
            <span className="cart-emoji">🛒</span>
            {getCartCount() > 0 && (
              <span className="cart-badge">{getCartCount()}</span>
            )}
          </div>
          
          <button className="logout-btn" onClick={logout}>
            Logout
          </button>
        </div>
      </div>
      <p>Welcome to our online shop!</p>
    </header>
  );
}

// Order confirmation page component
function OrderConfirmation({ order }) {
  const navigate = useNavigate();
  
  return (
    <div className="confirmation-page">
      <div className="confirmation-card">
        <div className="success-icon">✓</div>
        <h2>Order Placed Successfully!</h2>
        <p className="order-number">Order #{order?.id}</p>
        <p className="order-total">Total: ${order?.total_amount}</p>
        <p className="confirmation-message">
          Thank you for your order! We'll send you an email confirmation shortly.
        </p>
        <button 
          className="continue-shopping-btn"
          onClick={() => navigate('/')}
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
}

// Main App Routes
function AppRoutes() {
  const { isAuthenticated } = useAuth();
  const [completedOrder, setCompletedOrder] = useState(null);

  const handleOrderSuccess = (order) => {
    setCompletedOrder(order);
  };

  // If not authenticated, show only login/signup
  if (!isAuthenticated()) {
    return <AuthRoutes />;
  }

  // If authenticated, show main app routes
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<ProductList />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout onOrderSuccess={handleOrderSuccess} />} />
        <Route path="/orders" element={<OrderHistory />} />
        <Route path="/order-confirmation" element={<OrderConfirmation order={completedOrder} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

// Auth Routes (Login/Signup)
function AuthRoutes() {
  const [authView, setAuthView] = useState('login');

  return (
    <div className="App">
      <header className="App-header">
        <h1>My Ecommerce Store</h1>
        <p>Welcome to our online shop!</p>
      </header>
      
      {authView === 'login' ? (
        <Login onSwitchToSignup={() => setAuthView('signup')} />
      ) : (
        <Signup onSwitchToLogin={() => setAuthView('login')} />
      )}
    </div>
  );
}

// Main App component with Router
function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <AppRoutes />
      </div>
    </BrowserRouter>
  );
}

export default App;
