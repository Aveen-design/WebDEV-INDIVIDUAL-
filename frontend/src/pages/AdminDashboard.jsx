import { useState, useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import api from '../utils/api';

const AdminDashboard = () => {
  const [tab, setTab] = useState('pending');
  const [stats, setStats] = useState(null);
  const [pending, setPending] = useState([]);
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [disputes, setDisputes] = useState([]);
  const [msg, setMsg] = useState('');

  const loadStats = async () => {
    try { const r = await api.get('/admin/stats'); setStats(r.data.data); } catch {}
  };
  const loadPending = async () => {
    try { const r = await api.get('/admin/vehicles/pending'); setPending(r.data.data); } catch {}
  };
  const loadUsers = async () => {
    try { const r = await api.get('/admin/users'); setUsers(r.data.data); } catch {}
  };
  const loadBookings = async () => {
    try { const r = await api.get('/admin/bookings'); setBookings(r.data.data); } catch {}
  };
  const loadDisputes = async () => {
    try { const r = await api.get('/disputes'); setDisputes(r.data.data); } catch {}
  };

  useEffect(() => {
    loadStats();
    loadPending();
  }, []);

  useEffect(() => {
    if (tab === 'users') loadUsers();
    if (tab === 'bookings') loadBookings();
    if (tab === 'pending') loadPending();
    if (tab === 'disputes') loadDisputes();
  }, [tab]);

  const review = async (id, status) => {
    try {
      await api.patch(`/admin/vehicles/${id}/review`, { status });
      setMsg(`Vehicle ${status}.`);
      loadPending();
      loadStats();
    } catch { setMsg('Action failed.'); }
  };

  const toggleUser = async (id, isActive) => {
    try {
      await api.patch(`/admin/users/${id}/toggle`, { is_active: !isActive }); 
      loadUsers();
    } catch { setMsg('Could not update user.'); }
  };

  const resolveDispute = async (id) => {
    const resolution = window.prompt('Enter your resolution:');
    if (!resolution) return;
    try {
      await api.patch(`/disputes/${id}/resolve`, { resolution, status: 'resolved' });
      setMsg('Dispute resolved.');
      loadDisputes();
    } catch { setMsg('Could not resolve.'); }
  };

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.container}>
        <h1 style={styles.title}>Admin Dashboard</h1>

        {stats && (
          <div style={styles.statGrid}>
            <Stat label="Users" value={stats.users} />
            <Stat label="Vehicles" value={stats.vehicles} />
            <Stat label="Pending" value={stats.pending} highlight />
            <Stat label="Bookings" value={stats.bookings} />
            <Stat label="Revenue" value={`Rs ${stats.revenue.toLocaleString()}`} />
          </div>
        )}

        {msg && <div style={styles.msg}>{msg}</div>}

        <div style={styles.tabs}>
          {['pending', 'users', 'bookings', 'disputes'].map((t) => (
            <button key={t} onClick={() => setTab(t)}
              style={{ ...styles.tab, ...(tab === t ? styles.tabActive : {}) }}>
              {t === 'pending' ? 'Pending Listings' : t === 'users' ? 'Users'
                : t === 'bookings' ? 'All Bookings' : 'Disputes'}
            </button>
          ))}
        </div>

        {tab === 'pending' && (
          <div style={styles.list}>
            {pending.length === 0 ? <p style={styles.empty}>No pending listings.</p> :
              pending.map((v) => (
                <div key={v.id} style={styles.card}>
                  <div>
                    <h3 style={styles.cardTitle}>{v.title}</h3>
                    <p style={styles.cardMeta}>{v.brand} {v.model} · {v.year} · {v.location} · Rs {Number(v.daily_rate).toLocaleString()}/day</p>
                    <p style={styles.cardOwner}>Owner: {v.owner_name} ({v.owner_email})</p>
                  </div>
                  <div style={styles.cardActions}>
                    <button onClick={() => review(v.id, 'approved')} style={styles.approveBtn}>Approve</button>
                    <button onClick={() => review(v.id, 'rejected')} style={styles.rejectBtn}>Reject</button>
                  </div>
                </div>
              ))}
          </div>
        )}

        {tab === 'users' && (
          <div style={styles.list}>
            {users.map((u) => (
              <div key={u.id} style={styles.card}>
                <div>
                  <h3 style={styles.cardTitle}>{u.full_name}</h3>
                  <p style={styles.cardMeta}>{u.email} · {u.role} · joined {fmt(u.created_at)}</p>
                </div>
                <button onClick={() => toggleUser(u.id, u.is_active)}
                  style={u.is_active ? styles.rejectBtn : styles.approveBtn}>
                  {u.is_active ? 'Suspend' : 'Activate'}
                </button>
              </div>
            ))}
          </div>
        )}

        {tab === 'bookings' && (
          <div style={styles.list}>
            {bookings.map((b) => (
              <div key={b.id} style={styles.card}>
                <div>
                  <h3 style={styles.cardTitle}>{b.vehicle_title} <span style={styles.ref}>({b.reference_code})</span></h3>
                  <p style={styles.cardMeta}>{b.customer_name} → {b.owner_name} · {fmt(b.start_date)} – {fmt(b.end_date)}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={styles.amount}>Rs {Number(b.total_amount).toLocaleString()}</div>
                  <div style={styles.statusTag}>{b.status.replace('_', ' ')}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'disputes' && (
          <div style={styles.list}>
            {disputes.length === 0 ? <p style={styles.empty}>No disputes.</p> :
              disputes.map((d) => (
                <div key={d.id} style={styles.card}>
                  <div>
                    <h3 style={styles.cardTitle}>{d.vehicle_title} <span style={styles.ref}>({d.reference_code})</span></h3>
                    <p style={styles.cardMeta}>Raised by {d.raised_by_name}: {d.reason}</p>
                    {d.resolution && <p style={{ color: '#1e7e44', fontSize: '0.82rem', margin: '0.3rem 0 0' }}>Resolution: {d.resolution}</p>}
                  </div>
                  {d.status === 'open' ? (
                    <button onClick={() => resolveDispute(d.id)} style={styles.approveBtn}>Resolve</button>
                  ) : (
                    <span style={styles.statusTag}>{d.status}</span>
                  )}
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

const Stat = ({ label, value, highlight }) => (
  <div style={{ ...styles.statBox, ...(highlight && value > 0 ? styles.statHighlight : {}) }}>
    <div style={styles.statValue}>{value}</div>
    <div style={styles.statLabel}>{label}</div>
  </div>
);

const fmt = (d) => new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

const styles = {
  page: { background: '#EDEEF5', minHeight: '100vh', fontFamily: "'Inter', sans-serif" },
  container: { maxWidth: '1000px', margin: '0 auto', padding: '8rem 1.5rem 2rem' },
  title: { color: '#14213d', fontSize: '1.9rem', fontWeight: '700', margin: '0 0 1.5rem', fontFamily: 'Outfit, sans-serif' },
  statGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '1rem', marginBottom: '1.5rem' },
  statBox: { background: '#fff', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '12px', padding: '1.2rem', textAlign: 'center' },
  statHighlight: { border: '1px solid #faad14', background: '#fffbe6' },
  statValue: { fontSize: '1.6rem', fontWeight: '800', color: '#14213d' },
  statLabel: { fontSize: '0.8rem', color: '#888', marginTop: '0.2rem' },
  msg: { background: '#e6f4ff', border: '1px solid #60A5FA', color: '#0958d9', borderRadius: '10px', padding: '0.8rem 1.1rem', marginBottom: '1rem', fontSize: '0.88rem' },
  tabs: { display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' },
  tab: { background: '#fff', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '8px', padding: '0.6rem 1.2rem', fontSize: '0.88rem', fontWeight: '600', cursor: 'pointer', color: '#666' },
  tabActive: { background: '#60A5FA', color: '#fff', border: '1px solid #60A5FA' },
  list: { display: 'flex', flexDirection: 'column', gap: '0.8rem' },
  empty: { color: '#888', textAlign: 'center', padding: '3rem' },
  card: { background: '#fff', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '12px', padding: '1.1rem 1.3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' },
  cardTitle: { color: '#14213d', fontSize: '1rem', fontWeight: '700', margin: 0 },
  ref: { color: '#999', fontSize: '0.8rem', fontWeight: '400' },
  cardMeta: { color: '#888', fontSize: '0.82rem', margin: '0.3rem 0 0' },
  cardOwner: { color: '#666', fontSize: '0.8rem', margin: '0.2rem 0 0' },
  cardActions: { display: 'flex', gap: '0.5rem', flexShrink: 0 },
  approveBtn: { background: '#52c41a', color: '#fff', border: 'none', borderRadius: '8px', padding: '0.5rem 1.1rem', fontSize: '0.83rem', fontWeight: '600', cursor: 'pointer' },
  rejectBtn: { background: '#fff', color: '#cf1322', border: '1px solid #ffccc7', borderRadius: '8px', padding: '0.5rem 1.1rem', fontSize: '0.83rem', fontWeight: '600', cursor: 'pointer' },
  amount: { color: '#14213d', fontWeight: '700', fontSize: '0.95rem' },
  statusTag: { color: '#888', fontSize: '0.78rem', textTransform: 'capitalize', marginTop: '0.2rem' },
};

export default AdminDashboard;