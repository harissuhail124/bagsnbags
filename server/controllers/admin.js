const path = require('path');
const multer = require('multer');
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

// Configure multer storage for admin uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'prod-' + uniqueSuffix + ext);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp|avif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only image files (jpeg, jpg, png, webp, avif) are supported.'));
  },
});

// Admin Dashboard stats
const getDashboardStats = async (req, res) => {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  // Total revenue & orders
  const paidOrders = await Order.find({ paymentStatus: 'paid' });
  const totalRevenue = paidOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  // Orders today
  const ordersTodayCount = await Order.countDocuments({
    createdAt: { $gte: startOfToday },
  });

  // Low stock products (stock <= 5)
  const lowStockProducts = await Product.find({ stock: { $lte: 5 } })
    .select('title stock price images slug category')
    .populate('category', 'name')
    .limit(10);

  // Recent 6 orders
  const recentOrders = await Order.find()
    .sort({ createdAt: -1 })
    .limit(6);

  // Customer count
  const customerCount = await User.countDocuments({ role: 'customer' });

  res.json({
    stats: {
      totalRevenue: Number(totalRevenue.toFixed(2)),
      paidOrdersCount: paidOrders.length,
      ordersTodayCount,
      lowStockCount: lowStockProducts.length,
      customerCount,
    },
    lowStockProducts,
    recentOrders,
  });
};

// Admin: list customers
const listCustomers = async (req, res) => {
  const customers = await User.find({ role: 'customer' })
    .select('-passwordHash -resetPasswordToken -resetPasswordExpires')
    .sort({ createdAt: -1 });

  // For each customer, find order count and total spent
  const customerData = await Promise.all(
    customers.map(async (c) => {
      const orders = await Order.find({ user: c._id });
      const totalSpent = orders
        .filter((o) => o.paymentStatus === 'paid')
        .reduce((sum, o) => sum + (o.totalAmount || 0), 0);
      return {
        ...c.toObject(),
        orderCount: orders.length,
        totalSpent: Number(totalSpent.toFixed(2)),
      };
    })
  );

  res.json({ customers: customerData });
};

// Admin: handle multi-image upload
const handleImageUpload = (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: { message: 'No image files uploaded', statusCode: 400 } });
  }

  const urls = req.files.map((file) => `/uploads/${file.filename}`);
  res.json({ urls });
};

module.exports = {
  upload,
  getDashboardStats,
  listCustomers,
  handleImageUpload,
};
