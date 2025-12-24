// Main App component - the root of our React application
import React, { useState } from 'react';
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import { useCart } from './context/CartContext';
import './App.css';

function App() {
  // State to track which page to show
  const [currentPage, setCurrentPage] = useState('products');
  const { getCartCount } = useCart();

  return (
    <div className="App">
      <header className="App-header">
        <div className="header-content">
          <h1 onClick={() => setCurrentPage('products')} style={{cursor: 'pointer'}}>
            My Ecommerce Store
          </h1>
          <div className="cart-icon" onClick={() => setCurrentPage('cart')}>
            <span className="cart-emoji">🛒</span>
            {getCartCount() > 0 && (
              <span className="cart-badge">{getCartCount()}</span>
            )}
          </div>
        </div>
        <p>Welcome to our online shop!</p>
      </header>
      
      {/* Show different components based on current page */}
      {/* Pass navigation function to Cart */}
      {currentPage === 'products' ? <ProductList /> : <Cart onBackClick={() => setCurrentPage('products')} />}
    </div>
  );
}

export default App;