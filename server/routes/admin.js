const express = require('express');
const router = express.Router();
const asyncHandler = require('../utils/asyncHandler');
const { protect, admin } = require('../middleware/auth');
const {
  upload,
  getDashboardStats,
  listCustomers,
  handleImageUpload,
} = require('../controllers/admin');

// Protected admin dashboard and management
router.get('/dashboard', protect, admin, asyncHandler(getDashboardStats));
router.get('/customers', protect, admin, asyncHandler(listCustomers));
router.post('/upload', protect, admin, upload.array('images', 8), handleImageUpload);

module.exports = router;
