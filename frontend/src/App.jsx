import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AuthContext } from './context/AuthContext';
import { CartContext } from './context/CartContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import AdminDashboard from './pages/AdminDashboard';
import ProductDetail from './pages/ProductDetail';
import Orders from './pages/Orders';
import { ShoppingCart, User, LayoutDashboard, Package, LogOut, ChevronDown } from 'lucide-react';

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const { cart } = useContext(CartContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand">Srini Commerce</Link>

      <div className="nav-links">
        <Link to="/">Shop</Link>

        {user ? (
          <div style={{ position: 'relative' }}>
            <button
              className="btn btn-ghost"
              style={{ gap: '6px', fontWeight: 600, color: 'var(--text)' }}
              onClick={() => setMenuOpen(o => !o)}
            >
              <User size={16} /> {user.email ? user.email.split('@')[0] : 'Account'}
              <ChevronDown size={14} />
            </button>

            {menuOpen && (
              <div
                style={{
                  position: 'absolute', top: '110%', right: 0,
                  background: 'var(--surface)', border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)', minWidth: '180px',
                  boxShadow: 'var(--shadow-lg)', zIndex: 300, overflow: 'hidden'
                }}
                onMouseLeave={() => setMenuOpen(false)}
              >
                {user.role === 'ADMIN' && (
                  <Link to="/admin" onClick={() => setMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', color: 'var(--text)', fontSize: '0.9rem', transition: 'background 0.15s' }} onMouseEnter={e => e.currentTarget.style.background='var(--surface-hover)'} onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                    <LayoutDashboard size={15} /> Admin Dashboard
                  </Link>
                )}
                <Link to="/orders" onClick={() => setMenuOpen(false)} style={{ display: user.role === 'ADMIN' ? 'none' : 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', color: 'var(--text)', fontSize: '0.9rem', transition: 'background 0.15s' }} onMouseEnter={e => e.currentTarget.style.background='var(--surface-hover)'} onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                  <Package size={15} /> My Orders
                </Link>
                <div style={{ borderTop: '1px solid var(--border)' }}>
                  <button onClick={() => { logout(); setMenuOpen(false); }} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', color: 'var(--error)', background: 'none', border: 'none', cursor: 'pointer', width: '100%', fontSize: '0.9rem', transition: 'background 0.15s' }} onMouseEnter={e => e.currentTarget.style.background='#fee2e2'} onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                    <LogOut size={15} /> Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login" className="btn btn-primary" style={{ padding: '8px 20px' }}>
            <User size={16} /> Login
          </Link>
        )}

        <Link to="/cart" style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', padding: '8px 12px', borderRadius: 'var(--radius-sm)', color: 'var(--text-secondary)', transition: 'all 0.2s' }} onMouseEnter={e => { e.currentTarget.style.background='var(--primary-light)'; e.currentTarget.style.color='var(--primary)'; }} onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.color='var(--text-secondary)'; }}>
          <ShoppingCart size={22} />
          {cartCount > 0 && (
            <span style={{ position: 'absolute', top: '2px', right: '2px', background: 'var(--accent)', color: 'white', borderRadius: '50%', width: '18px', height: '18px', fontSize: '0.7rem', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {cartCount}
            </span>
          )}
        </Link>
      </div>
    </nav>
  );
}

function App() {
  const { user } = useContext(AuthContext);

  return (
    <Router>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders" element={<Orders />} />
          {user && user.role === 'ADMIN' && (
            <Route path="/admin" element={<AdminDashboard />} />
          )}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
