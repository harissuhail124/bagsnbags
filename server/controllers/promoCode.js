const PromoCode = require('../models/PromoCode');

// Validate code for checkout
const validatePromoCode = async (req, res, next) => {
  const { code } = req.body;
  if (!code) {
    const err = new Error('Promo code required');
    err.statusCode = 400;
    return next(err);
  }

  const promo = await PromoCode.findOne({ code: code.toUpperCase() });
  if (!promo || !promo.active) {
    const err = new Error('Invalid or inactive promotional code');
    err.statusCode = 400;
    return next(err);
  }

  if (promo.expiresAt && new Date(promo.expiresAt) < new Date()) {
    const err = new Error('This promotional code has expired');
    err.statusCode = 400;
    return next(err);
  }

  if (promo.usageLimit && promo.usedCount >= promo.usageLimit) {
    const err = new Error('This promotional code has reached its maximum redemptions');
    err.statusCode = 400;
    return next(err);
  }

  res.json({
    promo: {
      code: promo.code,
      discountType: promo.discountType,
      discountValue: promo.discountValue,
    },
  });
};

// Admin: list promo codes
const listPromoCodes = async (req, res) => {
  const promoCodes = await PromoCode.find().sort({ createdAt: -1 });
  res.json({ promoCodes });
};

// Admin: create promo code
const createPromoCode = async (req, res, next) => {
  const { code, discountType, discountValue, expiresAt, usageLimit, active } = req.body;
  const existing = await PromoCode.findOne({ code: code.toUpperCase() });
  if (existing) {
    const err = new Error('Promo code already exists');
    err.statusCode = 400;
    return next(err);
  }

  const promo = await PromoCode.create({
    code: code.toUpperCase(),
    discountType,
    discountValue: Number(discountValue),
    expiresAt: expiresAt ? new Date(expiresAt) : null,
    usageLimit: usageLimit ? Number(usageLimit) : null,
    active: active !== undefined ? active : true,
  });

  res.status(201).json({ promo });
};

// Admin: update promo code
const updatePromoCode = async (req, res, next) => {
  const { id } = req.params;
  const updates = { ...req.body };
  if (updates.code) updates.code = updates.code.toUpperCase();

  const promo = await PromoCode.findByIdAndUpdate(id, updates, { new: true });
  if (!promo) {
    const err = new Error('Promo code not found');
    err.statusCode = 404;
    return next(err);
  }

  res.json({ promo });
};

// Admin: delete promo code
const deletePromoCode = async (req, res, next) => {
  const { id } = req.params;
  const promo = await PromoCode.findByIdAndDelete(id);
  if (!promo) {
    const err = new Error('Promo code not found');
    err.statusCode = 404;
    return next(err);
  }

  res.json({ message: 'Promo code removed' });
};

module.exports = {
  validatePromoCode,
  listPromoCodes,
  createPromoCode,
  updatePromoCode,
  deletePromoCode,
};
