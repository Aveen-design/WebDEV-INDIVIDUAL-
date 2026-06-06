import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const ChooseRole = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { login } = useAuth();
  const pending = params.get('pending');

  const [selected, setSelected] = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  const confirm = async () => {
    if (!selected) return setError('Please choose how you want to use DriveNepal');
    setLoading(true);
    try {
      const res = await api.post('/auth/google/complete', { pending_token: pending, role: selected });
      const token = res.data.data.token;
      localStorage.setItem('token', token);
      const me = await api.get('/auth/me');
      login(me.data.data.user, token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please sign in again.');
    } finally {
      setLoading(false);
    }
  };

  if (!pending) {
    navigate('/login');
    return null;
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.brand}>
          <span style={{ color: '#14213d' }}>Drive</span>
          <span style={{ color: '#60A5FA' }}>Nepal</span>
        </div>
        <h2 style={styles.heading}>How will you use DriveNepal?</h2>
        <p style={styles.sub}>Choose your account type to finish setting up.</p>

        {error && <div style={styles.error}>{error}</div>}

        <div style={styles.options}>
          <div onClick={() => setSelected('customer')}
            style={{ ...styles.option, ...(selected === 'customer' ? styles.optionActive : {}) }}>
            <div style={styles.optIcon}>🔑</div>
            <h3 style={styles.optTitle}>Rent a vehicle</h3>
            <p style={styles.optDesc}>Browse and book vehicles across Nepal</p>
          </div>

          <div onClick={() => setSelected('owner')}
            style={{ ...styles.option, ...(selected === 'owner' ? styles.optionActive : {}) }}>
            <div style={styles.optIcon}>🚗</div>
            <h3 style={styles.optTitle}>List my vehicle</h3>
            <p style={styles.optDesc}>Earn by renting out your vehicles</p>
          </div>
        </div>

        <button onClick={confirm} style={styles.btn} disabled={loading}>
          {loading ? 'Setting up...' : 'Continue'}
        </button>
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: '100vh', background: '#EDEEF5', display: 'flex',
    alignItems: 'center', justifyContent: 'center', padding: '2rem', fontFamily: "'Inter', sans-serif",
  },
  card: {
    background: '#fff', borderRadius: '20px', padding: '2.5rem', width: '100%',
    maxWidth: '460px', boxShadow: '0 20px 60px rgba(0,0,0,0.12)',
  },
  brand: { fontSize: '1.3rem', fontWeight: '700', marginBottom: '1.5rem' },
  heading: { fontSize: '1.5rem', fontWeight: '700', color: '#14213d', margin: '0 0 0.3rem', fontFamily: 'Outfit, sans-serif' },
  sub: { color: '#888', fontSize: '0.9rem', margin: '0 0 1.5rem' },
  error: { background: '#fdecea', border: '1px solid #e63946', color: '#c1121f',
    borderRadius: '8px', padding: '0.7rem 1rem', marginBottom: '1rem', fontSize: '0.85rem' },
  options: { display: 'flex', gap: '1rem', marginBottom: '1.5rem' },
  option: {
    flex: 1, border: '2px solid #e0e0e6', borderRadius: '14px', padding: '1.3rem 1rem',
    textAlign: 'center', cursor: 'pointer', transition: 'all 0.15s',
  },
  optionActive: { borderColor: '#60A5FA', background: '#f0f7ff' },
  optIcon: { fontSize: '2rem', marginBottom: '0.5rem' },
  optTitle: { fontSize: '1rem', fontWeight: '700', color: '#14213d', margin: '0 0 0.3rem' },
  optDesc: { fontSize: '0.78rem', color: '#888', margin: 0, lineHeight: 1.4 },
  btn: {
    width: '100%', background: '#60A5FA', color: '#fff', border: 'none', borderRadius: '10px',
    padding: '0.85rem', fontSize: '1rem', fontWeight: '600', cursor: 'pointer',
  },
};

export default ChooseRole;