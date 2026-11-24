const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  title: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String },
  variant: { type: String },
  quantity: { type: Number, required: true, min: 1 },
});

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  customerEmail: { type: String, required: true },
  customerName: { type: String, required: true },
  items: [orderItemSchema],
  subtotal: { type: Number, required: true },
  discountAmount: { type: Number, default: 0 },
  shippingFee: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true },
  shippingAddress: {
    line1: { type: String, required: true },
    line2: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true, default: 'US' },
  },
  paymentMethod: { type: String, enum: ['stripe', 'cod', 'jazzcash', 'easypaisa'], required: true },
  paymentDetails: {
    accountNumber: { type: String },
    transactionId: { type: String },
  },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
  status: {
    type: String,
    enum: ['pending', 'paid', 'packed', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
  },
  promoCode: { type: String },
  trackingNumber: { type: String },
  trackingCarrier: { type: String },
  stripeSessionId: { type: String },
  stripePaymentIntentId: { type: String },
}, { timestamps: true });

orderSchema.pre('validate', function(next) {
  if (!this.orderNumber) {
    this.orderNumber = 'BNB-' + Date.now().toString(36).toUpperCase() + '-' + Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  }
  next();
});

orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ customerEmail: 1 });

module.exports = mongoose.model('Order', orderSchema);
