const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

let pool; // Database connection (set from server.js)

function setPool(dbPool) {
    pool = dbPool;
}

// POST /api/auth/signup - Register a new user
router.post('/signup', async (req, res) => {
    try {
        // Extract user data from request body
        const { email, password, first_name, last_name } = req.body;
        
        // Hash the password with bcrypt (10 salt rounds)
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Insert new user into database
        const result = await pool.query(
            'INSERT INTO users (email, password_hash, first_name, last_name) VALUES ($1, $2, $3, $4) RETURNING *',
            [email, hashedPassword, first_name, last_name]
        );

        // Create JWT token with user ID, expires in 24 hours
        const token = jwt.sign(
            { userId: result.rows[0].id }, 
            process.env.JWT_SECRET, 
            { expiresIn: '24h' }
        );
        
        // Send token and user info (but NOT password!)
        res.status(201).json({ 
            token,
            user: {
                id: result.rows[0].id,
                email: result.rows[0].email,
                first_name: result.rows[0].first_name,
                last_name: result.rows[0].last_name
            }
        });
    } catch (error) {
        // Handle errors (like duplicate email)
        if (error.code === '23505') {
            // PostgreSQL unique violation error code
            return res.status(400).json({ error: 'Email already exists' });
        }
        res.status(500).json({ error: error.message });
    }
});

// POST /api/auth/login - Authenticate user and return JWT
router.post('/login', async (req, res) => {
    try {
        // Extract login credentials from request body
        const { email, password } = req.body;
        
        // Find user by email in database
        const result = await pool.query(
            'SELECT * FROM users WHERE email = $1', 
            [email]
        );

        // Check if user exists
        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Compare provided password with stored hashed password
        const isValidPassword = await bcrypt.compare(
            password, 
            result.rows[0].password_hash
        );
        
        // If password doesn't match, return error
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Password is correct - create JWT token
        const token = jwt.sign(
            { userId: result.rows[0].id }, 
            process.env.JWT_SECRET, 
            { expiresIn: '24h' }
        );
        
        // Send token and user info
        res.status(200).json({ 
            token,
            user: {
                id: result.rows[0].id,
                email: result.rows[0].email,
                first_name: result.rows[0].first_name,
                last_name: result.rows[0].last_name
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = { router, setPool };
