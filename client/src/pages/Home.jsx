import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import './Home.css';

export default function Home() {
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNewArrivals();
  }, []);

  const fetchNewArrivals = async () => {
    try {
      const res = await axios.get('/api/products?limit=8&featured=true');
      if (res.data?.data && res.data.data.length > 0) {
        setNewArrivals(res.data.data);
      } else {
        // Fallback to standard 8 products
        const fallback = await axios.get('/api/products?limit=8');
        setNewArrivals(fallback.data?.data || []);
      }
    } catch (e) {
      console.error('Failed to load new arrivals', e);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    {
      title: "Backpacks",
      slug: "backpacks",
      subtitle: "Waxed canvas & bridle leather",
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=900&h=1125&fit=crop&q=80",
    },
    {
      title: "Handbags",
      slug: "handbags",
      subtitle: "Full-grain calf & box leather",
      image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=900&h=1125&fit=crop&q=80",
    },
    {
      title: "Totes",
      slug: "totes",
      subtitle: "Heavy duck canvas & brass",
      image: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=900&h=1125&fit=crop&q=80",
    },
    {
      title: "Wallets",
      slug: "accessories",
      subtitle: "Bifolds, card sleeves & key pouches",
      image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=900&h=1125&fit=crop&q=80",
    },
  ];

  return (
    <div className="home-page">
      {/* 1. Hero Section */}
      <section className="hero-section">
        <img
          src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=1600&fit=crop&q=85"
          alt="Artisan crafted leather travel bag on wooden bench"
          className="hero-bg-img"
          loading="eager"
        />
        <div className="container">
          <div className="hero-content">
            <span className="hero-eyebrow">Autumn Edition &middot; 2026 Collection</span>
            <h1 className="hero-title">Waxed canvas, full-grain leather straps. Made to be carried every day.</h1>
            <p className="hero-description">
              Restrained utilitarian carry goods constructed in small workshops. Shaped by traditional saddle-stitching, solid brass fittings, and time.
            </p>
            <Link to="/shop" className="btn btn-primary">
              Explore the Collection
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Category Tiles (4) */}
      <section className="categories-section">
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title">Curated Silhouettes</h2>
              <p className="section-subtitle">Purpose-built bags designed for transit, study, and travel.</p>
            </div>
            <Link to="/shop" className="section-link">
              View All Goods
            </Link>
          </div>

          <div className="category-tiles-grid">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                to={`/shop?category=${cat.slug}`}
                className="category-tile-card"
              >
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="category-tile-img"
                  loading="lazy"
                  width="450"
                  height="562"
                />
                <div className="category-tile-overlay"></div>
                <div className="category-tile-info">
                  <h3 className="category-tile-title">{cat.title}</h3>
                  <span className="category-tile-count">{cat.subtitle}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. New Arrivals Row (8 items) */}
      <section className="new-arrivals-section">
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title">New Editions</h2>
              <p className="section-subtitle">Freshly assembled pieces available in limited workshop quantities.</p>
            </div>
            <Link to="/shop?sort=newest" className="section-link">
              Browse Newest
            </Link>
          </div>

          {loading ? (
            <div className="product-row-grid">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="aspect-4-5 skeleton"></div>
              ))}
            </div>
          ) : (
            <div className="product-row-grid">
              {newArrivals.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 4. Editorial Split Section */}
      <section className="editorial-split-section">
        <div className="container">
          <div className="editorial-grid">
            <div className="editorial-image-frame">
              <img
                src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=900&h=1125&fit=crop&q=80"
                alt="Leather craftsperson beveling straps at cutting table"
                loading="lazy"
                width="600"
                height="750"
              />
            </div>

            <div className="editorial-text-col">
              <span className="editorial-kicker">Materials &amp; Provenance</span>
              <h2 className="editorial-heading">Nothing synthetic against your shoulder.</h2>
              <p className="editorial-paragraph">
                Every skin we cut is sourced from heritage tanneries practicing vegetable tanning using mimosa, chestnut, and quebracho barks. We avoid chrome salts and synthetic topcoats so the leather breathes and patinas honestly.
              </p>
              <p className="editorial-paragraph">
                Our weatherproofing comes from paraffin and beeswax applied to 18oz army duck cotton. If scratched, a quick warm breath or friction from your fingertips restores the surface.
              </p>

              <div className="editorial-points">
                <div className="editorial-point-item">
                  <div className="editorial-point-dot"></div>
                  <span>Solid sand-cast brass hardware that never chips or flakes silver.</span>
                </div>
                <div className="editorial-point-item">
                  <div className="editorial-point-dot"></div>
                  <span>Continuous perimeter saddle-stitching with bonded poly-core thread.</span>
                </div>
                <div className="editorial-point-item">
                  <div className="editorial-point-dot"></div>
                  <span>Internal device pockets lined with virgin German wool felt.</span>
                </div>
              </div>

              <div style={{ marginTop: 'var(--space-3)' }}>
                <Link to="/about" className="btn btn-outline">
                  Read Atelier Journal
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Customer Reviews Strip */}
      <section className="reviews-strip-section">
        <div className="container">
          <div className="section-header" style={{ marginBottom: 'var(--space-4)' }}>
            <div>
              <h2 className="section-title">Verified Field Notes</h2>
              <p className="section-subtitle">Real feedback from clients who carry our bags daily.</p>
            </div>
          </div>

          <div className="reviews-strip-grid">
            <div className="review-strip-card">
              <p className="review-strip-quote">
                "The waxed canvas has a pleasant, understated hand feel. Fits my 15-inch laptop securely with room for a sweater and sketchbook."
              </p>
              <div className="review-strip-author">
                <span className="review-strip-name">Julian Vance &mdash; Zurich</span>
                <span className="review-strip-product">Atelier Field Backpack</span>
              </div>
            </div>

            <div className="review-strip-card">
              <p className="review-strip-quote">
                "After four months of daily cycling in wet autumn weather, the leather has developed a handsome glow and no rain seeped through."
              </p>
              <div className="review-strip-author">
                <span className="review-strip-name">Elena Rostova &mdash; Stockholm</span>
                <span className="review-strip-product">Garrison Roll-Top Rucksack</span>
              </div>
            </div>

            <div className="review-strip-card">
              <p className="review-strip-quote">
                "Solid brass hardware has real weight to it. No flashy logos, just honest materials assembled with care."
              </p>
              <div className="review-strip-author">
                <span className="review-strip-name">Marcus Chen &mdash; Edinburgh</span>
                <span className="review-strip-product">Archivist Leather Briefcase</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
