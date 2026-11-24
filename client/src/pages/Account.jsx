import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import toast from 'react-hot-toast';
import './Account.css';

export default function Account() {
  const { user, logout, isAdmin } = useAuth();
  const { addItem } = useCart();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'wishlist' | 'profile'
  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchAccountData();
  }, [user]);

  const fetchAccountData = async () => {
    setLoading(true);
    try {
      const [ordersRes, wishlistRes] = await Promise.all([
        axios.get('/api/orders/my-orders', { withCredentials: true }),
        axios.get('/api/wishlist', { withCredentials: true }),
      ]);
      setOrders(ordersRes.data?.orders || []);
      setWishlist(wishlistRes.data?.wishlist || []);
    } catch (e) {
      console.error('Error loading account details', e);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    toast('Signed out from atelier account.', { icon: '•' });
    navigate('/');
  };

  if (!user) return null;

  return (
    <div className="container account-page">
      <div className="account-header-box">
        <div>
          <span className="badge" style={{ marginBottom: '6px' }}>Client Profile</span>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem' }}>{user.name}</h1>
          <p style={{ color: 'var(--color-secondary-text)', fontSize: '0.88rem' }}>{user.email}</p>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {isAdmin && (
            <Link to="/admin" className="btn btn-outline btn-sm">
              Admin Portal
            </Link>
          )}
          <button className="btn btn-outline btn-sm" onClick={handleLogout}>
            Sign Out
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="account-tabs">
        <button
          className={`account-tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          Order History ({orders.length})
        </button>
        <button
          className={`account-tab-btn ${activeTab === 'wishlist' ? 'active' : ''}`}
          onClick={() => setActiveTab('wishlist')}
        >
          Saved Wishlist ({wishlist.length})
        </button>
        <button
          className={`account-tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          Details &amp; Security
        </button>
      </div>

      {/* Tab 1: Orders */}
      {activeTab === 'orders' && (
        <div>
          {loading ? (
            <p>Loading order archive...</p>
          ) : orders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)' }}>No orders on record</h3>
              <p style={{ color: 'var(--color-secondary-text)', marginBottom: '20px' }}>
                You have not placed any orders with our workshop yet.
              </p>
              <Link to="/shop" className="btn btn-primary">
                Browse Collection
              </Link>
            </div>
          ) : (
            <div className="orders-history-list">
              {orders.map((ord) => (
                <div key={ord._id} className="order-history-card">
                  <div className="order-history-top">
                    <div>
                      <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: 'var(--color-secondary-text)' }}>
                        Placed {new Date(ord.createdAt).toLocaleDateString()} &middot;
                      </span>{' '}
                      <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{ord.orderNumber}</span>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span className={`badge ${ord.paymentStatus === 'paid' ? 'badge-success' : ''}`}>
                        Payment: {ord.paymentStatus}
                      </span>
                      <span className="badge">
                        Status: {ord.status}
                      </span>
                    </div>
                  </div>

                  <div className="order-history-items">
                    {ord.items.map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div
                          style={{
                            width: '50px',
                            aspectRatio: '4 / 5',
                            backgroundColor: 'var(--color-neutral-muted)',
                            borderRadius: 'var(--radius-sm)',
                            overflow: 'hidden',
                          }}
                        >
                          {item.image && (
                            <img src={item.image} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          )}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 500, fontSize: '0.9rem' }}>{item.title}</div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--color-secondary-text)' }}>
                            Qty: {item.quantity} &middot; PKR {item.price.toLocaleString()}
                          </div>
                        </div>
                        <div style={{ fontWeight: 500 }}>
                          PKR {(item.price * item.quantity).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div
                    style={{
                      borderTop: '1px solid var(--color-neutral-muted)',
                      marginTop: '14px',
                      paddingTop: '12px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div style={{ fontSize: '0.85rem' }}>
                      {ord.trackingNumber ? (
                        <span>Carrier Tracking: <strong>{ord.trackingNumber}</strong> ({ord.trackingCarrier})</span>
                      ) : (
                        <span style={{ color: 'var(--color-secondary-text)' }}>Awaiting carrier pickup</span>
                      )}
                    </div>
                    <div style={{ fontWeight: 600, fontSize: '1rem' }}>
                      Total: PKR {ord.totalAmount.toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Wishlist */}
      {activeTab === 'wishlist' && (
        <div>
          {wishlist.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)' }}>Your wishlist is empty</h3>
              <p style={{ color: 'var(--color-secondary-text)', marginBottom: '20px' }}>
                Tap the heart on any product to save it for later consideration.
              </p>
              <Link to="/shop" className="btn btn-outline">
                Explore Bags
              </Link>
            </div>
          ) : (
            <div className="products-grid">
              {wishlist.map((p) => (
                <ProductCard
                  key={p._id}
                  product={p}
                  inWishlist={true}
                  onWishlistChange={(id, inList) => {
                    if (!inList) {
                      setWishlist(wishlist.filter((item) => item._id !== id));
                    }
                  }}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Profile Details */}
      {activeTab === 'profile' && (
        <div
          style={{
            maxWidth: '500px',
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-sm)',
            padding: 'var(--space-5)',
          }}
        >
          <h3 style={{ fontFamily: 'var(--font-serif)', marginBottom: 'var(--space-3)' }}>Profile Record</h3>
          <p style={{ fontSize: '0.88rem', color: 'var(--color-secondary-text)', marginBottom: '16px' }}>
            Registered client of Bags'n'Bags atelier. Your details are secured with bcrypt hashing and encrypted sessions.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem' }}>
            <div>
              <span style={{ color: 'var(--color-secondary-text)', fontSize: '0.78rem', textTransform: 'uppercase', display: 'block' }}>Name</span>
              <strong>{user.name}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--color-secondary-text)', fontSize: '0.78rem', textTransform: 'uppercase', display: 'block' }}>Email</span>
              <strong>{user.email}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--color-secondary-text)', fontSize: '0.78rem', textTransform: 'uppercase', display: 'block' }}>Account Type</span>
              <strong>{user.role === 'admin' ? 'Atelier Director (Admin)' : 'Client Member'}</strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
