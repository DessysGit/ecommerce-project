// Import express and create a router
const express = require('express');
const router = express.Router(); // Router lets us define routes in separate files

// Database pool variable (this will be set from server.js
let pool;

// Function to receieve database pool from server.js
function setPool(dbPool) {
  pool = dbPool;
}

// GET /api/products - Retrieve all products from database
// async = this function perform asynchronous operations (database queries)
router.get('/', async (req, res) => {
  try {
    // Query database for all products, ordered by newest first
    const result = await pool.query('SELECT * FROM products ORDER BY created_at DESC');

    // Send the retrieved products as JSON response
    // result.rows contains the actual data rows returned by database
    res.json(result.rows);
  } catch (error) {
    // If error occurs, send 500 status with error message
    res.status(500).json({ error: error.message });
  }
});

// POST /api/products/add - Add a new product to database
router.post('/add', async (req, res) => {
  try {
    // Extract product details from request body
    // req.body contains parsed JSON data sent by client
    const { name, description, price, stock_quantity, category, image_url } = req.body;
    
    // Insert new product into database
    // $1, $2, etc. are placeholders for parameterized query to prevent SQL injection
    // RETURNING * returns the newly created product row
    const result = await pool.query(
      'INSERT INTO products (name, description, price, stock_quantity, category, image_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [name, description, price, stock_quantity, category, image_url]
    );
    
    // Send the newly created product as JSON response with 201 status
    res.status(201).json(result.rows[0]);
  } catch (error) {
    // Handle errors and send 500 status with error message
    res.status(500).json({ error: error.message });
  }
});

// Export the router and setPool function so server.js can use them
module.exports = { router, setPool };