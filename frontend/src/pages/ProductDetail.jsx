import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { CartContext } from '../context/CartContext';
import { ShoppingCart, ArrowLeft, Star, Shield, Truck, RotateCcw } from 'lucide-react';

function StarRating({ count = 4 }) {
  return <span className="stars">{'★'.repeat(count)}{'☆'.repeat(5 - count)}</span>;
}

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [toast, setToast] = useState('');
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    api.get(`/products/${id}`).then(r => setProduct(r.data)).catch(() => {});
  }, [id]);

  if (!product) return (
    <div style={{ textAlign: 'center', padding: '80px', color: 'var(--text-muted)' }}>
      <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>⏳</div>
      Loading product...
    </div>
  );

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) addToCart(product);
    setToast(`${qty}x "${product.name}" added to cart!`);
    setTimeout(() => setToast(''), 2500);
  };

  return (
    <div className="fade-up">
      <button onClick={() => navigate(-1)} className="btn btn-ghost" style={{ marginBottom: '24px', color: 'var(--text-secondary)' }}>
        <ArrowLeft size={16} /> Back to Products
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'start' }}>
        {/* IMAGE */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow)' }}>
          {product.imageUrl
            ? <img src={product.imageUrl} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : <div style={{ fontSize: '6rem', textAlign: 'center' }}>📦</div>
          }
        </div>

        {/* DETAILS — sticky */}
        <div style={{ position: 'sticky', top: '88px' }}>
          {product.category && (
            <span className="badge badge-blue" style={{ marginBottom: '16px', display: 'inline-flex' }}>
              {product.category.name}
            </span>
          )}
          <h1 style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text)', marginBottom: '12px', lineHeight: 1.25, letterSpacing: '-0.5px' }}>
            {product.name}
          </h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <StarRating count={4} />
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>4.0 · 128 reviews</span>
          </div>

          <div style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--text)', marginBottom: '8px', letterSpacing: '-1px' }}>
            ₹{product.price}
          </div>

          <div style={{ marginBottom: '24px' }}>
            {product.stockQuantity > 0
              ? <span className="badge badge-green">✓ In Stock — {product.stockQuantity} units available</span>
              : <span className="badge badge-red">✗ Out of Stock</span>
            }
          </div>

          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.75, marginBottom: '28px', borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
            {product.description}
          </p>

          {/* QUANTITY */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
            <span style={{ fontWeight: '600', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Qty:</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
              <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ padding: '8px 16px', background: 'var(--surface-hover)', border: 'none', cursor: 'pointer', fontWeight: '700', fontSize: '1.1rem', color: 'var(--text)', transition: 'background 0.15s' }}>−</button>
              <span style={{ padding: '8px 20px', fontWeight: '600', minWidth: '48px', textAlign: 'center' }}>{qty}</span>
              <button onClick={() => setQty(q => Math.min(product.stockQuantity, q + 1))} style={{ padding: '8px 16px', background: 'var(--surface-hover)', border: 'none', cursor: 'pointer', fontWeight: '700', fontSize: '1.1rem', color: 'var(--text)', transition: 'background 0.15s' }} disabled={qty >= product.stockQuantity}>+</button>
            </div>
          </div>

          {/* CTAs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}>
            <button
              className="btn btn-accent"
              style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '1rem' }}
              disabled={product.stockQuantity === 0}
              onClick={() => { handleAddToCart(); navigate('/cart'); }}
            >
              Buy Now
            </button>
            <button
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '1rem' }}
              onClick={handleAddToCart}
              disabled={product.stockQuantity === 0}
            >
              <ShoppingCart size={18} /> Add to Cart
            </button>
          </div>

          {/* TRUST BADGES */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
            {[[<Truck size={18} />, 'Free Delivery'], [<Shield size={18} />, 'Secure Payment'], [<RotateCcw size={18} />, 'Easy Returns']].map(([icon, label]) => (
              <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: '500', textAlign: 'center' }}>
                <div style={{ color: 'var(--primary)' }}>{icon}</div>
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* REVIEWS SECTION */}
      <div style={{ marginTop: '64px', borderTop: '1px solid var(--border)', paddingTop: '40px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '24px' }}>Customer Reviews</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {[{ name: 'Ravi K.', rating: 5, text: 'Excellent product! Exactly as described. Super fast delivery.' },
            { name: 'Priya M.', rating: 4, text: 'Good quality, well packaged. Happy with the purchase.' },
            { name: 'Arjun S.', rating: 4, text: 'Great value for this price. Highly recommended!' }
          ].map(r => (
            <div key={r.name} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '20px', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontWeight: '600', color: 'var(--text)' }}>{r.name}</span>
                <StarRating count={r.rating} />
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6 }}>{r.text}</p>
            </div>
          ))}
        </div>
      </div>

      {toast && <div className="toast">🛒 {toast}</div>}
    </div>
  );
}
