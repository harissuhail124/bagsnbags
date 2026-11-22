const express = require('express');
const router = express.Router();
const asyncHandler = require('../utils/asyncHandler');
const { protect, admin } = require('../middleware/auth');
const {
  validatePromoCode,
  listPromoCodes,
  createPromoCode,
  updatePromoCode,
  deletePromoCode,
} = require('../controllers/promoCode');

router.post('/validate', asyncHandler(validatePromoCode));

// Admin CRUD
router.get('/', protect, admin, asyncHandler(listPromoCodes));
router.post('/', protect, admin, asyncHandler(createPromoCode));
router.put('/:id', protect, admin, asyncHandler(updatePromoCode));
router.delete('/:id', protect, admin, asyncHandler(deletePromoCode));

module.exports = router;
