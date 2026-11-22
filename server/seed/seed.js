require('dotenv').config({ path: require('path').resolve(__dirname, '..', '..', '.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const connectDB = require('../config/db');
const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');
const PromoCode = require('../models/PromoCode');
const Review = require('../models/Review');
const images = require('./images');

const adminEmail = 'admin@bagsnbags.com';
const adminPassword = 'Password123!';

const runSeed = async () => {
  try {
    await connectDB();
    console.log('Clearing existing database records...');
    await Promise.all([
      User.deleteMany({}),
      Category.deleteMany({}),
      Product.deleteMany({}),
      PromoCode.deleteMany({}),
      Review.deleteMany({}),
    ]);

    // 1. Create Admin User & Sample Customer
    const adminHash = await bcrypt.hash(adminPassword, 12);
    const admin = await User.create({
      name: 'Atelier Director',
      email: adminEmail,
      passwordHash: adminHash,
      role: 'admin',
    });

    const customerHash = await bcrypt.hash('Password123!', 12);
    const customer = await User.create({
      name: 'Claire Dupont',
      email: 'customer@bagsnbags.com',
      passwordHash: customerHash,
      role: 'customer',
    });

    // 2. Create Categories
    const categoryDocs = {};
    for (const [key, data] of Object.entries(images.categories)) {
      const cat = await Category.create({
        name: data.name,
        slug: data.slug,
        imageUrl: data.imageUrl,
        description: data.description,
      });
      categoryDocs[key] = cat;
    }

    // 3. Create Products
    const createdProducts = [];
    for (const p of images.products) {
      const categoryDoc = categoryDocs[p.categoryKey];
      if (!categoryDoc) continue;

      const product = await Product.create({
        title: p.title,
        description: p.description,
        price: p.price,
        images: p.images,
        category: categoryDoc._id,
        stock: p.stock,
        material: p.material,
        color: p.color,
        dimensions: p.dimensions,
        capacity: p.capacity,
        weight: p.weight,
        featured: p.featured || false,
        details: p.details || [],
        careInstructions: p.careInstructions || '',
        rating: 4.8 + Math.round((Math.random() * 0.2) * 10) / 10,
        numReviews: Math.floor(Math.random() * 6) + 2,
      });
      createdProducts.push(product);
    }

    // 4. Create Promo Codes
    await PromoCode.create([
      {
        code: 'WELCOME10',
        discountType: 'percentage',
        discountValue: 10,
        active: true,
        usageLimit: 1000,
      },
      {
        code: 'ATELIER25',
        discountType: 'fixed',
        discountValue: 25,
        active: true,
        usageLimit: 500,
      },
    ]);

    // 5. Create Sample Authentic Reviews
    const sampleReviews = [
      {
        title: "Remarkable craft and stitching",
        comment: "The waxed canvas has a pleasant, understated hand feel. Fits my 15-inch laptop securely with room for a sweater and sketchbook.",
        rating: 5,
      },
      {
        title: "Subtle and durable",
        comment: "After four months of daily cycling in wet autumn weather, the leather has developed a handsome glow and no rain seeped through.",
        rating: 5,
      },
      {
        title: "Flawless proportions",
        comment: "Solid brass hardware has real weight to it. Beautifully packaged in an unbleached linen dust bag.",
        rating: 5,
      },
      {
        title: "Well worth the investment",
        comment: "Understated luxury. No flashy logos, just honest materials assembled with care.",
        rating: 4,
      }
    ];

    for (let i = 0; i < Math.min(10, createdProducts.length); i++) {
      const rev = sampleReviews[i % sampleReviews.length];
      await Review.create({
        product: createdProducts[i]._id,
        user: customer._id,
        title: rev.title,
        rating: rev.rating,
        comment: rev.comment,
        verifiedPurchase: true,
        status: 'approved',
      });
    }

    console.log('✅ Seed complete:');
    console.log(`   Admin User: ${admin.email} (Password: ${adminPassword})`);
    console.log(`   Customer User: ${customer.email} (Password: Password123!)`);
    console.log(`   Categories created: ${Object.keys(categoryDocs).length}`);
    console.log(`   Products created: ${createdProducts.length}`);
    console.log(`   Promo codes: WELCOME10 (10% off), ATELIER25 ($25 off)`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err);
    process.exit(1);
  }
};

runSeed();
