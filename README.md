# Bags'n'Bags — Production E-Commerce Web Application

**Bags'n'Bags** is a full-stack, production-quality editorial e-commerce web application specializing in fine leather goods, backpacks, totes, duffels, and small travel accessories.

Built with an artisanal, calm, editorial aesthetic (warm neutrals, 4:5 aspect ratio imagery, thin 1px borders, subtle transitions, no emojis, zero template look).

---

## Architecture & Tech Stack

- **Frontend**: React 18, Vite, React Router v6, Axios, Lucide React (clean SVGs), React Hot Toast.
- **Backend**: Node.js, Express, Helmet, CORS, Express Rate Limit, Cookie Parser, Multer.
- **Database**: MongoDB Atlas via Mongoose with text indexing, atomic transactions, and model validations.
- **Authentication**: JWT stored in secure `httpOnly` cookies, bcrypt password hashing, token-based email password resets.
- **Payments**: Stripe Checkout (card/Apple Pay/Google Pay in test mode) + Cash on Delivery (COD).
- **Validation**: Zod schema validation across API payloads.
- **Images**: Served locally from `/server/uploads` for admin uploads, initial seed catalog from curated 4:5 Unsplash photography in `server/seed/images.js`.

---

## Directory Structure

```
Web App/
├── client/                     # Vite React Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/         # Header, Footer, CartDrawer, ProductCard
│   │   ├── context/            # AuthContext, CartContext
│   │   ├── pages/              # Home, Shop, ProductDetail, Cart, Checkout, OrderConfirmation,
│   │   │                       # Login, Register, ForgotPassword, ResetPassword, Account,
│   │   │                       # About, ShippingReturns, Contact, Privacy, Terms, NotFound
│   │   │   └── admin/          # Admin Dashboard, Products, Orders, Categories, Promos, Reviews
│   │   ├── styles/             # Global tokens, resets, utility classes
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── server/                     # Node.js + Express Backend
│   ├── config/                 # db.js, env.js
│   ├── controllers/            # auth, product, category, cart, order, review, promoCode, wishlist, contact, admin
│   ├── middleware/             # auth (protect, admin), validation (Zod), errorHandler
│   ├── models/                 # User, Product, Category, Cart, Order, Review, PromoCode, Newsletter, ContactMessage, Wishlist
│   ├── routes/                 # Versioned /api endpoints
│   ├── seed/                   # images.js, seed.js (30 products, 6 categories, admin user)
│   ├── tests/                  # Jest + Supertest suites (models.test.js, api.test.js)
│   ├── uploads/                # Local static directory for admin image uploads
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
├── README.md
└── PDF_DOCUMENTATION.md        # Comprehensive technical & architectural specification
```

---

## Windows Quick-Start Guide

### 1. Prerequisites
- **Node.js** v18+ installed.
- **MongoDB Atlas** cluster URI (or local MongoDB).

### 2. Configure Environment Variables
Inside `server/.env` (or project root `.env`), define:
```env
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/bagsnbags?retryWrites=true&w=majority
JWT_SECRET=super_secret_jwt_key_bagsnbags_2026
CLIENT_URL=http://localhost:5173
PORT=5000

# Optional Stripe Integration (leave empty for test-mode simulator)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Optional SMTP (leave blank to automatically use Nodemailer Ethereal mock in dev)
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
```

### 3. Install Dependencies
```powershell
# In server directory
cd server
npm install

# In client directory
cd ../client
npm install
```

### 4. Seed Database
Seeds 1 Admin, 1 Customer, 6 Categories, 30 Products, and Promo Codes:
```powershell
cd server
npm run seed
```
**Default Credentials:**
- **Admin**: `admin@bagsnbags.com` / `Password123!`
- **Customer**: `customer@bagsnbags.com` / `Password123!`
- **Promo Codes**: `WELCOME10` (10% off), `ATELIER25` ($25 off)

### 5. Run the Application
In **Terminal 1** (Backend):
```powershell
cd server
npm run dev
# Starts on http://localhost:5000
```

In **Terminal 2** (Frontend):
```powershell
cd client
npm run dev
# Starts on http://localhost:5173
```

Open `http://localhost:5173` in your browser.

---

## Running Tests
Run the automated test suite (Jest + Supertest covering health, models, authentication, cart synchronization, atomic stock decrements, and order creation):
```powershell
cd server
npm test
```

---

## Testing Stripe Checkout & Webhooks

1. If you configure `STRIPE_SECRET_KEY=sk_test_...`:
   - During checkout, selecting **Stripe Checkout** will redirect directly to Stripe's hosted checkout.
   - Use Stripe test card: `4242 4242 4242 4242`, any future MM/YY, and any CVC.
2. To test webhooks locally using the Stripe CLI:
   ```powershell
   stripe listen --forward-to localhost:5000/api/orders/webhook
   ```
   Copy the printed `whsec_...` into `STRIPE_WEBHOOK_SECRET` in `server/.env`.
3. If Stripe keys are omitted in development, selecting **Stripe** seamlessly redirects to the order confirmation page with a test transaction reference. Selecting **Cash on Delivery** creates the order immediately and dispatches an email confirmation.

---

## Manual Verification Checklist

- [x] **Home Page**: Hero with editorial photography, announcement bar, 4 category tiles, 8 new arrivals, craft section, reviews strip, newsletter subscription.
- [x] **Shop Page**: 12 items/page pagination, filters for category, price range, color/tone, stock status, sorting (newest, price, rating), debounced search.
- [x] **Product Detail**: Multi-thumbnail gallery with hover zoom, stock badges, specifications, add to cart with quantity, accordion details, customer reviews, "You may also like" related row.
- [x] **Cart**: Slide-over drawer and dedicated `/cart` page, instant quantity controls, removal, subtotal, shipping calculation (complimentary over $150), promo code validation (`WELCOME10`).
- [x] **Checkout**: Multi-step guest or registered customer checkout, address validation, shipping method, Stripe Checkout or Cash on Delivery selection.
- [x] **Order Confirmation**: Displays order reference, snapshot of items, billing summary, delivery address, and automated email dispatch.
- [x] **Authentication**: Register, Login (httpOnly cookie JWT), Forgot/Reset password with secure token.
- [x] **Account**: Orders history with status badges, tracking number display, saved wishlist with remove/move to bag, profile info.
- [x] **Admin Portal (`/admin`)**: Revenue and order metrics, low-stock warnings, multi-image product creation with upload to `/server/uploads`, order status & tracking number updater, customer listing, promo code generator, review moderator.
