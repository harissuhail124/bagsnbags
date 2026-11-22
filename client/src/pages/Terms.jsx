import React from 'react';

export default function Terms() {
  return (
    <div className="container" style={{ padding: 'var(--space-8) 0 var(--space-12)', maxWidth: '780px', lineHeight: 1.7 }}>
      <span className="badge" style={{ marginBottom: '8px' }}>Legal</span>
      <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.4rem', marginBottom: 'var(--space-4)' }}>
        Terms of Service
      </h1>
      <p style={{ color: 'var(--color-secondary-text)', marginBottom: 'var(--space-4)' }}>
        Last updated: November 2026
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', color: 'var(--color-primary-text)' }}>
        <p>
          By accessing and placing orders through the Bags'n'Bags online store, you agree to comply with and be bound by the following terms of purchase and warranty conditions.
        </p>
        <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem' }}>Product Variance &amp; Natural Character</h3>
        <p>
          Because our products are crafted from genuine vegetable-tanned bovine leathers and paraffin waxed duck canvas, slight natural variations in grain texture, growth marks, and tonal depth are authentic characteristics of the material and do not constitute manufacturing defects.
        </p>
        <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem' }}>Pricing &amp; Availability</h3>
        <p>
          All prices are listed in USD. We reserve the right to correct pricing errors and cancel orders resulting from inadvertent typographical mistakes.
        </p>
      </div>
    </div>
  );
}
