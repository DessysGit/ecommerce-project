// Cart component - displays all items in shopping cart
import React from 'react';
import { useCart } from '../context/CartContext';
import './Cart.css';

// Add onBackClick and onCheckout props to handle navigation
function Cart({ onBackClick, onCheckout }) {
  const { 
    cartItems, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    getCartTotal 
  } = useCart();

  // Handle quantity change from input
  const handleQuantityChange = (productId, newQuantity) => {
    const quantity = parseInt(newQuantity);
    if (quantity > 0) {
      updateQuantity(productId, quantity);
    }
  };

  // If cart is empty, show message
  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        {/* Back button for empty cart */}
        <button className="back-button" onClick={onBackClick}>
          ← Back to Products
        </button>
        <div className="cart-empty">
          <h2>Your Cart is Empty</h2>
          <p>Add some products to get started!</p>
          <span className="empty-cart-icon">🛒</span>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      {/* Back button at the top */}
      <button className="back-button" onClick={onBackClick}>
        ← Back to Products
      </button>
      
      <h2>Shopping Cart</h2>
      
      <div className="cart-container">
        {/* Cart items list */}
        <div className="cart-items">
          {cartItems.map((item) => (
            <div key={item.product.id} className="cart-item">
              {/* Product image */}
              <img 
                src={item.product.image_url} 
                alt={item.product.name}
                className="cart-item-image"
              />
              
              {/* Product details */}
              <div className="cart-item-details">
                <h3>{item.product.name}</h3>
                <p className="cart-item-category">{item.product.category}</p>
                <p className="cart-item-price">${item.product.price}</p>
              </div>
              
              {/* Quantity controls */}
              <div className="cart-item-quantity">
                <button 
                  onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                  className="quantity-btn"
                >
                  -
                </button>
                <input 
                  type="number" 
                  value={item.quantity}
                  onChange={(e) => handleQuantityChange(item.product.id, e.target.value)}
                  min="1"
                  className="quantity-input"
                />
                <button 
                  onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                  className="quantity-btn"
                >
                  +
                </button>
              </div>
              
              {/* Item subtotal */}
              <div className="cart-item-subtotal">
                ${(parseFloat(item.product.price) * item.quantity).toFixed(2)}
              </div>
              
              {/* Remove button */}
              <button 
                onClick={() => removeFromCart(item.product.id)}
                className="remove-btn"
                title="Remove item"
              >
                ❌
              </button>
            </div>
          ))}
        </div>
        
        {/* Cart summary */}
        <div className="cart-summary">
          <h3>Order Summary</h3>
          <div className="summary-row">
            <span>Subtotal:</span>
            <span>${getCartTotal()}</span>
          </div>
          <div className="summary-row">
            <span>Shipping:</span>
            <span>Free</span>
          </div>
          <div className="summary-row total">
            <span>Total:</span>
            <span>${getCartTotal()}</span>
          </div>
          
          {/* Checkout button - calls onCheckout prop */}
          <button className="checkout-btn" onClick={onCheckout}>
            Proceed to Checkout
          </button>
          
          <button 
            onClick={clearCart}
            className="clear-cart-btn"
          >
            Clear Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default Cart;
