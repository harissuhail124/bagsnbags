const express = require('express');
const router = express.Router();
const asyncHandler = require('../utils/asyncHandler');
const { protect, admin } = require('../middleware/auth');
const { submitContactMessage, listMessagesAdmin } = require('../controllers/contact');

router.post('/', asyncHandler(submitContactMessage));
router.get('/admin', protect, admin, asyncHandler(listMessagesAdmin));

module.exports = router;
