import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const Login = () => {
  const navigate  = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!formData.email || !formData.password) {
      return setError('Please enter both email and password');
    }

    setLoading(true);
    try {
      const res = await api.post('/auth/login', formData);
      const { user, token } = res.data.data;
      login(user, token);
      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        {}
        <div style={styles.visualPanel}>
          <div style={styles.visualTop}>
            <Link to="/" style={styles.visualLink}>Browse fleet</Link>
            <Link to="/register" style={styles.visualBtn}>Sign up</Link>
          </div>
          <div style={styles.visualIcon}>🚗</div>
          <div style={styles.visualBottom}>
            <p style={styles.visualCity}>Kathmandu · Pokhara · Chitwan</p>
            <p style={styles.visualSub}>300+ verified vehicles ready to book</p>
          </div>
        </div>

        {}
        <div style={styles.formPanel}>
          <div style={styles.brand}>
            <span style={styles.brandText}>Drive</span>
            <span style={styles.brandAccent}>Nepal</span>
          </div>

          <h2 style={styles.heading}>Welcome back</h2>
          <p style={styles.subheading}>Sign in to manage your bookings</p>

          {error && <div style={styles.errorBox}>{error}</div>}

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.field}>
              <label style={styles.label}>Email Address</label>
              <input
                style={styles.input}
                type="email"
                name="email"
                placeholder="aarav@gmail.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Password</label>
              <input
                style={styles.input}
                type="password"
                name="password"
                placeholder="Your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <button
              type="submit"
              style={{ ...styles.button, opacity: loading ? 0.7 : 1 }}
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p style={styles.footerText}>
            Don't have an account?{' '}
            <Link to="/register" style={styles.link}>Create one</Link>
          </p>
        </div>

      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight:      '100vh',
    background:     '#f0f0f3',
    display:        'flex',
    alignItems:     'center',
    justifyContent: 'center',
    padding:        '2rem',
    fontFamily:     "'Segoe UI', sans-serif",
  },
  container: {
    display:      'flex',
    width:        '100%',
    maxWidth:     '900px',
    minHeight:    '560px',
    background:   '#fff',
    borderRadius: '20px',
    overflow:     'hidden',
    boxShadow:    '0 20px 60px rgba(0,0,0,0.12)',
  },

  visualPanel: {
    flex:          1,
    background:    'linear-gradient(160deg, #14213d 0%, #1d3557 100%)',
    padding:       '2rem',
    display:       'flex',
    flexDirection: 'column',
    justifyContent:'space-between',
    position:      'relative',
    overflow:      'hidden',
  },
  visualTop: {
    display:    'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap:        '14px',
    zIndex:     2,
  },
  visualLink: {
    color:          'rgba(255,255,255,0.75)',
    fontSize:       '0.85rem',
    textDecoration: 'none',
  },
  visualBtn: {
    border:         '1px solid rgba(255,255,255,0.4)',
    color:          '#fff',
    fontSize:       '0.85rem',
    padding:        '0.5rem 1.1rem',
    borderRadius:   '8px',
    textDecoration: 'none',
  },
  visualIcon: {
    position:  'absolute',
    inset:     0,
    display:   'flex',
    alignItems:'center',
    justifyContent: 'center',
    fontSize:  '9rem',
    opacity:   0.15,
  },
  visualBottom: { zIndex: 2 },
  visualCity: {
    color:    '#fff',
    fontSize: '1rem',
    margin:   0,
    fontWeight: '600',
  },
  visualSub: {
    color:    'rgba(255,255,255,0.65)',
    fontSize: '0.85rem',
    margin:   '0.4rem 0 0',
  },

  formPanel: {
    flex:          1.1,
    padding:       '3rem 2.5rem',
    display:       'flex',
    flexDirection: 'column',
    justifyContent:'center',
  },
  brand: {
    fontSize:     '1.3rem',
    fontWeight:   '700',
    marginBottom: '1.5rem',
  },
  brandText:   { color: '#14213d' },
  brandAccent: { color: '#e63946' },
  heading: {
    fontSize:   '1.9rem',
    fontWeight: '700',
    color:      '#14213d',
    margin:     '0 0 0.3rem',
  },
  subheading: {
    color:        '#888',
    fontSize:     '0.9rem',
    margin:       '0 0 1.5rem',
  },
  errorBox: {
    background:   '#fdecea',
    border:       '1px solid #e63946',
    color:        '#c1121f',
    borderRadius: '8px',
    padding:      '0.75rem 1rem',
    marginBottom: '1rem',
    fontSize:     '0.875rem',
  },
  form: {
    display:       'flex',
    flexDirection: 'column',
    gap:           '1rem',
  },
  field: {
    display:       'flex',
    flexDirection: 'column',
    gap:           '0.4rem',
  },
  label: {
    color:    '#444',
    fontSize: '0.85rem',
    fontWeight: '500',
  },
  input: {
    background:   '#f7f7fa',
    border:       '1px solid #e0e0e6',
    borderRadius: '10px',
    padding:      '0.8rem 1rem',
    color:        '#14213d',
    fontSize:     '0.95rem',
    outline:      'none',
    width:        '100%',
    boxSizing:    'border-box',
  },
  button: {
    background:   '#e63946',
    color:        '#fff',
    border:       'none',
    borderRadius: '10px',
    padding:      '0.85rem',
    fontSize:     '1rem',
    fontWeight:   '600',
    cursor:       'pointer',
    marginTop:    '0.5rem',
    width:        '100%',
  },
  footerText: {
    textAlign: 'center',
    color:     '#888',
    fontSize:  '0.875rem',
    marginTop: '1.5rem',
  },
  link: {
    color:          '#e63946',
    textDecoration: 'none',
    fontWeight:     '600',
  },
};

export default Login;