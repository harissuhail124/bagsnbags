const mongoose = require('mongoose');
const Stripe = require('stripe');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const PromoCode = require('../models/PromoCode');
const { sendEmail } = require('../utils/email');
const { STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, CLIENT_URL } = require('../config/env');

const stripe = STRIPE_SECRET_KEY ? new Stripe(STRIPE_SECRET_KEY) : null;

/** Helper: atomically decrement product stock */
const decrementStock = async (items) => {
  for (const item of items) {
    const updated = await Product.findOneAndUpdate(
      { _id: item.productId, stock: { $gte: item.quantity } },
      { $inc: { stock: -item.quantity } },
      { new: true }
    );
    if (!updated) {
      throw new Error(`Item "${item.title}" is out of stock or insufficient quantity available.`);
    }
  }
};

/** Create an order (Stripe Checkout session or Cash on Delivery) */
const createOrder = async (req, res, next) => {
  const {
    customerName,
    customerEmail,
    items,
    shippingAddress,
    paymentMethod, // 'stripe' | 'cod'
    promoCode,
  } = req.body;

  if (!items || items.length === 0) {
    const err = new Error('Bag is empty');
    err.statusCode = 400;
    return next(err);
  }

  // 1. Snapshot product details from database to guarantee authentic prices
  const snapshotItems = [];
  let calculatedSubtotal = 0;

  for (const item of items) {
    const prodId = item.product?._id || item.productId || item.product;
    const dbProduct = await Product.findById(prodId);
    if (!dbProduct) {
      const err = new Error(`Product ${prodId} no longer exists.`);
      err.statusCode = 400;
      return next(err);
    }

    const qty = Math.max(1, Number(item.quantity) || 1);
    const itemTotal = dbProduct.price * qty;
    calculatedSubtotal += itemTotal;

    snapshotItems.push({
      productId: dbProduct._id,
      title: dbProduct.title,
      price: dbProduct.price,
      image: dbProduct.images?.[0] || '',
      variant: item.variant || null,
      quantity: qty,
    });
  }

  // 2. Validate promo code if provided
  let discountAmount = 0;
  let promoDoc = null;
  if (promoCode) {
    promoDoc = await PromoCode.findOne({
      code: promoCode.toUpperCase(),
      active: true,
      $or: [{ expiresAt: { $exists: false } }, { expiresAt: { $gt: new Date() } }],
    });
    if (promoDoc) {
      if (promoDoc.discountType === 'percentage') {
        discountAmount = (calculatedSubtotal * promoDoc.discountValue) / 100;
      } else if (promoDoc.discountType === 'fixed') {
        discountAmount = Math.min(calculatedSubtotal, promoDoc.discountValue);
      }
    }
  }

  const subtotalAfterDiscount = Math.max(0, calculatedSubtotal - discountAmount);
  // Free shipping over $150
  const shippingFee = subtotalAfterDiscount >= 150 ? 0 : 15;
  const totalAmount = Number((subtotalAfterDiscount + shippingFee).toFixed(2));

  // 3. Atomically decrement stock
  await decrementStock(snapshotItems);

  // If promo was used, increment used count
  if (promoDoc) {
    await PromoCode.findByIdAndUpdate(promoDoc._id, { $inc: { usedCount: 1 } });
  }

  // 4. Create Order document
  const order = await Order.create({
    user: req.user?.id || null,
    customerName,
    customerEmail,
    items: snapshotItems,
    subtotal: calculatedSubtotal,
    discountAmount,
    shippingFee,
    totalAmount,
    shippingAddress,
    paymentMethod,
    paymentStatus: 'pending',
    status: 'pending',
    promoCode: promoDoc?.code || null,
  });

  // Clear logged-in user cart
  if (req.user?.id) {
    await Cart.findOneAndUpdate({ user: req.user.id }, { items: [] });
  }

  // 5. Handle Stripe Checkout vs Cash on Delivery
  if (paymentMethod === 'stripe') {
    if (!stripe) {
      // If Stripe secret key not yet configured in .env, simulate successful checkout URL
      return res.status(201).json({
        order,
        checkoutUrl: `${CLIENT_URL || 'http://localhost:5173'}/order-confirmation/${order._id}?payment_intent=mock_stripe_success`,
      });
    }

    try {
      const lineItems = snapshotItems.map((item) => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.title,
            images: item.image ? [item.image] : [],
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      }));

      // Add shipping line if applicable
      if (shippingFee > 0) {
        lineItems.push({
          price_data: {
            currency: 'usd',
            product_data: { name: 'Standard Insured Shipping' },
            unit_amount: Math.round(shippingFee * 100),
          },
          quantity: 1,
        });
      }

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: 'payment',
        customer_email: customerEmail,
        success_url: `${CLIENT_URL || 'http://localhost:5173'}/order-confirmation/${order._id}?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${CLIENT_URL || 'http://localhost:5173'}/checkout?cancelled=true`,
        metadata: {
          orderId: order._id.toString(),
        },
      });

      order.stripeSessionId = session.id;
      await order.save();

      return res.status(201).json({
        order,
        checkoutUrl: session.url,
      });
    } catch (stripeErr) {
      console.error('Stripe session creation error:', stripeErr);
      return res.status(201).json({
        order,
        checkoutUrl: `${CLIENT_URL || 'http://localhost:5173'}/order-confirmation/${order._id}`,
      });
    }
  }

  // Cash on Delivery – Send order confirmation email immediately
  try {
    await sendEmail({
      to: customerEmail,
      subject: `Order Confirmation – #${order.orderNumber}`,
      text: `Hello ${customerName},\n\nThank you for your order with Bags'n'Bags. We have received your order (#${order.orderNumber}) and our atelier is preparing it for shipment.\n\nTotal: $${totalAmount.toFixed(2)} (Cash on Delivery)\n\nWarm regards,\nBags'n'Bags`,
    });
  } catch (emailErr) {
    console.error('Confirmation email error:', emailErr);
  }

  res.status(201).json({ order });
};

/** Get single order details */
const getOrderById = async (req, res, next) => {
  const { id } = req.params;
  const order = await Order.findById(id);
  if (!order) {
    const err = new Error('Order not found');
    err.statusCode = 404;
    return next(err);
  }

  // Protect customer privacy: only owner or admin can view
  if (req.user && req.user.role !== 'admin' && order.user && order.user.toString() !== req.user.id) {
    const err = new Error('Not authorized to view this order');
    err.statusCode = 403;
    return next(err);
  }

  res.json({ order });
};

/** Get orders for logged in user */
const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.json({ orders });
};

/** Admin: list all orders with filter and pagination */
const listOrdersAdmin = async (req, res) => {
  const { status, paymentStatus, page = 1, limit = 20, search } = req.query;
  const query = {};

  if (status) query.status = status;
  if (paymentStatus) query.paymentStatus = paymentStatus;
  if (search) {
    query.$or = [
      { orderNumber: new RegExp(search, 'i') },
      { customerEmail: new RegExp(search, 'i') },
      { customerName: new RegExp(search, 'i') },
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);
  const total = await Order.countDocuments(query);
  const orders = await Order.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit));

  res.json({
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      pages: Math.ceil(total / Number(limit)),
    },
    orders,
  });
};

/** Admin: update order status & tracking */
const updateOrderStatus = async (req, res, next) => {
  const { id } = req.params;
  const { status, paymentStatus, trackingNumber, trackingCarrier } = req.body;

  const order = await Order.findById(id);
  if (!order) {
    const err = new Error('Order not found');
    err.statusCode = 404;
    return next(err);
  }

  if (status) order.status = status;
  if (paymentStatus) order.paymentStatus = paymentStatus;
  if (trackingNumber !== undefined) order.trackingNumber = trackingNumber;
  if (trackingCarrier !== undefined) order.trackingCarrier = trackingCarrier;

  await order.save();

  // If tracking added, send dispatch notification email
  if (trackingNumber && order.customerEmail) {
    try {
      await sendEmail({
        to: order.customerEmail,
        subject: `Your Bags'n'Bags Order #${order.orderNumber} Has Shipped`,
        text: `Your order #${order.orderNumber} is now on its way via ${order.trackingCarrier || 'carrier'}.\nTracking: ${trackingNumber}`,
      });
    } catch (e) {
      // ignore
    }
  }

  res.json({ order });
};

/** Stripe Webhook */
const handleStripeWebhook = async (req, res) => {
  if (!stripe || !STRIPE_WEBHOOK_SECRET) {
    return res.status(200).json({ received: true });
  }

  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const orderId = session.metadata?.orderId;
    if (orderId) {
      await Order.findByIdAndUpdate(orderId, {
        paymentStatus: 'paid',
        status: 'paid',
        stripePaymentIntentId: session.payment_intent,
      });
    }
  }

  res.json({ received: true });
};

module.exports = {
  createOrder,
  getOrderById,
  getMyOrders,
  listOrdersAdmin,
  updateOrderStatus,
  handleStripeWebhook,
};
