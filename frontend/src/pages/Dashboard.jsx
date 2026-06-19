import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { useAuth } from '../context/AuthContext';
import ReviewForm from '../components/ReviewForm';
import api from '../utils/api';

const STATUS_COLORS = {
  pending:     { bg: '#fff7e6', text: '#b06f00' },
  confirmed:   { bg: '#e6f4ff', text: '#0958d9' },
  handed_over: { bg: '#f0e6ff', text: '#722ed1' },
  returned:    { bg: '#e6fffb', text: '#08979c' },
  completed:   { bg: '#eafaf1', text: '#1e7e44' },
  cancelled:   { bg: '#fff1f0', text: '#cf1322' },
  rejected:    { bg: '#fff1f0', text: '#cf1322' },
};

const StatusBadge = ({ status }) => {
  const c = STATUS_COLORS[status] || { bg: '#eee', text: '#666' };
  return (
    <span style={{ background: c.bg, color: c.text, fontSize: '0.72rem', fontWeight: 600,
      padding: '0.25rem 0.7rem', borderRadius: '20px', textTransform: 'capitalize' }}>
      {status.replace('_', ' ')}
    </span>
  );
};

const Dashboard = () => {
  const { user } = useAuth();
  const location = useLocation();
  const isOwner = user?.role === 'owner';

  const [bookings, setBookings]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [actionMsg, setActionMsg]     = useState('');
  const [reviewingId, setReviewingId] = useState(null);
  const [disputingId, setDisputingId] = useState(null);
  const [disputeText, setDisputeText] = useState('');

  const successRef = location.state?.bookingSuccess;

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const endpoint = isOwner ? '/bookings/owner' : '/bookings/my';
      const res = await api.get(endpoint);
      setBookings(res.data.data);
    } catch {
      setActionMsg('Could not load bookings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBookings(); }, []);

  const changeStatus = async (id, status) => {
    try {
      await api.patch(`/bookings/${id}/status`, { status });
      setActionMsg(`Booking ${status.replace('_', ' ')}.`);
      fetchBookings();
    } catch (err) {
      setActionMsg(err.response?.data?.message || 'Could not update status.');
    }
  };

  const submitDispute = async (bookingId) => {
    if (!disputeText.trim()) return;
    try {
      await api.post('/disputes', { booking_id: bookingId, reason: disputeText });
      setActionMsg('Dispute submitted for admin review.');
      setDisputingId(null);
      setDisputeText('');
    } catch (err) {
      setActionMsg(err.response?.data?.message || 'Could not submit dispute.');
    }
  };

  const ownerActions = (b) => {
    if (b.status === 'pending') return [['confirmed', 'Accept'], ['rejected', 'Reject']];
    if (b.status === 'confirmed') return [['handed_over', 'Mark Handed Over'], ['cancelled', 'Cancel']];
    if (b.status === 'handed_over') return [['returned', 'Mark Returned']];
    if (b.status === 'returned') return [['completed', 'Mark Completed']];
    return [];
  };

  const customerActions = (b) => {
    if (b.status === 'pending' || b.status === 'confirmed') return [['cancelled', 'Cancel Booking']];
    return [];
  };

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.head}>
          <div>
            <h1 style={styles.title}>{isOwner ? 'Owner Dashboard' : 'My Bookings'}</h1>
            <p style={styles.sub}>Welcome back, {user?.full_name?.split(' ')[0]}</p>
          </div>
          {isOwner && (
            <Link to="/owner/vehicles" style={styles.manageBtn}>Manage My Vehicles</Link>
          )}
        </div>

        {successRef && (
          <div style={styles.successBox}>
            Booking confirmed! Your reference is <strong>{successRef}</strong>
          </div>
        )}
        {actionMsg && <div style={styles.infoBox}>{actionMsg}</div>}

        {loading ? (
          <div style={styles.message}>Loading...</div>
        ) : bookings.length === 0 ? (
          <div style={styles.empty}>
            <p>{isOwner ? 'No bookings on your vehicles yet.' : "You haven't made any bookings yet."}</p>
            {!isOwner && <Link to="/vehicles" style={styles.browseBtn}>Browse Vehicles</Link>}
          </div>
        ) : (
          <div style={styles.list}>
            {bookings.map((b) => {
              const actions = isOwner ? ownerActions(b) : customerActions(b);
              return (
                <div key={b.id} style={styles.bookingCard}>
                  <div style={styles.cardTop}>
                    <div>
                      <h3 style={styles.vehicleTitle}>{b.vehicle_title}</h3>
                      <p style={styles.ref}>Ref: {b.reference_code}</p>
                    </div>
                    <StatusBadge status={b.status} />
                  </div>

                  <div style={styles.details}>
                    <Detail label="Dates" value={`${fmt(b.start_date)} – ${fmt(b.end_date)} (${b.total_days}d)`} />
                    {isOwner
                      ? <Detail label="Customer" value={b.customer_name} />
                      : <Detail label="Driver" value={b.driver_required ? 'With driver' : 'Self drive'} />}
                    <Detail label="Total" value={`Rs ${Number(b.total_amount).toLocaleString()}`} />
                    {isOwner && b.customer_phone && <Detail label="Phone" value={b.customer_phone} />}
                  </div>

                  <div style={{ marginTop: '0.8rem' }}>
                    <Link to={`/messages/${b.id}`}
                      style={{ ...styles.messageBtn, textDecoration: 'none', display: 'inline-block' }}>
                      Message {isOwner ? 'Customer' : 'Owner'}
                    </Link>
                  </div>

                  {actions.length > 0 && (
                    <div style={styles.actions}>
                      {actions.map(([status, label]) => (
                        <button key={status} onClick={() => changeStatus(b.id, status)}
                          style={status === 'rejected' || status === 'cancelled' ? styles.dangerBtn : styles.actionBtn}>
                          {label}
                        </button>
                      ))}
                    </div>
                  )}

                  {!isOwner && b.status === 'completed' && (
                    <div style={{ marginTop: '1rem', borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: '0.5rem' }}>
                      {reviewingId === b.id ? (
                        <ReviewForm bookingId={b.id} onSuccess={() => { setReviewingId(null); setActionMsg('Thanks for your review!'); fetchBookings(); }} />
                      ) : (
                        <button onClick={() => setReviewingId(b.id)} style={styles.actionBtn}>
                          Leave a Review
                        </button>
                      )}
                    </div>
                  )}

                  {['handed_over', 'returned', 'completed'].includes(b.status) && (
                    <div style={{ marginTop: '0.8rem' }}>
                      {disputingId === b.id ? (
                        <div>
                          <textarea value={disputeText} onChange={(e) => setDisputeText(e.target.value)}
                            placeholder="Describe the issue..." rows={2}
                            style={{ width: '100%', background: '#f7f7fa', border: '1px solid #e0e0e6',
                              borderRadius: '8px', padding: '0.6rem', fontSize: '0.85rem',
                              fontFamily: 'inherit', resize: 'vertical', boxSizing: 'border-box', marginBottom: '0.5rem' }} />
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button onClick={() => submitDispute(b.id)} style={styles.dangerBtn}>Submit Dispute</button>
                            <button onClick={() => { setDisputingId(null); setDisputeText(''); }}
                              style={{ ...styles.messageBtn, border: 'none', cursor: 'pointer' }}>Cancel</button>
                          </div>
                        </div>
                      ) : (
                        <button onClick={() => setDisputingId(b.id)}
                          style={{ background: 'transparent', border: 'none', color: '#cf1322',
                            fontSize: '0.8rem', cursor: 'pointer', padding: 0, textDecoration: 'underline' }}>
                          Raise a dispute
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

const Detail = ({ label, value }) => (
  <div>
    <span style={styles.detailLabel}>{label}</span>
    <span style={styles.detailValue}>{value}</span>
  </div>
);

const fmt = (d) => new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

const styles = {
  page: { background: '#EDEEF5', minHeight: '100vh', fontFamily: "'Inter', sans-serif" },
  container: { maxWidth: '900px', margin: '0 auto', padding: '8rem 1.5rem 1.5rem' },
  head: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' },
  title: { color: '#14213d', fontSize: '1.9rem', fontWeight: '700', margin: 0, fontFamily: 'Outfit, sans-serif' },
  sub: { color: '#888', margin: '0.3rem 0 0' },
  manageBtn: {
    background: '#14213d', color: '#fff', textDecoration: 'none',
    padding: '0.65rem 1.2rem', borderRadius: '8px', fontSize: '0.85rem', fontWeight: '600',
  },
  successBox: {
    background: '#eafaf1', border: '1px solid #2ecc71', color: '#1e7e44',
    borderRadius: '10px', padding: '0.9rem 1.1rem', marginBottom: '1rem', fontSize: '0.9rem',
  },
  infoBox: {
    background: '#e6f4ff', border: '1px solid #60A5FA', color: '#0958d9',
    borderRadius: '10px', padding: '0.8rem 1.1rem', marginBottom: '1rem', fontSize: '0.88rem',
  },
  message: { color: '#888', textAlign: 'center', padding: '3rem' },
  empty: { textAlign: 'center', padding: '3rem', color: '#888' },
  browseBtn: {
    display: 'inline-block', marginTop: '1rem', background: '#60A5FA', color: '#fff',
    textDecoration: 'none', padding: '0.7rem 1.5rem', borderRadius: '8px', fontWeight: '600',
  },
  list: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  bookingCard: {
    background: '#fff', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '14px',
    padding: '1.3rem', boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
  },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' },
  vehicleTitle: { color: '#14213d', fontSize: '1.15rem', fontWeight: '700', margin: 0 },
  ref: { color: '#999', fontSize: '0.8rem', margin: '0.2rem 0 0' },
  details: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.8rem',
    paddingBottom: '0.5rem',
  },
  detailLabel: { display: 'block', color: '#999', fontSize: '0.72rem', marginBottom: '0.15rem' },
  detailValue: { color: '#14213d', fontSize: '0.9rem', fontWeight: '600' },
  messageBtn: {
    background: '#f0f0f5', color: '#14213d', border: 'none', borderRadius: '8px',
    padding: '0.5rem 1.1rem', fontSize: '0.85rem', fontWeight: '600',
  },
  actions: { display: 'flex', gap: '0.6rem', marginTop: '1rem', flexWrap: 'wrap',
    borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: '1rem' },
  actionBtn: {
    background: '#60A5FA', color: '#fff', border: 'none', borderRadius: '8px',
    padding: '0.55rem 1.1rem', fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer',
  },
  dangerBtn: {
    background: '#fff', color: '#cf1322', border: '1px solid #ffccc7', borderRadius: '8px',
    padding: '0.55rem 1.1rem', fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer',
  },
};

export default Dashboard;