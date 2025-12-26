// Orders routes - handles order creation and retrieval
const express = require('express');
const router = express.Router();
const authenticateToken = require('./middleware/auth');

let pool; // Database connection (set from server.js)

function setPool(dbPool) {
  pool = dbPool;
}

// POST /api/orders/create - Create a new order
router.post('/create', authenticateToken, async (req, res) => {
  // Get a dedicated database client for transaction
  // Transaction = multiple operations that succeed or fail together
  const client = await pool.connect();
  
  try {
    // BEGIN transaction - if anything fails, we can ROLLBACK everything
    await client.query('BEGIN');
    
    const userId = req.user.userId;
    const { shippingAddress, phone, items } = req.body;
    
    // Validate that cart has items
    if (!items || items.length === 0) {
      throw new Error('Cart is empty');
    }
    
    // Calculate total amount from all items
    const totalAmount = items.reduce((sum, item) => {
      return sum + (parseFloat(item.product.price) * item.quantity);
    }, 0);
    
    // Step 1: Create the order record
    const orderResult = await client.query(
      `INSERT INTO orders (user_id, total_amount, shipping_address, status) 
       VALUES ($1, $2, $3, 'pending') 
       RETURNING *`,
      [userId, totalAmount.toFixed(2), shippingAddress]
    );
    
    const order = orderResult.rows[0];
    const orderId = order.id;
    
    // Step 2: Create order_items for each product
    // Step 3: Update product stock quantities
    for (const item of items) {
      // Insert order item
      await client.query(
        `INSERT INTO order_items (order_id, product_id, quantity, price) 
         VALUES ($1, $2, $3, $4)`,
        [orderId, item.product.id, item.quantity, item.product.price]
      );
      
      // Reduce product stock
      const stockResult = await client.query(
        `UPDATE products 
         SET stock_quantity = stock_quantity - $1 
         WHERE id = $2 
         RETURNING stock_quantity`,
        [item.quantity, item.product.id]
      );
      
      // Check if product has enough stock
      if (stockResult.rows[0].stock_quantity < 0) {
        throw new Error(`Insufficient stock for ${item.product.name}`);
      }
    }
    
    // Step 4: Clear user's cart
    await client.query(
      'DELETE FROM cart_items WHERE user_id = $1',
      [userId]
    );
    
    // COMMIT transaction - save all changes to database
    await client.query('COMMIT');
    
    // Return success response with order details
    res.status(201).json({
      message: 'Order created successfully',
      order: {
        id: order.id,
        total_amount: order.total_amount,
        status: order.status,
        created_at: order.created_at,
        items: items.length
      }
    });
    
  } catch (error) {
    // ROLLBACK transaction - undo all changes if anything failed
    await client.query('ROLLBACK');
    console.error('Order creation error:', error);
    res.status(500).json({ error: error.message });
  } finally {
    // Release the client back to the pool
    client.release();
  }
});

// GET /api/orders - Get all orders for logged-in user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    
    // Get all orders for this user with their items
    const ordersResult = await pool.query(
      `SELECT 
        orders.id,
        orders.total_amount,
        orders.status,
        orders.shipping_address,
        orders.created_at
       FROM orders
       WHERE orders.user_id = $1
       ORDER BY orders.created_at DESC`,
      [userId]
    );
    
    // For each order, get its items
    const orders = await Promise.all(
      ordersResult.rows.map(async (order) => {
        const itemsResult = await pool.query(
          `SELECT 
            order_items.quantity,
            order_items.price,
            products.name,
            products.image_url
           FROM order_items
           JOIN products ON order_items.product_id = products.id
           WHERE order_items.order_id = $1`,
          [order.id]
        );
        
        return {
          ...order,
          items: itemsResult.rows
        };
      })
    );
    
    res.json(orders);
    
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/orders/:id - Get specific order details
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const orderId = req.params.id;
    
    // Get order (verify it belongs to this user)
    const orderResult = await pool.query(
      `SELECT * FROM orders 
       WHERE id = $1 AND user_id = $2`,
      [orderId, userId]
    );
    
    if (orderResult.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    // Get order items with product details
    const itemsResult = await pool.query(
      `SELECT 
        order_items.quantity,
        order_items.price,
        products.name,
        products.description,
        products.image_url
       FROM order_items
       JOIN products ON order_items.product_id = products.id
       WHERE order_items.order_id = $1`,
      [orderId]
    );
    
    res.json({
      ...orderResult.rows[0],
      items: itemsResult.rows
    });
    
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = { router, setPool };
