const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

beforeAll(async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/bagsnbags_test');
  }
});

afterAll(async () => {
  await mongoose.connection.close();
});

jest.setTimeout(30000);

describe("Auth, Cart & Order Creation API Tests", () => {
  const testUser = {
    name: "Test Customer",
    email: `test_${Date.now()}@example.com`,
    password: "Password123!",
  };
  let userCookie = '';

  test("1. Auth - Register new user", async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser);

    expect([201, 400]).toContain(res.statusCode);
    if (res.statusCode === 201) {
      expect(res.body.user).toBeDefined();
      expect(res.body.user.email).toBe(testUser.email);
      userCookie = res.headers['set-cookie'];
    }
  });

  test("2. Auth - Login user and receive httpOnly cookie", async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: testUser.email, password: testUser.password });

    if (res.statusCode === 200) {
      expect(res.body.user.email).toBe(testUser.email);
      expect(res.headers['set-cookie']).toBeDefined();
      userCookie = res.headers['set-cookie'];
    }
  });

  test("3. Cart - Sync guest cart with user cart", async () => {
    const sampleProduct = await Product.findOne();
    if (!sampleProduct) return;

    const res = await request(app)
      .post('/api/cart/sync')
      .set('Cookie', userCookie)
      .send({
        items: [{ product: sampleProduct._id, quantity: 2, variant: 'Standard' }],
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.items).toBeDefined();
  });

  test("4. Order - Create an order with Cash on Delivery", async () => {
    const sampleProduct = await Product.findOne({ stock: { $gt: 2 } });
    if (!sampleProduct) return;

    const initialStock = sampleProduct.stock;

    const orderPayload = {
      customerName: "Jane Smith",
      customerEmail: "jane.smith@example.com",
      paymentMethod: "cod",
      items: [
        {
          productId: sampleProduct._id,
          quantity: 1,
          variant: "Natural",
        },
      ],
      shippingAddress: {
        line1: "124 Mercer St",
        city: "New York",
        state: "NY",
        postalCode: "10012",
        country: "US",
      },
    };

    const res = await request(app)
      .post('/api/orders')
      .set('Cookie', userCookie)
      .send(orderPayload);

    expect(res.statusCode).toBe(201);
    expect(res.body.order).toBeDefined();
    expect(res.body.order.orderNumber).toMatch(/^BNB-/);
    expect(res.body.order.paymentMethod).toBe('cod');
    expect(res.body.order.paymentStatus).toBe('pending');

    // Verify atomic stock decrement
    const updatedProduct = await Product.findById(sampleProduct._id);
    expect(updatedProduct.stock).toBe(initialStock - 1);
  });
});
