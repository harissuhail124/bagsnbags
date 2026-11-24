import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './Checkout.css';

export default function Checkout() {
  const { items, subtotal, discountAmount, shippingFee, grandTotal, promoCode, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'Pakistan',
    paymentMethod: 'cod', // 'cod' | 'jazzcash' | 'easypaisa' | 'stripe'
    paymentAccount: '',
    paymentTxId: '',
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    if (!formData.email.trim() || !formData.email.includes('@')) newErrors.email = 'Valid email is required';
    if (!formData.line1.trim()) newErrors.line1 = 'Street address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State / Province is required';
    if (!formData.postalCode.trim()) newErrors.postalCode = 'Postal code is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Please complete all required shipping fields.');
      return;
    }
    if (items.length === 0) {
      toast.error('Your bag is empty.');
      navigate('/shop');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        customerName: formData.name,
        customerEmail: formData.email,
        items: items.map((i) => ({
          productId: i.product._id,
          quantity: i.quantity,
          variant: i.variant,
        })),
        shippingAddress: {
          line1: formData.line1,
          line2: formData.line2,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          country: formData.country,
        },
        paymentMethod: formData.paymentMethod,
        paymentDetails: {
          accountNumber: formData.paymentAccount || '',
          transactionId: formData.paymentTxId || '',
        },
        promoCode: promoCode?.code || null,
      };

      const res = await axios.post('/api/orders', payload, { withCredentials: true });
      clearCart();

      if (formData.paymentMethod === 'stripe' && res.data.checkoutUrl) {
        // Redirect to Stripe checkout
        window.location.href = res.data.checkoutUrl;
      } else {
        // Cash on delivery or direct confirmation
        navigate(`/order-confirmation/${res.data.order._id}`);
      }
    } catch (err) {
      const msg = err.response?.data?.error?.message || 'Could not place order. Please review your details.';
      toast.error(msg);
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container checkout-page" style={{ textAlign: 'center', padding: '80px 0' }}>
        <h2>Your Bag is Empty</h2>
        <p>Please select pieces before proceeding to checkout.</p>
        <Link to="/shop" className="btn btn-primary" style={{ marginTop: '20px' }}>
          Browse Bags
        </Link>
      </div>
    );
  }

  return (
    <div className="container checkout-page">
      <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.2rem', marginBottom: 'var(--space-4)' }}>
        Checkout
      </h1>

      <div className="checkout-grid">
        {/* Left: Checkout Steps Form */}
        <form onSubmit={handlePlaceOrder}>
          {/* Step 1: Contact Information */}
          <div className="checkout-section-box">
            <h3 className="checkout-section-title">
              <span className="checkout-step-num">1</span>
              Contact Information
            </h3>
            <div className="form-row two-col">
              <div className="form-group">
                <label htmlFor="name">Full Name *</label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  placeholder="e.g. Eleanor Vance"
                  value={formData.name}
                  onChange={handleChange}
                />
                {errors.name && <span className="form-error-msg">{errors.name}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && <span className="form-error-msg">{errors.email}</span>}
              </div>
            </div>
            {!user && (
              <p style={{ fontSize: '0.78rem', color: 'var(--color-secondary-text)', marginTop: '4px' }}>
                Checking out as a guest. Have an account? <Link to="/login" style={{ textDecoration: 'underline' }}>Sign in here</Link>.
              </p>
            )}
          </div>

          {/* Step 2: Shipping Address */}
          <div className="checkout-section-box">
            <h3 className="checkout-section-title">
              <span className="checkout-step-num">2</span>
              Shipping Destination
            </h3>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="line1">Street Address *</label>
                <input
                  id="line1"
                  type="text"
                  name="line1"
                  placeholder="142 Mercer Street, Apt 4B"
                  value={formData.line1}
                  onChange={handleChange}
                />
                {errors.line1 && <span className="form-error-msg">{errors.line1}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="line2">Apartment, Suite, Unit (Optional)</label>
                <input
                  id="line2"
                  type="text"
                  name="line2"
                  placeholder="Floor 2, Studio 9"
                  value={formData.line2}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-row three-col">
              <div className="form-group">
                <label htmlFor="city">City *</label>
                <input
                  id="city"
                  type="text"
                  name="city"
                  placeholder="Lahore / Karachi"
                  value={formData.city}
                  onChange={handleChange}
                />
                {errors.city && <span className="form-error-msg">{errors.city}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="state">Province / Region *</label>
                <input
                  id="state"
                  type="text"
                  name="state"
                  placeholder="Punjab / Sindh"
                  value={formData.state}
                  onChange={handleChange}
                />
                {errors.state && <span className="form-error-msg">{errors.state}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="postalCode">Postal Code *</label>
                <input
                  id="postalCode"
                  type="text"
                  name="postalCode"
                  placeholder="54000"
                  value={formData.postalCode}
                  onChange={handleChange}
                />
                {errors.postalCode && <span className="form-error-msg">{errors.postalCode}</span>}
              </div>
            </div>
          </div>

          {/* Step 3: Shipping Method */}
          <div className="checkout-section-box">
            <h3 className="checkout-section-title">
              <span className="checkout-step-num">3</span>
              Delivery Service
            </h3>
            <div className="payment-option-card selected">
              <div style={{ flex: 1 }}>
                <span className="payment-option-title">Standard Insured Courier (3–5 Business Days)</span>
                <p className="payment-option-desc">
                  Shipped in carbon-neutral packaging with unbleached cotton dust bag.
                </p>
              </div>
              <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                {shippingFee === 0 ? 'Complimentary' : `PKR ${shippingFee.toLocaleString()}`}
              </span>
            </div>
          </div>

          {/* Step 4: Payment Method */}
          <div className="checkout-section-box">
            <h3 className="checkout-section-title">
              <span className="checkout-step-num">4</span>
              Payment Selection
            </h3>

            <div className="payment-methods-group">
              {/* Cash on Delivery */}
              <div className="payment-option-card-wrapper">
                <label className={`payment-option-card ${formData.paymentMethod === 'cod' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={formData.paymentMethod === 'cod'}
                    onChange={handleChange}
                    style={{ accentColor: 'var(--color-accent)' }}
                  />
                  <div>
                    <span className="payment-option-title">Cash on Delivery (COD)</span>
                    <p className="payment-option-desc">
                      Pay the courier representative in cash upon package handover and inspection.
                    </p>
                  </div>
                </label>
              </div>

              {/* JazzCash */}
              <div className="payment-option-card-wrapper">
                <label className={`payment-option-card ${formData.paymentMethod === 'jazzcash' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="jazzcash"
                    checked={formData.paymentMethod === 'jazzcash'}
                    onChange={handleChange}
                    style={{ accentColor: 'var(--color-accent)' }}
                  />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="payment-option-title">JazzCash Mobile Wallet</span>
                      <span className="payment-badge-tag jazzcash">JazzCash</span>
                    </div>
                    <p className="payment-option-desc">
                      Direct instant transfer via your JazzCash app or mobile account.
                    </p>
                  </div>
                </label>

                {formData.paymentMethod === 'jazzcash' && (
                  <div className="payment-details-nested">
                    <p style={{ marginBottom: '8px', lineHeight: 1.5 }}>
                      <strong>Atelier Account Title:</strong> Bags'n'Bags Official<br />
                      <strong>JazzCash Mobile / Till:</strong> <span style={{ color: 'var(--color-accent)', fontWeight: 600 }}>0300-1234567</span>
                    </p>
                    <div className="form-row two-col" style={{ marginBottom: 0 }}>
                      <div className="form-group">
                        <label htmlFor="jazzcash-acc">Your JazzCash Mobile No.</label>
                        <input
                          id="jazzcash-acc"
                          type="text"
                          name="paymentAccount"
                          placeholder="03XXXXXXXXX"
                          value={formData.paymentAccount}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="jazzcash-tx">Transaction ID / TID (Optional)</label>
                        <input
                          id="jazzcash-tx"
                          type="text"
                          name="paymentTxId"
                          placeholder="e.g. 1029384756"
                          value={formData.paymentTxId}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* EasyPaisa */}
              <div className="payment-option-card-wrapper">
                <label className={`payment-option-card ${formData.paymentMethod === 'easypaisa' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="easypaisa"
                    checked={formData.paymentMethod === 'easypaisa'}
                    onChange={handleChange}
                    style={{ accentColor: 'var(--color-accent)' }}
                  />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="payment-option-title">EasyPaisa Mobile Wallet</span>
                      <span className="payment-badge-tag easypaisa">EasyPaisa</span>
                    </div>
                    <p className="payment-option-desc">
                      Fast mobile transfer through your EasyPaisa wallet or app.
                    </p>
                  </div>
                </label>

                {formData.paymentMethod === 'easypaisa' && (
                  <div className="payment-details-nested">
                    <p style={{ marginBottom: '8px', lineHeight: 1.5 }}>
                      <strong>Atelier Account Title:</strong> Bags'n'Bags Official<br />
                      <strong>EasyPaisa Mobile Number:</strong> <span style={{ color: 'var(--color-accent)', fontWeight: 600 }}>0345-1234567</span>
                    </p>
                    <div className="form-row two-col" style={{ marginBottom: 0 }}>
                      <div className="form-group">
                        <label htmlFor="easypaisa-acc">Your EasyPaisa Mobile No.</label>
                        <input
                          id="easypaisa-acc"
                          type="text"
                          name="paymentAccount"
                          placeholder="03XXXXXXXXX"
                          value={formData.paymentAccount}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="easypaisa-tx">Transaction ID / TID (Optional)</label>
                        <input
                          id="easypaisa-tx"
                          type="text"
                          name="paymentTxId"
                          placeholder="e.g. 9876543210"
                          value={formData.paymentTxId}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Stripe / Cards */}
              <div className="payment-option-card-wrapper">
                <label className={`payment-option-card ${formData.paymentMethod === 'stripe' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="stripe"
                    checked={formData.paymentMethod === 'stripe'}
                    onChange={handleChange}
                    style={{ accentColor: 'var(--color-accent)' }}
                  />
                  <div>
                    <span className="payment-option-title">Stripe Checkout (Cards, Apple Pay)</span>
                    <p className="payment-option-desc">
                      Pay via Visa, MasterCard, and international debit/credit cards.
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '16px' }}
            disabled={submitting}
          >
            {submitting
              ? 'Processing Order...'
              : formData.paymentMethod === 'stripe'
              ? `Proceed to Stripe Payment (PKR ${grandTotal.toLocaleString()})`
              : formData.paymentMethod === 'jazzcash'
              ? `Confirm Order with JazzCash (PKR ${grandTotal.toLocaleString()})`
              : formData.paymentMethod === 'easypaisa'
              ? `Confirm Order with EasyPaisa (PKR ${grandTotal.toLocaleString()})`
              : `Place Order with Cash on Delivery (PKR ${grandTotal.toLocaleString()})`}
          </button>
        </form>

        {/* Right: Order Summary Panel */}
        <aside className="checkout-summary-panel">
          <h3 className="checkout-summary-title">Summary</h3>

          <div className="checkout-items-preview">
            {items.map((item, idx) => (
              <div key={idx} className="checkout-item-row">
                <div className="checkout-item-thumb">
                  <img
                    src={item.product.images?.[0] || 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=900&h=1125&fit=crop'}
                    alt={item.product.title}
                  />
                </div>
                <div className="checkout-item-info">
                  <div style={{ fontWeight: 500 }}>{item.product.title}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--color-secondary-text)' }}>
                    Qty: {item.quantity} {item.variant ? `(${item.variant})` : ''}
                  </div>
                </div>
                <div style={{ fontWeight: 500 }}>
                  PKR {((item.product.price || 0) * item.quantity).toLocaleString()}
                </div>
              </div>
            ))}
          </div>

          <div className="summary-row">
            <span>Subtotal</span>
            <span>PKR {subtotal.toLocaleString()}</span>
          </div>

          {discountAmount > 0 && (
            <div className="summary-row" style={{ color: 'var(--color-success)' }}>
              <span>Promo {promoCode?.code}</span>
              <span>-PKR {discountAmount.toLocaleString()}</span>
            </div>
          )}

          <div className="summary-row">
            <span>Shipping</span>
            <span>{shippingFee === 0 ? 'Complimentary' : `PKR ${shippingFee.toLocaleString()}`}</span>
          </div>

          <div className="summary-row total">
            <span>Total Due</span>
            <span>PKR {grandTotal.toLocaleString()}</span>
          </div>
        </aside>
      </div>
    </div>
  );
}
