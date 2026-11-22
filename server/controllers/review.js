const Review = require('../models/Review');
const Order = require('../models/Order');
const Product = require('../models/Product');

// Get approved reviews for a product
const getProductReviews = async (req, res) => {
  const { productId } = req.params;
  const reviews = await Review.find({ product: productId, status: 'approved' })
    .populate('user', 'name')
    .sort({ createdAt: -1 });

  res.json({ reviews });
};

// Add a review (only logged-in users who purchased can review)
const addReview = async (req, res, next) => {
  const { productId } = req.params;
  const { rating, comment, title } = req.body;

  // Check if user purchased this product
  const purchasedOrder = await Order.findOne({
    user: req.user.id,
    'items.productId': productId,
    status: { $ne: 'cancelled' },
  });

  if (!purchasedOrder && req.user.role !== 'admin') {
    const err = new Error('You may only review products you have purchased.');
    err.statusCode = 403;
    return next(err);
  }

  // Check if already reviewed
  const existingReview = await Review.findOne({ product: productId, user: req.user.id });
  if (existingReview) {
    const err = new Error('You have already submitted a review for this product.');
    err.statusCode = 400;
    return next(err);
  }

  const review = await Review.create({
    product: productId,
    user: req.user.id,
    title: title || '',
    rating: Number(rating),
    comment,
    verifiedPurchase: true,
    status: 'approved',
  });

  // Recalculate product rating
  const allReviews = await Review.find({ product: productId, status: 'approved' });
  const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
  await Product.findByIdAndUpdate(productId, {
    rating: Number(avgRating.toFixed(1)),
    numReviews: allReviews.length,
  });

  await review.populate('user', 'name');
  res.status(201).json({ review });
};

// Admin: list all reviews for moderation
const listReviewsAdmin = async (req, res) => {
  const reviews = await Review.find()
    .populate('product', 'title slug images')
    .populate('user', 'name email')
    .sort({ createdAt: -1 });

  res.json({ reviews });
};

// Admin: moderate review (approve / reject / delete)
const moderateReview = async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body; // 'approved' | 'rejected'

  const review = await Review.findByIdAndUpdate(id, { status }, { new: true });
  if (!review) {
    const err = new Error('Review not found');
    err.statusCode = 404;
    return next(err);
  }

  res.json({ review });
};

const deleteReview = async (req, res, next) => {
  const { id } = req.params;
  const review = await Review.findByIdAndDelete(id);
  if (!review) {
    const err = new Error('Review not found');
    err.statusCode = 404;
    return next(err);
  }

  res.json({ message: 'Review deleted' });
};

module.exports = {
  getProductReviews,
  addReview,
  listReviewsAdmin,
  moderateReview,
  deleteReview,
};
