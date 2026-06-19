import { Link } from 'react-router-dom';

import carDisplay  from '../../assets/cardisplay.jpg';
import bookingImg  from '../../assets/bookinggconfirm.png';
import mountainImg from '../../assets/mountain.png';
import handingKey  from '../../assets/handingkey.jpg';

const cards = [
  {
    title: 'Browse & filter vehicles',
    body:  'Search by type, location, price, and driver preference across Nepal.',
    img:   carDisplay,
  },
  {
    title: 'Book in minutes',
    body:  'Pick your dates, review the cost breakdown, and confirm instantly.',
    img:   bookingImg,
  },
  {
    title: 'Drive your way',
    body:  'Self-drive or with a driver — your journey, your choice.',
    img:   mountainImg,
  },
  {
    title: 'Trusted platform',
    body:  'Verified owners, secure payments, and dispute protection built in.',
    img:   handingKey,
  },
];

const Footer = () => {
  return (
    <footer style={s.footer}>
      <div style={s.inner}>

        <h2 style={s.heading}>
          Nepal's boldest vehicle rental platform — book in minutes, drive on your terms.
        </h2>

        {}
        <div style={s.grid}>
          {cards.map((c, i) => (
            <div key={i} style={{ ...s.card, backgroundImage: `url(${c.img})` }}>
              <div style={s.overlay} />
              <div style={s.cardContent}>
                <h3 style={s.cardTitle}>{c.title}</h3>
                <p style={s.cardBody}>{c.body}</p>
              </div>
            </div>
          ))}
        </div>

        {}
        <div style={s.bottom}>
          <div style={s.bottomLinks}>
            <Link to="/vehicles" style={s.link}>Browse Vehicles</Link>
            <Link to="/about"    style={s.link}>About Us</Link>
            <Link to="/contact"  style={s.link}>Contact</Link>
            <Link to="/login"    style={s.link}>Sign In</Link>
            <Link to="/register" style={s.link}>Register</Link>
          </div>
          <div style={s.bottomRight}>
            <span style={s.copy}>© {new Date().getFullYear()} DriveNepal. All rights reserved.</span>
            <Link to="/vehicles" style={s.cta}>Get Started →</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};

const s = {
  footer: {
    background: '#EDEEF5',
    color: '#14213d',
    marginTop: '4rem',
    fontFamily: 'Inter, sans-serif',
    borderTop: '1px solid rgba(20,33,61,0.08)',
  },
  inner: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '4rem 1.5rem 2rem',
  },
  heading: {
    fontSize: 'clamp(1.5rem, 3.5vw, 2.6rem)',
    fontWeight: '800',
    lineHeight: 1.15,
    maxWidth: '720px',
    marginBottom: '2.5rem',
    color: '#14213d',
    fontFamily: 'Outfit, sans-serif',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '1rem',
    marginBottom: '3rem',
  },
  card: {
    borderRadius: '16px',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    height: '280px',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    position: 'relative',
    boxShadow: '0 2px 12px rgba(20,33,61,0.10)',
  },
  overlay: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(to top, rgba(20,33,61,0.80) 40%, rgba(20,33,61,0.05) 100%)',
    borderRadius: '16px',
  },
  cardContent: {
    position: 'relative',
    zIndex: 1,
    padding: '1.3rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.35rem',
  },
  cardTitle: {
    fontSize: '0.95rem',
    fontWeight: '700',
    lineHeight: 1.3,
    margin: 0,
    color: '#fff',
    fontFamily: 'Outfit, sans-serif',
  },
  cardBody: {
    fontSize: '0.8rem',
    lineHeight: 1.55,
    margin: 0,
    color: 'rgba(255,255,255,0.7)',
  },
  bottom: {
    borderTop: '1px solid rgba(20,33,61,0.1)',
    paddingTop: '1.5rem',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '1rem',
  },
  bottomLinks: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1.5rem',
  },
  link: {
    color: 'rgba(20,33,61,0.5)',
    textDecoration: 'none',
    fontSize: '0.85rem',
    fontWeight: '500',
  },
  bottomRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
    flexWrap: 'wrap',
  },
  copy: {
    color: 'rgba(20,33,61,0.35)',
    fontSize: '0.8rem',
  },
  cta: {
    background: '#60A5FA',
    color: '#fff',
    padding: '0.5rem 1.2rem',
    borderRadius: '999px',
    fontSize: '0.85rem',
    fontWeight: '600',
    textDecoration: 'none',
    fontFamily: 'Outfit, sans-serif',
  },
};

export default Footer;
