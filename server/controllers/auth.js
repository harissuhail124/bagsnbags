const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const { generateToken } = require('../utils/jwt');
const { sendEmail } = require('../utils/email');
const { JWT_SECRET } = require('../config/env');

/** Register a new user */
const register = async (req, res, next) => {
  const { name, email, password } = req.body;
  // Check if user exists
  const existing = await User.findOne({ email });
  if (existing) {
    const err = new Error('User already exists');
    err.statusCode = 400;
    return next(err);
  }
  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({ name, email, passwordHash });
  const token = generateToken(user);
  // Set httpOnly cookie
  res.cookie('token', token, { httpOnly: true, secure: false, sameSite: 'lax', maxAge: 7 * 24 * 60 * 60 * 1000 });
  res.status(201).json({ message: 'Registered successfully', user: { id: user._id, name, email, role: user.role } });
};

/** Login */
const login = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    const err = new Error('Invalid credentials');
    err.statusCode = 401;
    return next(err);
  }
  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) {
    const err = new Error('Invalid credentials');
    err.statusCode = 401;
    return next(err);
  }
  const token = generateToken(user);
  res.cookie('token', token, { httpOnly: true, secure: false, sameSite: 'lax', maxAge: 7 * 24 * 60 * 60 * 1000 });
  res.json({ message: 'Logged in', user: { id: user._id, name: user.name, email: user.email, role: user.role } });
};

/** Logout */
const logout = async (req, res, next) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out' });
};

/** Forgot password – send reset link */
const forgotPassword = async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    // Do not reveal whether email exists
    return res.json({ message: 'If that email is registered, a reset link has been sent' });
  }
  const resetToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 hour
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
  const message = `You requested a password reset. Click this link to set a new password (valid for 1 hour):\n\n${resetUrl}`;

  try {
    await sendEmail({
      to: user.email,
      subject: 'Password Reset – Bags\'n\'Bags',
      text: message,
    });
    res.json({ message: 'If that email is registered, a reset link has been sent' });
  } catch (e) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save({ validateBeforeSave: false });
    const err = new Error('Email could not be sent');
    err.statusCode = 500;
    next(err);
  }
};

/** Reset password using token */
const resetPassword = async (req, res, next) => {
  const { token } = req.params; // raw token from URL
  const { password } = req.body;
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() },
  });
  if (!user) {
    const err = new Error('Token is invalid or has expired');
    err.statusCode = 400;
    return next(err);
  }
  user.passwordHash = await bcrypt.hash(password, 12);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();
  const jwtToken = generateToken(user);
  res.cookie('token', jwtToken, { httpOnly: true, secure: false, sameSite: 'lax', maxAge: 7 * 24 * 60 * 60 * 1000 });
  res.json({ message: 'Password reset successful' });
};

/** Get current logged‑in user profile */
const getMe = async (req, res, next) => {
  const user = await User.findById(req.user.id).select('-passwordHash -resetPasswordToken -resetPasswordExpires');
  if (!user) {
    const err = new Error('User not found');
    err.statusCode = 404;
    return next(err);
  }
  res.json({ user });
};

module.exports = { register, login, logout, forgotPassword, resetPassword, getMe };
