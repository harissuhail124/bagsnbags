import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle2, Package, ArrowRight } from 'lucide-react';

export default function OrderConfirmation() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const res = await axios.get(`/api/orders/${id}`);
      setOrder(res.data?.order);
    } catch (e) {
      console.error('Error fetching order', e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>
        <p>Loading your order details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>
        <h2>Order Record Not Found</h2>
        <p>Please check your confirmation email or contact atelier support.</p>
        <Link to="/shop" className="btn btn-primary" style={{ marginTop: '20px' }}>
          Return to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: 'var(--space-8) 0 var(--space-12)', maxWidth: '780px' }}>
      <div
        style={{
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-sm)',
          padding: 'var(--space-6)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
          <CheckCircle2 size={44} color="var(--color-success)" style={{ margin: '0 auto 12px' }} />
          <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--color-accent)' }}>
            Order Confirmed
          </span>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', marginTop: '4px' }}>
            Thank you, {order.customerName}
          </h1>
          <p style={{ color: 'var(--color-secondary-text)', fontSize: '0.92rem', marginTop: '6px' }}>
            We have dispatched an email confirmation to <strong>{order.customerEmail}</strong>.
          </p>
          <div
            style={{
              display: 'inline-block',
              marginTop: '12px',
              padding: '6px 14px',
              backgroundColor: 'var(--color-neutral-muted)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.85rem',
              fontWeight: 500,
            }}
          >
            Order Reference: <strong>{order.orderNumber}</strong>
          </div>
        </div>

        {/* Order Items Snapshot */}
        <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', marginBottom: 'var(--space-3)' }}>
            Purchased Pieces
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {order.items.map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  paddingBottom: '12px',
                  borderBottom: '1px solid var(--color-neutral-muted)',
                }}
              >
                <div
                  style={{
                    width: '60px',
                    aspectRatio: '4 / 5',
                    backgroundColor: 'var(--color-neutral-muted)',
                    borderRadius: 'var(--radius-sm)',
                    overflow: 'hidden',
                    flexShrink: 0,
                  }}
                >
                  {item.image && (
                    <img src={item.image} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 500, fontSize: '0.92rem' }}>{item.title}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--color-secondary-text)' }}>
                    Qty: {item.quantity} {item.variant ? `(${item.variant})` : ''} &middot; ${item.price.toFixed(2)} each
                  </div>
                </div>
                <div style={{ fontWeight: 500, fontSize: '0.95rem' }}>
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Totals & Delivery Address */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 'var(--space-4)',
            backgroundColor: 'var(--color-bg)',
            padding: 'var(--space-4)',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--color-border)',
            marginBottom: 'var(--space-6)',
          }}
        >
          <div>
            <h4 style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-secondary-text)', marginBottom: '8px' }}>
              Shipping Address
            </h4>
            <p style={{ fontSize: '0.88rem', color: 'var(--color-primary-text)', lineHeight: 1.5 }}>
              {order.shippingAddress?.line1}<br />
              {order.shippingAddress?.line2 && <>{order.shippingAddress.line2}<br /></>}
              {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.postalCode}<br />
              {order.shippingAddress?.country}
            </p>
          </div>

          <div>
            <h4 style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-secondary-text)', marginBottom: '8px' }}>
              Payment &amp; Status
            </h4>
            <p style={{ fontSize: '0.88rem', color: 'var(--color-primary-text)', lineHeight: 1.5 }}>
              Method: <strong>{order.paymentMethod === 'stripe' ? 'Stripe Checkout' : 'Cash on Delivery'}</strong><br />
              Payment Status: <strong>{order.paymentStatus.toUpperCase()}</strong><br />
              Fulfillment: <strong>{order.status.toUpperCase()}</strong>
            </p>
            <div style={{ marginTop: '10px', fontSize: '0.95rem', fontWeight: 600 }}>
              Total Paid/Due: ${order.totalAmount.toFixed(2)}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <Link to="/shop" className="btn btn-primary">
            Continue Shopping
          </Link>
          <Link to="/account" className="btn btn-outline">
            View in Account
          </Link>
        </div>
      </div>
    </div>
  );
}
