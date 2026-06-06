import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const Register = () => {
  const navigate  = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    full_name: '', email: '', password: '',
    confirm_password: '', role: 'customer', phone: '',
  });
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.full_name || !formData.email || !formData.password) {
      return setError('Please fill in all required fields');
    }
    if (formData.password.length < 8) {
      return setError('Password must be at least 8 characters');
    }
    if (formData.password !== formData.confirm_password) {
      return setError('Passwords do not match');
    }

    setLoading(true);
    try {
      const res = await api.post('/auth/register', {
        full_name: formData.full_name,
        email:     formData.email,
        password:  formData.password,
        role:      formData.role,
        phone:     formData.phone,
      });
      login(res.data.data.user, res.data.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        <div style={styles.visualPanel}>
          <div style={styles.visualTop}>
            <Link to="/" style={styles.visualLink}>Browse fleet</Link>
            <Link to="/login" style={styles.visualBtn}>Sign in</Link>
          </div>
          <div style={styles.visualIcon}>🚗</div>
          <div style={styles.visualBottom}>
            <p style={styles.visualCity}>Join DriveNepal today</p>
            <p style={styles.visualSub}>Rent a vehicle or list your own — all in one place</p>
          </div>
        </div>

        <div style={styles.formPanel}>
          <div style={styles.brand}>
            <span style={styles.brandText}>Drive</span>
            <span style={styles.brandAccent}>Nepal</span>
          </div>

          <h2 style={styles.heading}>Create account</h2>
          <p style={styles.subheading}>Get started in less than a minute</p>

          {error && <div style={styles.errorBox}>{error}</div>}

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.field}>
              <label style={styles.label}>Full Name *</label>
              <input style={styles.input} type="text" name="full_name"
                placeholder="Aarav Sharma" value={formData.full_name}
                onChange={handleChange} required />
            </div>

            <div style={styles.row}>
              <div style={{ ...styles.field, flex: 1 }}>
                <label style={styles.label}>Email *</label>
                <input style={styles.input} type="email" name="email"
                  placeholder="aarav@gmail.com" value={formData.email}
                  onChange={handleChange} required />
              </div>
              <div style={{ ...styles.field, flex: 1 }}>
                <label style={styles.label}>Phone</label>
                <input style={styles.input} type="tel" name="phone"
                  placeholder="98XXXXXXXX" value={formData.phone}
                  onChange={handleChange} />
              </div>
            </div>

            <div style={styles.field}>
              <label style={styles.label}>I want to</label>
              <select style={styles.input} name="role"
                value={formData.role} onChange={handleChange}>
                <option value="customer">Rent a vehicle</option>
                <option value="owner">List my vehicle</option>
              </select>
            </div>

            <div style={styles.row}>
              <div style={{ ...styles.field, flex: 1 }}>
                <label style={styles.label}>Password *</label>
                <input style={styles.input} type="password" name="password"
                  placeholder="Min 8 chars" value={formData.password}
                  onChange={handleChange} required />
              </div>
              <div style={{ ...styles.field, flex: 1 }}>
                <label style={styles.label}>Confirm *</label>
                <input style={styles.input} type="password" name="confirm_password"
                  placeholder="Repeat" value={formData.confirm_password}
                  onChange={handleChange} required />
              </div>
            </div>

            <button type="submit"
              style={{ ...styles.button, opacity: loading ? 0.7 : 1 }}
              disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div style={styles.divider}>
            <div style={styles.dividerLine} />
            <span style={styles.dividerText}>or</span>
            <div style={styles.dividerLine} />
          </div>

          <a href="http://localhost:8000/api/auth/google" style={styles.googleBtn}>
            <img src="https://www.google.com/favicon.ico" alt="" style={styles.googleIcon} />
            Sign up with Google
          </a>

          <p style={styles.footerText}>
            Already have an account?{' '}
            <Link to="/login" style={styles.link}>Sign in</Link>
          </p>
        </div>

      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: '100vh', background: '#f0f0f3', display: 'flex',
    alignItems: 'center', justifyContent: 'center', padding: '2rem',
    fontFamily: "'Inter', sans-serif",
  },
  container: {
    display: 'flex', width: '100%', maxWidth: '960px', minHeight: '620px',
    background: '#fff', borderRadius: '20px', overflow: 'hidden',
    boxShadow: '0 20px 60px rgba(0,0,0,0.12)',
  },
  visualPanel: {
    flex: 1, background: 'linear-gradient(160deg, #14213d 0%, #1d3557 100%)',
    padding: '2rem', display: 'flex', flexDirection: 'column',
    justifyContent: 'space-between', position: 'relative', overflow: 'hidden',
  },
  visualTop: { display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '14px', zIndex: 2 },
  visualLink: { color: 'rgba(255,255,255,0.75)', fontSize: '0.85rem', textDecoration: 'none' },
  visualBtn: {
    border: '1px solid rgba(255,255,255,0.4)', color: '#fff', fontSize: '0.85rem',
    padding: '0.5rem 1.1rem', borderRadius: '8px', textDecoration: 'none',
  },
  visualIcon: {
    position: 'absolute', inset: 0, display: 'flex', alignItems: 'center',
    justifyContent: 'center', fontSize: '9rem', opacity: 0.15,
  },
  visualBottom: { zIndex: 2 },
  visualCity: { color: '#fff', fontSize: '1rem', margin: 0, fontWeight: '600' },
  visualSub: { color: 'rgba(255,255,255,0.65)', fontSize: '0.85rem', margin: '0.4rem 0 0' },
  formPanel: {
    flex: 1.2, padding: '2.5rem', display: 'flex',
    flexDirection: 'column', justifyContent: 'center',
  },
  brand: { fontSize: '1.3rem', fontWeight: '700', marginBottom: '1.25rem' },
  brandText: { color: '#14213d' },
  brandAccent: { color: '#60A5FA' },
  heading: { fontSize: '1.9rem', fontWeight: '700', color: '#14213d', margin: '0 0 0.3rem' },
  subheading: { color: '#888', fontSize: '0.9rem', margin: '0 0 1.5rem' },
  errorBox: {
    background: '#fdecea', border: '1px solid #e63946', color: '#c1121f',
    borderRadius: '8px', padding: '0.75rem 1rem', marginBottom: '1rem', fontSize: '0.875rem',
  },
  form: { display: 'flex', flexDirection: 'column', gap: '0.9rem' },
  row: { display: 'flex', gap: '0.75rem' },
  field: { display: 'flex', flexDirection: 'column', gap: '0.4rem' },
  label: { color: '#444', fontSize: '0.85rem', fontWeight: '500' },
  input: {
    background: '#f7f7fa', border: '1px solid #e0e0e6', borderRadius: '10px',
    padding: '0.8rem 1rem', color: '#14213d', fontSize: '0.95rem',
    outline: 'none', width: '100%', boxSizing: 'border-box',
  },
  button: {
    background: '#60A5FA', color: '#fff', border: 'none', borderRadius: '10px',
    padding: '0.85rem', fontSize: '1rem', fontWeight: '600', cursor: 'pointer',
    marginTop: '0.5rem', width: '100%',
  },
  divider: { display: 'flex', alignItems: 'center', gap: '0.6rem', margin: '1.2rem 0' },
  dividerLine: { flex: 1, height: '1px', background: '#e0e0e6' },
  dividerText: { color: '#999', fontSize: '0.8rem' },
  googleBtn: {
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem',
    background: '#fff', border: '1px solid #e0e0e6', borderRadius: '10px',
    padding: '0.75rem', textDecoration: 'none', color: '#14213d', fontWeight: '500', fontSize: '0.9rem',
  },
  googleIcon: { width: '18px', height: '18px' },
  footerText: { textAlign: 'center', color: '#888', fontSize: '0.875rem', marginTop: '1.25rem' },
  link: { color: '#60A5FA', textDecoration: 'none', fontWeight: '600' },
};

export default Register;