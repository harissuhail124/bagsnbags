import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Minus, X, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './CartPage.css';

export default function CartPage() {
  const {
    items,
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

  if (items.length === 0) {
    return (
      <div className="container cart-page" style={{ textAlign: 'center', padding: '80px 0' }}>
        <h1 className="cart-page-title" style={{ border: 'none' }}>Your Bag is Empty</h1>
        <p style={{ color: 'var(--color-secondary-text)', marginBottom: '32px' }}>
          Explore our collection of durable everyday backpacks, leather totes, and luggage.
        </p>
        <Link to="/shop" className="btn btn-primary">
          Explore Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="container cart-page">
      <h1 className="cart-page-title">Shopping Bag ({items.reduce((acc, i) => acc + i.quantity, 0)})</h1>

      <div className="cart-layout">
        {/* Items Table */}
        <div className="cart-table-wrap">
          <table className="cart-table">
            <thead>
              <tr>
                <th>Piece</th>
                <th>Quantity</th>
                <th>Total</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => (
                <tr key={`${item.product._id}-${item.variant || 'std'}-${idx}`}>
                  <td>
                    <div className="cart-product-cell">
                      <Link to={`/product/${item.product.slug}`} className="cart-thumb">
                        <img
                          src={item.product.images?.[0] || 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=900&h=1125&fit=crop'}
                          alt={item.product.title}
                        />
                      </Link>
                      <div>
                        <Link
                          to={`/product/${item.product.slug}`}
                          style={{ fontWeight: 500, fontSize: '0.95rem' }}
                        >
                          {item.product.title}
                        </Link>
                        {item.variant && (
                          <div style={{ fontSize: '0.78rem', color: 'var(--color-secondary-text)' }}>
                            Tone: {item.variant}
                          </div>
                        )}
                        <div style={{ fontSize: '0.85rem', color: 'var(--color-secondary-text)', marginTop: '2px' }}>
                          PKR {(item.product.price || 0).toLocaleString()} each
                        </div>
                      </div>
                    </div>
                  </td>

                  <td>
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
                  </td>

                  <td style={{ fontWeight: 500 }}>
                    PKR {((item.product.price || 0) * item.quantity).toLocaleString()}
                  </td>

                  <td style={{ textAlign: 'right' }}>
                    <button
                      onClick={() => removeItem(item.product._id, item.variant)}
                      style={{ color: 'var(--color-secondary-text)', padding: '6px' }}
                      aria-label="Remove item"
                    >
                      <X size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Order Summary Box */}
        <aside className="cart-summary-box">
          <h3 className="cart-summary-title">Order Summary</h3>

          {promoCode ? (
            <div className="promo-applied-tag">
              <span>Code {promoCode.code} applied (-PKR {discountAmount.toLocaleString()})</span>
              <span className="promo-remove-link" onClick={removePromo}>Remove</span>
            </div>
          ) : (
            <form onSubmit={handleApplyPromo} className="promo-form">
              <input
                type="text"
                placeholder="PROMO CODE"
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value)}
                disabled={promoLoading}
              />
              <button type="submit" className="btn btn-outline" disabled={promoLoading}>
                {promoLoading ? '...' : 'Apply'}
              </button>
            </form>
          )}

          <div className="summary-row">
            <span>Subtotal</span>
            <span>PKR {subtotal.toLocaleString()}</span>
          </div>

          {discountAmount > 0 && (
            <div className="summary-row">
              <span>Promotional Discount</span>
              <span>-PKR {discountAmount.toLocaleString()}</span>
            </div>
          )}

          <div className="summary-row">
            <span>Insured Standard Shipping</span>
            <span>{shippingFee === 0 ? 'Complimentary' : `PKR ${shippingFee.toLocaleString()}`}</span>
          </div>

          <div className="summary-row total">
            <span>Estimated Total</span>
            <span>PKR {grandTotal.toLocaleString()}</span>
          </div>

          <button
            className="btn btn-primary"
            onClick={() => navigate('/checkout')}
            style={{ width: '100%', marginTop: 'var(--space-2)' }}
          >
            Proceed to Checkout
          </button>

          <p style={{ fontSize: '0.78rem', color: 'var(--color-secondary-text)', textAlign: 'center' }}>
            Complimentary shipping applied on orders over $150. Tax calculated at checkout.
          </p>
        </aside>
      </div>
    </div>
  );
}
