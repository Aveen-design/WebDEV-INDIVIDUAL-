import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [stage, setStage] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);

  const requestOtp = async (e) => {
    e.preventDefault();
    setError(''); setInfo('');
    if (!email) return setError('Please enter your email');

    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setInfo('If an account exists, a reset code has been sent to your email.');
      setStage(2);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    setError(''); setInfo('');
    if (otp.length !== 6) return setError('Enter the 6-digit code');

    setLoading(true);
    try {
      await api.post('/auth/verify-otp', { email, otp });
      setStage(3);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired code');
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (e) => {
    e.preventDefault();
    setError(''); setInfo('');
    if (newPassword.length < 8) return setError('Password must be at least 8 characters');
    if (newPassword !== confirmPassword) return setError('Passwords do not match');

    setLoading(true);
    try {
      await api.post('/auth/reset-password', { email, otp, new_password: newPassword });
      setInfo('Password reset! Redirecting to login...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.brand}>
          <span style={styles.brandText}>Drive</span>
          <span style={styles.brandAccent}>Nepal</span>
        </div>

        <h2 style={styles.heading}>
          {stage === 1 && 'Reset your password'}
          {stage === 2 && 'Enter the code'}
          {stage === 3 && 'Set a new password'}
        </h2>
        <p style={styles.subheading}>
          {stage === 1 && "We'll send a 6-digit code to your email"}
          {stage === 2 && `Code sent to ${email}`}
          {stage === 3 && 'Choose a strong new password'}
        </p>

        {error && <div style={styles.errorBox}>{error}</div>}
        {info  && <div style={styles.infoBox}>{info}</div>}

        {stage === 1 && (
          <form onSubmit={requestOtp} style={styles.form}>
            <input style={styles.input} type="email" placeholder="Your email"
              value={email} onChange={(e) => setEmail(e.target.value)} required />
            <button type="submit" style={styles.button} disabled={loading}>
              {loading ? 'Sending...' : 'Send Code'}
            </button>
          </form>
        )}

        {stage === 2 && (
          <form onSubmit={verifyOtp} style={styles.form}>
            <input style={{ ...styles.input, letterSpacing: '6px', textAlign: 'center', fontSize: '1.3rem' }}
              type="text" placeholder="000000" maxLength={6}
              value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} required />
            <button type="submit" style={styles.button} disabled={loading}>
              {loading ? 'Verifying...' : 'Verify Code'}
            </button>
            <button type="button" onClick={requestOtp} style={styles.linkBtn}>
              Resend code
            </button>
          </form>
        )}

        {stage === 3 && (
          <form onSubmit={resetPassword} style={styles.form}>
            <input style={styles.input} type="password" placeholder="New password"
              value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
            <input style={styles.input} type="password" placeholder="Confirm new password"
              value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
            <button type="submit" style={styles.button} disabled={loading}>
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}

        <p style={styles.footerText}>
          Remembered it? <Link to="/login" style={styles.link}>Back to login</Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: '100vh', background: '#f0f0f3', display: 'flex',
    alignItems: 'center', justifyContent: 'center', padding: '2rem',
    fontFamily: "'Segoe UI', sans-serif",
  },
  card: {
    background: '#fff', borderRadius: '20px', padding: '2.5rem',
    width: '100%', maxWidth: '420px', boxShadow: '0 20px 60px rgba(0,0,0,0.12)',
  },
  brand: { fontSize: '1.3rem', fontWeight: '700', marginBottom: '1.5rem' },
  brandText: { color: '#14213d' },
  brandAccent: { color: '#DC143C' },
  heading: { fontSize: '1.6rem', fontWeight: '700', color: '#14213d', margin: '0 0 0.3rem' },
  subheading: { color: '#888', fontSize: '0.9rem', margin: '0 0 1.5rem' },
  errorBox: {
    background: '#fdecea', border: '1px solid #e63946', color: '#c1121f',
    borderRadius: '8px', padding: '0.75rem 1rem', marginBottom: '1rem', fontSize: '0.875rem',
  },
  infoBox: {
    background: '#eafaf1', border: '1px solid #2ecc71', color: '#1e7e44',
    borderRadius: '8px', padding: '0.75rem 1rem', marginBottom: '1rem', fontSize: '0.875rem',
  },
  form: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  input: {
    background: '#f7f7fa', border: '1px solid #e0e0e6', borderRadius: '10px',
    padding: '0.8rem 1rem', color: '#14213d', fontSize: '0.95rem',
    outline: 'none', width: '100%', boxSizing: 'border-box',
  },
  button: {
    background: '#DC143C', color: '#fff', border: 'none', borderRadius: '10px',
    padding: '0.85rem', fontSize: '1rem', fontWeight: '600', cursor: 'pointer',
  },
  linkBtn: {
    background: 'transparent', border: 'none', color: '#DC143C',
    fontSize: '0.85rem', cursor: 'pointer', fontWeight: '500',
  },
  footerText: { textAlign: 'center', color: '#888', fontSize: '0.875rem', marginTop: '1.25rem' },
  link: { color: '#DC143C', textDecoration: 'none', fontWeight: '600' },
};

export default ForgotPassword;