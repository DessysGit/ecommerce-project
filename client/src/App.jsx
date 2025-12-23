// Main App component - the root of our React application
import React from 'react';
import ProductList from './components/ProductList';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>My Ecommerce Store</h1>
        <p>Welcome to our online shop!</p>
      </header>
      
      {/* ProductList component fetches and displays products */}
      <ProductList />
    </div>
  );
}

export default App;