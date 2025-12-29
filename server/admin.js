// Admin routes - protected routes for admin users only
const express = require('express');
const router = express.Router();
const authenticateToken = require('./middleware/auth');
const { requireAdmin } = require('./middleware/adminAuth');

let pool; // Database connection (set from server.js)

function setPool(dbPool) {
  pool = dbPool;
}

// All admin routes require both authentication AND admin privileges
// authenticateToken verifies JWT, requireAdmin checks is_admin flag

// GET /api/admin/dashboard - Get dashboard statistics
router.get('/dashboard', authenticateToken, requireAdmin, async (req, res) => {
  try {
    // Get total users
    const usersResult = await pool.query('SELECT COUNT(*) as count FROM users');
    
    // Get total products
    const productsResult = await pool.query('SELECT COUNT(*) as count FROM products');
    
    // Get total orders
    const ordersResult = await pool.query('SELECT COUNT(*) as count FROM orders');
    
    // Get total revenue
    const revenueResult = await pool.query(
      'SELECT SUM(total_amount) as revenue FROM orders WHERE status = $1',
      ['completed']
    );
    
    // Get pending orders count
    const pendingOrdersResult = await pool.query(
      'SELECT COUNT(*) as count FROM orders WHERE status = $1',
      ['pending']
    );
    
    // Get recent orders (last 5)
    const recentOrdersResult = await pool.query(
      `SELECT o.id, o.total_amount, o.status, o.created_at, 
              u.first_name, u.last_name, u.email
       FROM orders o
       JOIN users u ON o.user_id = u.id
       ORDER BY o.created_at DESC
       LIMIT 5`
    );
    
    res.json({
      totalUsers: parseInt(usersResult.rows[0].count),
      totalProducts: parseInt(productsResult.rows[0].count),
      totalOrders: parseInt(ordersResult.rows[0].count),
      totalRevenue: parseFloat(revenueResult.rows[0].revenue || 0),
      pendingOrders: parseInt(pendingOrdersResult.rows[0].count),
      recentOrders: recentOrdersResult.rows
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/admin/orders - Get all orders
router.get('/orders', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT o.*, u.first_name, u.last_name, u.email
       FROM orders o
       JOIN users u ON o.user_id = u.id
       ORDER BY o.created_at DESC`
    );
    
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/admin/orders/:id/status - Update order status
router.put('/orders/:id/status', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const orderId = req.params.id;
    const { status } = req.body;
    
    // Validate status
    const validStatuses = ['pending', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    
    const result = await pool.query(
      'UPDATE orders SET status = $1 WHERE id = $2 RETURNING *',
      [status, orderId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    res.json({
      message: 'Order status updated',
      order: result.rows[0]
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/admin/users - Get all users
router.get('/users', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, email, first_name, last_name, is_admin, created_at,
              (SELECT COUNT(*) FROM orders WHERE user_id = users.id) as order_count
       FROM users
       ORDER BY created_at DESC`
    );
    
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/admin/products/:id - Delete product
router.delete('/products/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const productId = req.params.id;
    
    const result = await pool.query(
      'DELETE FROM products WHERE id = $1 RETURNING *',
      [productId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json({
      message: 'Product deleted successfully',
      product: result.rows[0]
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/admin/products/:id - Update product
router.put('/products/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const productId = req.params.id;
    const { name, description, price, stock_quantity, category, image_url } = req.body;
    
    const result = await pool.query(
      `UPDATE products 
       SET name = $1, description = $2, price = $3, stock_quantity = $4, 
           category = $5, image_url = $6, updated_at = CURRENT_TIMESTAMP
       WHERE id = $7 
       RETURNING *`,
      [name, description, price, stock_quantity, category, image_url, productId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json({
      message: 'Product updated successfully',
      product: result.rows[0]
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = { router, setPool };
