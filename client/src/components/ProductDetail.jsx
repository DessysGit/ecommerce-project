// ProductDetail component - displays detailed product information
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import './ProductDetail.css';

function ProductDetail() {
  // Get product ID from URL parameters
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  // State for main product
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for related products
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loadingRelated, setLoadingRelated] = useState(false);

  // Fetch product when component mounts or ID changes
  useEffect(() => {
    fetchProduct();
  }, [id]);

  // Fetch product details
  const fetchProduct = async () => {
    try {
      setLoading(true);
      
      // Get main product
      const response = await axios.get(`http://localhost:5000/api/products/${id}`);
      setProduct(response.data);
      
      // Fetch related products (same category)
      if (response.data.category) {
        fetchRelatedProducts(response.data.category, response.data.id);
      }
      
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  // Fetch related products from same category
  const fetchRelatedProducts = async (category, currentProductId) => {
    try {
      setLoadingRelated(true);
      const response = await axios.get(`http://localhost:5000/api/products?category=${category}`);
      
      // Filter out current product and limit to 4 related products
      const related = response.data
        .filter(p => p.id !== currentProductId)
        .slice(0, 4);
      
      setRelatedProducts(related);
      setLoadingRelated(false);
    } catch (err) {
      console.error('Error fetching related products:', err);
      setLoadingRelated(false);
    }
  };

  // Handle add to cart
  const handleAddToCart = () => {
    addToCart(product);
    alert(`${product.name} added to cart!`);
  };

  // Render loading state
  if (loading) {
    return <div className="loading">Loading product...</div>;
  }

  // Render error state
  if (error) {
    return (
      <div className="error-container">
        <div className="error">Error: {error}</div>
        <button className="back-button" onClick={() => navigate('/')}>
          ← Back to Products
        </button>
      </div>
    );
  }

  // Render product not found
  if (!product) {
    return (
      <div className="error-container">
        <div className="error">Product not found</div>
        <button className="back-button" onClick={() => navigate('/')}>
          ← Back to Products
        </button>
      </div>
    );
  }

  return (
    <div className="product-detail-page">
      {/* Back button */}
      <button className="back-button" onClick={() => navigate('/')}>
        ← Back to Products
      </button>

      {/* Product Details Section */}
      <div className="product-detail-container">
        {/* Product Image */}
        <div className="product-image-section">
          <img src={product.image_url} alt={product.name} className="product-detail-image" />
        </div>

        {/* Product Info */}
        <div className="product-info-section">
          <h1 className="product-title">{product.name}</h1>
          
          <p className="product-category-badge">{product.category}</p>
          
          <div className="product-price-section">
            <span className="product-detail-price">${product.price}</span>
            <span className="product-stock">
              {product.stock_quantity > 0 
                ? `${product.stock_quantity} in stock` 
                : 'Out of stock'}
            </span>
          </div>

          <div className="product-description-section">
            <h3>Description</h3>
            <p>{product.description}</p>
          </div>

          <div className="product-actions">
            <button 
              className="add-to-cart-btn-large"
              onClick={handleAddToCart}
              disabled={product.stock_quantity === 0}
            >
              {product.stock_quantity > 0 ? 'Add to Cart' : 'Out of Stock'}
            </button>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="related-products-section">
          <h2>Related Products</h2>
          
          {loadingRelated ? (
            <p>Loading related products...</p>
          ) : (
            <div className="related-products-grid">
              {relatedProducts.map(relatedProduct => (
                <div 
                  key={relatedProduct.id} 
                  className="related-product-card"
                  onClick={() => navigate(`/products/${relatedProduct.id}`)}
                >
                  <img src={relatedProduct.image_url} alt={relatedProduct.name} />
                  <h4>{relatedProduct.name}</h4>
                  <p className="related-price">${relatedProduct.price}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ProductDetail;
