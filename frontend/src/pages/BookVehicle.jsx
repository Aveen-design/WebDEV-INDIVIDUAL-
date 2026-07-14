import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const PLATFORM_FEE_PERCENT = 5;

const BookVehicle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [vehicle, setVehicle] = useState(null);
  const [booked,  setBooked]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    start_date: '',
    end_date: '',
    driver_required: false,
    pickup_location: '',
    customer_note: '',
  });

  useEffect(() => {
    const load = async () => {
      try {
        const [vRes, aRes] = await Promise.all([
          api.get(`/vehicles/${id}`),
          api.get(`/vehicles/${id}/availability`),
        ]);
        setVehicle(vRes.data.data);
        setBooked(aRes.data.data.booked || []);
        if (vRes.data.data.driver_only) {
          setForm((f) => ({ ...f, driver_required: true }));
        }
      } catch {
        setError('Could not load this vehicle.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
    setError('');
  };

  const totalDays = useMemo(() => {
    if (!form.start_date || !form.end_date) return 0;
    const s = new Date(form.start_date);
    const e = new Date(form.end_date);
    const diff = Math.round((e - s) / (1000 * 60 * 60 * 24)) + 1;
    return diff > 0 ? diff : 0;
  }, [form.start_date, form.end_date]);

  const pricing = useMemo(() => {
    if (!vehicle || totalDays === 0) return null;
    const daily  = Number(vehicle.daily_rate);
    const driver = form.driver_required ? Number(vehicle.driver_rate) : 0;
    const subtotal = (daily + driver) * totalDays;
    const fee = Math.round(subtotal * (PLATFORM_FEE_PERCENT / 100));
    return { daily, driver, subtotal, fee, total: subtotal + fee };
  }, [vehicle, totalDays, form.driver_required]);

  const overlapsBooked = (start, end) => {
    const s = new Date(start);
    const e = new Date(end);
    return booked.some((b) => {
      const bs = new Date(b.start_date);
      const be = new Date(b.end_date);
      return s <= be && e >= bs;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.start_date || !form.end_date) return setError('Please select both dates');
    if (totalDays === 0) return setError('End date must be on or after start date');

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (new Date(form.start_date) < today) return setError('Start date cannot be in the past');

    if (overlapsBooked(form.start_date, form.end_date))
      return setError('Those dates are already booked. Please choose different dates.');

    setSubmitting(true);
    try {
      const res = await api.post('/bookings', {
        vehicle_id: Number(id),
        start_date: form.start_date,
        end_date: form.end_date,
        driver_required: form.driver_required,
        pickup_location: form.pickup_location,
        customer_note: form.customer_note,
      });
      navigate(`/payment/${res.data.data.id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create booking. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (<div style={styles.page}><Navbar /><div style={styles.message}>Loading...</div></div>);
  if (error && !vehicle) return (<div style={styles.page}><Navbar /><div style={styles.message}>{error}</div><Footer /></div>);

  const today = new Date().toISOString().split('T')[0];

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.container}>
        <Link to={`/vehicles/${id}`} style={styles.backLink}>← Back to vehicle</Link>
        <h1 style={styles.title}>Book {vehicle.title}</h1>

        {booked.length > 0 && (
          <div style={styles.bookedNote}>
            <strong>Already booked dates:</strong>{' '}
            {booked.map((b, i) => (
              <span key={i}>
                {fmt(b.start_date)} – {fmt(b.end_date)}{i < booked.length - 1 ? ', ' : ''}
              </span>
            ))}
          </div>
        )}

        <div style={styles.layout}>
          <form onSubmit={handleSubmit} style={styles.formCard}>
            {error && <div style={styles.errorBox}>{error}</div>}

            <div style={styles.row}>
              <div style={styles.field}>
                <label style={styles.label}>Start Date</label>
                <input type="date" name="start_date" min={today}
                  value={form.start_date} onChange={handleChange} style={styles.input} required />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>End Date</label>
                <input type="date" name="end_date" min={form.start_date || today}
                  value={form.end_date} onChange={handleChange} style={styles.input} required />
              </div>
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Driver Option</label>
              {vehicle.driver_only ? (
                <p style={styles.fixedOption}>This vehicle is only available with a driver.</p>
              ) : vehicle.has_driver ? (
                <label style={styles.checkRow}>
                  <input type="checkbox" name="driver_required"
                    checked={form.driver_required} onChange={handleChange} />
                  <span>Add a driver (+Rs {Number(vehicle.driver_rate).toLocaleString()}/day)</span>
                </label>
              ) : (
                <p style={styles.fixedOption}>Self drive only.</p>
              )}
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Pickup Location</label>
              <input type="text" name="pickup_location" placeholder="e.g. Thamel, Kathmandu"
                value={form.pickup_location} onChange={handleChange} style={styles.input} />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Note to Owner (optional)</label>
              <textarea name="customer_note" rows={3} placeholder="Any special requests?"
                value={form.customer_note} onChange={handleChange} style={{ ...styles.input, resize: 'vertical' }} />
            </div>

            <button type="submit" style={styles.submitBtn} disabled={submitting}>
              {submitting ? 'Confirming...' : 'Confirm Booking'}
            </button>
          </form>

          <aside style={styles.summary}>
            <h3 style={styles.summaryTitle}>Price Summary</h3>

            {pricing ? (
              <>
                <Line label={`Rs ${pricing.daily.toLocaleString()} × ${totalDays} day(s)`} value={`Rs ${(pricing.daily * totalDays).toLocaleString()}`} />
                {form.driver_required && pricing.driver > 0 && (
                  <Line label={`Driver Rs ${pricing.driver.toLocaleString()} × ${totalDays}`} value={`Rs ${(pricing.driver * totalDays).toLocaleString()}`} />
                )}
                <Line label="Subtotal" value={`Rs ${pricing.subtotal.toLocaleString()}`} />
                <Line label={`Platform fee (${PLATFORM_FEE_PERCENT}%)`} value={`Rs ${pricing.fee.toLocaleString()}`} />
                <div style={styles.divider} />
                <Line label="Total" value={`Rs ${pricing.total.toLocaleString()}`} bold />
              </>
            ) : (
              <p style={styles.summaryEmpty}>Select dates to see the price.</p>
            )}

            <p style={styles.summaryNote}>You won't be charged until the owner confirms.</p>
          </aside>
        </div>
      </div>
      <Footer />
    </div>
  );
};

const Line = ({ label, value, bold }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.45rem 0' }}>
    <span style={{ color: bold ? '#14213d' : '#666', fontWeight: bold ? 700 : 400, fontSize: bold ? '1.1rem' : '0.9rem' }}>{label}</span>
    <span style={{ color: bold ? '#3B82F6' : '#14213d', fontWeight: bold ? 800 : 600, fontSize: bold ? '1.2rem' : '0.9rem' }}>{value}</span>
  </div>
);

const fmt = (d) => new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });

const styles = {
  page: { background: '#EDEEF5', minHeight: '100vh', fontFamily: "'Inter', sans-serif" },
  message: { color: '#666', textAlign: 'center', padding: '8rem 1rem 5rem' },
  container: { maxWidth: '1000px', margin: '0 auto', padding: '8rem 1.5rem 1.5rem' },
  backLink: { color: '#3B82F6', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500' },
  title: { color: '#14213d', fontSize: '1.8rem', fontWeight: '700', margin: '1rem 0 0.5rem', fontFamily: 'Outfit, sans-serif' },
  bookedNote: {
    background: '#fff7e6', border: '1px solid #ffd591', color: '#8a5a00',
    borderRadius: '10px', padding: '0.8rem 1rem', fontSize: '0.85rem', margin: '0 0 1.5rem',
  },
  layout: { display: 'grid', gridTemplateColumns: '1fr 320px', gap: '2rem', alignItems: 'start' },
  formCard: {
    background: '#fff', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '16px',
    padding: '1.8rem', boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
  },
  errorBox: {
    background: '#fdecea', border: '1px solid #e63946', color: '#c1121f',
    borderRadius: '8px', padding: '0.75rem 1rem', marginBottom: '1rem', fontSize: '0.875rem',
  },
  row: { display: 'flex', gap: '1rem' },
  field: { display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1.1rem', flex: 1 },
  label: { color: '#555', fontSize: '0.85rem', fontWeight: '500' },
  input: {
    background: '#f7f7fa', border: '1px solid #e0e0e6', borderRadius: '10px',
    padding: '0.7rem 0.9rem', color: '#14213d', fontSize: '0.9rem', outline: 'none',
    width: '100%', boxSizing: 'border-box', fontFamily: 'inherit',
  },
  checkRow: { display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#14213d', fontSize: '0.9rem' },
  fixedOption: { color: '#666', fontSize: '0.88rem', margin: 0, fontStyle: 'italic' },
  submitBtn: {
    width: '100%', background: '#60A5FA', color: '#fff', border: 'none', borderRadius: '10px',
    padding: '0.9rem', fontSize: '1rem', fontWeight: '600', cursor: 'pointer', marginTop: '0.5rem',
  },
  summary: {
    background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '16px',
    padding: '1.5rem', position: 'sticky', top: '110px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
  },
  summaryTitle: { color: '#14213d', fontSize: '1.1rem', fontWeight: '700', margin: '0 0 1rem' },
  summaryEmpty: { color: '#999', fontSize: '0.9rem', margin: '0.5rem 0' },
  divider: { height: '1px', background: 'rgba(0,0,0,0.08)', margin: '0.6rem 0' },
  summaryNote: { color: '#aaa', fontSize: '0.78rem', marginTop: '1rem' },
};

export default BookVehicle;