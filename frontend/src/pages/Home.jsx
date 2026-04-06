import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { CartContext } from '../context/CartContext';
import { Search, ShoppingCart, Star, SlidersHorizontal, X } from 'lucide-react';

const CATEGORY_ICONS = {
  'Electronics': '📱',
  'Fashion': '👗',
  'Home/Kitchen Goods': '🏠',
  'Personal Care': '✨',
  'default': '🛍️',
};

function StarRating({ count = 4 }) {
  return (
    <span className="stars">
      {'★'.repeat(count)}{'☆'.repeat(5 - count)}
    </span>
  );
}

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [showFilters, setShowFilters] = useState(false);
  const { addToCart } = useContext(CartContext);
  const [toast, setToast] = useState('');

  const fetchData = async () => {
    try {
      let url = '/products?';
      if (search) url += `search=${search}&`;
      if (selectedCategory) url += `category=${selectedCategory}`;
      const [prodRes, catRes] = await Promise.all([api.get(url), api.get('/categories')]);
      setProducts(prodRes.data);
      setCategories(catRes.data);
    } catch {
      console.error('Failed to load data');
    }
  };

  useEffect(() => { fetchData(); }, [selectedCategory]); // eslint-disable-line

  const handleSearch = (e) => { e.preventDefault(); fetchData(); };

  const handleAddToCart = (product) => {
    addToCart(product);
    setToast(`"${product.name}" added to cart!`);
    setTimeout(() => setToast(''), 2500);
  };

  let displayProducts = [...products];
  if (priceRange.min) displayProducts = displayProducts.filter(p => p.price >= Number(priceRange.min));
  if (priceRange.max) displayProducts = displayProducts.filter(p => p.price <= Number(priceRange.max));
  if (sortBy === 'price-asc') displayProducts.sort((a, b) => a.price - b.price);
  if (sortBy === 'price-desc') displayProducts.sort((a, b) => b.price - a.price);
  if (sortBy === 'name') displayProducts.sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="fade-up">
      {/* HERO */}
      <div className="hero-section">
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '560px' }}>
          <span className="badge" style={{ background: 'rgba(255,255,255,0.2)', color: 'white', marginBottom: '16px', display: 'inline-flex' }}>
            🎉 New Season Sale — Up to 50% Off
          </span>
          <h1 style={{ fontSize: '3.5rem', fontWeight: '800', lineHeight: 1.1, marginBottom: '20px', letterSpacing: '-1px' }}>
            Shop Smarter.<br />Live Better.
          </h1>
          <p style={{ fontSize: '1.15rem', opacity: 0.85, marginBottom: '32px', lineHeight: 1.6 }}>
            Explore thousands of products across all categories with the best prices, fast delivery, and top-rated quality.
          </p>
          <button className="btn" style={{ background: 'var(--accent)', color: 'white', padding: '14px 36px', fontSize: '1.05rem', boxShadow: '0 4px 20px rgba(249,115,22,0.5)', borderRadius: 'var(--radius-sm)', border: 'none', cursor: 'pointer' }}>
            Shop Now →
          </button>
        </div>
      </div>

      {/* CATEGORIES */}
      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '20px', color: 'var(--text)' }}>
          Shop by Category
        </h2>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button
            className={`category-pill ${selectedCategory === '' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('')}
          >
            <span className="icon">🛍️</span> All
          </button>
          {categories.map(c => (
            <button
              key={c.id}
              className={`category-pill ${selectedCategory === String(c.id) ? 'active' : ''}`}
              onClick={() => setSelectedCategory(String(c.id))}
            >
              <span className="icon">{CATEGORY_ICONS[c.name] || CATEGORY_ICONS.default}</span>
              {c.name}
            </button>
          ))}
        </div>
      </section>

      {/* SEARCH + SORT */}
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap' }}>
        <form onSubmit={handleSearch} style={{ flex: 1, minWidth: '240px', display: 'flex', gap: '8px' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: '100%', padding: '11px 16px 11px 44px', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)', background: 'var(--surface)', fontSize: '0.95rem', color: 'var(--text)', outline: 'none', transition: 'border 0.2s' }}
              onFocus={e => e.target.style.borderColor='var(--primary)'}
              onBlur={e => e.target.style.borderColor='var(--border)'}
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ padding: '11px 20px' }}>Search</button>
        </form>

        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          style={{ padding: '11px 16px', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)', background: 'var(--surface)', color: 'var(--text)', fontSize: '0.9rem', cursor: 'pointer' }}
        >
          <option value="default">Sort: Featured</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="name">Name: A–Z</option>
        </select>

        <button className="btn btn-outline" style={{ gap: '8px' }} onClick={() => setShowFilters(f => !f)}>
          <SlidersHorizontal size={16} /> Filters
        </button>
      </div>

      {/* FILTER PANEL */}
      {showFilters && (
        <div className="card" style={{ padding: '20px', marginBottom: '24px', display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <h4 style={{ width: '100%', marginBottom: '-8px', color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Filter by Price (₹)</h4>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            <input type="number" placeholder="Min price" value={priceRange.min} onChange={e => setPriceRange(p => ({...p, min: e.target.value}))} style={{ padding: '9px 14px', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)', width: '140px', fontSize: '0.9rem', color: 'var(--text)', background: 'var(--surface)' }} />
            <span style={{ color: 'var(--text-muted)' }}>–</span>
            <input type="number" placeholder="Max price" value={priceRange.max} onChange={e => setPriceRange(p => ({...p, max: e.target.value}))} style={{ padding: '9px 14px', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)', width: '140px', fontSize: '0.9rem', color: 'var(--text)', background: 'var(--surface)' }} />
            <button className="btn btn-ghost" style={{ color: 'var(--error)', gap: '6px' }} onClick={() => setPriceRange({ min: '', max: '' })}>
              <X size={14} /> Clear
            </button>
          </div>
        </div>
      )}

      {/* PRODUCTS GRID */}
      <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: '700', color: 'var(--text)' }}>
          {selectedCategory === '' ? 'All Products' : categories.find(c => String(c.id) === selectedCategory)?.name}
          <span style={{ fontSize: '1rem', fontWeight: '400', color: 'var(--text-muted)', marginLeft: '10px' }}>({displayProducts.length} items)</span>
        </h2>
      </div>

      {displayProducts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 20px', background: 'var(--surface)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🔍</div>
          <h3 style={{ marginBottom: '8px', color: 'var(--text)' }}>No products found</h3>
          <p style={{ color: 'var(--text-muted)' }}>Try adjusting your search or filters.</p>
        </div>
      ) : (
        <div className="grid">
          {displayProducts.map(p => (
            <div key={p.id} className="product-card">
              <Link to={`/product/${p.id}`} style={{ display: 'block' }}>
                <div className="product-card-img">
                  {p.imageUrl
                    ? <img src={p.imageUrl} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <span style={{ fontSize: '4rem' }}>{CATEGORY_ICONS[p.category?.name] || '📦'}</span>
                  }
                </div>
              </Link>
              <div className="product-card-body">
                {p.category && <span className="badge badge-blue" style={{ alignSelf: 'flex-start' }}>{p.category.name}</span>}
                <Link to={`/product/${p.id}`}>
                  <h3 style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--text)', lineHeight: 1.4 }}>{p.name}</h3>
                </Link>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{p.description}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <StarRating count={4} />
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>(128)</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                  <div>
                    <span style={{ fontSize: '1.3rem', fontWeight: '700', color: 'var(--text)' }}>₹{p.price}</span>
                    {p.stockQuantity > 0
                      ? <span className="badge badge-green" style={{ marginLeft: '8px', fontSize: '0.72rem' }}>In Stock</span>
                      : <span className="badge badge-red" style={{ marginLeft: '8px', fontSize: '0.72rem' }}>Out</span>
                    }
                  </div>
                </div>
                <button
                  className="btn btn-primary"
                  style={{ width: '100%', justifyContent: 'center', marginTop: '4px', padding: '10px' }}
                  onClick={() => handleAddToCart(p)}
                  disabled={p.stockQuantity === 0}
                >
                  <ShoppingCart size={16} /> Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {toast && <div className="toast">🛒 {toast}</div>}
    </div>
  );
}
