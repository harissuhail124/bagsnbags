const Newsletter = require('../models/Newsletter');

const subscribe = async (req, res, next) => {
  const { email } = req.body;
  if (!email || !email.includes('@')) {
    const err = new Error('A valid email address is required.');
    err.statusCode = 400;
    return next(err);
  }

  try {
    await Newsletter.create({ email: email.toLowerCase().trim() });
    res.status(201).json({ message: 'Subscribed successfully' });
  } catch (err) {
    if (err.code === 11000) {
      // Already subscribed, return friendly 200
      return res.json({ message: 'You are already subscribed to our dispatch.' });
    }
    next(err);
  }
};

module.exports = { subscribe };
