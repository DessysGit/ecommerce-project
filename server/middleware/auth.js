// Import jsonwebtoken to verify JWT tokens
const jwt = require('jsonwebtoken');

// Middleware function - runs BEFORE cart routes to check authentication
const authenticateToken = (req, res, next) => {
  // Get the Authorization header from the request
  const authHeader = req.headers['authorization'];
  
  // Token format is \"Bearer TOKEN\", we only want the TOKEN part
  const token = authHeader && authHeader.split(' ')[1];
  
  // If no token provided, reject the request
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  // Verify the token is valid and not tampered with
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    // If verification failed (token is fake or expired)
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    
    // Token is valid! Attach user info to request object
    // decoded contains: { userId: 1, iat: ..., exp: ... }
    req.user = decoded;
    
    // Call next() to proceed to the actual route handler
    next();
  });
};

// Export so other files can use this middleware
module.exports = authenticateToken;
