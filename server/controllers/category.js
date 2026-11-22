const Category = require('../models/Category');

const listCategories = async (req, res) => {
  const categories = await Category.find().sort({ name: 1 });
  res.json({ categories });
};

const getCategoryBySlug = async (req, res, next) => {
  const { slug } = req.params;
  const category = await Category.findOne({ slug });
  if (!category) {
    const err = new Error('Category not found');
    err.statusCode = 404;
    return next(err);
  }
  res.json(category);
};

const createCategory = async (req, res) => {
  const { name, imageUrl, description } = req.body;
  const category = await Category.create({ name, imageUrl, description });
  res.status(201).json(category);
};

const updateCategory = async (req, res, next) => {
  const { id } = req.params;
  const category = await Category.findByIdAndUpdate(id, req.body, { new: true });
  if (!category) {
    const err = new Error('Category not found');
    err.statusCode = 404;
    return next(err);
  }
  res.json(category);
};

const deleteCategory = async (req, res, next) => {
  const { id } = req.params;
  const category = await Category.findByIdAndDelete(id);
  if (!category) {
    const err = new Error('Category not found');
    err.statusCode = 404;
    return next(err);
  }
  res.json({ message: 'Category removed' });
};

module.exports = {
  listCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
};
