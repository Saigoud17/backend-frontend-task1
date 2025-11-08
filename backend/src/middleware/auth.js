const jwt = require('jsonwebtoken');
require('dotenv').config();

// Verify JWT token
const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // ✅ Handle both { id } or { sub } payloads
        req.user = {
            id: decoded.id || decoded.sub,
            role: decoded.role
        };

        next();
    } catch (err) {
        return res.status(403).json({ error: 'Invalid or expired token' });
    }
};

// Role check
const authorizeAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied: Admins only' });
    }
    next();
};

module.exports = { authenticate, authorizeAdmin };