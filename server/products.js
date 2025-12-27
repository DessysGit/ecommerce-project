// Import express and create a router
const express = require('express');
const router = express.Router(); // Router lets us define routes in separate files

// Database pool variable (will be set from server.js)
let pool;

// Function to receive database pool from server.js
function setPool(dbPool) {
  pool = dbPool;
}

// GET /api/products - Retrieve all products with optional search, filter, and sort
router.get('/', async (req, res) => {
  try {
    // Get query parameters from URL
    const { search, category, sortBy } = req.query;
    
    // Start building the SQL query
    let query = 'SELECT * FROM products WHERE 1=1';
    const params = [];
    let paramCount = 0;
    
    // Add search filter if provided
    if (search) {
      paramCount++;
      query += ` AND (name ILIKE $${paramCount} OR description ILIKE $${paramCount})`;
      params.push(`%${search}%`); // ILIKE is case-insensitive LIKE
    }
    
    // Add category filter if provided
    if (category && category !== 'all') {
      paramCount++;
      query += ` AND category = $${paramCount}`;
      params.push(category);
    }
    
    // Add sorting
    switch(sortBy) {
      case 'price_asc':
        query += ' ORDER BY price ASC';
        break;
      case 'price_desc':
        query += ' ORDER BY price DESC';
        break;
      case 'name_asc':
        query += ' ORDER BY name ASC';
        break;
      case 'name_desc':
        query += ' ORDER BY name DESC';
        break;
      case 'newest':
        query += ' ORDER BY created_at DESC';
        break;
      default:
        query += ' ORDER BY created_at DESC'; // Default: newest first
    }
    
    // Execute the query
    const result = await pool.query(query, params);
    
    // Send products as JSON response
    res.json(result.rows);
  } catch (error) {
    // If something goes wrong, send error message with 500 status code
    res.status(500).json({ error: error.message });
  }
});

// GET /api/products/categories - Get all unique categories
router.get('/categories', async (req, res) => {
  try {
    // Get distinct categories from products table
    const result = await pool.query(
      'SELECT DISTINCT category FROM products WHERE category IS NOT NULL ORDER BY category'
    );
    
    // Extract just the category names
    const categories = result.rows.map(row => row.category);
    
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/products/add - Add a new product to database
router.post('/add', async (req, res) => {
  try {
    // Extract product data from request body
    const { name, description, price, stock_quantity, category, image_url } = req.body;
    
    // Insert new product into database
    // $1, $2, etc. are placeholders that prevent SQL injection attacks
    // RETURNING * returns the newly created product
    const result = await pool.query(
      'INSERT INTO products (name, description, price, stock_quantity, category, image_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [name, description, price, stock_quantity, category, image_url]
    );
    
    // Send back the created product with 201 status (Created)
    res.status(201).json(result.rows[0]);
  } catch (error) {
    // Handle errors
    res.status(500).json({ error: error.message });
  }
});

// Export router and setPool function so server.js can use them
module.exports = { router, setPool };
