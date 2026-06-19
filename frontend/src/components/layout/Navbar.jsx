import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import NotificationBell from '../NotificationBell';
import AuthModal from '../AuthModal';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [modalMode, setModalMode] = useState(null);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <nav style={styles.nav}>
        <div style={styles.inner}>
          <Link to="/" style={styles.brand}>
            <span style={styles.brandText}>Drive</span>
            <span style={styles.brandAccent}>Nepal</span>
          </Link>

          <div style={styles.links}>
            <Link to="/"         style={styles.link}>Home</Link>
            <Link to="/vehicles" style={styles.link}>Vehicles</Link>
            <Link to="/about"    style={styles.link}>About</Link>
            <Link to="/contact"  style={styles.link}>Contact</Link>
          </div>

          <div style={styles.authArea}>
            {user ? (
              <>
                <NotificationBell />
                <Link to="/dashboard" style={styles.dashLink}>
                  {user.full_name?.split(' ')[0] || 'Dashboard'}
                </Link>
                <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
              </>
            ) : (
              <>
                <button onClick={() => setModalMode('login')} style={styles.loginLink}>Sign in</button>
                <button onClick={() => setModalMode('register')} style={styles.signupBtn}>Get Started →</button>
              </>
            )}
          </div>
        </div>
      </nav>

      {modalMode && (
        <AuthModal
          mode={modalMode}
          onClose={() => setModalMode(null)}
          onSwitch={() => setModalMode(modalMode === 'login' ? 'register' : 'login')}
        />
      )}
    </>
  );
};

const styles = {
  nav: {
    position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 50,
    padding: '1.5rem 0',
    background: 'linear-gradient(to bottom, rgba(241,241,241,0.8), transparent)',
    backdropFilter: 'blur(4px)',
  },
  inner: {
    maxWidth: '1280px', margin: '0 auto', padding: '0 2rem',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  },
  brand: { fontSize: '1.4rem', fontWeight: '700', textDecoration: 'none', fontFamily: 'Outfit, sans-serif' },
  brandText: { color: '#14213d' },
  brandAccent: { color: '#60A5FA' },
  links: { display: 'flex', gap: '2rem' },
  link: {
    color: '#555', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500',
  },
  authArea: { display: 'flex', alignItems: 'center', gap: '1rem' },
  loginLink: {
    background: 'none', border: 'none', color: '#14213d',
    fontSize: '0.9rem', fontWeight: '500', cursor: 'pointer', padding: 0,
  },
  signupBtn: {
    background: '#60A5FA', color: '#fff', border: 'none',
    padding: '0.6rem 1.3rem', borderRadius: '24px', fontSize: '0.85rem',
    fontWeight: '600', cursor: 'pointer',
  },
  dashLink: { color: '#14213d', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '600' },
  logoutBtn: {
    background: 'transparent', border: '1px solid rgba(0,0,0,0.15)', color: '#444',
    padding: '0.5rem 1.1rem', borderRadius: '24px', fontSize: '0.85rem', cursor: 'pointer', fontWeight: '500',
  },
};

export default Navbar;
