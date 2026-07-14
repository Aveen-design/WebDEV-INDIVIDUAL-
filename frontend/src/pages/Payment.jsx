import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import api from '../utils/api';

const Payment = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking]   = useState(null);
  const [loading, setLoading]   = useState(true);
  const [paying,  setPaying]    = useState(false);
  const [error,   setError]     = useState('');

  const formRef = useRef(null);
  const [esewaFields, setEsewaFields] = useState(null);

  useEffect(() => {
    api.get(`/bookings/${bookingId}`)
      .then((r) => setBooking(r.data.data))
      .catch(() => setError('Could not load booking details.'))
      .finally(() => setLoading(false));
  }, [bookingId]);

  useEffect(() => {
    if (esewaFields && formRef.current) {
      formRef.current.submit();
    }
  }, [esewaFields]);

  const handleESewa = async () => {
    setPaying(true);
    setError('');
    try {
      const res = await api.post('/payments/esewa/initiate', { booking_id: Number(bookingId) });
      setEsewaFields(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not initiate eSewa payment.');
      setPaying(false);
    }
  };

  if (loading) return <div style={styles.page}><Navbar /><div style={styles.msg}>Loading...</div></div>;
  if (error && !booking) return <div style={styles.page}><Navbar /><div style={styles.msg}>{error}</div></div>;

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.container}>
        <Link to="/dashboard" style={styles.back}>← Back to Dashboard</Link>
        <h1 style={styles.title}>Complete Payment</h1>

        <div style={styles.layout}>
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Order Summary</h2>
            <div style={styles.divider} />
            <Row label="Vehicle"      value={booking.vehicle_title} />
            <Row label="Dates"        value={`${fmt(booking.start_date)} – ${fmt(booking.end_date)}`} />
            <Row label="Days"         value={`${booking.total_days} day(s)`} />
            <Row label="Daily Rate"   value={`Rs ${Number(booking.daily_rate).toLocaleString()}`} />
            {booking.driver_required && Number(booking.driver_rate) > 0 && (
              <Row label="Driver Rate" value={`Rs ${Number(booking.driver_rate).toLocaleString()}/day`} />
            )}
            <Row label="Subtotal"     value={`Rs ${Number(booking.subtotal).toLocaleString()}`} />
            <Row label="Platform Fee" value={`Rs ${Number(booking.platform_fee).toLocaleString()}`} />
            <div style={styles.divider} />
            <Row label="Total Amount" value={`Rs ${Number(booking.total_amount).toLocaleString()}`} bold />
            <p style={styles.ref}>Ref: {booking.reference_code}</p>
          </div>

          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Choose Payment Method</h2>
            <div style={styles.divider} />
            {error && <div style={styles.errorBox}>{error}</div>}

            <button onClick={handleESewa} disabled={paying} style={styles.esewaBtn}>
              {paying ? 'Redirecting to eSewa...' : 'Pay with eSewa'}
            </button>
            <p style={styles.hint}>
              You'll be redirected to eSewa's secure payment page.
            </p>
            <p style={styles.hint}>
              Test eSewa login: <strong>9806800001</strong> / <strong>Nepal@123</strong>
            </p>
          </div>
        </div>
      </div>
      <Footer />

      {esewaFields && (
        <form ref={formRef} method="POST" action={esewaFields.payment_url} style={{ display: 'none' }}>
          <input name="amount"                   value={esewaFields.amount} readOnly />
          <input name="tax_amount"               value={esewaFields.tax_amount} readOnly />
          <input name="total_amount"             value={esewaFields.total_amount} readOnly />
          <input name="transaction_uuid"         value={esewaFields.transaction_uuid} readOnly />
          <input name="product_code"             value={esewaFields.product_code} readOnly />
          <input name="product_service_charge"   value={esewaFields.product_service_charge} readOnly />
          <input name="product_delivery_charge"  value={esewaFields.product_delivery_charge} readOnly />
          <input name="success_url"              value={esewaFields.success_url} readOnly />
          <input name="failure_url"              value={esewaFields.failure_url} readOnly />
          <input name="signed_field_names"       value={esewaFields.signed_field_names} readOnly />
          <input name="signature"                value={esewaFields.signature} readOnly />
        </form>
      )}
    </div>
  );
};

const Row = ({ label, value, bold }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.45rem 0' }}>
    <span style={{ color: bold ? '#14213d' : '#888', fontSize: bold ? '1rem' : '0.88rem', fontWeight: bold ? 700 : 400 }}>
      {label}
    </span>
    <span style={{ color: bold ? '#3B82F6' : '#14213d', fontSize: bold ? '1.1rem' : '0.88rem', fontWeight: bold ? 800 : 600 }}>
      {value}
    </span>
  </div>
);

const fmt = (d) => new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

const styles = {
  page:      { background: '#EDEEF5', minHeight: '100vh', fontFamily: "'Inter', sans-serif" },
  msg:       { color: '#888', textAlign: 'center', padding: '8rem 1rem' },
  container: { maxWidth: '900px', margin: '0 auto', padding: '8rem 1.5rem 3rem' },
  back:      { color: '#3B82F6', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500 },
  title:     { color: '#14213d', fontSize: '1.9rem', fontWeight: 700, margin: '1rem 0 2rem', fontFamily: 'Outfit, sans-serif' },
  layout:    { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', alignItems: 'start' },
  card: {
    background: '#fff', border: '1px solid rgba(0,0,0,0.06)',
    borderRadius: '16px', padding: '1.8rem', boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
  },
  cardTitle: { color: '#14213d', fontSize: '1.1rem', fontWeight: 700, margin: '0 0 1rem' },
  divider:   { height: '1px', background: 'rgba(0,0,0,0.07)', margin: '0.6rem 0 0.8rem' },
  ref:       { color: '#aaa', fontSize: '0.78rem', marginTop: '0.8rem' },
  errorBox: {
    background: '#fdecea', border: '1px solid #e63946', color: '#c1121f',
    borderRadius: '8px', padding: '0.7rem 1rem', marginBottom: '1rem', fontSize: '0.85rem',
  },
  esewaBtn: {
    width: '100%', background: '#60BB46', color: '#fff', border: 'none',
    borderRadius: '10px', padding: '0.9rem', fontSize: '1rem', fontWeight: 700,
    cursor: 'pointer', marginTop: '0.5rem',
  },
  hint: { color: '#999', fontSize: '0.8rem', marginTop: '0.8rem', textAlign: 'center' },
};

export default Payment;
