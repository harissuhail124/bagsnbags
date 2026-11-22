const express = require('express');
const router = express.Router();
const asyncHandler = require('../utils/asyncHandler');
const { protect, admin } = require('../middleware/auth');
const {
  getProductReviews,
  addReview,
  listReviewsAdmin,
  moderateReview,
  deleteReview,
} = require('../controllers/review');

router.get('/product/:productId', asyncHandler(getProductReviews));
router.post('/product/:productId', protect, asyncHandler(addReview));

// Admin moderation
router.get('/admin', protect, admin, asyncHandler(listReviewsAdmin));
router.patch('/admin/:id', protect, admin, asyncHandler(moderateReview));
router.delete('/admin/:id', protect, admin, asyncHandler(deleteReview));

module.exports = router;
