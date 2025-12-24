// ProductList component - displays all products from the database
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import './ProductList.css';

function ProductList() {
  // State to store products fetched from backend
  // useState returns [currentValue, functionToUpdateValue]
  const [products, setProducts] = useState([]);
  
  // State to track loading status
  const [loading, setLoading] = useState(true);
  
  // State to store any errors
  const [error, setError] = useState(null);

  // Get addToCart function from CartContext
  const { addToCart } = useCart();

  // useEffect runs when component first loads (like componentDidMount)
  // The empty array [] means "run once when component mounts"
  useEffect(() => {
    fetchProducts();
  }, []);

  // Function to fetch products from backend
  const fetchProducts = async () => {
    try {
      setLoading(true);
      
      // Make GET request to backend API
      // axios.get returns a promise, await waits for it
      const response = await axios.get('http://localhost:5000/api/products');
      
      // Update products state with data from backend
      setProducts(response.data);
      setLoading(false);
    } catch (err) {
      // If something goes wrong, store error message
      setError(err.message);
      setLoading(false);
    }
  };

  // Handle add to cart button click
  const handleAddToCart = (product) => {
    addToCart(product);
    
    alert(`${product.name} added to cart!`);
  };

  // Show loading message while fetching data
  if (loading) {
    return <div className="loading">Loading products...</div>;
  }

  // Show error message if fetch failed
  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  // Render the products
  return (
    <div className="product-list">
      <h2>Our Products</h2>
      <div className="products-grid">
        {/* Map over products array and create a card for each */}
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <img src={product.image_url} alt={product.name} />
            <h3>{product.name}</h3>
            <p className="description">{product.description}</p>
            <p className="category">{product.category}</p>
            <div className="product-footer">
              <p className="price">₵{product.price}</p>
              <p className="stock">Stock: {product.stock_quantity}</p>
            </div>
            {/* Add to Cart button */}
            <button className="add-to-cart" onClick={() => handleAddToCart(product)}>Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductList;