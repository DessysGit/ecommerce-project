// Import required packages
const express = require('express'); // Web framework for creating server
const cors = require('cors'); // Allows frontend to communicate with backend
const { Pool } = require('pg'); // PostgreSQL client for Node.js
require('dotenv').config(); // Load environment variables from .env file

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000; // Server will run on port 5000

// Middleware - Functions that run before routes
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse incoming JSON data

// Database connection pool
// A pool maintains multiple database connection for better performance
const pool = new Pool({
    connectionString: process.env.DATABASE_URL, // Connection string from .env file
    ssl: {
        rejectUnauthorized: false // required for cloud databases like Neon
    }
});

// Test database connection on startup
pool.connect((err, client, release) => {
    if (err) {
        return console.error('Error connecting to database;', err.stack);
    }
    console.log('✅ Connected to PostgreSQL database');
    release(); // Release the client back to the pool
});

// Import product routes and pass database pool to them
const { router: productsRouter, setPool: setProductsPool } = require('./products');
setProductsPool(pool); // Give products.js access to database

// Use routes - all product routes will start with /api/products
app.use('/api/products', productsRouter);

// Import auth routes and pass database pool to them
const { router: authRouter, setPool: setAuthPool } = require('./auth');
setAuthPool(pool); // Give auth.js access to database

// Use routes - all auth routes will start with /api/auth
app.use('/api/auth', authRouter);

// Import cart routes and pass database pool to them
const { router: cartRouter, setPool: setCartPool } = require('./cart');
setCartPool(pool); // Give cart.js access to database

// Use routes - all cart routes will start with /api/cart
app.use('/api/cart', cartRouter);

// Import orders routes and pass database pool to them
const { router: ordersRouter, setPool: setOrdersPool } = require('./orders');
setOrdersPool(pool); // Give orders.js access to database

// Use routes - all order routes will start with /api/orders
app.use('/api/orders', ordersRouter);

// Root route - test endpoint to check if server is running
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the Ecommerce API!'});
});

// Start the server and listen for requests
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
