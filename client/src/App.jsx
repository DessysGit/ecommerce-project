// Main App component - the root of our React application
import React, { useState } from 'react';
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import Login from './components/Login';
import Signup from './components/Signup';
import { useAuth } from './context/AuthContext';
import { useCart } from './context/CartContext';
import './App.css';

function App() {
  // State to track which page to show
  const [currentPage, setCurrentPage] = useState('products');
  
  // State to track which auth form to show (login or signup)
  const [authView, setAuthView] = useState('login');
  
  // State to store completed order for confirmation
  const [completedOrder, setCompletedOrder] = useState(null);
  
  // Get authentication state and functions
  const { user, logout, isAuthenticated } = useAuth();
  const { getCartCount } = useCart();

  // Handle successful order completion
  const handleOrderSuccess = (order) => {
    setCompletedOrder(order);
    setCurrentPage('confirmation');
  };

  // If user is not logged in, show login/signup forms
  if (!isAuthenticated()) {
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

  // Render different pages based on currentPage state
  const renderPage = () => {
    switch(currentPage) {
      case 'products':
        return <ProductList />;
      
      case 'cart':
        return (
          <Cart 
            onBackClick={() => setCurrentPage('products')}
            onCheckout={() => setCurrentPage('checkout')}
          />
        );
      
      case 'checkout':
        return (
          <Checkout 
            onBackToCart={() => setCurrentPage('cart')}
            onOrderSuccess={handleOrderSuccess}
          />
        );
      
      case 'confirmation':
        return (
          <div className="confirmation-page">
            <div className="confirmation-card">
              <div className="success-icon">✓</div>
              <h2>Order Placed Successfully!</h2>
              <p className="order-number">Order #{completedOrder?.id}</p>
              <p className="order-total">Total: ${completedOrder?.total_amount}</p>
              <p className="confirmation-message">
                Thank you for your order! We'll send you an email confirmation shortly.
              </p>
              <button 
                className="continue-shopping-btn"
                onClick={() => setCurrentPage('products')}
              >
                Continue Shopping
              </button>
            </div>
          </div>
        );
      
      default:
        return <ProductList />;
    }
  };

  // If user IS logged in, show main app
  return (
    <div className="App">
      <header className="App-header">
        <div className="header-content">
          <h1 onClick={() => setCurrentPage('products')} style={{cursor: 'pointer'}}>
            My Ecommerce Store
          </h1>
          
          <div className="header-actions">
            {/* Show logged in user's name */}
            <span className="user-greeting">
              Hello, {user?.first_name || 'User'}!
            </span>
            
            {/* Cart icon */}
            <div className="cart-icon" onClick={() => setCurrentPage('cart')}>
              <span className="cart-emoji">🛒</span>
              {getCartCount() > 0 && (
                <span className="cart-badge">{getCartCount()}</span>
              )}
            </div>
            
            {/* Logout button */}
            <button className="logout-btn" onClick={logout}>
              Logout
            </button>
          </div>
        </div>
        <p>Welcome to our online shop!</p>
      </header>
      
      {/* Render the current page */}
      {renderPage()}
    </div>
  );
}

export default App;
