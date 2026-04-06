import { useState, useEffect } from 'react';
import api from '../api';
import { Package, Clock, CheckCircle, Trash2, ShoppingBag } from 'lucide-react';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/orders')
      .then(r => setOrders(r.data))
      .catch(() => setError('Failed to load your orders.'))
      .finally(() => setLoading(false));
  }, []);

  const handleDeleteOrder = async (id) => {
    if (!window.confirm('Cancel this order?')) return;
    try {
      await api.delete(`/orders/${id}`);
      setOrders(prev => prev.filter(o => o.id !== id));
    } catch {
      alert('Failed to cancel order. Please try again.');
    }
  };

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '80px', color: 'var(--text-muted)' }}>
      <div style={{ fontSize: '2rem', marginBottom: '12px' }}>⏳</div>
      Loading your orders...
    </div>
  );

  if (error) return (
    <div style={{ textAlign: 'center', padding: '80px', color: 'var(--error)' }}>⚠️ {error}</div>
  );

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }} className="fade-up">
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text)' }}>My Orders</h1>
        <p style={{ color: 'var(--text-muted)', marginTop: '6px' }}>{orders.length} order{orders.length !== 1 ? 's' : ''} placed</p>
      </div>

      {orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 20px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)' }}>
          <ShoppingBag size={56} style={{ color: 'var(--text-muted)', marginBottom: '20px' }} />
          <h2 style={{ marginBottom: '8px', color: 'var(--text)' }}>No orders yet</h2>
          <p style={{ color: 'var(--text-muted)' }}>Your order history will appear here.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {orders.map(order => (
            <div key={order.id} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
              {/* ORDER HEADER */}
              <div style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                    <Package size={16} style={{ color: 'var(--primary)' }} />
                    <span style={{ fontWeight: '700', color: 'var(--text)', fontSize: '1rem' }}>Order #{order.id}</span>
                    <span className={`badge ${order.status === 'pending' ? 'badge-orange' : 'badge-green'}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      {order.status === 'pending' ? <Clock size={11} /> : <CheckCircle size={11} />}
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '2px' }}>Order Total</p>
                    <p style={{ fontWeight: '800', fontSize: '1.3rem', color: 'var(--text)' }}>₹{order.totalAmount.toFixed(2)}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteOrder(order.id)}
                    style={{ padding: '8px', background: 'none', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', transition: 'all 0.2s' }}
                    onMouseEnter={e => { e.currentTarget.style.background='#fee2e2'; e.currentTarget.style.borderColor='var(--error)'; e.currentTarget.style.color='var(--error)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background='none'; e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.color='var(--text-muted)'; }}
                    title="Cancel Order"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* ORDER ITEMS */}
              <div style={{ padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {order.items && order.items.length > 0 ? order.items.map(item => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: 'var(--bg)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      {item.product?.imageUrl
                        ? <img src={item.product.imageUrl} alt={item.product.name} style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '6px', border: '1px solid var(--border)' }} />
                        : <div style={{ width: '48px', height: '48px', background: 'var(--primary-light)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>📦</div>
                      }
                      <div>
                        <p style={{ fontWeight: '600', color: 'var(--text)', fontSize: '0.95rem' }}>{item.product?.name || 'Product'}</p>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <p style={{ fontWeight: '700', color: 'var(--text)', fontSize: '1rem' }}>₹{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                )) : (
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', padding: '8px 0' }}>No items found for this order.</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
