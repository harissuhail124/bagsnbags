const Product = require('../models/Product');
const Category = require('../models/Category');

/** List products with pagination, filters, search, sorting */
const listProducts = async (req, res, next) => {
  const {
    page = 1,
    limit = 12,
    search,
    category,
    minPrice,
    maxPrice,
    color,
    material,
    inStock,
    featured,
    sort,
  } = req.query;

  const query = {};

  if (search) {
    query.$text = { $search: search };
  }

  if (category) {
    const catDoc = await Category.findOne({
      $or: [{ slug: category }, { name: new RegExp(`^${category}$`, 'i') }],
    });
    if (catDoc) {
      query.category = catDoc._id;
    } else if (category.match(/^[0-9a-fA-F]{24}$/)) {
      query.category = category;
    }
  }

  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  if (color) {
    query.color = new RegExp(color, 'i');
  }

  if (material) {
    query.material = new RegExp(material, 'i');
  }

  if (inStock === 'true' || inStock === true) {
    query.stock = { $gt: 0 };
  }

  if (featured === 'true' || featured === true) {
    query.featured = true;
  }

  let sortOption = { createdAt: -1 };
  switch (sort) {
    case 'priceLow':
      sortOption = { price: 1 };
      break;
    case 'priceHigh':
      sortOption = { price: -1 };
      break;
    case 'rating':
      sortOption = { rating: -1, numReviews: -1 };
      break;
    case 'newest':
    default:
      sortOption = { createdAt: -1 };
  }

  const numericLimit = Math.max(1, Math.min(48, Number(limit)));
  const numericPage = Math.max(1, Number(page));
  const skip = (numericPage - 1) * numericLimit;

  const total = await Product.countDocuments(query);
  const products = await Product.find(query)
    .populate('category', 'name slug')
    .sort(sortOption)
    .skip(skip)
    .limit(numericLimit);

  res.json({
    pagination: {
      total,
      page: numericPage,
      limit: numericLimit,
      pages: Math.ceil(total / numericLimit),
    },
    data: products,
  });
};

/** Get a single product by slug or id */
const getProduct = async (req, res, next) => {
  const { slug } = req.params;
  let product;
  if (slug.match(/^[0-9a-fA-F]{24}$/)) {
    product = await Product.findById(slug).populate('category', 'name slug');
  } else {
    product = await Product.findOne({ slug }).populate('category', 'name slug');
  }

  if (!product) {
    const err = new Error('Product not found');
    err.statusCode = 404;
    return next(err);
  }

  // Get 4 related products in same category for "You may also like"
  const related = await Product.find({
    category: product.category?._id,
    _id: { $ne: product._id },
  })
    .limit(4)
    .populate('category', 'name slug');

  res.json({ product, related });
};

/** Create a new product (admin) */
const createProduct = async (req, res, next) => {
  const {
    title,
    description,
    price,
    images,
    categoryId,
    stock,
    material,
    color,
    dimensions,
    capacity,
    weight,
    featured,
    details,
    careInstructions,
    variants,
  } = req.body;

  const category = await Category.findById(categoryId);
  if (!category) {
    const err = new Error('Category not found');
    err.statusCode = 400;
    return next(err);
  }

  const product = await Product.create({
    title,
    description,
    price,
    images,
    category: category._id,
    stock,
    material,
    color,
    dimensions,
    capacity,
    weight,
    featured: !!featured,
    details: details || [],
    careInstructions: careInstructions || '',
    variants: variants || [],
  });

  res.status(201).json(product);
};

/** Update an existing product (admin) */
const updateProduct = async (req, res, next) => {
  const { id } = req.params;
  const updates = { ...req.body };

  if (updates.categoryId) {
    const cat = await Category.findById(updates.categoryId);
    if (!cat) {
      const err = new Error('Category not found');
      err.statusCode = 400;
      return next(err);
    }
    updates.category = cat._id;
    delete updates.categoryId;
  }

  const product = await Product.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
  if (!product) {
    const err = new Error('Product not found');
    err.statusCode = 404;
    return next(err);
  }
  res.json(product);
};

/** Delete a product (admin) */
const deleteProduct = async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findByIdAndDelete(id);
  if (!product) {
    const err = new Error('Product not found');
    err.statusCode = 404;
    return next(err);
  }
  res.json({ message: 'Product removed' });
};

module.exports = {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
