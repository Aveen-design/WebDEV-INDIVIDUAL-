import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const PaymentSuccess = ({ failure }) => {
  const [searchParams] = useSearchParams();
  const [status,  setStatus]  = useState('verifying');
  const [bookingId, setBookingId] = useState(null);
  const [errMsg,  setErrMsg]  = useState('');

  useEffect(() => {
    if (failure) {
      setStatus('failed');
      return;
    }

    const data = searchParams.get('data');
    if (!data) {
      setStatus('failed');
      setErrMsg('No payment data received.');
      return;
    }

    const token = localStorage.getItem('token');
    fetch(`http://localhost:8000/api/payments/esewa/verify?data=${encodeURIComponent(data)}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((json) => {
        if (json.success) {
          setBookingId(json.booking_id);
          setStatus('success');
        } else {
          setErrMsg(json.message || 'Verification failed.');
          setStatus('failed');
        }
      })
      .catch(() => {
        setErrMsg('Network error during verification.');
        setStatus('failed');
      });
  }, []);

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.container}>
        {status === 'verifying' && (
          <div style={styles.box}>
            <div style={styles.spinner} />
            <p style={styles.msg}>Verifying your payment...</p>
          </div>
        )}

        {status === 'success' && (
          <div style={styles.box}>
            <div style={styles.iconGreen}>✓</div>
            <h1 style={styles.heading}>Payment Successful!</h1>
            <p style={styles.sub}>Your payment via eSewa has been verified and recorded.</p>
            <div style={styles.btnRow}>
              <Link to="/dashboard" style={styles.primaryBtn}>Go to Dashboard</Link>
              {bookingId && (
                <Link to={`/messages/${bookingId}`} style={styles.secondaryBtn}>Message Owner</Link>
              )}
            </div>
          </div>
        )}

        {status === 'failed' && (
          <div style={styles.box}>
            <div style={styles.iconRed}>✕</div>
            <h1 style={{ ...styles.heading, color: '#c1121f' }}>Payment Failed</h1>
            <p style={styles.sub}>{errMsg || 'Your payment could not be completed. No amount has been deducted.'}</p>
            <div style={styles.btnRow}>
              <Link to="/dashboard" style={styles.primaryBtn}>Go to Dashboard</Link>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

const styles = {
  page:      { background: '#EDEEF5', minHeight: '100vh', fontFamily: "'Inter', sans-serif" },
  container: { maxWidth: '520px', margin: '0 auto', padding: '10rem 1.5rem 3rem', textAlign: 'center' },
  box: {
    background: '#fff', border: '1px solid rgba(0,0,0,0.06)',
    borderRadius: '20px', padding: '3rem 2rem', boxShadow: '0 4px 30px rgba(0,0,0,0.06)',
  },
  spinner: {
    width: '48px', height: '48px', border: '4px solid #e0e0e6',
    borderTop: '4px solid #60A5FA', borderRadius: '50%',
    animation: 'spin 0.8s linear infinite', margin: '0 auto 1.5rem',
  },
  msg:     { color: '#888', fontSize: '1rem' },
  iconGreen: {
    width: '64px', height: '64px', background: '#eafaf1', color: '#16a34a',
    borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '2rem', fontWeight: 700, margin: '0 auto 1.5rem',
  },
  iconRed: {
    width: '64px', height: '64px', background: '#fdecea', color: '#c1121f',
    borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '2rem', fontWeight: 700, margin: '0 auto 1.5rem',
  },
  heading: { color: '#14213d', fontSize: '1.7rem', fontWeight: 700, margin: '0 0 0.6rem', fontFamily: 'Outfit, sans-serif' },
  sub:     { color: '#888', fontSize: '0.95rem', margin: '0 0 2rem', lineHeight: 1.6 },
  btnRow:  { display: 'flex', gap: '0.8rem', justifyContent: 'center', flexWrap: 'wrap' },
  primaryBtn: {
    background: '#14213d', color: '#fff', textDecoration: 'none',
    padding: '0.75rem 1.5rem', borderRadius: '10px', fontWeight: 600, fontSize: '0.9rem',
  },
  secondaryBtn: {
    background: '#f0f0f5', color: '#14213d', textDecoration: 'none',
    padding: '0.75rem 1.5rem', borderRadius: '10px', fontWeight: 600, fontSize: '0.9rem',
  },
};

export default PaymentSuccess;
