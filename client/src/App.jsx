import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Components
import Header from './components/Header';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';

// Pages
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import CartPage from './pages/CartPage';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Account from './pages/Account';
import About from './pages/About';
import ShippingReturns from './pages/ShippingReturns';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import NotFound from './pages/NotFound';
import Admin from './pages/admin/Admin';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          {/* Subtle bottom-left toast notifications */}
          <Toaster
            position="bottom-left"
            toastOptions={{
              duration: 3500,
              style: {
                background: '#2B2623',
                color: '#FAF8F5',
                fontSize: '0.82rem',
                borderRadius: '2px',
                padding: '10px 16px',
                border: '1px solid #3E3834',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              },
              success: {
                iconTheme: {
                  primary: '#8A6F55',
                  secondary: '#FAF8F5',
                },
              },
            }}
          />

          <Header />
          <CartDrawer />

          <main className="site-main">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />

              {/* Category shortcut aliases */}
              <Route path="/backpacks" element={<Navigate to="/shop?category=backpacks" replace />} />
              <Route path="/handbags" element={<Navigate to="/shop?category=handbags" replace />} />
              <Route path="/totes" element={<Navigate to="/shop?category=totes" replace />} />
              <Route path="/wallets" element={<Navigate to="/shop?category=accessories" replace />} />

              <Route path="/product/:slug" element={<ProductDetail />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order-confirmation/:id" element={<OrderConfirmation />} />

              {/* Auth routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />

              {/* Customer Account */}
              <Route path="/account" element={<Account />} />
              <Route path="/wishlist" element={<Account />} />

              {/* Admin Portal */}
              <Route path="/admin" element={<Admin />} />

              {/* Static content */}
              <Route path="/about" element={<About />} />
              <Route path="/shipping-returns" element={<ShippingReturns />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />

              {/* 404 fallback */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>

          <Footer />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
