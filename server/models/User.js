const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['admin', 'customer'], default: 'customer' },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
}, { timestamps: true });

// Virtual for password set
userSchema.virtual('password')
  .set(function (pwd) {
    this.passwordHash = bcrypt.hashSync(pwd, 12);
  });

userSchema.methods.comparePassword = function (pwd) {
  return bcrypt.compareSync(pwd, this.passwordHash);
};

module.exports = mongoose.model('User', userSchema);
