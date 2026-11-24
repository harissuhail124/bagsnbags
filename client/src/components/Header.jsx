import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Search, User, ShoppingBag, Menu, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './Header.css';

export default function Header() {
  const { totalItemCount, openDrawer } = useCart();
  const { user, isAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <>
      {/* Announcement Bar */}
      <div className="announcement-bar">
        Complimentary standard shipping on orders over PKR 150 &middot; Handcrafted in small editions
      </div>

      <header className="site-header">
        <div className="container header-container">
          <div className="header-left">
            <button
              className="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>

            <Link to="/" className="logo">
              Bags'n'Bags
            </Link>

            <nav className="site-nav">
              <NavLink to="/shop" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                Shop
              </NavLink>
              <NavLink to="/shop?category=backpacks" className="nav-link">
                Backpacks
              </NavLink>
              <NavLink to="/shop?category=handbags" className="nav-link">
                Handbags
              </NavLink>
              <NavLink to="/shop?category=totes" className="nav-link">
                Totes
              </NavLink>
              <NavLink to="/shop?category=accessories" className="nav-link">
                Wallets
              </NavLink>
              <NavLink to="/about" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                About
              </NavLink>
            </nav>
          </div>

          <div className="header-actions">
            <button
              className="action-btn"
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label="Toggle search"
            >
              <Search size={19} />
            </button>

            {isAdmin && (
              <Link to="/admin" className="badge" style={{ textDecoration: 'none', margin: '0 4px' }}>
                Admin
              </Link>
            )}

            <Link
              to={user ? "/account" : "/login"}
              className="action-btn"
              aria-label={user ? "My Account" : "Sign In"}
            >
              <User size={19} />
            </Link>

            <button
              className="action-btn"
              onClick={openDrawer}
              aria-label={`Shopping bag with ${totalItemCount} items`}
            >
              <ShoppingBag size={19} />
              {totalItemCount > 0 && <span className="cart-badge">{totalItemCount}</span>}
            </button>
          </div>
        </div>

        {/* Search Bar Dropdown */}
        <div className={`search-bar-wrap ${searchOpen ? 'open' : ''}`}>
          <div className="container">
            <form onSubmit={handleSearchSubmit} className="search-input-box">
              <Search size={18} color="var(--color-secondary-text)" />
              <input
                type="text"
                placeholder="Search bags by name, material, or silhouette..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus={searchOpen}
              />
              <button type="button" onClick={() => setSearchOpen(false)} aria-label="Close search">
                <X size={18} />
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Mobile Nav Overlay & Panel */}
      <div
        className={`mobile-nav-overlay ${mobileMenuOpen ? 'open' : ''}`}
        onClick={() => setMobileMenuOpen(false)}
      />
      <aside className={`mobile-nav-panel ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-nav-header">
          <span className="logo" style={{ fontSize: '1.25rem' }}>Bags'n'Bags</span>
          <button onClick={() => setMobileMenuOpen(false)} aria-label="Close menu">
            <X size={20} />
          </button>
        </div>

        <nav className="mobile-nav-links">
          <Link to="/shop" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>All Bags</Link>
          <Link to="/shop?category=backpacks" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>Backpacks</Link>
          <Link to="/shop?category=handbags" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>Handbags</Link>
          <Link to="/shop?category=totes" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>Totes</Link>
          <Link to="/shop?category=accessories" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>Wallets</Link>
          <Link to="/about" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>About Our Craft</Link>
          <Link to="/contact" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
          {user ? (
            <Link to="/account" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>Account Profile</Link>
          ) : (
            <Link to="/login" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>Sign In / Register</Link>
          )}
          {isAdmin && (
            <Link to="/admin" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)} style={{ color: 'var(--color-accent)' }}>
              Admin Panel
            </Link>
          )}
        </nav>
      </aside>
    </>
  );
}
