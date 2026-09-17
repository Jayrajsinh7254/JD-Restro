const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];

            // Mock database mode support
            if (process.env.MOCK_DATABASE === 'true') {
                if (token === 'mock_token_123' || token.startsWith('mock_token')) {
                    req.user = { _id: 'mock_admin_id', name: 'Executive Admin', role: 'admin', email: 'admin@drizzle.com' };
                    return next();
                }
            }

            // Verify JWT token
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_jwt_key_drizzle_restaurant_2026');

            if (process.env.MOCK_DATABASE === 'true') {
                req.user = { _id: decoded.id || 'mock_admin_id', name: 'Executive Admin', role: 'admin', email: 'admin@drizzle.com' };
                return next();
            }

            req.user = await User.findById(decoded.id).select('-password');
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: 'Not authorized, user not found'
                });
            }

            return next();
        } catch (error) {
            console.error('Auth protect error:', error.message);
            return res.status(401).json({
                success: false,
                message: 'Not authorized, token failed or expired'
            });
        }
    }

    return res.status(401).json({
        success: false,
        message: 'Not authorized, no token provided'
    });
};

const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({
            success: false,
            message: 'Forbidden: Requires admin privileges'
        });
    }
};

module.exports = { protect, admin };
