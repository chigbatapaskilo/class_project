// auth.js
const jwt = require('jsonwebtoken');
const User = require('../model/userModel');
require('dotenv').config();

// Middleware to protect routes and verify token
exports.protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id);

        if (!req.user) {
            return res.status(401).json({ message: 'Not authorized, user not found' });
        }

        next();
    } catch (error) {
        return res.status(401).json({ message: 'Not authorized, token failed' });
    }
};

// Middleware to check if the user has the required roles
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Permission denied' });
        }
        next();
    };
};

// Middleware to check if the user is an admin
exports.isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied' });
    }
    next();
};

// Middleware to check if the user is a teacher
exports.isTeacher = (req, res, next) => {
    if (req.user.role !== 'teacher' && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied' });
    }
    next();
};

// Middleware to check if the user is a student
exports.isStudent = (req, res, next) => {
    if (req.user.role !== 'student' && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied' });
    }
    next();
};

