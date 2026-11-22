const express = require('express');
const router = express.Router();
const asyncHandler = require('../utils/asyncHandler');
const { protect } = require('../middleware/auth');
const { getCart, syncCart, clearCart } = require('../controllers/cart');

router.get('/', protect, asyncHandler(getCart));
router.post('/sync', protect, asyncHandler(syncCart));
router.delete('/clear', protect, asyncHandler(clearCart));

module.exports = router;
