// ProductList component - displays all products from the database with search and filters
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import './ProductList.css';

function ProductList() {
  // Products data state
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSort, setSelectedSort] = useState('newest');
  const [availableCategories, setAvailableCategories] = useState([]);
  
  // Get addToCart function from cart context
  const { addToCart } = useCart();

  // Fetch categories when component mounts
  useEffect(() => {
    fetchCategories();
  }, []);

  // Debounce search input - wait 500ms after user stops typing
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);

    // Cleanup: cancel the timer if user keeps typing
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch products whenever debounced search/filter/sort changes
  useEffect(() => {
    fetchProducts();
  }, [debouncedSearch, selectedCategory, selectedSort]);

  // Fetch available categories from backend
  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/products/categories');
      setAvailableCategories(response.data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  // Fetch products with current filters
  const fetchProducts = async () => {
    try {
      setLoading(true);
      
      // Build query parameters
      const params = new URLSearchParams();
      if (debouncedSearch) params.append('search', debouncedSearch);
      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      if (selectedSort) params.append('sortBy', selectedSort);
      
      // Make request with query parameters
      const response = await axios.get(`http://localhost:5000/api/products?${params.toString()}`);
      setProducts(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  // Handle add to cart button click
  const handleAddToCart = (product) => {
    addToCart(product);
    alert(`${product.name} added to cart!`);
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setDebouncedSearch('');
    setSelectedCategory('all');
    setSelectedSort('newest');
  };

  // Check if any filters are active
  const hasActiveFilters = searchQuery || selectedCategory !== 'all' || selectedSort !== 'newest';

  if (loading) {
    return <div className="loading">Loading products...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="product-list">
      <h2>Our Products</h2>
      
      {/* Search and Filter Bar */}
      <div className="filter-bar">
        {/* Search Input */}
        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <span className="search-icon">🔍</span>
        </div>
        
        {/* Category Filter */}
        <select
          className="filter-select"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="all">All Categories</option>
          {availableCategories.map(category => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        
        {/* Sort Options */}
        <select
          className="filter-select"
          value={selectedSort}
          onChange={(e) => setSelectedSort(e.target.value)}
        >
          <option value="newest">Newest First</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="name_asc">Name: A to Z</option>
          <option value="name_desc">Name: Z to A</option>
        </select>
        
        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <button className="clear-filters-btn" onClick={clearFilters}>
            Clear Filters
          </button>
        )}
      </div>
      
      {/* Results count */}
      <div className="results-info">
        {products.length} {products.length === 1 ? 'product' : 'products'} found
        {debouncedSearch && ` for "${debouncedSearch}"`}
      </div>
      
      {/* Products Grid */}
      {products.length === 0 ? (
        <div className="no-products">
          <p>No products found matching your criteria.</p>
          <button className="clear-filters-btn" onClick={clearFilters}>
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="products-grid">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <img src={product.image_url} alt={product.name} />
              <h3>{product.name}</h3>
              <p className="description">{product.description}</p>
              <p className="category">{product.category}</p>
              <div className="product-footer">
                <p className="price">${product.price}</p>
                <p className="stock">Stock: {product.stock_quantity}</p>
              </div>
              <button 
                className="add-to-cart"
                onClick={() => handleAddToCart(product)}
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductList;
