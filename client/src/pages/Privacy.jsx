import React from 'react';

export default function Privacy() {
  return (
    <div className="container" style={{ padding: 'var(--space-8) 0 var(--space-12)', maxWidth: '780px', lineHeight: 1.7 }}>
      <span className="badge" style={{ marginBottom: '8px' }}>Legal</span>
      <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.4rem', marginBottom: 'var(--space-4)' }}>
        Privacy Policy
      </h1>
      <p style={{ color: 'var(--color-secondary-text)', marginBottom: 'var(--space-4)' }}>
        Last updated: November 2026
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', color: 'var(--color-primary-text)' }}>
        <p>
          At Bags'n'Bags, we value your privacy and practice data minimization. We only collect the minimal personal information necessary to fulfill orders, facilitate customer communication, and deliver our optional newsletter.
        </p>
        <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem' }}>Information Collection</h3>
        <p>
          When placing an order or registering an atelier account, we collect your name, shipping address, email address, and order items. Payment card details are handled directly by Stripe and are never stored on our local servers.
        </p>
        <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem' }}>Cookies &amp; Security</h3>
        <p>
          Authentication sessions use secure, httpOnly cookies with strict expiration policies. We do not sell or trade your personal information to third-party ad networks.
        </p>
      </div>
    </div>
  );
}
