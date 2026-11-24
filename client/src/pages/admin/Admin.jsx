import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import {
  Package,
  Layers,
  ShoppingBag,
  Users,
  Tag,
  Star,
  Mail,
  Plus,
  Trash2,
  Edit,
  X,
  UploadCloud,
  Check,
  ChevronLeft,
  ChevronRight,
  ArrowUp,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import './Admin.css';

export default function Admin() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('overview'); // overview | products | categories | orders | customers | promos | reviews | inquiries

  // Data states
  const [dashboardData, setDashboardData] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [promos, setPromos] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(false);

  // Modals
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [promoModalOpen, setPromoModalOpen] = useState(false);
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Product form
  const [prodForm, setProdForm] = useState({
    title: '',
    description: '',
    price: '',
    categoryId: '',
    stock: '',
    material: '',
    color: '',
    dimensions: '',
    capacity: '',
    weight: '',
    featured: false,
    images: [],
  });
  const [uploadingImages, setUploadingImages] = useState(false);
  const [imageUrlInput, setImageUrlInput] = useState('');

  // Category form
  const [catForm, setCatForm] = useState({ name: '', imageUrl: '', description: '' });

  // Promo form
  const [promoForm, setPromoForm] = useState({
    code: '',
    discountType: 'percentage',
    discountValue: '',
    usageLimit: '',
    expiresAt: '',
  });

  // Order status update form
  const [orderStatusForm, setOrderStatusForm] = useState({
    status: '',
    paymentStatus: '',
    trackingCarrier: '',
    trackingNumber: '',
  });

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      toast.error('Admin authorization required.');
      navigate('/login');
    }
  }, [isAdmin, authLoading]);

  useEffect(() => {
    if (isAdmin) {
      loadTabData(activeTab);
    }
  }, [activeTab, isAdmin]);

  const loadTabData = async (tab) => {
    setLoading(true);
    try {
      if (tab === 'overview') {
        const res = await axios.get('/api/admin/dashboard', { withCredentials: true });
        setDashboardData(res.data);
      } else if (tab === 'products') {
        const [prodRes, catRes] = await Promise.all([
          axios.get('/api/products?limit=100'),
          axios.get('/api/categories'),
        ]);
        setProducts(prodRes.data?.data || []);
        setCategories(catRes.data?.categories || []);
      } else if (tab === 'categories') {
        const res = await axios.get('/api/categories');
        setCategories(res.data?.categories || []);
      } else if (tab === 'orders') {
        const res = await axios.get('/api/orders?limit=50', { withCredentials: true });
        setOrders(res.data?.orders || []);
      } else if (tab === 'customers') {
        const res = await axios.get('/api/admin/customers', { withCredentials: true });
        setCustomers(res.data?.customers || []);
      } else if (tab === 'promos') {
        const res = await axios.get('/api/promo-codes', { withCredentials: true });
        setPromos(res.data?.promoCodes || []);
      } else if (tab === 'reviews') {
        const res = await axios.get('/api/reviews/admin', { withCredentials: true });
        setReviews(res.data?.reviews || []);
      } else if (tab === 'inquiries') {
        const res = await axios.get('/api/contact/admin', { withCredentials: true });
        setInquiries(res.data?.messages || []);
      }
    } catch (e) {
      console.error('Error fetching tab data', e);
    } finally {
      setLoading(false);
    }
  };

  // Image upload
  const handleImageFileChange = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const data = new FormData();
    for (let i = 0; i < files.length; i++) {
      data.append('images', files[i]);
    }

    setUploadingImages(true);
    try {
      const res = await axios.post('/api/admin/upload', data, {
        withCredentials: true,
      });
      const newUrls = res.data?.urls || [];
      if (newUrls.length > 0) {
        setProdForm((prev) => ({
          ...prev,
          images: [...prev.images, ...newUrls],
        }));
        toast.success(`${newUrls.length} ${newUrls.length === 1 ? 'image' : 'images'} uploaded successfully.`);
      }
    } catch (err) {
      const msg = err.response?.data?.error?.message || 'Image upload failed. Please verify the file is a valid image.';
      toast.error(msg);
    } finally {
      setUploadingImages(false);
      e.target.value = '';
    }
  };

  const handleAddImageUrl = (e) => {
    e.preventDefault();
    if (!imageUrlInput.trim()) return;
    setProdForm((prev) => ({
      ...prev,
      images: [...prev.images, imageUrlInput.trim()],
    }));
    setImageUrlInput('');
    toast.success('Image URL added.');
  };

  // Reorder product images
  const moveImage = (index, targetIndex) => {
    if (targetIndex < 0 || targetIndex >= prodForm.images.length) return;
    setProdForm((prev) => {
      const nextImages = [...prev.images];
      const [moved] = nextImages.splice(index, 1);
      nextImages.splice(targetIndex, 0, moved);
      return { ...prev, images: nextImages };
    });
  };

  const setAsCover = (index) => {
    if (index === 0) return;
    setProdForm((prev) => {
      const nextImages = [...prev.images];
      const [cover] = nextImages.splice(index, 1);
      nextImages.unshift(cover);
      return { ...prev, images: nextImages };
    });
    toast.success('Moved to #1 (Cover image).');
  };

  // Save product
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...prodForm,
        price: Number(prodForm.price),
        stock: Number(prodForm.stock),
      };

      if (editingProduct) {
        await axios.put(`/api/products/${editingProduct._id}`, payload, { withCredentials: true });
        toast.success('Product updated.');
      } else {
        await axios.post('/api/products', payload, { withCredentials: true });
        toast.success('New product created.');
      }
      setProductModalOpen(false);
      setEditingProduct(null);
      loadTabData('products');
    } catch (err) {
      const msg = err.response?.data?.error?.message || 'Error saving product.';
      toast.error(msg);
    }
  };

  // Delete product
  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await axios.delete(`/api/products/${id}`, { withCredentials: true });
      toast.success('Product deleted.');
      setProducts(products.filter((p) => p._id !== id));
    } catch (err) {
      toast.error('Could not delete product.');
    }
  };

  // Save Category
  const handleSaveCategory = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/categories', catForm, { withCredentials: true });
      toast.success('Category added.');
      setCategoryModalOpen(false);
      setCatForm({ name: '', imageUrl: '', description: '' });
      loadTabData('categories');
    } catch (err) {
      toast.error('Error saving category.');
    }
  };

  // Save Promo Code
  const handleSavePromo = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        '/api/promo-codes',
        {
          ...promoForm,
          discountValue: Number(promoForm.discountValue),
          usageLimit: promoForm.usageLimit ? Number(promoForm.usageLimit) : null,
        },
        { withCredentials: true }
      );
      toast.success('Promo code created.');
      setPromoModalOpen(false);
      setPromoForm({ code: '', discountType: 'percentage', discountValue: '', usageLimit: '', expiresAt: '' });
      loadTabData('promos');
    } catch (err) {
      toast.error('Error saving promo code.');
    }
  };

  // Update Order Status
  const handleUpdateOrderStatus = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`/api/orders/${selectedOrder._id}/status`, orderStatusForm, { withCredentials: true });
      toast.success('Order status updated.');
      setOrderModalOpen(false);
      loadTabData('orders');
    } catch (err) {
      toast.error('Could not update order status.');
    }
  };

  // Review moderation
  const handleModerateReview = async (id, status) => {
    try {
      await axios.patch(`/api/reviews/admin/${id}`, { status }, { withCredentials: true });
      toast.success(`Review ${status}.`);
      setReviews(reviews.map((r) => (r._id === id ? { ...r, status } : r)));
    } catch (err) {
      toast.error('Failed to update review status.');
    }
  };

  if (authLoading || !isAdmin) {
    return (
      <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>
        <p>Verifying administrative credentials...</p>
      </div>
    );
  }

  return (
    <div className="container admin-page">
      {/* Header */}
      <div className="admin-header">
        <div>
          <span className="badge" style={{ marginBottom: '6px' }}>Atelier Control</span>
          <h1 className="admin-title">Store Management</h1>
        </div>
        <Link to="/shop" className="btn btn-outline btn-sm">
          View Public Store
        </Link>
      </div>

      {/* Tabs */}
      <nav className="admin-nav">
        {[
          { key: 'overview', label: 'Overview', icon: <Package size={14} /> },
          { key: 'products', label: 'Products', icon: <ShoppingBag size={14} /> },
          { key: 'categories', label: 'Categories', icon: <Layers size={14} /> },
          { key: 'orders', label: 'Orders', icon: <Package size={14} /> },
          { key: 'customers', label: 'Clients', icon: <Users size={14} /> },
          { key: 'promos', label: 'Promos', icon: <Tag size={14} /> },
          { key: 'reviews', label: 'Reviews', icon: <Star size={14} /> },
          { key: 'inquiries', label: 'Inquiries', icon: <Mail size={14} /> },
        ].map((tab) => (
          <button
            key={tab.key}
            className={`admin-nav-btn ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* 1. OVERVIEW */}
      {activeTab === 'overview' && dashboardData && (
        <div>
          <div className="admin-stats-grid">
            <div className="stat-card">
              <span className="stat-card-label">Gross Paid Revenue</span>
              <span className="stat-card-value">PKR {(dashboardData.stats?.totalRevenue || 0).toLocaleString()}</span>
            </div>
            <div className="stat-card">
              <span className="stat-card-label">Orders Placed Today</span>
              <span className="stat-card-value">{dashboardData.stats?.ordersTodayCount}</span>
            </div>
            <div className="stat-card">
              <span className="stat-card-label">Low Stock Alerts (&le; 5)</span>
              <span className="stat-card-value" style={{ color: dashboardData.stats?.lowStockCount > 0 ? 'var(--color-error)' : 'inherit' }}>
                {dashboardData.stats?.lowStockCount}
              </span>
            </div>
            <div className="stat-card">
              <span className="stat-card-label">Registered Clients</span>
              <span className="stat-card-value">{dashboardData.stats?.customerCount}</span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-6)' }}>
            {/* Low Stock List */}
            <div className="admin-table-container" style={{ padding: 'var(--space-4)' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', marginBottom: '14px' }}>Inventory Attention Needed</h3>
              {dashboardData.lowStockProducts?.length === 0 ? (
                <p style={{ color: 'var(--color-secondary-text)', fontSize: '0.88rem' }}>All bag models well stocked.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {dashboardData.lowStockProducts.map((p) => (
                    <div key={p._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.88rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '8px' }}>
                      <div>
                        <strong>{p.title}</strong>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-secondary-text)' }}>{p.category?.name}</div>
                      </div>
                      <span className="badge badge-low-stock">{p.stock} units left</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Orders List */}
            <div className="admin-table-container" style={{ padding: 'var(--space-4)' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', marginBottom: '14px' }}>Recent Order Submissions</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {dashboardData.recentOrders?.map((ord) => (
                  <div key={ord._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.88rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '8px' }}>
                    <div>
                      <strong>{ord.orderNumber}</strong> &middot; {ord.customerName}
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-secondary-text)' }}>
                        {ord.paymentMethod?.toUpperCase()} &middot; {ord.status.toUpperCase()}
                      </div>
                    </div>
                    <span style={{ fontWeight: 600 }}>PKR {ord.totalAmount.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. PRODUCTS TAB */}
      {activeTab === 'products' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--color-secondary-text)' }}>
              Showing {products.length} catalog editions
            </span>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => {
                setEditingProduct(null);
                setProdForm({
                  title: '',
                  description: '',
                  price: '',
                  categoryId: categories[0]?._id || '',
                  stock: 15,
                  material: '',
                  color: '',
                  dimensions: '',
                  capacity: '',
                  weight: '',
                  featured: false,
                  images: [],
                });
                setProductModalOpen(true);
              }}
            >
              <Plus size={14} style={{ marginRight: '4px' }} /> Add New Product
            </button>
          </div>

          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Piece</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Featured</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '40px', aspectRatio: '4/5', backgroundColor: 'var(--color-neutral-muted)', borderRadius: '2px', overflow: 'hidden' }}>
                          <img src={p.images?.[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <strong>{p.title}</strong>
                      </div>
                    </td>
                    <td>{p.category?.name || 'Unassigned'}</td>
                    <td>PKR {p.price.toLocaleString()}</td>
                    <td>
                      <span className={`badge ${p.stock <= 5 ? 'badge-low-stock' : ''}`}>
                        {p.stock}
                      </span>
                    </td>
                    <td>{p.featured ? 'Yes' : 'No'}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => {
                            setEditingProduct(p);
                            setProdForm({
                              title: p.title,
                              description: p.description,
                              price: p.price,
                              categoryId: p.category?._id || p.category,
                              stock: p.stock,
                              material: p.material || '',
                              color: p.color || '',
                              dimensions: p.dimensions || '',
                              capacity: p.capacity || '',
                              weight: p.weight || '',
                              featured: p.featured || false,
                              images: p.images || [],
                            });
                            setProductModalOpen(true);
                          }}
                          style={{ padding: '4px' }}
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p._id)}
                          style={{ padding: '4px', color: 'var(--color-error)' }}
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. CATEGORIES TAB */}
      {activeTab === 'categories' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--color-secondary-text)' }}>
              {categories.length} Silhouettes configured
            </span>
            <button className="btn btn-primary btn-sm" onClick={() => setCategoryModalOpen(true)}>
              <Plus size={14} style={{ marginRight: '4px' }} /> Add Category
            </button>
          </div>

          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Slug</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((c) => (
                  <tr key={c._id}>
                    <td>
                      <div style={{ width: '40px', aspectRatio: '4/5', backgroundColor: 'var(--color-neutral-muted)', borderRadius: '2px', overflow: 'hidden' }}>
                        {c.imageUrl && <img src={c.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                      </div>
                    </td>
                    <td><strong>{c.name}</strong></td>
                    <td><code>{c.slug}</code></td>
                    <td style={{ fontSize: '0.82rem', color: 'var(--color-secondary-text)', maxWidth: '300px' }}>{c.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. ORDERS TAB */}
      {activeTab === 'orders' && (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order #</th>
                <th>Client</th>
                <th>Amount</th>
                <th>Payment</th>
                <th>Fulfillment</th>
                <th>Tracking</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((ord) => (
                <tr key={ord._id}>
                  <td><strong>{ord.orderNumber}</strong></td>
                  <td>
                    <div>{ord.customerName}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-secondary-text)' }}>{ord.customerEmail}</div>
                  </td>
                  <td>PKR {ord.totalAmount.toLocaleString()}</td>
                  <td>
                    <div>
                      <span className={`badge ${ord.paymentStatus === 'paid' ? 'badge-success' : ''}`}>
                        {ord.paymentStatus}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--color-secondary-text)', marginTop: '3px' }}>
                      {ord.paymentMethod?.toUpperCase()}
                      {ord.paymentDetails?.accountNumber && ` (${ord.paymentDetails.accountNumber})`}
                    </div>
                  </td>
                  <td>
                    <span className="badge">{ord.status}</span>
                  </td>
                  <td>{ord.trackingNumber || 'Unassigned'}</td>
                  <td>
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => {
                        setSelectedOrder(ord);
                        setOrderStatusForm({
                          status: ord.status,
                          paymentStatus: ord.paymentStatus,
                          trackingCarrier: ord.trackingCarrier || 'UPS',
                          trackingNumber: ord.trackingNumber || '',
                        });
                        setOrderModalOpen(true);
                      }}
                    >
                      Update
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 5. CUSTOMERS TAB */}
      {activeTab === 'customers' && (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Orders Placed</th>
                <th>Total Spent</th>
                <th>Member Since</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c._id}>
                  <td><strong>{c.name}</strong></td>
                  <td>{c.email}</td>
                  <td>{c.orderCount || 0}</td>
                  <td>PKR {(c.totalSpent || 0).toLocaleString()}</td>
                  <td>{new Date(c.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 6. PROMOS TAB */}
      {activeTab === 'promos' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--color-secondary-text)' }}>
              Active and historic discount codes
            </span>
            <button className="btn btn-primary btn-sm" onClick={() => setPromoModalOpen(true)}>
              <Plus size={14} style={{ marginRight: '4px' }} /> Create Code
            </button>
          </div>

          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Discount</th>
                  <th>Redemptions</th>
                  <th>Active</th>
                </tr>
              </thead>
              <tbody>
                {promos.map((pr) => (
                  <tr key={pr._id}>
                    <td><strong>{pr.code}</strong></td>
                    <td>{pr.discountType === 'percentage' ? `${pr.discountValue}%` : `PKR ${pr.discountValue.toLocaleString()}`}</td>
                    <td>{pr.usedCount} {pr.usageLimit ? `/ ${pr.usageLimit}` : ''}</td>
                    <td>
                      <span className={`badge ${pr.active ? 'badge-success' : ''}`}>
                        {pr.active ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 7. REVIEWS TAB */}
      {activeTab === 'reviews' && (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Piece</th>
                <th>Author</th>
                <th>Rating</th>
                <th>Comment</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((r) => (
                <tr key={r._id}>
                  <td><strong>{r.product?.title || 'Unknown Piece'}</strong></td>
                  <td>{r.user?.name}</td>
                  <td>{r.rating} / 5</td>
                  <td style={{ maxWidth: '280px', fontSize: '0.82rem' }}>{r.comment}</td>
                  <td>
                    <span className={`badge ${r.status === 'approved' ? 'badge-success' : ''}`}>
                      {r.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      {r.status !== 'approved' && (
                        <button
                          className="btn btn-outline btn-sm"
                          onClick={() => handleModerateReview(r._id, 'approved')}
                        >
                          Approve
                        </button>
                      )}
                      {r.status !== 'rejected' && (
                        <button
                          className="btn btn-outline btn-sm"
                          onClick={() => handleModerateReview(r._id, 'rejected')}
                        >
                          Reject
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 8. INQUIRIES TAB */}
      {activeTab === 'inquiries' && (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Name</th>
                <th>Email</th>
                <th>Subject</th>
                <th>Message</th>
              </tr>
            </thead>
            <tbody>
              {inquiries.map((m) => (
                <tr key={m._id}>
                  <td>{new Date(m.createdAt).toLocaleDateString()}</td>
                  <td><strong>{m.name}</strong></td>
                  <td>{m.email}</td>
                  <td>{m.subject}</td>
                  <td style={{ fontSize: '0.85rem', maxWidth: '300px' }}>{m.message}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* PRODUCT MODAL */}
      {productModalOpen && (
        <div className="admin-modal-overlay" onClick={() => setProductModalOpen(false)}>
          <div className="admin-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3 style={{ fontFamily: 'var(--font-serif)' }}>
                {editingProduct ? 'Edit Bag Edition' : 'Create Bag Edition'}
              </h3>
              <button onClick={() => setProductModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  value={prodForm.title}
                  onChange={(e) => setProdForm({ ...prodForm, title: e.target.value })}
                  required
                />
              </div>

              <div className="form-row two-col">
                <div className="form-group">
                  <label>Category *</label>
                  <select
                    value={prodForm.categoryId}
                    onChange={(e) => setProdForm({ ...prodForm, categoryId: e.target.value })}
                    required
                  >
                    <option value="">Select Silhouette</option>
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Price (PKR) *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={prodForm.price}
                    onChange={(e) => setProdForm({ ...prodForm, price: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-row two-col">
                <div className="form-group">
                  <label>Inventory Stock *</label>
                  <input
                    type="number"
                    value={prodForm.stock}
                    onChange={(e) => setProdForm({ ...prodForm, stock: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Color / Tone</label>
                  <input
                    type="text"
                    value={prodForm.color}
                    onChange={(e) => setProdForm({ ...prodForm, color: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Material &amp; Tannery</label>
                <input
                  type="text"
                  placeholder="e.g. 18oz dry waxed canvas & bridle leather"
                  value={prodForm.material}
                  onChange={(e) => setProdForm({ ...prodForm, material: e.target.value })}
                />
              </div>

              <div className="form-row three-col">
                <div className="form-group">
                  <label>Dimensions</label>
                  <input
                    type="text"
                    placeholder="40cm x 30cm"
                    value={prodForm.dimensions}
                    onChange={(e) => setProdForm({ ...prodForm, dimensions: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Capacity</label>
                  <input
                    type="text"
                    placeholder="22 Litres"
                    value={prodForm.capacity}
                    onChange={(e) => setProdForm({ ...prodForm, capacity: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Weight</label>
                  <input
                    type="text"
                    placeholder="1.1 kg"
                    value={prodForm.weight}
                    onChange={(e) => setProdForm({ ...prodForm, weight: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Description *</label>
                <textarea
                  rows="3"
                  value={prodForm.description}
                  onChange={(e) => setProdForm({ ...prodForm, description: e.target.value })}
                  required
                ></textarea>
              </div>

              {/* Multi-Image Upload & URL Input */}
              <div className="form-group">
                <label>Product Photography * (Upload files or add direct URLs)</label>
                
                {/* 1. File Upload Button */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageFileChange}
                    disabled={uploadingImages}
                    style={{ flex: 1, padding: '6px' }}
                  />
                  {uploadingImages && (
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-accent)', whiteSpace: 'nowrap' }}>
                      Uploading...
                    </span>
                  )}
                </div>

                {/* 2. Direct URL Input */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                  <input
                    type="text"
                    placeholder="Or paste an image URL (e.g. Unsplash, CDN)..."
                    value={imageUrlInput}
                    onChange={(e) => setImageUrlInput(e.target.value)}
                    style={{ flex: 1, fontSize: '0.85rem' }}
                  />
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={handleAddImageUrl}
                  >
                    Add URL
                  </button>
                </div>

                {/* Reorderable Thumbnail Grid */}
                {prodForm.images.length > 0 ? (
                  <div>
                    <p style={{ fontSize: '0.78rem', color: 'var(--color-secondary-text)', marginBottom: '8px' }}>
                      <strong>Photo Sequence:</strong> #1 is the primary store cover; #2 is revealed on hover. Use arrows or &quot;Make Cover&quot; to change order.
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: '10px' }}>
                      {prodForm.images.map((url, idx) => (
                        <div
                          key={idx}
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            border: idx === 0 ? '2px solid var(--color-accent)' : '1px solid var(--color-border)',
                            borderRadius: 'var(--radius-sm)',
                            overflow: 'hidden',
                            backgroundColor: 'var(--color-surface)',
                            position: 'relative',
                          }}
                        >
                          {/* Image preview with badge */}
                          <div style={{ position: 'relative', width: '100%', aspectRatio: '4 / 5', backgroundColor: 'var(--color-neutral-muted)' }}>
                            <img src={url} alt={`Photo ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            
                            <span
                              style={{
                                position: 'absolute',
                                top: 4,
                                left: 4,
                                background: idx === 0 ? 'var(--color-accent)' : 'rgba(43, 38, 35, 0.85)',
                                color: '#FFFFFF',
                                fontSize: '0.65rem',
                                fontWeight: 600,
                                padding: '2px 6px',
                                borderRadius: '2px',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                              }}
                            >
                              {idx === 0 ? '#1 Cover' : idx === 1 ? '#2 Hover' : `#${idx + 1}`}
                            </span>

                            <button
                              type="button"
                              onClick={() => setProdForm({ ...prodForm, images: prodForm.images.filter((_, i) => i !== idx) })}
                              style={{
                                position: 'absolute',
                                top: 4,
                                right: 4,
                                background: 'rgba(165, 72, 63, 0.9)',
                                color: '#FFFFFF',
                                borderRadius: '50%',
                                width: '18px',
                                height: '18px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                              title="Delete photo"
                            >
                              <X size={11} />
                            </button>
                          </div>

                          {/* Reordering Controls */}
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px', backgroundColor: 'var(--color-bg)', borderTop: '1px solid var(--color-border)' }}>
                            <button
                              type="button"
                              onClick={() => moveImage(idx, idx - 1)}
                              disabled={idx === 0}
                              style={{
                                opacity: idx === 0 ? 0.3 : 1,
                                padding: '3px 6px',
                                background: 'var(--color-surface)',
                                border: '1px solid var(--color-border)',
                                borderRadius: '2px',
                              }}
                              title="Move photo earlier in order"
                            >
                              <ChevronLeft size={13} />
                            </button>

                            {idx !== 0 && (
                              <button
                                type="button"
                                onClick={() => setAsCover(idx)}
                                style={{
                                  fontSize: '0.65rem',
                                  textTransform: 'uppercase',
                                  fontWeight: 600,
                                  color: 'var(--color-accent)',
                                  padding: '2px 4px',
                                  border: 'none',
                                  background: 'transparent',
                                }}
                                title="Set as primary cover photo"
                              >
                                Set #1
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => moveImage(idx, idx + 1)}
                              disabled={idx === prodForm.images.length - 1}
                              style={{
                                opacity: idx === prodForm.images.length - 1 ? 0.3 : 1,
                                padding: '3px 6px',
                                background: 'var(--color-surface)',
                                border: '1px solid var(--color-border)',
                                borderRadius: '2px',
                              }}
                              title="Move photo later in order"
                            >
                              <ChevronRight size={13} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p style={{ fontSize: '0.78rem', color: 'var(--color-secondary-text)', fontStyle: 'italic', margin: '4px 0 0' }}>
                    No photos attached yet. Please upload at least one image or enter an image URL.
                  </p>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="checkbox"
                  id="featured-check"
                  checked={prodForm.featured}
                  onChange={(e) => setProdForm({ ...prodForm, featured: e.target.checked })}
                />
                <label htmlFor="featured-check" style={{ fontSize: '0.85rem' }}>Feature on Home New Arrivals</label>
              </div>

              <button type="submit" className="btn btn-primary" style={{ marginTop: '10px' }}>
                {editingProduct ? 'Save Changes' : 'Create Product'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ORDER STATUS MODAL */}
      {orderModalOpen && selectedOrder && (
        <div className="admin-modal-overlay" onClick={() => setOrderModalOpen(false)}>
          <div className="admin-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3 style={{ fontFamily: 'var(--font-serif)' }}>Order #{selectedOrder.orderNumber}</h3>
              <button onClick={() => setOrderModalOpen(false)}><X size={18} /></button>
            </div>

            <form onSubmit={handleUpdateOrderStatus} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="form-group">
                <label>Fulfillment Status</label>
                <select
                  value={orderStatusForm.status}
                  onChange={(e) => setOrderStatusForm({ ...orderStatusForm, status: e.target.value })}
                >
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="packed">Packed</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div className="form-group">
                <label>Payment Status</label>
                <select
                  value={orderStatusForm.paymentStatus}
                  onChange={(e) => setOrderStatusForm({ ...orderStatusForm, paymentStatus: e.target.value })}
                >
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="failed">Failed</option>
                </select>
              </div>

              <div className="form-row two-col">
                <div className="form-group">
                  <label>Carrier</label>
                  <input
                    type="text"
                    placeholder="UPS, DHL, FedEx"
                    value={orderStatusForm.trackingCarrier}
                    onChange={(e) => setOrderStatusForm({ ...orderStatusForm, trackingCarrier: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Tracking Number</label>
                  <input
                    type="text"
                    placeholder="1Z9999999999999999"
                    value={orderStatusForm.trackingNumber}
                    onChange={(e) => setOrderStatusForm({ ...orderStatusForm, trackingNumber: e.target.value })}
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ marginTop: '10px' }}>
                Save Order Changes
              </button>
            </form>
          </div>
        </div>
      )}

      {/* CATEGORY MODAL */}
      {categoryModalOpen && (
        <div className="admin-modal-overlay" onClick={() => setCategoryModalOpen(false)}>
          <div className="admin-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3 style={{ fontFamily: 'var(--font-serif)' }}>Add Silhouette Category</h3>
              <button onClick={() => setCategoryModalOpen(false)}><X size={18} /></button>
            </div>
            <form onSubmit={handleSaveCategory} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={catForm.name}
                  onChange={(e) => setCatForm({ ...catForm, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Image URL</label>
                <input
                  type="url"
                  value={catForm.imageUrl}
                  onChange={(e) => setCatForm({ ...catForm, imageUrl: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  rows="2"
                  value={catForm.description}
                  onChange={(e) => setCatForm({ ...catForm, description: e.target.value })}
                ></textarea>
              </div>
              <button type="submit" className="btn btn-primary">Save Category</button>
            </form>
          </div>
        </div>
      )}

      {/* PROMO MODAL */}
      {promoModalOpen && (
        <div className="admin-modal-overlay" onClick={() => setPromoModalOpen(false)}>
          <div className="admin-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3 style={{ fontFamily: 'var(--font-serif)' }}>Create Promotional Code</h3>
              <button onClick={() => setPromoModalOpen(false)}><X size={18} /></button>
            </div>
            <form onSubmit={handleSavePromo} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="form-group">
                <label>Code</label>
                <input
                  type="text"
                  placeholder="e.g. AUTUMN15"
                  value={promoForm.code}
                  onChange={(e) => setPromoForm({ ...promoForm, code: e.target.value.toUpperCase() })}
                  required
                />
              </div>
              <div className="form-row two-col">
                <div className="form-group">
                  <label>Type</label>
                  <select
                    value={promoForm.discountType}
                    onChange={(e) => setPromoForm({ ...promoForm, discountType: e.target.value })}
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed PKR</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Value</label>
                  <input
                    type="number"
                    placeholder="15"
                    value={promoForm.discountValue}
                    onChange={(e) => setPromoForm({ ...promoForm, discountValue: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Max Redemptions (Optional)</label>
                <input
                  type="number"
                  placeholder="Leave empty for unlimited"
                  value={promoForm.usageLimit}
                  onChange={(e) => setPromoForm({ ...promoForm, usageLimit: e.target.value })}
                />
              </div>
              <button type="submit" className="btn btn-primary">Create Code</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
