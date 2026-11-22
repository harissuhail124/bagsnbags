const express = require('express');
const router = express.Router();
const asyncHandler = require('../utils/asyncHandler');
const { protect, admin } = require('../middleware/auth');
const {
  listCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/category');

router.get('/', asyncHandler(listCategories));
router.get('/:slug', asyncHandler(getCategoryBySlug));

router.post('/', protect, admin, asyncHandler(createCategory));
router.put('/:id', protect, admin, asyncHandler(updateCategory));
router.delete('/:id', protect, admin, asyncHandler(deleteCategory));

module.exports = router;
