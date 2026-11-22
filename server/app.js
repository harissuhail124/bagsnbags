const path = require('path');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const { CLIENT_URL } = require('./config/env');
const errorHandler = require('./middleware/errorHandler');
const apiRouter = require('./routes');

const app = express();

// Needed behind Vercel's proxy so rate limiting and secure cookies work
app.set('trust proxy', 1);

// Security headers with resource policy relaxed for local uploads & images
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
}));

const allowedOrigin = (CLIENT_URL || 'http://localhost:5173').replace(/\/$/, '');

app.use(cors({
  origin: (origin, callback) => {
    // allow tools like Postman (no origin) and the configured frontend
    if (!origin || origin.replace(/\/$/, '') === allowedOrigin) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

// Stripe webhook requires raw body BEFORE express.json()
app.use((req, res, next) => {
  if (req.originalUrl === '/api/orders/webhook' || req.originalUrl === '/api/v1/orders/webhook') {
    next();
  } else {
    express.json({ limit: '5mb' })(req, res, next);
  }
});
app.use(express.urlencoded({ extended: true, limit: '5mb' }));
app.use(cookieParser());

// Serve static uploaded product images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rate limiter for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30, // 30 requests per 15 min on auth routes
  message: { error: { message: 'Too many authentication attempts, please try again in 15 minutes.', statusCode: 429 } },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/auth', authLimiter);
app.use('/api/v1/auth', authLimiter);

// Mount API router under both /api and /api/v1 for convenience
app.use('/api', apiRouter);
app.use('/api/v1', apiRouter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Central error handler – must be after all routes
app.use(errorHandler);

module.exports = app;
