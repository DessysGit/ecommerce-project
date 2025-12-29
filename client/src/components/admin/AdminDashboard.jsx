// AdminDashboard - Main admin panel with statistics and quick actions
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import './AdminDashboard.css';

function AdminDashboard() {
  const navigate = useNavigate();
  const { token, user } = useAuth();

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    recentOrders: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Redirect if not admin
  useEffect(() => {
    if (!user?.is_admin) {
      navigate('/');
    }
  }, [user, navigate]);

  // Fetch dashboard stats
  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/admin/dashboard', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setStats(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load dashboard');
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return '#f39c12';
      case 'completed': return '#27ae60';
      case 'cancelled': return '#e74c3c';
      default: return '#95a5a6';
    }
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <div className="admin-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p>Welcome back, {user?.first_name}!</p>
        </div>
        <button className="back-btn" onClick={() => navigate('/')}>
          ← Back to Store
        </button>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card blue">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <div className="stat-value">{stats.totalUsers}</div>
            <div className="stat-label">Total Users</div>
          </div>
        </div>

        <div className="stat-card green">
          <div className="stat-icon">📦</div>
          <div className="stat-info">
            <div className="stat-value">{stats.totalProducts}</div>
            <div className="stat-label">Products</div>
          </div>
        </div>

        <div className="stat-card orange">
          <div className="stat-icon">🛒</div>
          <div className="stat-info">
            <div className="stat-value">{stats.totalOrders}</div>
            <div className="stat-label">Total Orders</div>
          </div>
        </div>

        <div className="stat-card purple">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <div className="stat-value">${stats.totalRevenue.toFixed(2)}</div>
            <div className="stat-label">Total Revenue</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="action-buttons">
          <button 
            className="action-btn"
            onClick={() => alert('Product management coming soon! You can already add products via API.')}
          >
            <span className="action-icon">📦</span>
            Manage Products
          </button>
          <button 
            className="action-btn"
            onClick={() => alert('Order management coming soon! Check recent orders below.')}
          >
            <span className="action-icon">🛒</span>
            Manage Orders
            {stats.pendingOrders > 0 && (
              <span className="badge">{stats.pendingOrders} pending</span>
            )}
          </button>
          <button 
            className="action-btn"
            onClick={() => alert('User management coming soon!')}
          >
            <span className="action-icon">👥</span>
            View Users
          </button>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="recent-orders-section">
        <h2>Recent Orders</h2>
        {stats.recentOrders.length === 0 ? (
          <p className="no-data">No orders yet</p>
        ) : (
          <div className="orders-table">
            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.map(order => (
                  <tr key={order.id}>
                    <td>#{order.id}</td>
                    <td>
                      <div className="customer-info">
                        <div className="customer-name">
                          {order.first_name} {order.last_name}
                        </div>
                        <div className="customer-email">{order.email}</div>
                      </div>
                    </td>
                    <td className="amount">${order.total_amount}</td>
                    <td>
                      <span 
                        className="status-badge"
                        style={{ backgroundColor: getStatusColor(order.status) }}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td>{formatDate(order.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
