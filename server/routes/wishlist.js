const express = require('express');
const router = express.Router();
const asyncHandler = require('../utils/asyncHandler');
const { protect } = require('../middleware/auth');
const { getWishlist, toggleWishlist } = require('../controllers/wishlist');

router.get('/', protect, asyncHandler(getWishlist));
router.post('/toggle', protect, asyncHandler(toggleWishlist));

module.exports = router;
