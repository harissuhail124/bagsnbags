const { z } = require('zod');

// Allow both full URLs (http/https) and local uploaded paths (/uploads/...)
const imageStringSchema = z.string().min(1, 'Image path or URL is required').refine(
  (val) => val.startsWith('/uploads/') || val.startsWith('http://') || val.startsWith('https://') || val.startsWith('/'),
  { message: 'Image must be a valid URL (http/https) or an uploaded path (/uploads/...)' }
);

/** Validation for creating a product */
const createProductSchema = z.object({
  title: z.string().min(1, 'Title required'),
  description: z.string().min(1, 'Description required'),
  price: z.number().positive('Price must be positive'),
  images: z.array(imageStringSchema).min(1, 'At least one image required'),
  categoryId: z.string().min(1, 'Category ID required'),
  stock: z.number().int().nonnegative('Stock cannot be negative'),
  material: z.string().optional(),
  color: z.string().optional(),
  dimensions: z.string().optional(),
  capacity: z.string().optional(),
  weight: z.string().optional(),
  featured: z.boolean().optional(),
  details: z.array(z.string()).optional(),
  careInstructions: z.string().optional(),
  variants: z.array(z.object({ name: z.string(), options: z.array(z.string()) })).optional(),
});

/** Validation for updating a product */
const updateProductSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  price: z.number().positive().optional(),
  images: z.array(imageStringSchema).optional(),
  categoryId: z.string().optional(),
  stock: z.number().int().nonnegative().optional(),
  material: z.string().optional(),
  color: z.string().optional(),
  dimensions: z.string().optional(),
  capacity: z.string().optional(),
  weight: z.string().optional(),
  featured: z.boolean().optional(),
  details: z.array(z.string()).optional(),
  careInstructions: z.string().optional(),
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
  color: z.string().optional(),
  material: z.string().optional(),
  inStock: z.string().optional(),
  featured: z.string().optional(),
  sort: z.enum(['newest', 'priceLow', 'priceHigh', 'rating']).optional(),
});

module.exports = {
  createProductSchema,
  updateProductSchema,
  listProductsSchema,
};
