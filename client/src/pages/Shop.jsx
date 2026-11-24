import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { Filter, X, ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import './Shop.css';

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 12, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(true);

  // Extract query filters from URL
  const currentCategory = searchParams.get('category') || '';
  const currentSearch = searchParams.get('search') || '';
  const currentMinPrice = searchParams.get('minPrice') || '';
  const currentMaxPrice = searchParams.get('maxPrice') || '';
  const currentColor = searchParams.get('color') || '';
  const currentInStock = searchParams.get('inStock') === 'true';
  const currentSort = searchParams.get('sort') || 'newest';
  const currentPage = Number(searchParams.get('page')) || 1;

  // Local state for price inputs
  const [minPriceInput, setMinPriceInput] = useState(currentMinPrice);
  const [maxPriceInput, setMaxPriceInput] = useState(currentMaxPrice);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [searchParams]);

  const fetchCategories = async () => {
    try {
      const res = await axios.get('/api/categories');
      setCategories(res.data?.categories || []);
    } catch (e) {
      // fallback
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams(searchParams);
      if (!params.get('limit')) params.set('limit', '12');
      const res = await axios.get(`/api/products?${params.toString()}`);
      setProducts(res.data?.data || []);
      setPagination(res.data?.pagination || { total: 0, page: 1, limit: 12, pages: 1 });
    } catch (e) {
      console.error('Failed to load products', e);
    } finally {
      setLoading(false);
    }
  };

  const updateParam = (key, value) => {
    const nextParams = new URLSearchParams(searchParams);
    if (value !== '' && value !== null && value !== undefined && value !== false) {
      nextParams.set(key, value);
    } else {
      nextParams.delete(key);
    }
    nextParams.set('page', '1'); // reset to page 1 on filter change
    setSearchParams(nextParams);
  };

  const setPage = (pageNumber) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('page', String(pageNumber));
    setSearchParams(nextParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePriceApply = (e) => {
    e.preventDefault();
    const nextParams = new URLSearchParams(searchParams);
    if (minPriceInput) nextParams.set('minPrice', minPriceInput);
    else nextParams.delete('minPrice');

    if (maxPriceInput) nextParams.set('maxPrice', maxPriceInput);
    else nextParams.delete('maxPrice');

    nextParams.set('page', '1');
    setSearchParams(nextParams);
  };

  const clearAllFilters = () => {
    setMinPriceInput('');
    setMaxPriceInput('');
    setSearchParams({});
  };

  const hasActiveFilters = Boolean(
    currentCategory || currentSearch || currentMinPrice || currentMaxPrice || currentInStock
  );

  return (
    <div className="shop-page container">
      {/* Banner / Header */}
      <div className="shop-header-banner">
        <h1 className="shop-page-title">
          {currentCategory
            ? categories.find((c) => c.slug === currentCategory)?.name || currentCategory.toUpperCase()
            : currentSearch
            ? `Search: "${currentSearch}"`
            : "The Bag Collection"}
        </h1>
        <p className="shop-page-desc">
          Constructed from natural vegetable-tanned hides, dry waxed duck canvas, and solid sand-cast brass. Guaranteed for decades of daily transit.
        </p>
      </div>

      {/* Top Controls Bar */}
      <div className="shop-controls-bar">
        <div className="shop-controls-left">
          <button
            className="filter-toggle-btn"
            onClick={() => setFiltersOpen(!filtersOpen)}
            aria-expanded={filtersOpen}
          >
            <Filter size={14} />
            <span>{filtersOpen ? 'Hide Filters' : 'Show Filters'}</span>
          </button>
          <span className="results-count">
            {pagination.total} {pagination.total === 1 ? 'edition' : 'editions'} found
          </span>
        </div>

        <div className="shop-controls-right">
          <div className="sort-select-wrap">
            <label htmlFor="shop-sort" className="sort-label">Sort:</label>
            <select
              id="shop-sort"
              className="sort-select"
              value={currentSort}
              onChange={(e) => updateParam('sort', e.target.value)}
            >
              <option value="newest">Newest Editions</option>
              <option value="priceLow">Price: Low to High</option>
              <option value="priceHigh">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className={`shop-layout ${filtersOpen ? 'filters-open' : ''}`}>
        {/* Filters Sidebar */}
        {filtersOpen && (
          <aside className="filters-sidebar">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="filter-group-title" style={{ margin: 0 }}>Filters</span>
              {hasActiveFilters && (
                <button className="clear-filters-btn" onClick={clearAllFilters}>
                  Clear all
                </button>
              )}
            </div>

            {/* Categories Filter */}
            <div className="filter-group">
              <h4 className="filter-group-title">Category</h4>
              <div className="filter-options-list">
                <label className="filter-checkbox-label">
                  <input
                    type="radio"
                    name="category"
                    checked={!currentCategory}
                    onChange={() => updateParam('category', '')}
                  />
                  <span>All Categories</span>
                </label>
                {categories.map((cat) => (
                  <label key={cat.slug} className="filter-checkbox-label">
                    <input
                      type="radio"
                      name="category"
                      checked={currentCategory === cat.slug}
                      onChange={() => updateParam('category', cat.slug)}
                    />
                    <span>{cat.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="filter-group">
              <h4 className="filter-group-title">Price Range</h4>
              <form onSubmit={handlePriceApply}>
                <div className="price-inputs-row">
                  <input
                    type="number"
                    placeholder="Min PKR"
                    value={minPriceInput}
                    onChange={(e) => setMinPriceInput(e.target.value)}
                    min="0"
                  />
                  <span className="price-sep">&ndash;</span>
                  <input
                    type="number"
                    placeholder="Max PKR"
                    value={maxPriceInput}
                    onChange={(e) => setMaxPriceInput(e.target.value)}
                    min="0"
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-outline btn-sm"
                  style={{ width: '100%', marginTop: '8px' }}
                >
                  Apply Price
                </button>
              </form>
            </div>

            {/* In Stock Only Filter */}
            <div className="filter-group">
              <h4 className="filter-group-title">Availability</h4>
              <label className="filter-checkbox-label">
                <input
                  type="checkbox"
                  checked={currentInStock}
                  onChange={(e) => updateParam('inStock', e.target.checked ? 'true' : '')}
                />
                <span>In Stock Only</span>
              </label>
            </div>
          </aside>
        )}

        {/* Product Grid */}
        <main className="shop-grid-area">
          {loading ? (
            <div className="products-grid">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="aspect-4-5 skeleton"></div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="shop-empty-state">
              <h3>No pieces matched your selection.</h3>
              <p>Try clearing some filters or searching with a different term.</p>
              <button className="btn btn-outline" onClick={clearAllFilters}>
                Reset All Filters
              </button>
            </div>
          ) : (
            <>
              <div className="products-grid">
                {products.map((p) => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </div>

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="pagination-controls">
                  <button
                    className="pagination-btn"
                    onClick={() => setPage(currentPage - 1)}
                    disabled={currentPage <= 1}
                    aria-label="Previous page"
                  >
                    <ChevronLeft size={16} />
                  </button>

                  {[...Array(pagination.pages)].map((_, idx) => {
                    const pageNum = idx + 1;
                    return (
                      <button
                        key={pageNum}
                        className={`pagination-btn ${pageNum === currentPage ? 'active' : ''}`}
                        onClick={() => setPage(pageNum)}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    className="pagination-btn"
                    onClick={() => setPage(currentPage + 1)}
                    disabled={currentPage >= pagination.pages}
                    aria-label="Next page"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
