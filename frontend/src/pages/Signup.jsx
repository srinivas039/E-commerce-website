import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('USER');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/signup', { email, password, role });
      navigate('/login');
    } catch (err) {
      setError(err.response?.data || 'Signup failed. Try again.');
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }} className="fade-up">
      <div style={{ width: '100%', maxWidth: '420px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text)', marginBottom: '8px' }}>Create account</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Join Srini Commerce and start shopping</p>
        </div>

        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '36px', boxShadow: 'var(--shadow)' }}>
          {error && (
            <div style={{ background: '#fee2e2', border: '1px solid rgba(220,38,38,0.3)', padding: '12px 16px', borderRadius: 'var(--radius-sm)', marginBottom: '24px', color: 'var(--error)', fontSize: '0.9rem', fontWeight: '500', lineHeight: 1.5 }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Email Address</label>
              <input type="email" required placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
            </div>

            <div className="input-group">
              <label>Password</label>
              <input type="password" required placeholder="Min. 8 characters" value={password} onChange={e => setPassword(e.target.value)} />
            </div>

            <div className="input-group">
              <label>Account Type</label>
              <select value={role} onChange={e => setRole(e.target.value)}>
                <option value="USER">Customer — Browse & Shop</option>
                <option value="ADMIN">Admin — Manage Products</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '13px', fontSize: '1rem', marginTop: '8px' }} disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '24px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '600' }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
