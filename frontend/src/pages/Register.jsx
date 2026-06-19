import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import driveNepalImg from '../assets/drivenepal.png';

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
    <div style={s.page}>
      <div style={s.container}>

        <div style={s.visualPanel}>
          <div style={s.visualOverlay} />
          <div style={s.visualNav}>
            <Link to="/" style={s.navLink}>Browse fleet</Link>
            <Link to="/login" style={s.navBtn}>Sign in</Link>
          </div>

        </div>

        <div style={s.formPanel}>
          <h2 style={s.heading}>Create account</h2>
          <p style={s.subheading}>Get started in less than a minute</p>

          {error && <div style={s.errorBox}>{error}</div>}

          <form onSubmit={handleSubmit} style={s.form}>
            <div style={s.field}>
              <label style={s.label}>Full Name *</label>
              <input style={s.input} type="text" name="full_name"
                placeholder="Aarav Sharma" value={formData.full_name}
                onChange={handleChange} required />
            </div>

            <div style={s.row}>
              <div style={{ ...s.field, flex: 1 }}>
                <label style={s.label}>Email *</label>
                <input style={s.input} type="email" name="email"
                  placeholder="aarav@gmail.com" value={formData.email}
                  onChange={handleChange} required />
              </div>
              <div style={{ ...s.field, flex: 1 }}>
                <label style={s.label}>Phone</label>
                <input style={s.input} type="tel" name="phone"
                  placeholder="98XXXXXXXX" value={formData.phone}
                  onChange={handleChange} />
              </div>
            </div>

            <div style={s.field}>
              <label style={s.label}>I want to</label>
              <select style={s.input} name="role" value={formData.role} onChange={handleChange}>
                <option value="customer">Rent a vehicle</option>
                <option value="owner">List my vehicle</option>
              </select>
            </div>

            <div style={s.row}>
              <div style={{ ...s.field, flex: 1 }}>
                <label style={s.label}>Password *</label>
                <input style={s.input} type="password" name="password"
                  placeholder="Min 8 chars" value={formData.password}
                  onChange={handleChange} required />
              </div>
              <div style={{ ...s.field, flex: 1 }}>
                <label style={s.label}>Confirm *</label>
                <input style={s.input} type="password" name="confirm_password"
                  placeholder="Repeat" value={formData.confirm_password}
                  onChange={handleChange} required />
              </div>
            </div>

            <button type="submit"
              style={{ ...s.button, opacity: loading ? 0.7 : 1 }}
              disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div style={s.divider}>
            <div style={s.dividerLine} />
            <span style={s.dividerText}>or</span>
            <div style={s.dividerLine} />
          </div>

          <a href="http://localhost:8000/api/auth/google" style={s.googleBtn}>
            <img src="https://www.google.com/favicon.ico" alt="" style={s.googleIcon} />
            Sign up with Google
          </a>

          <p style={s.footerText}>
            Already have an account?{' '}
            <Link to="/login" style={s.link}>Sign in</Link>
          </p>
        </div>

      </div>
    </div>
  );
};

const s = {
  page: {
    minHeight: '100vh',
    background: '#EDEEF5',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
    fontFamily: "'Inter', sans-serif",
  },
  container: {
    display: 'flex',
    width: '100%',
    maxWidth: '960px',
    minHeight: '620px',
    background: '#fff',
    borderRadius: '24px',
    overflow: 'hidden',
    boxShadow: '0 24px 64px rgba(20,33,61,0.13)',
  },
  visualPanel: {
    flex: '0 0 340px',
    backgroundImage: `url(${driveNepalImg})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    padding: '2rem',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    position: 'relative',
  },
  visualOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(160deg, rgba(20,33,61,0.75) 0%, rgba(29,53,87,0.65) 100%)',
  },
  visualNav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: '12px',
    position: 'relative',
    zIndex: 1,
  },
  navLink: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: '0.85rem',
    textDecoration: 'none',
  },
  navBtn: {
    border: '1px solid rgba(255,255,255,0.35)',
    color: '#fff',
    fontSize: '0.85rem',
    padding: '0.45rem 1rem',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: '500',
  },
  visualFooter: {
    color: 'rgba(255,255,255,0.35)',
    fontSize: '0.78rem',
    margin: 0,
    textAlign: 'center',
    letterSpacing: '0.05em',
    position: 'relative',
    zIndex: 1,
  },
  formPanel: {
    flex: 1,
    padding: '2.5rem 2.5rem',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    overflowY: 'auto',
  },
  heading: {
    fontSize: '1.9rem',
    fontWeight: '700',
    color: '#14213d',
    margin: '0 0 0.3rem',
    fontFamily: 'Outfit, sans-serif',
  },
  subheading: {
    color: '#888',
    fontSize: '0.9rem',
    margin: '0 0 1.5rem',
  },
  errorBox: {
    background: '#fdecea',
    border: '1px solid #e63946',
    color: '#c1121f',
    borderRadius: '8px',
    padding: '0.75rem 1rem',
    marginBottom: '1rem',
    fontSize: '0.875rem',
  },
  form: { display: 'flex', flexDirection: 'column', gap: '0.9rem' },
  row: { display: 'flex', gap: '0.75rem' },
  field: { display: 'flex', flexDirection: 'column', gap: '0.4rem' },
  label: { color: '#555', fontSize: '0.82rem', fontWeight: '500' },
  input: {
    background: '#f7f7fa',
    border: '1px solid #e0e0e6',
    borderRadius: '10px',
    padding: '0.75rem 1rem',
    color: '#14213d',
    fontSize: '0.9rem',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
  },
  button: {
    background: '#60A5FA',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    padding: '0.85rem',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '0.4rem',
    width: '100%',
  },
  divider: { display: 'flex', alignItems: 'center', gap: '0.6rem', margin: '1.1rem 0' },
  dividerLine: { flex: 1, height: '1px', background: '#e0e0e6' },
  dividerText: { color: '#999', fontSize: '0.8rem' },
  googleBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.6rem',
    background: '#fff',
    border: '1px solid #e0e0e6',
    borderRadius: '10px',
    padding: '0.75rem',
    textDecoration: 'none',
    color: '#14213d',
    fontWeight: '500',
    fontSize: '0.9rem',
  },
  googleIcon: { width: '18px', height: '18px' },
  footerText: { textAlign: 'center', color: '#888', fontSize: '0.875rem', marginTop: '1.2rem' },
  link: { color: '#60A5FA', textDecoration: 'none', fontWeight: '600' },
};

export default Register;
