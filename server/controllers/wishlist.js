const Wishlist = require('../models/Wishlist');

const getWishlist = async (req, res) => {
  let wishlist = await Wishlist.findOne({ user: req.user.id }).populate({
    path: 'products',
    populate: { path: 'category', select: 'name slug' },
  });

  if (!wishlist) {
    wishlist = await Wishlist.create({ user: req.user.id, products: [] });
  }

  res.json({ wishlist: wishlist.products });
};

const toggleWishlist = async (req, res) => {
  const { productId } = req.body;
  let wishlist = await Wishlist.findOne({ user: req.user.id });

  if (!wishlist) {
    wishlist = new Wishlist({ user: req.user.id, products: [] });
  }

  const exists = wishlist.products.some((id) => id.toString() === productId);
  if (exists) {
    wishlist.products = wishlist.products.filter((id) => id.toString() !== productId);
  } else {
    wishlist.products.push(productId);
  }

  await wishlist.save();
  await wishlist.populate({
    path: 'products',
    populate: { path: 'category', select: 'name slug' },
  });

  res.json({
    inWishlist: !exists,
    wishlist: wishlist.products,
  });
};

module.exports = {
  getWishlist,
  toggleWishlist,
};
