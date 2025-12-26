// Cart routes - handles shopping cart operations for logged-in users
const express = require('express');
const router = express.Router();
const authenticateToken = require('./middleware/auth');

let pool; // Database connection (set from server.js)

function setPool(dbPool) {
  pool = dbPool;
}

// GET /api/cart - Get all cart items for logged-in user
router.get('/', authenticateToken, async (req, res) => {
  try {
    // Get user ID from authenticated token
    const userId = req.user.userId;
    
    // Query cart items with product details using JOIN
    const result = await pool.query(
      `
      SELECT 
        cart_items.id,
        cart_items.quantity,
        cart_items.created_at,
        products.id as product_id,
        products.name,
        products.description,
        products.price,
        products.category,
        products.image_url,
        products.stock_quantity
      FROM cart_items
      JOIN products 
        ON cart_items.product_id = products.id
      WHERE cart_items.user_id = $1
      ORDER BY cart_items.created_at DESC
      `,
      [userId]
    );
    
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/cart/add - Add item to cart (or update quantity if exists)
router.post('/add', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId, quantity } = req.body;
    
    // Validate input
    if (!productId || !quantity) {
      return res.status(400).json({ error: 'Product ID and quantity required' });
    }
    
    // Check if item already exists in cart
    const existingItem = await pool.query(
      'SELECT * FROM cart_items WHERE user_id = $1 AND product_id = $2',
      [userId, productId]
    );
    
    if (existingItem.rows.length > 0) {
      // Item exists - update quantity
      const newQuantity = existingItem.rows[0].quantity + quantity;
      const result = await pool.query(
        'UPDATE cart_items SET quantity = $1 WHERE user_id = $2 AND product_id = $3 RETURNING *',
        [newQuantity, userId, productId]
      );
      res.json(result.rows[0]);
    } else {
      // Item doesn't exist - insert new
      const result = await pool.query(
        'INSERT INTO cart_items (user_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *',
        [userId, productId, quantity]
      );
      res.status(201).json(result.rows[0]);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/cart/update/:productId - Update quantity of cart item
router.put('/update/:productId', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId } = req.params;
    const { quantity } = req.body;
    
    // Validate quantity
    if (quantity < 1) {
      return res.status(400).json({ error: 'Quantity must be at least 1' });
    }
    
    // Update the quantity
    const result = await pool.query(
      'UPDATE cart_items SET quantity = $1 WHERE user_id = $2 AND product_id = $3 RETURNING *',
      [quantity, userId, productId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Cart item not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/cart/remove/:productId - Remove item from cart
router.delete('/remove/:productId', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId } = req.params;
    
    // Delete the cart item
    const result = await pool.query(
      'DELETE FROM cart_items WHERE user_id = $1 AND product_id = $2 RETURNING *',
      [userId, productId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Cart item not found' });
    }
    
    res.json({ message: 'Item removed from cart', item: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/cart/clear - Clear entire cart for user
router.delete('/clear', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    
    // Delete all cart items for this user
    await pool.query(
      'DELETE FROM cart_items WHERE user_id = $1',
      [userId]
    );
    
    res.json({ message: 'Cart cleared successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = { router, setPool };
