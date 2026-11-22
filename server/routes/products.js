const express = require('express');
const router = express.Router();
const asyncHandler = require('../utils/asyncHandler');
const { protect, admin } = require('../middleware/auth');
const { listProducts, getProduct, createProduct, updateProduct, deleteProduct } = require('../controllers/product');
const { validate } = require('../middleware/validation');
const { createProductSchema, updateProductSchema, listProductsSchema } = require('../validation/product');

// Public routes
router.get('/', validate(listProductsSchema, 'query'), asyncHandler(listProducts));
router.get('/:slug', asyncHandler(getProduct));

// Admin routes – protect & admin
router.post('/', protect, admin, validate(createProductSchema), asyncHandler(createProduct));
router.put('/:id', protect, admin, validate(updateProductSchema), asyncHandler(updateProduct));
router.delete('/:id', protect, admin, asyncHandler(deleteProduct));

module.exports = router;
