import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import civic from '../assets/civic.png';

const Home = () => {
  return (
    <div style={styles.page}>
      {}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-18px); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <Navbar />

      {}
      <section style={styles.hero}>
        {}
        <div style={styles.glow} />
        {}
        <div style={styles.bgWord}>NEPAL</div>

        {}
        <div style={styles.heroText}>
          <h1 style={styles.heroTitle}>EXPLORE NEPAL YOUR WAY</h1>
          <p style={styles.heroSub}>
            Premium vehicle rental — drive yourself or hire a driver.
          </p>
        </div>

        {}
        <div style={styles.carWrap}>
          <img src={civic} alt="DriveNepal vehicle" style={styles.car} />
          <div style={styles.carShadow} />
        </div>

        {}
        <div style={styles.heroBtns}>
          <Link to="/vehicles" style={styles.primaryBtn}>Browse Vehicles</Link>
          <Link to="/register" style={styles.ghostBtn}>List Your Vehicle</Link>
        </div>
      </section>

      

      {}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>How DriveNepal Works</h2>
        <p style={styles.sectionSub}>Renting a vehicle has never been simpler</p>
        <div style={styles.cards}>
          {[
            { icon: '🔍', title: 'Search & Filter', desc: 'Find vehicles by location, type, price, and driver preference.' },
            { icon: '📅', title: 'Book Instantly', desc: 'Pick dates, see the price breakdown, and confirm in minutes.' },
            { icon: '🚗', title: 'Drive Away', desc: 'Pick up your vehicle or get a driver — your journey, your way.' },
          ].map((c) => (
            <div key={c.title} style={styles.card}>
              <div style={styles.cardIcon}>{c.icon}</div>
              <h3 style={styles.cardTitle}>{c.title}</h3>
              <p style={styles.cardDesc}>{c.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {}
      <section style={styles.cta}>
        <h2 style={styles.ctaTitle}>Ready to hit the road?</h2>
        <p style={styles.ctaSub}>Join thousands of renters across Nepal today.</p>
        <Link to="/register" style={styles.ctaBtn}>Get Started Free</Link>
      </section>

      <Footer />
    </div>
  );
};

const styles = {
  page: { background: '#0a0e1a', fontFamily: "'Segoe UI', sans-serif" },

  hero: {
    position: 'relative', overflow: 'hidden', textAlign: 'center',
    padding: '3rem 1.5rem 4rem', background: '#0a0e1a',
  },
  glow: {
    position: 'absolute', inset: 0,
    background: 'radial-gradient(ellipse 55% 45% at 50% 45%, rgba(56,120,255,0.20), transparent 70%)',
    pointerEvents: 'none',
  },
  bgWord: {
    position: 'absolute', top: '42%', left: '50%',
    transform: 'translate(-50%,-50%)',
    fontSize: 'clamp(5rem, 18vw, 16rem)', fontWeight: '800',
    color: 'rgba(255,255,255,0.035)', whiteSpace: 'nowrap',
    letterSpacing: '0.1em', zIndex: 0, userSelect: 'none',
  },
  heroText: {
    position: 'relative', zIndex: 3, paddingTop: '2rem',
    animation: 'fadeUp 0.8s ease',
  },
  heroTitle: {
    color: '#fff', fontSize: 'clamp(1.8rem, 5vw, 3.2rem)',
    fontWeight: '800', letterSpacing: '2px', margin: 0,
  },
  heroSub: {
    color: 'rgba(255,255,255,0.6)', fontSize: '1.05rem', marginTop: '1rem',
  },
  carWrap: {
    position: 'relative', zIndex: 2, margin: '1rem auto 0',
    maxWidth: '620px',
  },
  car: {
    width: '100%', height: 'auto', display: 'block',
    animation: 'float 5s ease-in-out infinite',
    filter: 'drop-shadow(0 40px 50px rgba(56,120,255,0.25))',
  },
  carShadow: {
    width: '60%', height: '24px', margin: '0 auto',
    background: 'radial-gradient(ellipse, rgba(56,120,255,0.35), transparent 70%)',
    borderRadius: '50%', filter: 'blur(8px)', marginTop: '-10px',
  },
  heroBtns: {
    position: 'relative', zIndex: 3, display: 'flex', gap: '1rem',
    justifyContent: 'center', marginTop: '2rem', flexWrap: 'wrap',
  },
  primaryBtn: {
    background: '#DC143C', color: '#fff', textDecoration: 'none',
    padding: '0.85rem 2rem', borderRadius: '28px', fontWeight: '600', fontSize: '0.95rem',
  },
  ghostBtn: {
    background: 'transparent', color: '#fff', textDecoration: 'none',
    padding: '0.85rem 2rem', borderRadius: '28px', fontWeight: '600',
    fontSize: '0.95rem', border: '1px solid rgba(255,255,255,0.3)',
  },

  stats: {
    display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around',
    padding: '2.5rem 1.5rem', gap: '1.5rem',
    background: '#0d1220', borderTop: '1px solid rgba(255,255,255,0.06)',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
  },
  statItem: { textAlign: 'center' },
  statNum: { fontSize: '2.2rem', fontWeight: '800', color: '#fff' },
  statLabel: { fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)', marginTop: '0.3rem' },

  section: {
    maxWidth: '1200px', margin: '0 auto', padding: '4rem 1.5rem', textAlign: 'center',
  },
  sectionTitle: { fontSize: '2.2rem', fontWeight: '700', color: '#fff', margin: '0 0 0.5rem' },
  sectionSub: { color: 'rgba(255,255,255,0.5)', fontSize: '1.05rem', margin: '0 0 3rem' },
  cards: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem',
  },
  card: {
    background: '#11172a', border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '16px', padding: '2rem', textAlign: 'center',
  },
  cardIcon: { fontSize: '3rem', marginBottom: '1rem' },
  cardTitle: { fontSize: '1.3rem', fontWeight: '700', color: '#fff', margin: '0 0 0.6rem' },
  cardDesc: { color: 'rgba(255,255,255,0.55)', fontSize: '0.95rem', lineHeight: 1.6, margin: 0 },

  cta: {
    background: 'linear-gradient(135deg, #DC143C 0%, #8a0d24 100%)',
    textAlign: 'center', padding: '4rem 1.5rem', color: '#fff',
  },
  ctaTitle: { fontSize: '2.4rem', fontWeight: '800', margin: '0 0 0.5rem' },
  ctaSub: { fontSize: '1.1rem', opacity: 0.9, margin: '0 0 2rem' },
  ctaBtn: {
    background: '#fff', color: '#DC143C', textDecoration: 'none',
    padding: '1rem 2.2rem', borderRadius: '28px', fontWeight: '700', fontSize: '1.05rem',
  },
};

export default Home;