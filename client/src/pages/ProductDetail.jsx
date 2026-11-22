import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Star, ChevronDown, ChevronUp, Plus, Minus, Check, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';
import toast from 'react-hot-toast';
import './ProductDetail.css';

export default function ProductDetail() {
  const { slug } = useParams();
  const { addItem } = useCart();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [loading, setLoading] = useState(true);

  // Accordion states
  const [openAccordion, setOpenAccordion] = useState('details');

  // Review form state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    fetchProductDetails();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  const fetchProductDetails = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/products/${slug}`);
      setProduct(res.data.product);
      setRelated(res.data.related || []);
      setSelectedImageIndex(0);

      // Fetch reviews
      if (res.data.product?._id) {
        fetchReviews(res.data.product._id);
      }
    } catch (e) {
      console.error('Failed to load product details', e);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async (productId) => {
    try {
      const res = await axios.get(`/api/reviews/product/${productId}`);
      setReviews(res.data?.reviews || []);
    } catch (e) {
      // fallback
    }
  };

  const handleAddToCart = () => {
    if (!product || product.stock <= 0) return;
    addItem(product, quantity, selectedVariant || product.color || 'Standard');
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast('Please sign in to submit a review.', { icon: '•' });
      return;
    }
    setSubmittingReview(true);
    try {
      const res = await axios.post(
        `/api/reviews/product/${product._id}`,
        {
          rating: reviewRating,
          title: reviewTitle,
          comment: reviewComment,
        },
        { withCredentials: true }
      );
      toast.success('Thank you. Your review has been published.');
      setReviews([res.data.review, ...reviews]);
      setShowReviewForm(false);
      setReviewTitle('');
      setReviewComment('');
    } catch (err) {
      const msg = err.response?.data?.error?.message || 'Could not submit review. Verified purchase is required.';
      toast.error(msg);
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="container product-detail-page">
        <div className="product-detail-grid">
          <div className="aspect-4-5 skeleton"></div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ height: '32px', width: '60%' }} className="skeleton"></div>
            <div style={{ height: '24px', width: '30%' }} className="skeleton"></div>
            <div style={{ height: '120px' }} className="skeleton"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container product-detail-page" style={{ textAlign: 'center', padding: '80px 0' }}>
        <h2>Bag Not Found</h2>
        <p>The piece you are looking for is either archived or no longer exists.</p>
        <Link to="/shop" className="btn btn-outline" style={{ marginTop: '20px' }}>
          Return to Collection
        </Link>
      </div>
    );
  }

  const images = product.images?.length > 0
    ? product.images
    : ['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=900&h=1125&fit=crop'];

  const isLowStock = product.stock > 0 && product.stock <= 5;
  const isOutOfStock = product.stock <= 0;

  return (
    <div className="container product-detail-page">
      {/* Breadcrumbs */}
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <span>/</span>
        <Link to="/shop">Shop</Link>
        <span>/</span>
        {product.category && (
          <>
            <Link to={`/shop?category=${product.category.slug}`}>{product.category.name}</Link>
            <span>/</span>
          </>
        )}
        <span style={{ color: 'var(--color-primary-text)' }}>{product.title}</span>
      </nav>

      {/* Main Grid */}
      <div className="product-detail-grid">
        {/* Gallery */}
        <div className="gallery-container">
          {images.length > 1 && (
            <div className="gallery-thumbs">
              {images.map((imgUrl, idx) => (
                <button
                  key={idx}
                  className={`gallery-thumb-btn ${idx === selectedImageIndex ? 'active' : ''}`}
                  onClick={() => setSelectedImageIndex(idx)}
                  aria-label={`View photo ${idx + 1}`}
                >
                  <img src={imgUrl} alt={`${product.title} thumb ${idx + 1}`} />
                </button>
              ))}
            </div>
          )}

          <div className="gallery-main-frame">
            <img
              src={images[selectedImageIndex]}
              alt={product.title}
              className="gallery-main-img"
            />
          </div>
        </div>

        {/* Product Details Column */}
        <div className="product-info-col">
          <span className="pdp-category">{product.category?.name || 'Handcrafted'}</span>
          <h1 className="pdp-title">{product.title}</h1>

          <div className="pdp-price-row">
            <span className="pdp-price">${product.price.toFixed(2)}</span>
            {isOutOfStock ? (
              <span className="badge badge-out-of-stock">Sold Out</span>
            ) : isLowStock ? (
              <span className="badge badge-low-stock">Only {product.stock} Left</span>
            ) : (
              <span className="badge badge-success">In Stock</span>
            )}

            {product.rating > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem' }}>
                <Star size={13} fill="#8A6F55" color="#8A6F55" />
                <span>{product.rating.toFixed(1)}</span>
                <span style={{ color: 'var(--color-secondary-text)' }}>({reviews.length} reviews)</span>
              </div>
            )}
          </div>

          <p className="pdp-description">{product.description}</p>

          {/* Specs Strip */}
          <div className="pdp-specs-strip">
            {product.material && (
              <div className="pdp-spec-item">
                <span>Material: </span>
                <strong>{product.material}</strong>
              </div>
            )}
            {product.dimensions && (
              <div className="pdp-spec-item">
                <span>Dimensions: </span>
                <strong>{product.dimensions}</strong>
              </div>
            )}
            {product.capacity && (
              <div className="pdp-spec-item">
                <span>Capacity: </span>
                <strong>{product.capacity}</strong>
              </div>
            )}
            {product.weight && (
              <div className="pdp-spec-item">
                <span>Weight: </span>
                <strong>{product.weight}</strong>
              </div>
            )}
          </div>

          {/* Add to Cart Actions */}
          <div className="pdp-actions-row">
            <div className="pdp-qty-picker">
              <button
                className="pdp-qty-btn"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                aria-label="Decrease quantity"
              >
                <Minus size={14} />
              </button>
              <span className="pdp-qty-num">{quantity}</span>
              <button
                className="pdp-qty-btn"
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                disabled={quantity >= product.stock}
                aria-label="Increase quantity"
              >
                <Plus size={14} />
              </button>
            </div>

            <button
              className="btn btn-primary pdp-add-btn"
              onClick={handleAddToCart}
              disabled={isOutOfStock}
            >
              {isOutOfStock ? 'Sold Out' : 'Add to Bag'}
            </button>
          </div>

          {/* Accordions */}
          <div className="pdp-accordions">
            {/* 1. Details */}
            <div className="pdp-accordion-item">
              <button
                className="pdp-accordion-trigger"
                onClick={() => setOpenAccordion(openAccordion === 'details' ? '' : 'details')}
              >
                <span>Construction Details</span>
                {openAccordion === 'details' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              {openAccordion === 'details' && (
                <div className="pdp-accordion-content">
                  {product.details?.length > 0 ? (
                    <ul className="pdp-details-list">
                      {product.details.map((detail, idx) => (
                        <li key={idx}>{detail}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>Hand-cut and assembled using heavy thread, beveled edges, and cast brass rivets.</p>
                  )}
                </div>
              )}
            </div>

            {/* 2. Materials & Care */}
            <div className="pdp-accordion-item">
              <button
                className="pdp-accordion-trigger"
                onClick={() => setOpenAccordion(openAccordion === 'care' ? '' : 'care')}
              >
                <span>Materials &amp; Care</span>
                {openAccordion === 'care' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              {openAccordion === 'care' && (
                <div className="pdp-accordion-content">
                  <p>{product.careInstructions || 'Wipe gently with a clean, slightly damp cloth. Avoid submerging in water or leaving on direct radiators. Re-wax canvas every few seasons.'}</p>
                </div>
              )}
            </div>

            {/* 3. Shipping & Returns */}
            <div className="pdp-accordion-item">
              <button
                className="pdp-accordion-trigger"
                onClick={() => setOpenAccordion(openAccordion === 'shipping' ? '' : 'shipping')}
              >
                <span>Shipping &amp; Returns</span>
                {openAccordion === 'shipping' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              {openAccordion === 'shipping' && (
                <div className="pdp-accordion-content">
                  <p>
                    Complimentary standard shipping on all orders over $150. Delivery within 3&ndash;5 business days. Each bag comes protected inside an unbleached organic linen dust cover. We accept returns within 30 days of arrival in original condition.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <section className="pdp-reviews-section">
        <div className="reviews-summary-bar">
          <div>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem' }}>Client Field Reviews</h3>
            <p style={{ fontSize: '0.88rem' }}>Authentic reviews from verified owners of this bag.</p>
          </div>

          <button
            className="btn btn-outline btn-sm"
            onClick={() => setShowReviewForm(!showReviewForm)}
          >
            {showReviewForm ? 'Close Form' : 'Write a Review'}
          </button>
        </div>

        {/* Review Form */}
        {showReviewForm && (
          <div className="review-form-wrap">
            <h4 style={{ fontFamily: 'var(--font-serif)' }}>Share your field experience</h4>
            <form onSubmit={handleReviewSubmit} className="review-form-grid">
              <div>
                <label style={{ fontSize: '0.8rem', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                  Rating
                </label>
                <select
                  value={reviewRating}
                  onChange={(e) => setReviewRating(Number(e.target.value))}
                  style={{ width: '100%', maxWidth: '200px' }}
                >
                  <option value={5}>5 Stars - Outstanding</option>
                  <option value={4}>4 Stars - Very Good</option>
                  <option value={3}>3 Stars - Satisfactory</option>
                  <option value={2}>2 Stars - Needs Improvement</option>
                  <option value={1}>1 Star - Dissatisfied</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                  Headline
                </label>
                <input
                  type="text"
                  placeholder="e.g. Excellent daily backpack"
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  style={{ width: '100%' }}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                  Review
                </label>
                <textarea
                  rows="4"
                  placeholder="Tell us about the materials, fit, and how it performs in daily use..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  style={{ width: '100%' }}
                  required
                ></textarea>
              </div>

              <div>
                <button type="submit" className="btn btn-primary" disabled={submittingReview}>
                  {submittingReview ? 'Submitting...' : 'Submit Review'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Reviews List */}
        <div className="reviews-list">
          {reviews.length === 0 ? (
            <p style={{ color: 'var(--color-secondary-text)', fontStyle: 'italic', padding: '20px 0' }}>
              No reviews recorded for this edition yet.
            </p>
          ) : (
            reviews.map((rev) => (
              <div key={rev._id} className="review-item">
                <div className="review-item-header">
                  <div>
                    <span className="review-author-name">{rev.user?.name || 'Verified Client'}</span>
                    {rev.verifiedPurchase && (
                      <span className="review-verified-badge">&#10003; Verified Purchase</span>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '2px' }}>
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} size={12} fill="#8A6F55" color="#8A6F55" />
                    ))}
                  </div>
                </div>
                {rev.title && <h5 className="review-item-title">{rev.title}</h5>}
                <p className="review-item-comment">{rev.comment}</p>
              </div>
            ))
          )}
        </div>
      </section>

      {/* "You may also like" related row */}
      {related.length > 0 && (
        <section style={{ marginTop: 'var(--space-10)', borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-8)' }}>
          <div className="section-header">
            <div>
              <h2 className="section-title">Complementary Pieces</h2>
              <p className="section-subtitle">Related carry items from the same atelier line.</p>
            </div>
          </div>
          <div className="product-row-grid">
            {related.map((relProd) => (
              <ProductCard key={relProd._id} product={relProd} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
