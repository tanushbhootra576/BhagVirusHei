const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = {
    // Middleware to authenticate all users (citizens and government officials)
    authenticate: async (req, res, next) => {
        try {
            // Get token from header
            const token = req.header('Authorization')?.replace('Bearer ', '');

            if (!token) {
                return res.status(401).json({ message: 'No authentication token, access denied' });
            }

            // Check for bypass token in development
            if (token === 'bypass-token') {
                // Use a 24-char hex string so it looks like a valid ObjectId; recommended to create a real test user instead.
                req.user = {
                    id: '64b7f0e2a4b9c1d2e3f4a5b6',
                    name: 'Bypass Test User',
                    email: 'test@example.com',
                    role: 'citizen'
                };
                return next();
            }

            // Verify JWT token
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);

                // Find user by id
                const user = await User.findById(decoded.id).select('-password');

                if (!user) {
                    return res.status(401).json({ message: 'Token is not valid or user no longer exists' });
                }

                // Add user to request
                req.user = user;
                return next();
            } catch (jwtError) {
                return res.status(401).json({ message: 'Token is not valid' });
            }
        } catch (error) {
            console.error('Authentication error:', error);
            res.status(401).json({ message: 'Authentication failed' });
        }
    },

    // Middleware to authorize government officials only
    authorizeGovernment: (req, res, next) => {
        if (req.user && req.user.role === 'government') {
            next();
        } else {
            res.status(403).json({ message: 'Access denied. Only government officials can access this resource' });
        }
    },

    // Middleware to authorize citizens only
    authorizeCitizen: (req, res, next) => {
        if (req.user && req.user.role === 'citizen') {
            next();
        } else {
            res.status(403).json({ message: 'Access denied. Only citizens can access this resource' });
        }
    }
};
