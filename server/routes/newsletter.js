const express = require('express');
const router = express.Router();
const asyncHandler = require('../utils/asyncHandler');
const { subscribe } = require('../controllers/newsletter');

router.post('/', asyncHandler(subscribe));

module.exports = router;
