const express = require('express');
const router = express.Router();

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'api ok', time: new Date().toISOString() });
});

// Feature routers
const authRouter = require('./auth');
const productRouter = require('./products');
const categoryRouter = require('./categories');
const cartRouter = require('./cart');
const orderRouter = require('./orders');
const reviewRouter = require('./reviews');
const promoCodeRouter = require('./promoCodes');
const wishlistRouter = require('./wishlist');
const newsletterRouter = require('./newsletter');
const contactRouter = require('./contact');
const adminRouter = require('./admin');

// Mount all feature routers
router.use('/auth', authRouter);
router.use('/products', productRouter);
router.use('/categories', categoryRouter);
router.use('/cart', cartRouter);
router.use('/orders', orderRouter);
router.use('/reviews', reviewRouter);
router.use('/promo-codes', promoCodeRouter);
router.use('/wishlist', wishlistRouter);
router.use('/newsletter', newsletterRouter);
router.use('/contact', contactRouter);
router.use('/admin', adminRouter);

module.exports = router;
