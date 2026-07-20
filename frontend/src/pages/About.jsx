import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const About = () => {
  return (
    <div style={styles.page}>
      <Navbar />

      <div style={styles.hero}>
        <div style={styles.heroInner}>
          <h1 style={styles.heroTitle}>About DriveNepal</h1>
          <p style={styles.heroSub}>
            Nepal's trusted platform for vehicle rentals — connecting owners and renters across the country.
          </p>
        </div>
      </div>

      <div style={styles.container}>

        <section style={styles.section}>
          <div style={styles.sectionGrid}>
            <div>
              <h2 style={styles.sectionTitle}>What is DriveNepal?</h2>
              <p style={styles.sectionText}>
                DriveNepal is an online vehicle rental marketplace built for Nepal. We connect vehicle owners who want to earn from their idle vehicles with customers who need reliable transport — whether for business travel, tourism, or everyday use.
              </p>
              <p style={styles.sectionText}>
                From cars and motorcycles to SUVs and vans, DriveNepal offers a wide range of vehicles across Kathmandu, Pokhara, and Chitwan, with options for self-drive or with a driver.
              </p>
            </div>
            <div style={styles.card}>
              <div style={styles.iconBlock}>🚗</div>
              <h3 style={styles.cardTitle}>For Renters</h3>
              <p style={styles.cardText}>Browse verified vehicles, check availability, book online, and pay securely through eSewa. Download your rental agreement instantly.</p>
            </div>
          </div>
        </section>

        <section style={{ ...styles.section, background: '#fff', borderRadius: '16px', padding: '2.5rem' }}>
          <h2 style={{ ...styles.sectionTitle, textAlign: 'center', marginBottom: '2rem' }}>Our Mission</h2>
          <p style={{ ...styles.sectionText, textAlign: 'center', maxWidth: '700px', margin: '0 auto' }}>
            To make vehicle rental in Nepal accessible, transparent, and hassle-free. We believe every journey should start with trust — verified listings, secure payments, and clear agreements between owners and renters.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={{ ...styles.sectionTitle, textAlign: 'center', marginBottom: '2.5rem' }}>How It Works</h2>
          <div style={styles.stepsGrid}>
            <Step number="1" title="Browse Vehicles" desc="Search and filter from a range of verified vehicles across Nepal. View photos, specs, and daily rates." />
            <Step number="2" title="Book & Pay" desc="Select your dates, choose driver option, and pay securely through eSewa. Get instant booking confirmation." />
            <Step number="3" title="Drive" desc="Meet the owner at pickup, collect the vehicle, and enjoy your journey. Download your rental agreement anytime." />
          </div>
        </section>

        <section style={styles.section}>
          <h2 style={{ ...styles.sectionTitle, textAlign: 'center', marginBottom: '2rem' }}>Why DriveNepal?</h2>
          <div style={styles.featuresGrid}>
            <Feature icon="✅" title="Verified Listings" desc="Every vehicle goes through an admin approval process before appearing on the platform." />
            <Feature icon="🔒" title="Secure Payments" desc="Payments are processed through eSewa, Nepal's most trusted digital payment gateway." />
            <Feature icon="📄" title="Rental Agreements" desc="Automatically generated PDF rental agreements for every confirmed booking." />
            <Feature icon="💬" title="Direct Messaging" desc="Communicate directly with the owner or renter through the platform." />
            <Feature icon="⭐" title="Reviews & Ratings" desc="Honest reviews from verified renters help you choose the right vehicle." />
            <Feature icon="🛡️" title="Dispute Resolution" desc="A built-in dispute system ensures fair resolution for both parties." />
          </div>
        </section>

      </div>

      <Footer />
    </div>
  );
};

const Step = ({ number, title, desc }) => (
  <div style={styles.step}>
    <div style={styles.stepNumber}>{number}</div>
    <h3 style={styles.stepTitle}>{title}</h3>
    <p style={styles.stepDesc}>{desc}</p>
  </div>
);

const Feature = ({ icon, title, desc }) => (
  <div style={styles.feature}>
    <div style={styles.featureIcon}>{icon}</div>
    <h4 style={styles.featureTitle}>{title}</h4>
    <p style={styles.featureDesc}>{desc}</p>
  </div>
);

const styles = {
  page: { background: '#EDEEF5', minHeight: '100vh', fontFamily: "'Inter', sans-serif" },
  hero: {
    background: '#14213d', paddingTop: '8rem', paddingBottom: '4rem',
  },
  heroInner: { maxWidth: '800px', margin: '0 auto', padding: '0 2rem', textAlign: 'center' },
  heroTitle: { color: '#fff', fontSize: '2.8rem', fontWeight: 800, margin: '0 0 1rem', fontFamily: 'Outfit, sans-serif' },
  heroSub: { color: 'rgba(255,255,255,0.7)', fontSize: '1.1rem', lineHeight: 1.7, margin: 0 },
  container: { maxWidth: '1100px', margin: '0 auto', padding: '3rem 1.5rem' },
  section: { marginBottom: '3rem' },
  sectionGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'center' },
  sectionTitle: { color: '#14213d', fontSize: '1.8rem', fontWeight: 700, margin: '0 0 1rem', fontFamily: 'Outfit, sans-serif' },
  sectionText: { color: '#555', fontSize: '0.95rem', lineHeight: 1.8, margin: '0 0 1rem' },
  card: {
    background: '#fff', borderRadius: '16px', padding: '2rem',
    boxShadow: '0 4px 20px rgba(0,0,0,0.06)', textAlign: 'center',
  },
  iconBlock: { fontSize: '3rem', marginBottom: '1rem' },
  cardTitle: { color: '#14213d', fontSize: '1.2rem', fontWeight: 700, margin: '0 0 0.8rem' },
  cardText: { color: '#666', fontSize: '0.9rem', lineHeight: 1.7, margin: 0 },
  stepsGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' },
  step: {
    background: '#fff', borderRadius: '16px', padding: '2rem',
    boxShadow: '0 4px 20px rgba(0,0,0,0.04)', textAlign: 'center',
  },
  stepNumber: {
    width: '48px', height: '48px', background: '#14213d', color: '#fff',
    borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '1.3rem', fontWeight: 700, margin: '0 auto 1rem',
  },
  stepTitle: { color: '#14213d', fontSize: '1.05rem', fontWeight: 700, margin: '0 0 0.6rem' },
  stepDesc: { color: '#777', fontSize: '0.88rem', lineHeight: 1.7, margin: 0 },
  featuresGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.2rem' },
  feature: {
    background: '#fff', borderRadius: '14px', padding: '1.5rem',
    boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
  },
  featureIcon: { fontSize: '1.8rem', marginBottom: '0.8rem' },
  featureTitle: { color: '#14213d', fontSize: '1rem', fontWeight: 700, margin: '0 0 0.4rem' },
  featureDesc: { color: '#777', fontSize: '0.85rem', lineHeight: 1.6, margin: 0 },
};

export default About;
