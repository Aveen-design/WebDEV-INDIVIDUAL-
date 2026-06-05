import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import heroVideo from '../assets/hero.mp4';

const Home = () => {
  return (
    <div style={styles.page}>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(15px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <Navbar />

      <section style={styles.hero}>
        <div style={styles.videoWrap}>
          <video autoPlay loop muted playsInline style={styles.video}>
            <source src={heroVideo} type="video/mp4" />
          </video>
          <div style={styles.videoOverlay} />
          <div style={styles.gradientMask} />
        </div>

        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>
            <span style={styles.ink}>Premium vehicle rental</span><br />
            <span style={styles.muted}>across Nepal — drive yourself</span><br />
            <span style={styles.muted}>or travel with a </span>
            <span style={styles.pill}><span style={styles.pillDot} /></span>
            <span style={styles.muted}> driver.</span>
          </h1>

          <div style={styles.heroBtns}>
            <Link to="/vehicles" style={styles.primaryBtn}>Browse Vehicles</Link>
            <Link to="/register" style={styles.ghostBtn}>List Your Vehicle</Link>
          </div>
        </div>

        <div style={styles.cornerLeft}>2026</div>
        <div style={styles.cornerRight}>nepal vehicle rental</div>
      </section>

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
  page: { background: '#EDEEF5', fontFamily: "'Inter', sans-serif" },

  hero: {
    position: 'relative', minHeight: '110vh', width: '100%',
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'flex-start', overflow: 'hidden', background: '#EDEEF5',
  },
  videoWrap: {
    position: 'absolute', top: '18vh', left: 0, width: '100%', height: '100vh',
    zIndex: 0, pointerEvents: 'none',
  },
 video: { width: '100%', height: '100%', objectFit: 'cover' },
  videoOverlay: {
    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
    background: 'linear-gradient(to bottom, rgba(10,14,26,0.55), rgba(10,14,26,0.35))',
  },

 heroContent: {
    maxWidth: '1280px', width: '100%', margin: '0 auto',
    padding: '22vh 2rem 0', position: 'relative', zIndex: 10,
    animation: 'fadeUp 0.8s ease',
  },
  heroTitle: {
    fontSize: 'clamp(2rem, 5.5vw, 4rem)', fontWeight: '700',
    fontFamily: 'Outfit, sans-serif', lineHeight: 1.15, letterSpacing: '-0.5px', margin: 0,
  },
  ink: { color: '#ffffff' },
  muted: { color: 'rgba(255,255,255,0.85)' },
  pill: {
    width: 'clamp(28px, 4vw, 62px)', height: 'clamp(20px, 2.6vw, 38px)',
    border: '2px solid #fff', borderRadius: '999px', display: 'inline-flex',
    alignItems: 'center', justifyContent: 'center', verticalAlign: 'middle',
  },
  pillDot: { width: '8px', height: '8px', background: '#fff', borderRadius: '50%' },
  pillDot: { width: '8px', height: '8px', background: '#1a1a1a', borderRadius: '50%' },

  heroBtns: {
    display: 'flex', gap: '1rem', marginTop: '2rem', flexWrap: 'wrap',
    animation: 'fadeUp 1s ease',
  },
primaryBtn: {
    background: '#60A5FA', color: '#fff', textDecoration: 'none',
    padding: '0.9rem 1.9rem', borderRadius: '8px', fontWeight: '600', fontSize: '0.95rem',
  },
  ghostBtn: {
    background: 'rgba(255,255,255,0.7)', color: '#14213d', textDecoration: 'none',
    padding: '0.9rem 1.9rem', borderRadius: '8px', fontWeight: '600',
    fontSize: '0.95rem', border: '1px solid rgba(0,0,0,0.1)',
  },

  cornerLeft: {
    position: 'absolute', bottom: '1.5rem', left: '2rem', zIndex: 10,
    fontSize: '0.8rem', color: 'rgba(255,255,255,0.8)',
  },
  cornerRight: {
    position: 'absolute', bottom: '1.5rem', right: '2rem', zIndex: 10,
    fontSize: '0.8rem', color: 'rgba(255,255,255,0.8)',
  },

  section: {
    maxWidth: '1200px', margin: '0 auto', padding: '4rem 1.5rem', textAlign: 'center',
    position: 'relative', zIndex: 5,
  },
  sectionTitle: { fontSize: '2.2rem', fontWeight: '700', color: '#14213d', margin: '0 0 0.5rem', fontFamily: 'Outfit, sans-serif' },
  sectionSub: { color: '#888', fontSize: '1.05rem', margin: '0 0 3rem' },
  cards: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' },
  card: {
    background: '#fff', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '16px',
    padding: '2rem', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
  },
  cardIcon: { fontSize: '3rem', marginBottom: '1rem' },
  cardTitle: { fontSize: '1.3rem', fontWeight: '700', color: '#14213d', margin: '0 0 0.6rem' },
  cardDesc: { color: '#666', fontSize: '0.95rem', lineHeight: 1.6, margin: 0 },

cta: {
    background: 'linear-gradient(135deg, #60A5FA 0%, #3B82F6 100%)',
    textAlign: 'center', padding: '4rem 1.5rem', color: '#fff',
  },
  ctaTitle: { fontSize: '2.4rem', fontWeight: '800', margin: '0 0 0.5rem', fontFamily: 'Outfit, sans-serif' },
  ctaSub: { fontSize: '1.1rem', opacity: 0.9, margin: '0 0 2rem' },
  ctaBtn: {
    background: '#fff', color: '#3B82F6', textDecoration: 'none',
    padding: '1rem 2.2rem', borderRadius: '8px', fontWeight: '700', fontSize: '1.05rem',
  },
};

export default Home;