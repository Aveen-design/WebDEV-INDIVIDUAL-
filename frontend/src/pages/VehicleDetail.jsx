import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const VehicleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [vehicle, setVehicle] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  useEffect(() => {
    const fetchVehicle = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/vehicles/${id}`);
        setVehicle(res.data.data);
        const rev = await api.get(`/reviews/vehicle/${id}`);
        setReviews(rev.data.data);
      } catch (err) {
        setError(err.response?.status === 404 ? 'Vehicle not found.' : 'Could not load this vehicle.');
      } finally {
        setLoading(false);
      }
    };
    fetchVehicle();
  }, [id]);

  const handleBook = () => {
    if (!user) navigate('/login');
    else navigate(`/vehicles/${id}/book`);
  };

  if (loading) {
    return (<div style={styles.page}><Navbar /><div style={styles.message}>Loading...</div></div>);
  }

  if (error) {
    return (
      <div style={styles.page}>
        <Navbar />
        <div style={styles.message}>
          {error}<br />
          <Link to="/vehicles" style={styles.backLink}>← Back to vehicles</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.container}>
        <Link to="/vehicles" style={styles.backLink}>← Back to vehicles</Link>

        <div style={styles.layout}>
          <div style={styles.main}>
            <div style={styles.imageWrap}>
              {vehicle.primary_photo ? (
                <img src={vehicle.primary_photo} alt={vehicle.title} style={styles.image} />
              ) : (
                <div style={styles.placeholder}>🚗</div>
              )}
              <span style={styles.typeBadge}>{vehicle.type}</span>
            </div>

            <h1 style={styles.title}>{vehicle.title}</h1>
            <p style={styles.location}>📍 {vehicle.location}</p>

            <div style={styles.specGrid}>
              <Spec label="Brand" value={vehicle.brand} />
              <Spec label="Model" value={vehicle.model} />
              <Spec label="Year" value={vehicle.year} />
              <Spec label="Seats" value={vehicle.seats} />
              <Spec label="Transmission" value={cap(vehicle.transmission)} />
              <Spec label="Fuel" value={cap(vehicle.fuel_type)} />
            </div>

            {vehicle.description && (
              <div style={styles.descBox}>
                <h3 style={styles.descTitle}>Description</h3>
                <p style={styles.descText}>{vehicle.description}</p>
              </div>
            )}

            <div style={styles.ownerBox}>
              <div style={styles.ownerAvatar}>{vehicle.owner_name?.charAt(0).toUpperCase()}</div>
              <div>
                <p style={styles.ownerLabel}>Listed by</p>
                <p style={styles.ownerName}>{vehicle.owner_name}</p>
              </div>
            </div>

            <div style={{ marginTop: '1.5rem' }}>
              <h3 style={styles.descTitle}>
                Reviews {reviews.length > 0 && `(${reviews.length})`}
              </h3>
              {reviews.length === 0 ? (
                <p style={styles.descText}>No reviews yet.</p>
              ) : (
                reviews.map((r) => (
                  <div key={r.id} style={styles.reviewCard}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <strong style={{ color: '#14213d', fontSize: '0.9rem' }}>{r.reviewer_name}</strong>
                      <span style={{ color: '#f5a623' }}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                    </div>
                    {r.comment && <p style={{ color: '#555', fontSize: '0.88rem', margin: '0.5rem 0 0' }}>{r.comment}</p>}
                    {r.owner_reply && (
                      <div style={styles.ownerReply}>
                        <span style={{ color: '#888', fontSize: '0.78rem' }}>Owner reply:</span>
                        <p style={{ color: '#555', fontSize: '0.85rem', margin: '0.2rem 0 0' }}>{r.owner_reply}</p>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          <aside style={styles.bookBox}>
            <div style={styles.priceRow}>
              <span style={styles.price}>Rs {Number(vehicle.daily_rate).toLocaleString()}</span>
              <span style={styles.perDay}>/ day</span>
            </div>

            {vehicle.average_rating > 0 && (
              <p style={styles.ratingLine}>
                ★ {Number(vehicle.average_rating).toFixed(1)} ({vehicle.total_reviews} reviews)
              </p>
            )}

            {vehicle.has_driver && (
              <p style={styles.driverInfo}>Driver available: +Rs {Number(vehicle.driver_rate).toLocaleString()}/day</p>
            )}

            <div style={styles.optionRow}>
              <span style={styles.optLabel}>Self drive</span>
              <span style={styles.optValue}>{vehicle.driver_only ? 'Not available' : 'Available'}</span>
            </div>
            <div style={styles.optionRow}>
              <span style={styles.optLabel}>With driver</span>
              <span style={styles.optValue}>{vehicle.has_driver ? 'Available' : 'Not available'}</span>
            </div>

            <button onClick={handleBook} style={styles.bookBtn}>
              {user ? 'Book Now' : 'Sign in to Book'}
            </button>
            <p style={styles.bookNote}>You won't be charged yet</p>
          </aside>
        </div>
      </div>
      <Footer />
    </div>
  );
};

const Spec = ({ label, value }) => (
  <div style={styles.spec}>
    <span style={styles.specLabel}>{label}</span>
    <span style={styles.specValue}>{value || '—'}</span>
  </div>
);

const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : '');

const styles = {
  page: { background: '#EDEEF5', minHeight: '100vh', fontFamily: "'Inter', sans-serif" },
  message: { color: '#666', textAlign: 'center', padding: '8rem 1rem 5rem' },
  container: { maxWidth: '1100px', margin: '0 auto', padding: '8rem 1.5rem 1.5rem' },
  backLink: { color: '#3B82F6', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500' },
  layout: { display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem', alignItems: 'start', marginTop: '1rem' },
  main: {},
  imageWrap: {
    position: 'relative', height: '360px', background: '#fff', borderRadius: '16px',
    display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
    border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
  },
  image: { width: '100%', height: '100%', objectFit: 'cover' },
  placeholder: { fontSize: '7rem', opacity: 0.25 },
  typeBadge: {
    position: 'absolute', top: '14px', left: '14px', background: '#60A5FA', color: '#fff',
    fontSize: '0.75rem', fontWeight: '600', padding: '0.3rem 0.9rem', borderRadius: '20px', textTransform: 'capitalize',
  },
  title: { color: '#14213d', fontSize: '1.8rem', fontWeight: '700', margin: '1.5rem 0 0.3rem', fontFamily: 'Outfit, sans-serif' },
  location: { color: '#666', margin: '0 0 1.5rem' },
  specGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' },
  spec: { background: '#fff', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '10px', padding: '0.9rem 1rem' },
  specLabel: { display: 'block', color: '#999', fontSize: '0.75rem', marginBottom: '0.2rem' },
  specValue: { color: '#14213d', fontSize: '1rem', fontWeight: '600' },
  descBox: { marginBottom: '1.5rem' },
  descTitle: { color: '#14213d', fontSize: '1.15rem', fontWeight: '600', margin: '0 0 0.5rem' },
  descText: { color: '#555', fontSize: '0.95rem', lineHeight: 1.7, margin: 0 },
  ownerBox: {
    display: 'flex', alignItems: 'center', gap: '0.9rem', background: '#fff',
    border: '1px solid rgba(0,0,0,0.06)', borderRadius: '12px', padding: '1rem 1.2rem',
  },
  ownerAvatar: {
    width: '46px', height: '46px', borderRadius: '50%', background: '#60A5FA', color: '#fff',
    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: '700',
  },
  ownerLabel: { color: '#999', fontSize: '0.75rem', margin: 0 },
  ownerName: { color: '#14213d', fontSize: '1rem', fontWeight: '600', margin: '0.1rem 0 0' },
  reviewCard: {
    background: '#fff', border: '1px solid rgba(0,0,0,0.06)',
    borderRadius: '10px', padding: '1rem', marginBottom: '0.8rem',
  },
  ownerReply: {
    background: '#f7f7fa', borderRadius: '8px', padding: '0.6rem 0.8rem', marginTop: '0.6rem',
  },
  bookBox: {
    background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '16px',
    padding: '1.5rem', position: 'sticky', top: '110px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
  },
  priceRow: { display: 'flex', alignItems: 'baseline', gap: '0.4rem' },
  price: { color: '#14213d', fontSize: '1.8rem', fontWeight: '800' },
  perDay: { color: '#999', fontSize: '0.9rem' },
  ratingLine: { color: '#f5a623', fontSize: '0.88rem', fontWeight: '600', margin: '0.5rem 0 0' },
  driverInfo: { color: '#3B82F6', fontSize: '0.85rem', margin: '0.5rem 0 1rem' },
  optionRow: { display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0', borderTop: '1px solid rgba(0,0,0,0.06)' },
  optLabel: { color: '#666', fontSize: '0.9rem' },
  optValue: { color: '#14213d', fontSize: '0.9rem', fontWeight: '500' },
  bookBtn: {
    width: '100%', background: '#60A5FA', color: '#fff', border: 'none', borderRadius: '10px',
    padding: '0.9rem', fontSize: '1rem', fontWeight: '600', cursor: 'pointer', marginTop: '1.2rem',
  },
  bookNote: { textAlign: 'center', color: '#aaa', fontSize: '0.8rem', margin: '0.7rem 0 0' },
};

export default VehicleDetail;