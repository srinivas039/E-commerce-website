import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { Trash2, ShoppingBag, ArrowRight, Plus, Minus } from 'lucide-react';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shipping = subtotal > 999 ? 0 : 59;
  const total = subtotal + shipping;

  if (cart.length === 0) return (
    <div style={{ textAlign: 'center', padding: '100px 20px' }} className="fade-up">
      <ShoppingBag size={64} style={{ color: 'var(--text-muted)', marginBottom: '24px' }} />
      <h2 style={{ fontSize: '1.8rem', marginBottom: '12px', color: 'var(--text)' }}>Your cart is empty</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>Looks like you haven't added anything yet.</p>
      <Link to="/" className="btn btn-primary">Browse Products</Link>
    </div>
  );

  return (
    <div className="fade-up">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text)' }}>
          Shopping Cart <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: '400' }}>({cart.length} items)</span>
        </h1>
        <button className="btn btn-ghost" onClick={clearCart} style={{ color: 'var(--error)', fontSize: '0.875rem' }}>
          Clear All
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '32px', alignItems: 'start' }}>
        {/* ITEMS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {cart.map(item => (
            <div key={item.product.id} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '20px', display: 'flex', gap: '20px', alignItems: 'center', boxShadow: 'var(--shadow-sm)', transition: 'box-shadow 0.2s' }}>
              {/* Image */}
              <div style={{ width: '100px', height: '100px', background: 'var(--bg)', borderRadius: 'var(--radius-sm)', overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {item.product.imageUrl
                  ? <img src={item.product.imageUrl} alt={item.product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <span style={{ fontSize: '2.5rem' }}>📦</span>
                }
              </div>

              {/* Info */}
              <div style={{ flex: 1 }}>
                <Link to={`/product/${item.product.id}`}>
                  <h3 style={{ fontWeight: '600', fontSize: '1rem', color: 'var(--text)', marginBottom: '4px' }}>{item.product.name}</h3>
                </Link>
                {item.product.category && (
                  <span className="badge badge-blue" style={{ fontSize: '0.72rem', marginBottom: '8px', display: 'inline-flex' }}>{item.product.category.name}</span>
                )}
                <p style={{ color: 'var(--primary)', fontWeight: '700', fontSize: '1.1rem' }}>₹{item.product.price}</p>
              </div>

              {/* Quantity */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
                <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} style={{ padding: '8px 12px', background: 'var(--bg)', border: 'none', cursor: 'pointer', color: 'var(--text)', fontWeight: '600', display: 'flex' }}>
                  <Minus size={14} />
                </button>
                <span style={{ padding: '8px 16px', fontWeight: '600', minWidth: '40px', textAlign: 'center', background: 'var(--surface)' }}>{item.quantity}</span>
                <button
                  onClick={() => item.quantity < item.product.stockQuantity && updateQuantity(item.product.id, item.quantity + 1)}
                  style={{ padding: '8px 12px', background: 'var(--bg)', border: 'none', cursor: item.quantity >= item.product.stockQuantity ? 'not-allowed' : 'pointer', color: 'var(--text)', fontWeight: '600', display: 'flex', opacity: item.quantity >= item.product.stockQuantity ? 0.4 : 1 }}
                  title={item.quantity >= item.product.stockQuantity ? `Max ${item.product.stockQuantity}` : ''}
                >
                  <Plus size={14} />
                </button>
              </div>

              {/* Subtotal */}
              <div style={{ minWidth: '90px', textAlign: 'right' }}>
                <p style={{ fontWeight: '700', fontSize: '1.1rem', color: 'var(--text)' }}>₹{(item.product.price * item.quantity).toFixed(2)}</p>
              </div>

              <button onClick={() => removeFromCart(item.product.id)} style={{ padding: '8px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', borderRadius: 'var(--radius-sm)', transition: 'all 0.2s', display: 'flex' }} onMouseEnter={e => { e.currentTarget.style.background='#fee2e2'; e.currentTarget.style.color='var(--error)'; }} onMouseLeave={e => { e.currentTarget.style.background='none'; e.currentTarget.style.color='var(--text-muted)'; }}>
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>

        {/* SUMMARY */}
        <div style={{ position: 'sticky', top: '88px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '28px', boxShadow: 'var(--shadow)' }}>
          <h2 style={{ fontWeight: '700', fontSize: '1.2rem', marginBottom: '24px', color: 'var(--text)' }}>Order Summary</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              <span>Subtotal</span> <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              <span>Shipping</span>
              <span style={{ color: shipping === 0 ? 'var(--success)' : 'var(--text-secondary)' }}>
                {shipping === 0 ? 'FREE' : `₹${shipping}`}
              </span>
            </div>
            {shipping > 0 && <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Free shipping on orders above ₹999</p>}
          </div>

          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <span style={{ fontWeight: '700', fontSize: '1.1rem' }}>Total</span>
            <span style={{ fontWeight: '800', fontSize: '1.5rem', color: 'var(--text)' }}>₹{total.toFixed(2)}</span>
          </div>

          {user ? (
            <button className="btn btn-accent" style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '1rem' }} onClick={() => navigate('/checkout')}>
              Proceed to Checkout <ArrowRight size={16} />
            </button>
          ) : (
            <Link to="/login" className="btn btn-primary" style={{ display: 'flex', width: '100%', justifyContent: 'center', padding: '14px', fontSize: '1rem' }}>
              Login to Checkout
            </Link>
          )}

          <Link to="/" style={{ display: 'block', textAlign: 'center', marginTop: '16px', color: 'var(--primary)', fontSize: '0.9rem', fontWeight: '500' }}>
            ← Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
