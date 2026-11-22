import React from 'react';
import { Link } from 'react-router-dom';

export default function ShippingReturns() {
  return (
    <div className="container" style={{ padding: 'var(--space-8) 0 var(--space-12)', maxWidth: '800px' }}>
      <span className="badge" style={{ marginBottom: '8px' }}>Customer Care</span>
      <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.4rem', marginBottom: 'var(--space-5)' }}>
        Shipping &amp; Returns
      </h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)', lineHeight: 1.75, color: 'var(--color-primary-text)' }}>
        <section>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', marginBottom: '8px' }}>
            Complimentary Shipping Threshold
          </h3>
          <p style={{ color: 'var(--color-secondary-text)' }}>
            All orders with a subtotal of $150 or greater receive complimentary standard insured courier delivery. For orders below $150, a flat $15 delivery fee covers trackable domestic dispatch.
          </p>
        </section>

        <section>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', marginBottom: '8px' }}>
            Dispatch &amp; Transit Times
          </h3>
          <p style={{ color: 'var(--color-secondary-text)' }}>
            Orders placed on business days before 1:00 PM EST are dispatched within 24 to 48 hours from our atelier. Standard courier transit takes 3 to 5 business days. You will receive an automated dispatch notification with carrier tracking as soon as the package is handed over.
          </p>
        </section>

        <section>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', marginBottom: '8px' }}>
            30-Day Evaluation Period
          </h3>
          <p style={{ color: 'var(--color-secondary-text)' }}>
            We want you to examine our materials in person with complete peace of mind. We accept returns within 30 days of confirmed delivery, provided the piece is unused, in original condition, and returned inside its organic linen dust bag with all tags intact.
          </p>
        </section>

        <section>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', marginBottom: '8px' }}>
            Repair Guarantee
          </h3>
          <p style={{ color: 'var(--color-secondary-text)' }}>
            We guarantee our stitching, hardware, and structural seams against manufacturing defects for five years. Should a rivet loosen or a zipper slide falter, our atelier will repair it at no cost.
          </p>
        </section>

        <div style={{ marginTop: 'var(--space-3)' }}>
          <Link to="/contact" className="btn btn-outline">
            Questions? Contact Atelier Support
          </Link>
        </div>
      </div>
    </div>
  );
}
