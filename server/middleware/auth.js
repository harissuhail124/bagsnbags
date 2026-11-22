const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/env');

// Verify JWT from httpOnly cookie; attach user payload to req.user
const protect = (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) {
    const err = new Error('Not authorized, token missing');
    err.statusCode = 401;
    return next(err);
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // { id, role }
    next();
  } catch (e) {
    const err = new Error('Not authorized, token invalid');
    err.statusCode = 401;
    next(err);
  }
};

// Admin role check
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') return next();
  const err = new Error('Admin privileges required');
  err.statusCode = 403;
  next(err);
};

module.exports = { protect, admin };
