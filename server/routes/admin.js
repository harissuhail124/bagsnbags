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

// Multi-image upload with custom error handling for multer
router.post('/upload', protect, admin, (req, res, next) => {
  upload.array('images', 8)(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: { message: err.message, statusCode: 400 } });
    }
    handleImageUpload(req, res, next);
  });
});

module.exports = router;
