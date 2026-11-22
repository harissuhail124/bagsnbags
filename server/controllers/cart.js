const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Get cart for logged in user
const getCart = async (req, res) => {
  let cart = await Cart.findOne({ user: req.user.id }).populate({
    path: 'items.product',
    select: 'title price images stock slug category',
  });

  if (!cart) {
    cart = await Cart.create({ user: req.user.id, items: [] });
  }

  res.json({ cart });
};

// Sync / merge guest cart upon login
const syncCart = async (req, res) => {
  const { items = [] } = req.body;
  let cart = await Cart.findOne({ user: req.user.id });

  if (!cart) {
    cart = new Cart({ user: req.user.id, items: [] });
  }

  // Merge items
  for (const guestItem of items) {
    const prodId = guestItem.product?._id || guestItem.product;
    if (!prodId) continue;

    const existingIndex = cart.items.findIndex(
      (ci) => ci.product.toString() === prodId.toString() && ci.variant === guestItem.variant
    );

    if (existingIndex > -1) {
      cart.items[existingIndex].quantity = Math.max(
        cart.items[existingIndex].quantity,
        guestItem.quantity
      );
    } else {
      cart.items.push({
        product: prodId,
        quantity: guestItem.quantity || 1,
        variant: guestItem.variant || null,
      });
    }
  }

  await cart.save();
  await cart.populate({
    path: 'items.product',
    select: 'title price images stock slug category',
  });

  res.json({ items: cart.items });
};

// Clear cart
const clearCart = async (req, res) => {
  await Cart.findOneAndUpdate({ user: req.user.id }, { items: [] });
  res.json({ message: 'Cart cleared' });
};

module.exports = {
  getCart,
  syncCart,
  clearCart,
};
