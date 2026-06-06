import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import api from '../utils/api';

const CITIES = ['Kathmandu','Pokhara','Lalitpur','Bhaktapur','Chitwan','Butwal','Biratnagar','Dharan','Nepalgunj','Janakpur'];

const AddVehicle = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '', type: 'car', brand: '', model: '', year: '',
    transmission: 'manual', fuel_type: 'petrol', seats: 5,
    daily_rate: '', driver_rate: '', has_driver: false, driver_only: false,
    location: 'Kathmandu', description: '',
  });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.title || !form.brand || !form.model || !form.year || !form.daily_rate) {
      return setError('Please fill in all required fields');
    }

    setLoading(true);
    try {
      await api.post('/vehicles', {
        ...form,
        year: Number(form.year),
        seats: Number(form.seats),
        daily_rate: Number(form.daily_rate),
        driver_rate: Number(form.driver_rate) || 0,
      });
      navigate('/owner/vehicles', { state: { added: true } });
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create listing.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.container}>
        <Link to="/owner/vehicles" style={styles.back}>← Back to my vehicles</Link>
        <h1 style={styles.title}>List a New Vehicle</h1>

        <form onSubmit={handleSubmit} style={styles.card}>
          {error && <div style={styles.errorBox}>{error}</div>}

          <Field label="Listing Title *">
            <input name="title" value={form.title} onChange={handleChange}
              placeholder="e.g. Honda Civic 2023 - Well Maintained" style={styles.input} />
          </Field>

          <div style={styles.row}>
            <Field label="Type *">
              <select name="type" value={form.type} onChange={handleChange} style={styles.input}>
                <option value="car">Car</option>
                <option value="suv">SUV</option>
                <option value="motorcycle">Motorcycle</option>
                <option value="van">Van</option>
                <option value="jeep">Jeep</option>
                <option value="bus">Bus</option>
                <option value="electric">Electric</option>
              </select>
            </Field>
            <Field label="Location *">
              <select name="location" value={form.location} onChange={handleChange} style={styles.input}>
                {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>
          </div>

          <div style={styles.row}>
            <Field label="Brand *">
              <input name="brand" value={form.brand} onChange={handleChange} placeholder="Honda" style={styles.input} />
            </Field>
            <Field label="Model *">
              <input name="model" value={form.model} onChange={handleChange} placeholder="Civic" style={styles.input} />
            </Field>
          </div>

          <div style={styles.row}>
            <Field label="Year *">
              <input name="year" type="number" value={form.year} onChange={handleChange} placeholder="2023" style={styles.input} />
            </Field>
            <Field label="Seats">
              <input name="seats" type="number" value={form.seats} onChange={handleChange} style={styles.input} />
            </Field>
          </div>

          <div style={styles.row}>
            <Field label="Transmission">
              <select name="transmission" value={form.transmission} onChange={handleChange} style={styles.input}>
                <option value="manual">Manual</option>
                <option value="automatic">Automatic</option>
              </select>
            </Field>
            <Field label="Fuel Type">
              <select name="fuel_type" value={form.fuel_type} onChange={handleChange} style={styles.input}>
                <option value="petrol">Petrol</option>
                <option value="diesel">Diesel</option>
                <option value="electric">Electric</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </Field>
          </div>

          <div style={styles.row}>
            <Field label="Daily Rate (Rs) *">
              <input name="daily_rate" type="number" value={form.daily_rate} onChange={handleChange} placeholder="8000" style={styles.input} />
            </Field>
            <Field label="Driver Rate (Rs/day)">
              <input name="driver_rate" type="number" value={form.driver_rate} onChange={handleChange} placeholder="2000" style={styles.input} />
            </Field>
          </div>

          <div style={styles.checks}>
            <label style={styles.checkRow}>
              <input type="checkbox" name="has_driver" checked={form.has_driver} onChange={handleChange} />
              <span>Driver available on request</span>
            </label>
            <label style={styles.checkRow}>
              <input type="checkbox" name="driver_only" checked={form.driver_only} onChange={handleChange} />
              <span>Only available with a driver (no self-drive)</span>
            </label>
          </div>

          <Field label="Description">
            <textarea name="description" rows={4} value={form.description} onChange={handleChange}
              placeholder="Describe the vehicle, its condition, and any special features."
              style={{ ...styles.input, resize: 'vertical' }} />
          </Field>

          <button type="submit" style={styles.submitBtn} disabled={loading}>
            {loading ? 'Creating...' : 'List Vehicle'}
          </button>
          <p style={styles.note}>Your listing will be reviewed by an admin before going live.</p>
        </form>
      </div>
      <Footer />
    </div>
  );
};

const Field = ({ label, children }) => (
  <div style={styles.field}>
    <label style={styles.label}>{label}</label>
    {children}
  </div>
);

const styles = {
  page: { background: '#EDEEF5', minHeight: '100vh', fontFamily: "'Inter', sans-serif" },
  container: { maxWidth: '720px', margin: '0 auto', padding: '8rem 1.5rem 1.5rem' },
  back: { color: '#3B82F6', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500' },
  title: { color: '#14213d', fontSize: '1.8rem', fontWeight: '700', margin: '1rem 0 1.5rem', fontFamily: 'Outfit, sans-serif' },
  card: {
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
  checks: { display: 'flex', flexDirection: 'column', gap: '0.7rem', margin: '0 0 1.1rem' },
  checkRow: { display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#14213d', fontSize: '0.9rem' },
  submitBtn: {
    width: '100%', background: '#60A5FA', color: '#fff', border: 'none', borderRadius: '10px',
    padding: '0.9rem', fontSize: '1rem', fontWeight: '600', cursor: 'pointer',
  },
  note: { textAlign: 'center', color: '#aaa', fontSize: '0.8rem', marginTop: '0.8rem' },
};

export default AddVehicle;