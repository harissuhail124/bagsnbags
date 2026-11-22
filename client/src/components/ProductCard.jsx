import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './ProductCard.css';

export default function ProductCard({ product, inWishlist = false, onWishlistChange }) {
  const { user } = useAuth();
  const [wishlisted, setWishlisted] = useState(inWishlist);
  const [toggling, setToggling] = useState(false);

  const primaryImage = product.images?.[0] || 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=900&h=1125&fit=crop';
  const secondaryImage = product.images?.[1] || primaryImage;

  const handleToggleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast('Please sign in to save items to your wishlist.', { icon: '•' });
      return;
    }
    setToggling(true);
    try {
      const res = await axios.post('/api/wishlist/toggle', { productId: product._id }, { withCredentials: true });
      setWishlisted(res.data.inWishlist);
      if (res.data.inWishlist) {
        toast.success(`Saved ${product.title} to wishlist.`);
      } else {
        toast('Removed from wishlist.', { icon: '•' });
      }
      if (onWishlistChange) onWishlistChange(product._id, res.data.inWishlist);
    } catch (err) {
      toast.error('Could not update wishlist.');
    } finally {
      setToggling(false);
    }
  };

  const isLowStock = product.stock > 0 && product.stock <= 5;
  const isOutOfStock = product.stock <= 0;

  return (
    <div className="product-card">
      <Link to={`/product/${product.slug}`} className="product-card-image-wrap">
        <img
          src={primaryImage}
          alt={product.title}
          className="product-img-primary"
          loading="lazy"
          width="450"
          height="562"
        />
        <img
          src={secondaryImage}
          alt={`${product.title} detail`}
          className="product-img-secondary"
          loading="lazy"
          width="450"
          height="562"
        />

        {isOutOfStock ? (
          <span className="product-card-badge" style={{ color: 'var(--color-error)' }}>Sold Out</span>
        ) : isLowStock ? (
          <span className="product-card-badge low-stock">Only {product.stock} Left</span>
        ) : product.featured ? (
          <span className="product-card-badge">Edition</span>
        ) : null}

        <button
          className={`product-wishlist-btn ${wishlisted ? 'active' : ''}`}
          onClick={handleToggleWishlist}
          disabled={toggling}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          <Heart size={15} fill={wishlisted ? 'currentColor' : 'none'} />
        </button>
      </Link>

      <div className="product-card-info">
        <span className="product-card-category">{product.category?.name || 'Carryall'}</span>
        <Link to={`/product/${product.slug}`} className="product-card-title">
          {product.title}
        </Link>
        <span className="product-card-price">${product.price.toFixed(2)}</span>
        {product.rating > 0 && (
          <div className="product-card-rating">
            <Star size={11} fill="#8A6F55" color="#8A6F55" />
            <span>{product.rating.toFixed(1)}</span>
            {product.numReviews > 0 && <span>({product.numReviews})</span>}
          </div>
        )}
      </div>
    </div>
  );
}
