// Main App component - the root of our React application
import React, { useState } from 'react';
import ProductList from './components/ProductList';
import Cart from './components/Cart';
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
  
  // Get authentication state and functions
  const { user, logout, isAuthenticated } = useAuth();
  const { getCartCount } = useCart();

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
      
      {/* Show different components based on current page */}
      {currentPage === 'products' ? (
        <ProductList />
      ) : (
        <Cart onBackClick={() => setCurrentPage('products')} />
      )}
    </div>
  );
}

export default App;
