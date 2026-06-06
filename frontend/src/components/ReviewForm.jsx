import { useState } from 'react';
import api from '../utils/api';

const ReviewForm = ({ bookingId, onSuccess }) => {
  const [rating, setRating]   = useState(0);
  const [hover, setHover]     = useState(0);
  const [comment, setComment] = useState('');
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setError('');
    if (rating === 0) return setError('Please select a rating');

    setLoading(true);
    try {
      await api.post('/reviews', { booking_id: bookingId, rating, comment });
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not submit review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.box}>
      <p style={styles.title}>Rate this rental</p>
      {error && <p style={styles.error}>{error}</p>}

      <div style={styles.stars}>
        {[1, 2, 3, 4, 5].map((s) => (
          <span key={s} onClick={() => setRating(s)}
            onMouseEnter={() => setHover(s)} onMouseLeave={() => setHover(0)}
            style={{ ...styles.star, color: (hover || rating) >= s ? '#f5a623' : '#ddd' }}>★</span>
        ))}
      </div>

      <textarea value={comment} onChange={(e) => setComment(e.target.value)}
        placeholder="Share your experience (optional)" rows={2} style={styles.textarea} />

      <button onClick={submit} style={styles.btn} disabled={loading}>
        {loading ? 'Submitting...' : 'Submit Review'}
      </button>
    </div>
  );
};

const styles = {
  box: { marginTop: '1rem', borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: '1rem' },
  title: { color: '#14213d', fontSize: '0.9rem', fontWeight: '600', margin: '0 0 0.5rem' },
  error: { color: '#cf1322', fontSize: '0.82rem', margin: '0 0 0.5rem' },
  stars: { display: 'flex', gap: '0.2rem', marginBottom: '0.6rem' },
  star: { fontSize: '1.6rem', cursor: 'pointer' },
  textarea: {
    width: '100%', background: '#f7f7fa', border: '1px solid #e0e0e6', borderRadius: '8px',
    padding: '0.6rem', fontSize: '0.85rem', fontFamily: 'inherit', resize: 'vertical',
    boxSizing: 'border-box', marginBottom: '0.6rem',
  },
  btn: {
    background: '#60A5FA', color: '#fff', border: 'none', borderRadius: '8px',
    padding: '0.5rem 1.2rem', fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer',
  },
};

export default ReviewForm;