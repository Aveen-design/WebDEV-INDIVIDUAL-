import { Link } from 'react-router-dom';

const VehicleCard = ({ vehicle }) => {
  return (
    <Link to={`/vehicles/${vehicle.id}`} style={styles.card}>
      <div style={styles.imageWrap}>
        {vehicle.primary_photo ? (
          <img src={vehicle.primary_photo} alt={vehicle.title} style={styles.image} />
        ) : (
          <div style={styles.placeholder}>🚗</div>
        )}
        <span style={styles.typeBadge}>{vehicle.type}</span>
      </div>

      <div style={styles.body}>
        <h3 style={styles.title}>{vehicle.title}</h3>
        <p style={styles.meta}>{vehicle.brand} · {vehicle.year} · {vehicle.seats} seats</p>
        <p style={styles.location}>📍 {vehicle.location}</p>

        <div style={styles.footer}>
          <div>
            <span style={styles.price}>Rs {Number(vehicle.daily_rate).toLocaleString()}</span>
            <span style={styles.perDay}>/day</span>
          </div>
          {vehicle.has_driver && <span style={styles.driverTag}>Driver available</span>}
        </div>
      </div>
    </Link>
  );
};

const styles = {
  card: {
    background: '#fff', border: '1px solid rgba(0,0,0,0.06)',
    borderRadius: '14px', overflow: 'hidden', textDecoration: 'none',
    display: 'flex', flexDirection: 'column', boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
  },
  imageWrap: {
    position: 'relative', height: '180px', background: '#f0f0f5',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  image: { width: '100%', height: '100%', objectFit: 'cover' },
  placeholder: { fontSize: '4rem', opacity: 0.3 },
  typeBadge: {
    position: 'absolute', top: '10px', left: '10px',
    background: '#60A5FA', color: '#fff', fontSize: '0.7rem',
    fontWeight: '600', padding: '0.25rem 0.7rem', borderRadius: '20px', textTransform: 'capitalize',
  },
  body: { padding: '1rem 1.1rem 1.2rem' },
  title: {
    color: '#14213d', fontSize: '1.05rem', fontWeight: '600',
    margin: '0 0 0.3rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
  },
  meta: { color: '#888', fontSize: '0.8rem', margin: '0 0 0.4rem' },
  location: { color: '#666', fontSize: '0.82rem', margin: '0 0 0.9rem' },
  footer: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  price: { color: '#3B82F6', fontSize: '1.2rem', fontWeight: '700' },
  perDay: { color: '#aaa', fontSize: '0.8rem' },
  driverTag: {
    background: 'rgba(96,165,250,0.15)', color: '#3B82F6',
    fontSize: '0.7rem', padding: '0.2rem 0.6rem', borderRadius: '12px',
  },
};

export default VehicleCard;