import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Plus, Minus, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './CartDrawer.css';

export default function CartDrawer() {
  const {
    items,
    isDrawerOpen,
    closeDrawer,
    updateQuantity,
    removeItem,
    subtotal,
    promoCode,
    applyPromo,
    removePromo,
    discountAmount,
    shippingFee,
    grandTotal,
  } = useCart();

  const [promoInput, setPromoInput] = useState('');
  const [promoLoading, setPromoLoading] = useState(false);
  const navigate = useNavigate();

  const handleApplyPromo = async (e) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    setPromoLoading(true);
    await applyPromo(promoInput.trim());
    setPromoLoading(false);
    setPromoInput('');
  };

  const handleCheckoutClick = () => {
    closeDrawer();
    navigate('/checkout');
  };

  const amountNeededForFreeShipping = Math.max(0, 150 - (subtotal - discountAmount));
  const freeShippingProgress = Math.min(100, (((subtotal - discountAmount) / 150) * 100));

  return (
    <div className={`cart-drawer-overlay ${isDrawerOpen ? 'open' : ''}`} onClick={closeDrawer}>
      <div className={`cart-drawer-panel ${isDrawerOpen ? 'open' : ''}`} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="cart-drawer-header">
          <h3 className="cart-drawer-title">Your Bag ({items.reduce((acc, i) => acc + i.quantity, 0)})</h3>
          <button className="cart-close-btn" onClick={closeDrawer} aria-label="Close bag">
            <X size={20} />
          </button>
        </div>

        {/* Free Shipping Progress */}
        <div className="cart-shipping-notice">
          {amountNeededForFreeShipping > 0 ? (
            <p>
              Add <strong>${amountNeededForFreeShipping.toFixed(2)}</strong> more for complimentary shipping.
            </p>
          ) : (
            <p><strong>Complimentary shipping unlocked.</strong></p>
          )}
          <div className="shipping-progress-bar">
            <div className="shipping-progress-fill" style={{ width: `${freeShippingProgress}%` }}></div>
          </div>
        </div>

        {/* Items List */}
        <div className="cart-drawer-items">
          {items.length === 0 ? (
            <div className="cart-empty-state">
              <p>Your bag is currently empty.</p>
              <button
                className="btn btn-outline btn-sm"
                onClick={() => {
                  closeDrawer();
                  navigate('/shop');
                }}
              >
                Browse Collection
              </button>
            </div>
          ) : (
            items.map((item, idx) => (
              <div key={`${item.product._id}-${item.variant || 'std'}-${idx}`} className="cart-item">
                <div className="cart-item-image">
                  <img
                    src={item.product.images?.[0] || 'https://images.unsplash.com/photo-1541558618245-545c070e98e2?w=900&h=1125&fit=crop'}
                    alt={item.product.title}
                    loading="lazy"
                  />
                </div>
                <div className="cart-item-info">
                  <div className="cart-item-top">
                    <div>
                      <h4 className="cart-item-title">{item.product.title}</h4>
                      {item.variant && <span className="cart-item-variant">{item.variant}</span>}
                    </div>
                    <span className="cart-item-price">${((item.product.price || 0) * item.quantity).toFixed(2)}</span>
                  </div>

                  <div className="cart-item-actions">
                    <div className="qty-control">
                      <button
                        className="qty-btn"
                        onClick={() => updateQuantity(item.product._id, item.variant, item.quantity - 1)}
                        aria-label="Decrease quantity"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="qty-display">{item.quantity}</span>
                      <button
                        className="qty-btn"
                        onClick={() => updateQuantity(item.product._id, item.variant, item.quantity + 1)}
                        aria-label="Increase quantity"
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    <button
                      className="cart-item-remove"
                      onClick={() => removeItem(item.product._id, item.variant)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="cart-drawer-footer">
            {promoCode ? (
              <div className="promo-applied-tag">
                <span>Code {promoCode.code} applied (-${discountAmount.toFixed(2)})</span>
                <span className="promo-remove-link" onClick={removePromo}>Remove</span>
              </div>
            ) : (
              <form onSubmit={handleApplyPromo} className="promo-form">
                <input
                  type="text"
                  placeholder="Promo code"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  disabled={promoLoading}
                />
                <button type="submit" className="btn btn-outline" disabled={promoLoading}>
                  {promoLoading ? '...' : 'Apply'}
                </button>
              </form>
            )}

            <div className="cart-totals-row">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>

            {discountAmount > 0 && (
              <div className="cart-totals-row">
                <span>Discount</span>
                <span>-${discountAmount.toFixed(2)}</span>
              </div>
            )}

            <div className="cart-totals-row">
              <span>Shipping</span>
              <span>{shippingFee === 0 ? 'Complimentary' : `$${shippingFee.toFixed(2)}`}</span>
            </div>

            <div className="cart-totals-row grand-total">
              <span>Total</span>
              <span>${grandTotal.toFixed(2)}</span>
            </div>

            <button className="btn btn-primary" onClick={handleCheckoutClick}>
              Checkout
            </button>

            <Link to="/cart" onClick={closeDrawer} className="view-cart-link">
              View Bag Details
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
