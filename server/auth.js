const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authenticateToken = require('./middleware/auth');

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

// GET /api/auth/profile - Get current user's profile info
router.get('/profile', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        
        // Get user info from database
        const result = await pool.query(
            'SELECT id, email, first_name, last_name, created_at FROM users WHERE id = $1',
            [userId]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        // Get user's order count
        const ordersResult = await pool.query(
            'SELECT COUNT(*) as order_count FROM orders WHERE user_id = $1',
            [userId]
        );
        
        res.json({
            ...result.rows[0],
            order_count: parseInt(ordersResult.rows[0].order_count)
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT /api/auth/profile - Update user profile info
router.put('/profile', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const { first_name, last_name, email } = req.body;
        
        // Update user info in database
        const result = await pool.query(
            'UPDATE users SET first_name = $1, last_name = $2, email = $3 WHERE id = $4 RETURNING id, email, first_name, last_name',
            [first_name, last_name, email, userId]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        res.json({
            message: 'Profile updated successfully',
            user: result.rows[0]
        });
    } catch (error) {
        // Handle duplicate email error
        if (error.code === '23505') {
            return res.status(400).json({ error: 'Email already in use' });
        }
        res.status(500).json({ error: error.message });
    }
});

// PUT /api/auth/password - Change user password
router.put('/password', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const { currentPassword, newPassword } = req.body;
        
        // Validate input
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ error: 'Current password and new password are required' });
        }
        
        // Validate new password strength
        if (newPassword.length < 6) {
            return res.status(400).json({ error: 'New password must be at least 6 characters long' });
        }
        
        // Get user's current password hash
        const userResult = await pool.query(
            'SELECT password_hash FROM users WHERE id = $1',
            [userId]
        );
        
        if (userResult.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        // Verify current password
        const isValidPassword = await bcrypt.compare(
            currentPassword,
            userResult.rows[0].password_hash
        );
        
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Current password is incorrect' });
        }
        
        // Hash new password
        const newHashedPassword = await bcrypt.hash(newPassword, 10);
        
        // Update password in database
        await pool.query(
            'UPDATE users SET password_hash = $1 WHERE id = $2',
            [newHashedPassword, userId]
        );
        
        res.json({ message: 'Password changed successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = { router, setPool };
