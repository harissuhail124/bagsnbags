const mongoose = require('mongoose');
const { MONGODB_URI } = require('./env');

let connecting = null;

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) return;

  if (!connecting) {
    connecting = mongoose.connect(MONGODB_URI).catch((err) => {
      connecting = null;
      throw err;
    });
  }

  await connecting;
  console.log('Connected to MongoDB Atlas');
};

module.exports = connectDB;