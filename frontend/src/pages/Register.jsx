import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const Register = () => {
  const navigate = useNavigate();
  const { login }  = useAuth();

  const [formData, setFormData] = useState({
    full_name: '',
    email:     '',
    password:  '',
    confirm_password: '',
    role:      'customer',
    phone:     '',
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
      <div style={styles.card}>

        {}
        <div style={styles.brand}>
          <span style={styles.brandText}>Drive</span>
          <span style={styles.brandAccent}>Nepal</span>
        </div>
        <p style={styles.subtitle}>Create your account</p>

        {}
        {error && <div style={styles.errorBox}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>

          {}
          <div style={styles.field}>
            <label style={styles.label}>Full Name *</label>
            <input
              style={styles.input}
              type="text"
              name="full_name"
              placeholder="Aarav Sharma"
              value={formData.full_name}
              onChange={handleChange}
              required
            />
          </div>

          {}
          <div style={styles.field}>
            <label style={styles.label}>Email Address *</label>
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

          {}
          <div style={styles.field}>
            <label style={styles.label}>Phone Number</label>
            <input
              style={styles.input}
              type="tel"
              name="phone"
              placeholder="98XXXXXXXX"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          {}
          <div style={styles.field}>
            <label style={styles.label}>I want to</label>
            <select
              style={styles.input}
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="customer">Rent a vehicle</option>
              <option value="owner">List my vehicle</option>
            </select>
          </div>

          {}
          <div style={styles.field}>
            <label style={styles.label}>Password *</label>
            <input
              style={styles.input}
              type="password"
              name="password"
              placeholder="Minimum 8 characters"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {}
          <div style={styles.field}>
            <label style={styles.label}>Confirm Password *</label>
            <input
              style={styles.input}
              type="password"
              name="confirm_password"
              placeholder="Repeat your password"
              value={formData.confirm_password}
              onChange={handleChange}
              required
            />
          </div>

          {}
          <button
            type="submit"
            style={{ ...styles.button, opacity: loading ? 0.7 : 1 }}
            disabled={loading}
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>

        </form>

        <p style={styles.footerText}>
          Already have an account?{' '}
          <Link to="/login" style={styles.link}>Sign in</Link>
        </p>

      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight:       '100vh',
    background:      '#0f0f0f',
    display:         'flex',
    alignItems:      'center',
    justifyContent:  'center',
    padding:         '2rem',
    fontFamily:      "'Segoe UI', sans-serif",
  },
  card: {
    background:   '#1a1a1a',
    borderRadius: '16px',
    padding:      '2.5rem',
    width:        '100%',
    maxWidth:     '460px',
    border:       '1px solid #2a2a2a',
  },
  brand: {
    textAlign:  'center',
    fontSize:   '1.8rem',
    fontWeight: '700',
    marginBottom: '0.25rem',
  },
  brandText: {
    color: '#ffffff',
  },
  brandAccent: {
    color: '#e63946',
  },
  subtitle: {
    textAlign:    'center',
    color:        '#888',
    fontSize:     '0.9rem',
    marginBottom: '1.5rem',
  },
  errorBox: {
    background:   '#2d1515',
    border:       '1px solid #e63946',
    color:        '#ff6b6b',
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
    color:    '#ccc',
    fontSize: '0.85rem',
  },
  input: {
    background:   '#252525',
    border:       '1px solid #333',
    borderRadius: '8px',
    padding:      '0.75rem 1rem',
    color:        '#fff',
    fontSize:     '0.95rem',
    outline:      'none',
    width:        '100%',
    boxSizing:    'border-box',
  },
  button: {
    background:   '#e63946',
    color:        '#fff',
    border:       'none',
    borderRadius: '8px',
    padding:      '0.85rem',
    fontSize:     '1rem',
    fontWeight:   '600',
    cursor:       'pointer',
    marginTop:    '0.5rem',
    width:        '100%',
  },
  footerText: {
    textAlign:  'center',
    color:      '#888',
    fontSize:   '0.875rem',
    marginTop:  '1.25rem',
  },
  link: {
    color:          '#e63946',
    textDecoration: 'none',
    fontWeight:     '600',
  },
};

export default Register;