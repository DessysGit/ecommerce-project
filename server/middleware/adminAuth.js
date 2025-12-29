// Admin authentication middleware - checks if user is an admin
const { Pool } = require('pg');

let pool;

// Set pool from server.js
function setPool(dbPool) {
  pool = dbPool;
}

// Middleware to check if authenticated user is an admin
const requireAdmin = async (req, res, next) => {
  try {
    // User must be authenticated first (req.user set by authenticateToken middleware)
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Check if user is admin in database
    const result = await pool.query(
      'SELECT is_admin FROM users WHERE id = $1',
      [req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!result.rows[0].is_admin) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    // User is admin, proceed to route
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { requireAdmin, setPool };
