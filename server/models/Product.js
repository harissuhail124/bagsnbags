const mongoose = require('mongoose');
const slugify = require('slugify');

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, unique: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  images: [{ type: String, required: true }],
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true, index: true },
  stock: { type: Number, required: true, min: 0 },
  material: { type: String },
  color: { type: String },
  dimensions: { type: String },
  capacity: { type: String },
  weight: { type: String },
  featured: { type: Boolean, default: false },
  details: [{ type: String }],
  careInstructions: { type: String },
  variants: [{
    name: String,
    options: [String],
  }],
  rating: { type: Number, default: 5.0 },
  numReviews: { type: Number, default: 0 },
}, { timestamps: true });

// Auto‑generate slug on validation if missing
productSchema.pre('validate', function(next) {
  if (!this.slug && this.title) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

// Text index for search
productSchema.index({ title: 'text', description: 'text', material: 'text' });

module.exports = mongoose.model('Product', productSchema);
