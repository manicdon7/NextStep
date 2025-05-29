const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extract token from "Bearer <token>"

  if (!token) {
    console.warn('No token provided in Authorization header');
    return res.status(401).json({ success: false, message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret'); // Ensure JWT_SECRET is set in .env
    req.user = decoded; // Set req.user to the decoded token payload
    console.log('Token verified, user:', decoded);
    next();
  } catch (err) {
    console.error('Token verification failed:', err.message);
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Token expired' });
    }
    return res.status(403).json({ success: false, message: 'Invalid token' });
  }
};

module.exports = authenticateToken;