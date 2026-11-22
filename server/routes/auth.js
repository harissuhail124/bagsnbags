const express = require('express');
const router = express.Router();
const asyncHandler = require('../utils/asyncHandler');
const { register, login, logout, forgotPassword, resetPassword, getMe } = require('../controllers/auth');
const { protect } = require('../middleware/auth');
const { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema } = require('../validation/auth');
const { validate } = require('../middleware/validation');

// Register new user
router.post('/register', validate(registerSchema), asyncHandler(register));
// Login
router.post('/login', validate(loginSchema), asyncHandler(login));
// Logout
router.post('/logout', protect, asyncHandler(logout));
// Forgot password (email token)
router.post('/forgot-password', validate(forgotPasswordSchema), asyncHandler(forgotPassword));
// Reset password using token
router.post('/reset-password/:token', validate(resetPasswordSchema), asyncHandler(resetPassword));
// Get own profile
router.get('/me', protect, asyncHandler(getMe));

module.exports = router;
