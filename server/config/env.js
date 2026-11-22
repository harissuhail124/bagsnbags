const path = require('path');
const dotenv = require('dotenv');

// Load .env from the server folder (one level up from config)
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

module.exports = {
  MONGODB_URI: process.env.MONGODB_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  // STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  // STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
  CLIENT_URL: process.env.CLIENT_URL,
  // SMTP_HOST: process.env.SMTP_HOST,
  // SMTP_PORT: process.env.SMTP_PORT,
  // SMTP_USER: process.env.SMTP_USER,
  // SMTP_PASS: process.env.SMTP_PASS,
};
