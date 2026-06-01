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
        <p style={styles.meta}>
          {vehicle.brand} · {vehicle.year} · {vehicle.seats} seats
        </p>
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
    background: '#11172a', border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '14px', overflow: 'hidden', textDecoration: 'none',
    display: 'flex', flexDirection: 'column', transition: 'transform 0.15s',
  },
  imageWrap: {
    position: 'relative', height: '180px', background: '#0d1220',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  image: { width: '100%', height: '100%', objectFit: 'cover' },
  placeholder: { fontSize: '4rem', opacity: 0.4 },
  typeBadge: {
    position: 'absolute', top: '10px', left: '10px',
    background: 'rgba(220,20,60,0.9)', color: '#fff', fontSize: '0.7rem',
    fontWeight: '600', padding: '0.25rem 0.7rem', borderRadius: '20px',
    textTransform: 'capitalize',
  },
  body: { padding: '1rem 1.1rem 1.2rem' },
  title: {
    color: '#fff', fontSize: '1.05rem', fontWeight: '600',
    margin: '0 0 0.3rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
  },
  meta: { color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', margin: '0 0 0.4rem' },
  location: { color: 'rgba(255,255,255,0.6)', fontSize: '0.82rem', margin: '0 0 0.9rem' },
  footer: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  price: { color: '#DC143C', fontSize: '1.2rem', fontWeight: '700' },
  perDay: { color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' },
  driverTag: {
    background: 'rgba(56,120,255,0.15)', color: '#6ea8ff',
    fontSize: '0.7rem', padding: '0.2rem 0.6rem', borderRadius: '12px',
  },
};

export default VehicleCard;