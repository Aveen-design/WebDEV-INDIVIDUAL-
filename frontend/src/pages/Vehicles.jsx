import { useState, useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import VehicleCard from '../components/vehicle/VehicleCard';
import api from '../utils/api';

const Vehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState('');

  const [filters, setFilters] = useState({
    type: '', location: '', min_price: '', max_price: '',
    transmission: '', driver_option: '', sort: 'newest',
  });

  const fetchVehicles = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      Object.entries(filters).forEach(([k, v]) => {
        if (v) params[k] = v;
      });
      const res = await api.get('/vehicles', { params });
      setVehicles(res.data.data.vehicles);
    } catch (err) {
      setError('Could not load vehicles. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const applyFilters = (e) => {
    e.preventDefault();
    fetchVehicles();
  };

  const resetFilters = () => {
    setFilters({
      type: '', location: '', min_price: '', max_price: '',
      transmission: '', driver_option: '', sort: 'newest',
    });
    setTimeout(fetchVehicles, 0);
  };

  return (
    <div style={styles.page}>
      <Navbar />

      <div style={styles.header}>
        <h1 style={styles.headerTitle}>Browse Vehicles</h1>
        <p style={styles.headerSub}>Find the perfect ride for your journey</p>
      </div>

      <div style={styles.layout}>
        <aside style={styles.sidebar}>
          <form onSubmit={applyFilters}>
            <h3 style={styles.filterTitle}>Filters</h3>

            <label style={styles.label}>Vehicle Type</label>
            <select name="type" value={filters.type} onChange={handleChange} style={styles.input}>
              <option value="">All types</option>
              <option value="car">Car</option>
              <option value="suv">SUV</option>
              <option value="motorcycle">Motorcycle</option>
              <option value="van">Van</option>
              <option value="jeep">Jeep</option>
              <option value="bus">Bus</option>
              <option value="electric">Electric</option>
            </select>

          <label style={styles.label}>Location</label>
            <select name="location" value={filters.location} onChange={handleChange} style={styles.input}>
              <option value="">All cities</option>
              <option value="Kathmandu">Kathmandu</option>
              <option value="Pokhara">Pokhara</option>
              <option value="Lalitpur">Lalitpur</option>
              <option value="Bhaktapur">Bhaktapur</option>
              <option value="Chitwan">Chitwan</option>
              <option value="Butwal">Butwal</option>
              <option value="Biratnagar">Biratnagar</option>
              <option value="Dharan">Dharan</option>
              <option value="Nepalgunj">Nepalgunj</option>
              <option value="Janakpur">Janakpur</option>
            </select>

            <label style={styles.label}>Price Range (Rs/day)</label>
            <div style={styles.row}>
              <input name="min_price" value={filters.min_price} onChange={handleChange}
                placeholder="Min" type="number" style={styles.input} />
              <input name="max_price" value={filters.max_price} onChange={handleChange}
                placeholder="Max" type="number" style={styles.input} />
            </div>

            <label style={styles.label}>Transmission</label>
            <select name="transmission" value={filters.transmission} onChange={handleChange} style={styles.input}>
              <option value="">Any</option>
              <option value="automatic">Automatic</option>
              <option value="manual">Manual</option>
            </select>

            <label style={styles.label}>Driver Option</label>
            <select name="driver_option" value={filters.driver_option} onChange={handleChange} style={styles.input}>
              <option value="">Any</option>
              <option value="self">Self drive</option>
              <option value="driver">With driver</option>
            </select>

            <label style={styles.label}>Sort By</label>
            <select name="sort" value={filters.sort} onChange={handleChange} style={styles.input}>
              <option value="newest">Newest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>

            <button type="submit" style={styles.applyBtn}>Apply Filters</button>
            <button type="button" onClick={resetFilters} style={styles.resetBtn}>Reset</button>
          </form>
        </aside>

        <main style={styles.results}>
          {loading ? (
            <div style={styles.message}>Loading vehicles...</div>
          ) : error ? (
            <div style={styles.errorMsg}>{error}</div>
          ) : vehicles.length === 0 ? (
            <div style={styles.message}>No vehicles match your filters.</div>
          ) : (
            <div style={styles.grid}>
              {vehicles.map((v) => <VehicleCard key={v.id} vehicle={v} />)}
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
};

const styles = {
  page: { background: '#0a0e1a', minHeight: '100vh', fontFamily: "'Segoe UI', sans-serif" },
  header: { maxWidth: '1200px', margin: '0 auto', padding: '2.5rem 1.5rem 1rem' },
  headerTitle: { color: '#fff', fontSize: '2rem', fontWeight: '700', margin: 0 },
  headerSub: { color: 'rgba(255,255,255,0.5)', margin: '0.4rem 0 0' },
  layout: {
    maxWidth: '1200px', margin: '0 auto', padding: '1.5rem',
    display: 'grid', gridTemplateColumns: '260px 1fr', gap: '2rem', alignItems: 'start',
  },
  sidebar: {
    background: '#11172a', border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '14px', padding: '1.5rem', position: 'sticky', top: '90px',
  },
  filterTitle: { color: '#fff', fontSize: '1.1rem', fontWeight: '600', margin: '0 0 1rem' },
  label: {
    color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', fontWeight: '500',
    display: 'block', margin: '0.9rem 0 0.4rem',
  },
  input: {
    width: '100%', background: '#0d1220', border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: '8px', padding: '0.6rem 0.7rem', color: '#fff', fontSize: '0.85rem',
    outline: 'none', boxSizing: 'border-box',
  },
  row: { display: 'flex', gap: '0.5rem' },
  applyBtn: {
    width: '100%', background: '#DC143C', color: '#fff', border: 'none',
    borderRadius: '8px', padding: '0.7rem', fontWeight: '600', cursor: 'pointer',
    marginTop: '1.2rem', fontSize: '0.9rem',
  },
  resetBtn: {
    width: '100%', background: 'transparent', color: 'rgba(255,255,255,0.6)',
    border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', padding: '0.6rem',
    cursor: 'pointer', marginTop: '0.6rem', fontSize: '0.85rem',
  },
  results: { minHeight: '400px' },
  grid: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.5rem',
  },
  message: { color: 'rgba(255,255,255,0.5)', textAlign: 'center', padding: '4rem 1rem' },
  errorMsg: { color: '#ff6b6b', textAlign: 'center', padding: '4rem 1rem' },
};

export default Vehicles;