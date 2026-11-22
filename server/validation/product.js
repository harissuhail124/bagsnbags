const { z } = require('zod');

/** Validation for creating a product */
const createProductSchema = z.object({
  title: z.string().min(1, 'Title required'),
  description: z.string().min(1, 'Description required'),
  price: z.number().positive('Price must be positive'),
  images: z.array(z.string().url('Image must be a URL')).min(1, 'At least one image required'),
  categoryId: z.string().min(1, 'Category ID required'),
  stock: z.number().int().nonnegative('Stock cannot be negative'),
  variants: z.array(z.object({ name: z.string(), options: z.array(z.string()) })).optional(),
});

/** Validation for updating a product */
const updateProductSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  price: z.number().positive().optional(),
  images: z.array(z.string().url()).optional(),
  categoryId: z.string().optional(),
  stock: z.number().int().nonnegative().optional(),
  variants: z.array(z.object({ name: z.string(), options: z.array(z.string()) })).optional(),
});

/** Validation for product list query (filters, pagination, sorting) */
const listProductsSchema = z.object({
  page: z.string().regex(/^\d+$/).optional(),
  limit: z.string().regex(/^\d+$/).optional(),
  search: z.string().optional(),
  category: z.string().optional(),
  minPrice: z.string().regex(/^\d+(\.\d+)?$/).optional(),
  maxPrice: z.string().regex(/^\d+(\.\d+)?$/).optional(),
  sort: z.enum(['newest', 'priceLow', 'priceHigh', 'rating']).optional(),
});

module.exports = {
  createProductSchema,
  updateProductSchema,
  listProductsSchema,
};
