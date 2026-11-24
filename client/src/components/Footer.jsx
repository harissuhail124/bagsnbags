import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import './Footer.css';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleNewsletter = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address.');
      return;
    }
    setSubmitting(true);
    try {
      await axios.post('/api/newsletter', { email });
      toast.success('Thank you for subscribing to our dispatch.');
      setEmail('');
    } catch (err) {
      const msg = err.response?.data?.error?.message || 'Subscription failed. Please try again.';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <h3 className="footer-logo">Bags'n'Bags</h3>
            <p className="footer-tagline">
              Carefully constructed everyday bags and travel carryalls. Built from full-grain leathers, waxed duck canvas, and solid brass fittings.
            </p>
          </div>

          <div className="footer-col">
            <h4 className="footer-col-title">Collection</h4>
            <ul className="footer-links">
              <li><Link to="/shop">All Bags</Link></li>
              <li><Link to="/shop?category=backpacks">Backpacks</Link></li>
              <li><Link to="/shop?category=handbags">Handbags</Link></li>
              <li><Link to="/shop?category=totes">Totes</Link></li>
              <li><Link to="/shop?category=accessories">Wallets & Small Goods</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4 className="footer-col-title">Customer Care</h4>
            <ul className="footer-links">
              <li><Link to="/shipping-returns">Shipping & Returns</Link></li>
              <li><Link to="/contact">Contact Atelier</Link></li>
              <li><Link to="/about">Our Materials & Craft</Link></li>
              <li><Link to="/privacy">Privacy Policy</Link></li>
              <li><Link to="/terms">Terms of Service</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4 className="footer-col-title">The Dispatch</h4>
            <p className="footer-newsletter-text">
              Occasional notes on new editions, studio processes, and limited runs. Never spam.
            </p>
            <form onSubmit={handleNewsletter} className="footer-newsletter-form">
              <input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={submitting}
                aria-label="Newsletter email"
                required
              />
              <button type="submit" disabled={submitting}>
                {submitting ? '...' : 'Join'}
              </button>
            </form>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Bags'n'Bags Ltd. Designed for everyday utility.</p>
          <p className="payment-methods-text">
            Accepted: Stripe Checkout, Visa, Mastercard, American Express, Cash on Delivery
          </p>
        </div>
      </div>
    </footer>
  );
}
