import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="container" style={{ textAlign: 'center', padding: '100px 0' }}>
      <span className="badge" style={{ marginBottom: '8px' }}>404 &middot; Not Found</span>
      <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.8rem', marginTop: '6px', marginBottom: '12px' }}>
        The Path Does Not Exist
      </h1>
      <p style={{ color: 'var(--color-secondary-text)', maxWidth: '440px', margin: '0 auto 28px' }}>
        The archive page or bag silhouette you requested could not be located.
      </p>
      <Link to="/" className="btn btn-primary">
        Return to Home
      </Link>
    </div>
  );
}
