import React from 'react';
import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className="container" style={{ padding: 'var(--space-8) 0 var(--space-12)', maxWidth: '840px' }}>
      <span className="badge" style={{ marginBottom: '8px' }}>Atelier Notes</span>
      <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', marginBottom: 'var(--space-4)' }}>
        Built for Decades of Daily Transit
      </h1>

      <div style={{ aspectRatio: '16 / 9', borderRadius: 'var(--radius-sm)', overflow: 'hidden', marginBottom: 'var(--space-6)', backgroundColor: 'var(--color-neutral-muted)' }}>
        <img
          src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=1400&fit=crop&q=80"
          alt="Cutting bench with natural leather and waxed canvas"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', fontSize: '1rem', lineHeight: 1.8, color: 'var(--color-primary-text)' }}>
        <p>
          Bags'n'Bags was established on a simple premise: everyday carry gear should be constructed from raw, durable, unpretentious materials that improve with wear rather than delaminate into landfills.
        </p>

        <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', marginTop: 'var(--space-2)' }}>
          Vegetable-Tanned Leathers
        </h3>
        <p>
          Our leathers are exclusively vegetable-tanned in traditional Italian pit drums using oak, chestnut, and mimosa bark tannins. This process takes up to 40 days. Unlike chrome-tanned commercial leathers coated with polyurethane plastic, vegetable-tanned hide absorbs natural oils from your palms and the sun, developing a rich caramel patina unique to your voyages.
        </p>

        <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', marginTop: 'var(--space-2)' }}>
          Paraffin Waxed Duck Cotton
        </h3>
        <p>
          We source our 18oz and 24oz duck canvas from mills that continue to impregnate dense cotton yarns with natural beeswax and paraffin. The result is a heavy, water-repellent barrier that can be easily renewed season after season with a bar of wax and a warm iron.
        </p>

        <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', marginTop: 'var(--space-2)' }}>
          Solid Sand-Cast Brass
        </h3>
        <p>
          Every buckle, D-ring, swivel snap, and rivet is cast from solid brass. They contain no zinc alloy pot metal and no plating. They will never peel, rust, or crack under winter frost.
        </p>

        <div style={{ marginTop: 'var(--space-4)', borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-4)' }}>
          <Link to="/shop" className="btn btn-primary">
            Explore Current Editions
          </Link>
        </div>
      </div>
    </div>
  );
}
