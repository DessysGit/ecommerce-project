// Checkout component - Handles order creation and shipping info
import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import './Checkout.css';

function Checkout({ onBackToCart, onOrderSuccess }) {
  // Get cart data and user info
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { token, user } = useAuth();

  // State for shipping form
  const [shippingInfo, setShippingInfo] = useState({
    fullName: user ? `${user.first_name} ${user.last_name}` : '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: ''
  });

  // State for loading and errors
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle input changes - updates shippingInfo when user types
  const handleChange = (e) => {
    setShippingInfo({
      ...shippingInfo,
      [e.target.name]: e.target.value
    });
  };

  // Handle form submission - creates order in backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Send order to backend
      const response = await axios.post(
        'http://localhost:5000/api/orders/create',
        {
          shippingAddress: `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.state} ${shippingInfo.postalCode}, ${shippingInfo.country}`,
          phone: shippingInfo.phone,
          items: cartItems
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      // Success! Clear cart and show confirmation
      await clearCart();
      onOrderSuccess(response.data.order);
      
    } catch (err) {
      setError(err.response?.data?.error || 'Order failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="checkout-page">
      <button className="back-button" onClick={onBackToCart}>
        ← Back to Cart
      </button>

      <h2>Checkout</h2>

      <div className="checkout-container">
        {/* Shipping Form */}
        <div className="shipping-form">
          <h3>Shipping Information</h3>
          
          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit}>
            {/* Full Name */}
            <input
              type="text"
              name="fullName"
              value={shippingInfo.fullName}
              onChange={handleChange}
              placeholder="Full Name"
              required
            />

            {/* Email */}
            <input
              type="email"
              name="email"
              value={shippingInfo.email}
              onChange={handleChange}
              placeholder="Email"
              required
            />

            {/* Phone */}
            <input
              type="tel"
              name="phone"
              value={shippingInfo.phone}
              onChange={handleChange}
              placeholder="Phone Number"
              required
            />

            {/* Address */}
            <input
              type="text"
              name="address"
              value={shippingInfo.address}
              onChange={handleChange}
              placeholder="Street Address"
              required
            />

            {/* City */}
            <input
              type="text"
              name="city"
              value={shippingInfo.city}
              onChange={handleChange}
              placeholder="City"
              required
            />

            {/* State */}
            <input
              type="text"
              name="state"
              value={shippingInfo.state}
              onChange={handleChange}
              placeholder="State/Province"
              required
            />

            {/* Postal Code */}
            <input
              type="text"
              name="postalCode"
              value={shippingInfo.postalCode}
              onChange={handleChange}
              placeholder="Postal Code"
              required
            />

            {/* Country */}
            <input
              type="text"
              name="country"
              value={shippingInfo.country}
              onChange={handleChange}
              placeholder="Country"
              required
            />

            <button type="submit" disabled={loading}>
              {loading ? 'Processing...' : `Place Order - $${getCartTotal()}`}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="order-summary">
          <h3>Order Summary</h3>
          
          <div className="summary-items">
            {cartItems.map(item => (
              <div key={item.product.id} className="summary-item">
                <img src={item.product.image_url} alt={item.product.name} />
                <div className="item-details">
                  <p className="item-name">{item.product.name}</p>
                  <p className="item-quantity">Qty: {item.quantity}</p>
                </div>
                <p className="item-price">
                  ${(parseFloat(item.product.price) * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          <div className="summary-total">
            <div className="total-row">
              <span>Subtotal:</span>
              <span>${getCartTotal()}</span>
            </div>
            <div className="total-row">
              <span>Shipping:</span>
              <span>Free</span>
            </div>
            <div className="total-row grand-total">
              <span>Total:</span>
              <span>${getCartTotal()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
