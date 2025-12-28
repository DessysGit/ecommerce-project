// OrderHistory component - displays user's past orders
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './OrderHistory.css';

function OrderHistory() {
  const navigate = useNavigate();
  const { token } = useAuth();

  // State for orders
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  // Fetch orders when component mounts
  useEffect(() => {
    fetchOrders();
  }, []);

  // Fetch user's order history from backend
  const fetchOrders = async () => {
    try {
      setLoading(true);
      
      const response = await axios.get('http://localhost:5000/api/orders', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      setOrders(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  // Toggle order expansion
  const toggleOrderExpansion = (orderId) => {
    if (expandedOrderId === orderId) {
      setExpandedOrderId(null); // Collapse if already expanded
    } else {
      setExpandedOrderId(orderId); // Expand this order
    }
  };

  // Format date to readable string
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status badge color
  const getStatusColor = (status) => {
    switch(status) {
      case 'pending':
        return '#f39c12';
      case 'completed':
        return '#27ae60';
      case 'cancelled':
        return '#e74c3c';
      default:
        return '#95a5a6';
    }
  };

  // Render content based on state
  const renderContent = () => {
    if (loading) {
      return <div className="loading">Loading your orders...</div>;
    }

    if (error) {
      return <div className="error">Error: {error}</div>;
    }

    if (orders.length === 0) {
      return (
        <div className="no-orders">
          <h3>No Orders Yet</h3>
          <p>You haven't placed any orders yet.</p>
          <button className="shop-now-btn" onClick={() => navigate('/')}>
            Start Shopping
          </button>
        </div>
      );
    }

    return (
      <div className="orders-list">
        {orders.map(order => (
          <div key={order.id} className="order-card">
            {/* Order Header - Always visible */}
            <div 
              className="order-header"
              onClick={() => toggleOrderExpansion(order.id)}
            >
              <div className="order-header-left">
                <h3>Order #{order.id}</h3>
                <p className="order-date">{formatDate(order.created_at)}</p>
              </div>
              
              <div className="order-header-right">
                <span 
                  className="order-status-badge"
                  style={{ backgroundColor: getStatusColor(order.status) }}
                >
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
                <span className="order-total">${order.total_amount}</span>
                <span className="expand-icon">
                  {expandedOrderId === order.id ? '▼' : '▶'}
                </span>
              </div>
            </div>

            {/* Order Details - Expandable */}
            {expandedOrderId === order.id && (
              <div className="order-details">
                <div className="order-shipping">
                  <h4>Shipping Address</h4>
                  <p>{order.shipping_address}</p>
                </div>

                <div className="order-items">
                  <h4>Items Ordered</h4>
                  {order.items.map((item, index) => (
                    <div key={index} className="order-item">
                      <img src={item.image_url} alt={item.name} />
                      <div className="order-item-details">
                        <p className="item-name">{item.name}</p>
                        <p className="item-quantity">Quantity: {item.quantity}</p>
                      </div>
                      <p className="item-price">${item.price}</p>
                    </div>
                  ))}
                </div>

                <div className="order-summary">
                  <div className="summary-row">
                    <span>Subtotal:</span>
                    <span>${order.total_amount}</span>
                  </div>
                  <div className="summary-row">
                    <span>Shipping:</span>
                    <span>Free</span>
                  </div>
                  <div className="summary-row total">
                    <span>Total:</span>
                    <span>${order.total_amount}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="order-history-page">
      <button className="back-button" onClick={() => navigate('/')}>
        ← Back to Products
      </button>

      <h2>Order History</h2>
      
      {renderContent()}
    </div>
  );
}

export default OrderHistory;
