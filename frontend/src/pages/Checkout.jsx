import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import api from '../api';
import { CreditCard, MapPin, CheckCircle, ArrowRight, ArrowLeft, Lock } from 'lucide-react';

const STEPS = ['Address', 'Payment', 'Review'];

export default function Checkout() {
  const { cart, clearCart } = useContext(CartContext);
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shipping = subtotal > 999 ? 0 : 59;
  const total = subtotal + shipping;

  const handleCheckout = async () => {
    setLoading(true);
    setError('');
    try {
      const items = cart.map(item => ({ productId: item.product.id, quantity: item.quantity }));
      await api.post('/orders/checkout', { items });
      setSuccess(true);
      setTimeout(() => { clearCart(); navigate('/orders'); }, 3000);
    } catch (err) {
      const msg = typeof err.response?.data === 'string'
        ? err.response.data
        : err.response?.data?.message || 'An error occurred. Please try again.';
      setError(msg);
      setLoading(false);
    }
  };

  if (cart.length === 0 && !success) { navigate('/cart'); return null; }

  if (success) return (
    <div style={{ maxWidth: '480px', margin: '80px auto', textAlign: 'center' }} className="fade-up">
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '60px 40px', boxShadow: 'var(--shadow-lg)' }}>
        <div style={{ width: '80px', height: '80px', background: '#dcfce7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
          <CheckCircle size={40} color="var(--success)" />
        </div>
        <h2 style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--text)', marginBottom: '12px' }}>Order Placed!</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>Your order has been successfully placed.</p>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Redirecting to your orders...</p>
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto' }} className="fade-up">
      <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '32px', color: 'var(--text)' }}>Checkout</h1>

      {/* STEP INDICATOR */}
      <div className="step-indicator" style={{ marginBottom: '40px' }}>
        {STEPS.map((label, i) => (
          <div key={label} className="step" style={{ flex: i < STEPS.length - 1 ? 1 : 'none' }}>
            <div className={`step-circle ${step > i ? 'done' : step === i ? 'active' : 'pending'}`}>
              {step > i ? '✓' : i + 1}
            </div>
            <span style={{ fontWeight: step === i ? '700' : '500', color: step === i ? 'var(--primary)' : step > i ? 'var(--success)' : 'var(--text-muted)', fontSize: '0.9rem' }}>
              {label}
            </span>
            {i < STEPS.length - 1 && <div className={`step-line ${step > i ? 'done' : ''}`} />}
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '32px', alignItems: 'start' }}>
        {/* MAIN PANEL */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '32px', boxShadow: 'var(--shadow-sm)' }}>

          {/* STEP 0: ADDRESS */}
          {step === 0 && (
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text)' }}>
                <MapPin size={20} color="var(--primary)" /> Delivery Address
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="input-group"><label>Full Name</label><input type="text" required placeholder="Srini Vasna" /></div>
                <div className="input-group"><label>Phone Number</label><input type="tel" required placeholder="+91 98765 43210" /></div>
                <div className="input-group" style={{ gridColumn: '1 / -1' }}><label>Address Line 1</label><input type="text" required placeholder="House No, Street, Colony" /></div>
                <div className="input-group" style={{ gridColumn: '1 / -1' }}><label>Address Line 2 (Optional)</label><input type="text" placeholder="Landmark, Area" /></div>
                <div className="input-group"><label>City</label><input type="text" required placeholder="Hyderabad" /></div>
                <div className="input-group"><label>PIN Code</label><input type="text" required placeholder="500001" maxLength="6" /></div>
                <div className="input-group"><label>State</label><input type="text" required placeholder="Telangana" /></div>
              </div>
            </div>
          )}

          {/* STEP 1: PAYMENT */}
          {step === 1 && (
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text)' }}>
                <CreditCard size={20} color="var(--primary)" /> Payment Details
              </h2>
              <div style={{ background: 'var(--bg)', border: '1.5px dashed var(--border)', borderRadius: 'var(--radius-sm)', padding: '12px 16px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--success)', fontWeight: '600', fontSize: '0.9rem' }}>
                <Lock size={14} /> Secure encrypted payment
              </div>

              {error && (
                <div style={{ background: '#fee2e2', border: '1px solid rgba(220,38,38,0.4)', padding: '14px 18px', borderRadius: 'var(--radius-sm)', marginBottom: '20px', display: 'flex', gap: '12px' }}>
                  <span style={{ fontSize: '1.1rem' }}>⚠️</span>
                  <div>
                    <p style={{ color: 'var(--error)', fontWeight: '700', marginBottom: '4px' }}>Payment Failed</p>
                    <p style={{ color: '#b91c1c', fontSize: '0.9rem' }}>{error}</p>
                  </div>
                </div>
              )}

              <div className="input-group"><label>Cardholder Name</label><input type="text" required placeholder="Srini Vasna" /></div>
              <div className="input-group">
                <label>Card Number</label>
                <input type="text" required placeholder="4242 4242 4242 4242" maxLength="16" style={{ letterSpacing: '2px' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="input-group"><label>Expiry (MM/YY)</label><input type="text" required placeholder="12/27" maxLength="5" /></div>
                <div className="input-group"><label>CVC</label><input type="text" required placeholder="123" maxLength="3" /></div>
              </div>
            </div>
          )}

          {/* STEP 2: REVIEW */}
          {step === 2 && (
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '24px', color: 'var(--text)' }}>Review Your Order</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                {cart.map(item => (
                  <div key={item.product.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: 'var(--bg)', borderRadius: 'var(--radius-sm)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ background: 'var(--primary-light)', color: 'var(--primary)', padding: '4px 10px', borderRadius: '20px', fontWeight: '700', fontSize: '0.85rem' }}>{item.quantity}x</span>
                      <span style={{ fontWeight: '500', color: 'var(--text)' }}>{item.product.name}</span>
                    </div>
                    <span style={{ fontWeight: '700', color: 'var(--text)' }}>₹{(item.product.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: '600', color: 'var(--text-secondary)' }}>Total (incl. shipping)</span>
                <span style={{ fontWeight: '800', fontSize: '1.4rem', color: 'var(--text)' }}>₹{total.toFixed(2)}</span>
              </div>
            </div>
          )}

          {/* NAV BUTTONS */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '32px', paddingTop: '24px', borderTop: '1px solid var(--border)' }}>
            {step > 0
              ? <button className="btn btn-outline" onClick={() => setStep(s => s - 1)}><ArrowLeft size={16} /> Back</button>
              : <div />
            }
            {step < 2
              ? <button className="btn btn-primary" onClick={() => setStep(s => s + 1)}>Continue <ArrowRight size={16} /></button>
              : <button className="btn btn-accent" style={{ padding: '12px 36px', fontSize: '1rem' }} onClick={handleCheckout} disabled={loading}>
                  {loading ? 'Placing Order...' : `Place Order — ₹${total.toFixed(2)}`}
                </button>
            }
          </div>
        </div>

        {/* ORDER MINI SUMMARY */}
        <div style={{ position: 'sticky', top: '88px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '24px', boxShadow: 'var(--shadow-sm)' }}>
          <h3 style={{ fontWeight: '700', fontSize: '1rem', marginBottom: '16px', color: 'var(--text)' }}>Order Summary</h3>
          {cart.map(item => (
            <div key={item.product.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              <span>{item.quantity}x {item.product.name}</span>
              <span>₹{(item.product.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="divider" />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
            <span>Shipping</span><span style={{ color: shipping === 0 ? 'var(--success)' : undefined }}>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '800', fontSize: '1.1rem', color: 'var(--text)' }}>
            <span>Total</span><span>₹{total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
