import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <div style={styles.inner}>

        <div style={styles.col}>
          <div style={styles.brand}>
            <span style={{ color: '#fff' }}>Drive</span>
            <span style={{ color: '#60A5FA' }}>Nepal</span>
          </div>
          <p style={styles.tagline}>
            Nepal's trusted online vehicle rental platform.
          </p>
        </div>

        <div style={styles.col}>
          <h4 style={styles.colTitle}>Explore</h4>
          <Link to="/vehicles" style={styles.footLink}>Browse Vehicles</Link>
          <Link to="/about"    style={styles.footLink}>About Us</Link>
          <Link to="/contact"  style={styles.footLink}>Contact</Link>
        </div>

        <div style={styles.col}>
          <h4 style={styles.colTitle}>Account</h4>
          <Link to="/login"    style={styles.footLink}>Sign In</Link>
          <Link to="/register" style={styles.footLink}>Register</Link>
        </div>

        <div style={styles.col}>
          <h4 style={styles.colTitle}>Contact</h4>
          <p style={styles.footText}>Kathmandu, Nepal</p>
          <p style={styles.footText}>support@drivenepal.com</p>
          <p style={styles.footText}>+977-1-XXXXXXX</p>
        </div>

      </div>

      <div style={styles.bottom}>
        © {new Date().getFullYear()} DriveNepal. All rights reserved.
      </div>
    </footer>
  );
};

const styles = {
  footer:  { background: '#14213d', color: '#fff', marginTop: '4rem' },
  inner:   {
    maxWidth: '1200px', margin: '0 auto', padding: '3rem 1.5rem',
    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '2rem',
  },
  col:      { display: 'flex', flexDirection: 'column', gap: '0.6rem' },
  brand:    { fontSize: '1.3rem', fontWeight: '700' },
  tagline:  { color: 'rgba(255,255,255,0.6)', fontSize: '0.875rem', lineHeight: 1.6 },
  colTitle: { fontSize: '0.95rem', fontWeight: '600', marginBottom: '0.3rem' },
  footLink: { color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '0.875rem' },
  footText: { color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem', margin: 0 },
  bottom:   {
    borderTop: '1px solid rgba(255,255,255,0.1)', textAlign: 'center',
    padding: '1.5rem', fontSize: '0.825rem', color: 'rgba(255,255,255,0.5)',
  },
};

export default Footer;