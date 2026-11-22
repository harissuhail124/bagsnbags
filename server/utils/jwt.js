const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/env');

// Generate a JWT for a user (payload: id, role)
const generateToken = (user) => {
  const payload = { id: user._id, role: user.role };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
};

module.exports = { generateToken };