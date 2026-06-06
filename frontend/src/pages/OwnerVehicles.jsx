import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import api from '../utils/api';

const OwnerVehicles = () => {
  const location = useLocation();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [msg, setMsg]           = useState(location.state?.added ? 'Vehicle listed successfully!' : '');

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const res = await api.get('/vehicles/owner/my');
      setVehicles(res.data.data);
    } catch {
      setMsg('Could not load your vehicles.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchVehicles(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this vehicle listing?')) return;
    try {
      await api.delete(`/vehicles/${id}`);
      setMsg('Vehicle removed.');
      fetchVehicles();
    } catch {
      setMsg('Could not remove vehicle.');
    }
  };

  const statusBadge = (status) => {
    const map = {
      approved: { bg: '#eafaf1', text: '#1e7e44' },
      pending:  { bg: '#fff7e6', text: '#b06f00' },
      rejected: { bg: '#fff1f0', text: '#cf1322' },
    };
    const c = map[status] || map.pending;
    return <span style={{ background: c.bg, color: c.text, fontSize: '0.72rem', fontWeight: 600,
      padding: '0.25rem 0.7rem', borderRadius: '20px', textTransform: 'capitalize' }}>{status}</span>;
  };

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.head}>
          <div>
            <h1 style={styles.title}>My Vehicles</h1>
            <p style={styles.sub}>Manage your listings</p>
          </div>
          <Link to="/owner/vehicles/new" style={styles.addBtn}>+ Add Vehicle</Link>
        </div>

        {msg && <div style={styles.infoBox}>{msg}</div>}

        {loading ? (
          <div style={styles.message}>Loading...</div>
        ) : vehicles.length === 0 ? (
          <div style={styles.empty}>
            <p>You haven't listed any vehicles yet.</p>
            <Link to="/owner/vehicles/new" style={styles.addBtn}>List Your First Vehicle</Link>
          </div>
        ) : (
          <div style={styles.list}>
            {vehicles.map((v) => (
              <div key={v.id} style={styles.row}>
                <div style={styles.thumb}>🚗</div>
                <div style={styles.info}>
                  <h3 style={styles.vTitle}>{v.title}</h3>
                  <p style={styles.vMeta}>{v.brand} · {v.location} · Rs {Number(v.daily_rate).toLocaleString()}/day</p>
                  <div style={{ marginTop: '0.4rem' }}>{statusBadge(v.verification_status)}</div>
                </div>
                <div style={styles.actions}>
                  <Link to={`/vehicles/${v.id}`} style={styles.viewBtn}>View</Link>
                  <button onClick={() => handleDelete(v.id)} style={styles.delBtn}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

const styles = {
  page: { background: '#EDEEF5', minHeight: '100vh', fontFamily: "'Inter', sans-serif" },
  container: { maxWidth: '900px', margin: '0 auto', padding: '8rem 1.5rem 1.5rem' },
  head: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' },
  title: { color: '#14213d', fontSize: '1.9rem', fontWeight: '700', margin: 0, fontFamily: 'Outfit, sans-serif' },
  sub: { color: '#888', margin: '0.3rem 0 0' },
  addBtn: {
    background: '#60A5FA', color: '#fff', textDecoration: 'none',
    padding: '0.65rem 1.3rem', borderRadius: '8px', fontSize: '0.88rem', fontWeight: '600',
  },
  infoBox: {
    background: '#e6f4ff', border: '1px solid #60A5FA', color: '#0958d9',
    borderRadius: '10px', padding: '0.8rem 1.1rem', marginBottom: '1rem', fontSize: '0.88rem',
  },
  message: { color: '#888', textAlign: 'center', padding: '3rem' },
  empty: { textAlign: 'center', padding: '3rem', color: '#888' },
  list: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  row: {
    display: 'flex', alignItems: 'center', gap: '1rem', background: '#fff',
    border: '1px solid rgba(0,0,0,0.06)', borderRadius: '14px', padding: '1rem 1.2rem',
    boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
  },
  thumb: {
    width: '60px', height: '60px', borderRadius: '10px', background: '#f0f0f5',
    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', flexShrink: 0,
  },
  info: { flex: 1 },
  vTitle: { color: '#14213d', fontSize: '1.05rem', fontWeight: '600', margin: 0 },
  vMeta: { color: '#888', fontSize: '0.83rem', margin: '0.2rem 0 0' },
  actions: { display: 'flex', gap: '0.5rem' },
  viewBtn: {
    background: '#f0f0f5', color: '#14213d', textDecoration: 'none',
    padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.83rem', fontWeight: '600',
  },
  delBtn: {
    background: '#fff', color: '#cf1322', border: '1px solid #ffccc7', borderRadius: '8px',
    padding: '0.5rem 1rem', fontSize: '0.83rem', fontWeight: '600', cursor: 'pointer',
  },
};

export default OwnerVehicles;