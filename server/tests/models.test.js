const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../models/User');
const Product = require('../models/Product');

beforeAll(async () => {
  // Connect to a test DB (use same MONGODB_URI – you can point to a separate Atlas test cluster)
  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});

test('GET /health returns ok', async () => {
  const res = await request(app).get('/health');
  expect(res.statusCode).toBe(200);
  expect(res.body.status).toBe('ok');
});

test('Create admin user via model', async () => {
  await User.deleteMany({ email: 'admin@bagsnbags.com' });
  const user = await User.create({
    name: 'Admin Test',
    email: 'admin@bagsnbags.com',
    passwordHash: await require('bcrypt').hash('Password123!', 12),
    role: 'admin',
  });
  expect(user.email).toBe('admin@bagsnbags.com');
});

test('Product count matches seed', async () => {
  const count = await Product.countDocuments();
  // Seed script creates as many as images.products length – at least 3 now.
  expect(count).toBeGreaterThanOrEqual(3);
});
