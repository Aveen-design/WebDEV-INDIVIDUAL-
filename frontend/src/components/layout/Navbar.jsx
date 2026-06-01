import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
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
              <Link to="/dashboard" style={styles.dashLink}>
                {user.full_name?.split(' ')[0] || 'Dashboard'}
              </Link>
              <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" style={styles.loginLink}>Sign in</Link>
              <Link to="/register" style={styles.signupBtn}>Get Started</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    background:    'rgba(10,14,26,0.7)',
    backdropFilter:'blur(10px)',
    borderBottom:  '1px solid rgba(255,255,255,0.08)',
    position:      'sticky',
    top:           0,
    zIndex:        100,
  },
  inner: {
    maxWidth: '1200px', margin: '0 auto', padding: '1rem 1.5rem',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  },
  brand: { fontSize: '1.4rem', fontWeight: '700', textDecoration: 'none' },
  brandText:   { color: '#fff' },
  brandAccent: { color: '#DC143C' },
  links: { display: 'flex', gap: '2rem' },
  link: {
    color: 'rgba(255,255,255,0.7)', textDecoration: 'none',
    fontSize: '0.95rem', fontWeight: '500',
  },
  authArea: { display: 'flex', alignItems: 'center', gap: '1rem' },
  loginLink: {
    color: 'rgba(255,255,255,0.85)', textDecoration: 'none',
    fontSize: '0.95rem', fontWeight: '500',
  },
  signupBtn: {
    background: '#DC143C', color: '#fff', textDecoration: 'none',
    padding: '0.6rem 1.3rem', borderRadius: '24px', fontSize: '0.9rem', fontWeight: '600',
  },
  dashLink: {
    color: '#fff', textDecoration: 'none', fontSize: '0.95rem', fontWeight: '600',
  },
  logoutBtn: {
    background: 'transparent', border: '1px solid rgba(255,255,255,0.25)',
    color: 'rgba(255,255,255,0.85)', padding: '0.5rem 1.1rem',
    borderRadius: '24px', fontSize: '0.9rem', cursor: 'pointer', fontWeight: '500',
  },
};

export default Navbar;