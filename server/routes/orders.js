const express = require('express');
const router = express.Router();
const asyncHandler = require('../utils/asyncHandler');
const { protect, admin } = require('../middleware/auth');
const {
  createOrder,
  getOrderById,
  getMyOrders,
  listOrdersAdmin,
  updateOrderStatus,
  handleStripeWebhook,
} = require('../controllers/order');

// Stripe webhook must receive raw body
router.post('/webhook', express.raw({ type: 'application/json' }), asyncHandler(handleStripeWebhook));

// Public / Guest / User order creation
router.post('/', asyncHandler(createOrder));

// Logged in user order history
router.get('/my-orders', protect, asyncHandler(getMyOrders));

// Get order by id
router.get('/:id', asyncHandler(getOrderById));

// Admin routes
router.get('/', protect, admin, asyncHandler(listOrdersAdmin));
router.patch('/:id/status', protect, admin, asyncHandler(updateOrderStatus));

module.exports = router;
