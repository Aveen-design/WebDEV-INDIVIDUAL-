import { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      return setError('Please fill in all required fields.');
    }
    setSubmitted(true);
  };

  return (
    <div style={styles.page}>
      <Navbar />

      <div style={styles.hero}>
        <div style={styles.heroInner}>
          <h1 style={styles.heroTitle}>Contact Us</h1>
          <p style={styles.heroSub}>Have a question or need help? We're here for you.</p>
        </div>
      </div>

      <div style={styles.container}>
        <div style={styles.layout}>

          <div style={styles.infoCard}>
            <h2 style={styles.infoTitle}>Get in Touch</h2>
            <p style={styles.infoText}>
              Reach out to us for any queries about vehicle listings, bookings, payments, or disputes. Our team will get back to you as soon as possible.
            </p>

            <div style={styles.contactItems}>
              <ContactItem icon="📧" label="Email" value="support@drivenepal.com" />
              <ContactItem icon="📞" label="Phone" value="01-3343232" />
              <ContactItem icon="📍" label="Address" value="Kathmandu, Nepal" />
              <ContactItem icon="🕐" label="Office Hours" value="Sun – Fri, 9:00 AM – 6:00 PM" />
            </div>
          </div>

          <div style={styles.formCard}>
            {submitted ? (
              <div style={styles.successBox}>
                <div style={styles.successIcon}>✓</div>
                <h3 style={styles.successTitle}>Message Sent!</h3>
                <p style={styles.successText}>Thanks for reaching out. We'll get back to you within 24 hours.</p>
                <button onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }); }}
                  style={styles.resetBtn}>Send Another Message</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h2 style={styles.formTitle}>Send a Message</h2>
                {error && <div style={styles.errorBox}>{error}</div>}

                <div style={styles.row}>
                  <Field label="Your Name *" name="name" value={form.name} onChange={handleChange} placeholder="Full name" />
                  <Field label="Email Address *" name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" />
                </div>

                <Field label="Subject" name="subject" value={form.subject} onChange={handleChange} placeholder="What is this about?" />

                <div style={styles.fieldWrap}>
                  <label style={styles.label}>Message *</label>
                  <textarea name="message" rows={5} value={form.message} onChange={handleChange}
                    placeholder="Describe your query in detail..."
                    style={{ ...styles.input, resize: 'vertical' }} />
                </div>

                <button type="submit" style={styles.submitBtn}>Send Message</button>
              </form>
            )}
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
};

const ContactItem = ({ icon, label, value }) => (
  <div style={styles.contactItem}>
    <span style={styles.contactIcon}>{icon}</span>
    <div>
      <p style={styles.contactLabel}>{label}</p>
      <p style={styles.contactValue}>{value}</p>
    </div>
  </div>
);

const Field = ({ label, name, type = 'text', value, onChange, placeholder }) => (
  <div style={styles.fieldWrap}>
    <label style={styles.label}>{label}</label>
    <input type={type} name={name} value={value} onChange={onChange}
      placeholder={placeholder} style={styles.input} />
  </div>
);

const styles = {
  page: { background: '#EDEEF5', minHeight: '100vh', fontFamily: "'Inter', sans-serif" },
  hero: { background: '#14213d', paddingTop: '8rem', paddingBottom: '4rem' },
  heroInner: { maxWidth: '800px', margin: '0 auto', padding: '0 2rem', textAlign: 'center' },
  heroTitle: { color: '#fff', fontSize: '2.8rem', fontWeight: 800, margin: '0 0 1rem', fontFamily: 'Outfit, sans-serif' },
  heroSub: { color: 'rgba(255,255,255,0.7)', fontSize: '1.1rem', lineHeight: 1.7, margin: 0 },
  container: { maxWidth: '1100px', margin: '0 auto', padding: '3rem 1.5rem' },
  layout: { display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '2rem', alignItems: 'start' },
  infoCard: {
    background: '#14213d', borderRadius: '16px', padding: '2.5rem',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  },
  infoTitle: { color: '#fff', fontSize: '1.5rem', fontWeight: 700, margin: '0 0 1rem', fontFamily: 'Outfit, sans-serif' },
  infoText: { color: 'rgba(255,255,255,0.65)', fontSize: '0.9rem', lineHeight: 1.8, margin: '0 0 2rem' },
  contactItems: { display: 'flex', flexDirection: 'column', gap: '1.2rem' },
  contactItem: { display: 'flex', alignItems: 'flex-start', gap: '1rem' },
  contactIcon: { fontSize: '1.4rem', marginTop: '0.1rem' },
  contactLabel: { color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', margin: '0 0 0.2rem', textTransform: 'uppercase', letterSpacing: '0.05em' },
  contactValue: { color: '#fff', fontSize: '0.92rem', fontWeight: 500, margin: 0 },
  formCard: {
    background: '#fff', borderRadius: '16px', padding: '2.5rem',
    boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
  },
  formTitle: { color: '#14213d', fontSize: '1.4rem', fontWeight: 700, margin: '0 0 1.5rem', fontFamily: 'Outfit, sans-serif' },
  errorBox: {
    background: '#fdecea', border: '1px solid #e63946', color: '#c1121f',
    borderRadius: '8px', padding: '0.75rem 1rem', marginBottom: '1rem', fontSize: '0.875rem',
  },
  row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' },
  fieldWrap: { display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1.1rem' },
  label: { color: '#555', fontSize: '0.85rem', fontWeight: 500 },
  input: {
    background: '#f7f7fa', border: '1px solid #e0e0e6', borderRadius: '10px',
    padding: '0.7rem 0.9rem', color: '#14213d', fontSize: '0.9rem',
    outline: 'none', width: '100%', boxSizing: 'border-box', fontFamily: 'inherit',
  },
  submitBtn: {
    width: '100%', background: '#14213d', color: '#fff', border: 'none',
    borderRadius: '10px', padding: '0.9rem', fontSize: '1rem',
    fontWeight: 600, cursor: 'pointer', marginTop: '0.5rem',
  },
  successBox: { textAlign: 'center', padding: '2rem 1rem' },
  successIcon: {
    width: '64px', height: '64px', background: '#eafaf1', color: '#16a34a',
    borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '2rem', fontWeight: 700, margin: '0 auto 1.5rem',
  },
  successTitle: { color: '#14213d', fontSize: '1.5rem', fontWeight: 700, margin: '0 0 0.6rem' },
  successText: { color: '#888', fontSize: '0.95rem', lineHeight: 1.6, margin: '0 0 1.5rem' },
  resetBtn: {
    background: '#f0f0f5', color: '#14213d', border: 'none', borderRadius: '8px',
    padding: '0.7rem 1.5rem', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer',
  },
};

export default Contact;
