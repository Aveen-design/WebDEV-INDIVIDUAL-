import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const Messages = () => {
  const { bookingId } = useParams();
  const { user } = useAuth();

  const [messages, setMessages] = useState([]);
  const [info, setInfo] = useState(null);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const bottomRef = useRef(null);

  const fetchConversation = async () => {
    try {
      const res = await api.get(`/messages/booking/${bookingId}`);
      setMessages(res.data.data.messages);
      setInfo(res.data.data.booking);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load conversation.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversation();
    const interval = setInterval(fetchConversation, 5000);
    return () => clearInterval(interval);
  }, [bookingId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    const content = text;
    setText('');
    try {
      await api.post('/messages', { booking_id: Number(bookingId), content });
      fetchConversation();
    } catch {
      setError('Could not send message.');
      setText(content);
    }
  };

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.container}>
        <Link to="/dashboard" style={styles.back}>← Back to dashboard</Link>

        {loading ? (
          <div style={styles.message}>Loading...</div>
        ) : error ? (
          <div style={styles.message}>{error}</div>
        ) : (
          <div style={styles.chatBox}>
            <div style={styles.chatHeader}>
              <div>
                <h3 style={styles.chatTitle}>{info.other_party}</h3>
                <p style={styles.chatSub}>{info.vehicle_title} · {info.reference_code}</p>
              </div>
            </div>

            <div style={styles.messageList}>
              {messages.length === 0 ? (
                <p style={styles.empty}>No messages yet. Say hello!</p>
              ) : (
                messages.map((m) => {
                  const mine = m.sender_id === user.id;
                  return (
                    <div key={m.id} style={{ ...styles.bubbleRow, justifyContent: mine ? 'flex-end' : 'flex-start' }}>
                      <div style={{ ...styles.bubble, ...(mine ? styles.bubbleMine : styles.bubbleTheirs) }}>
                        {!mine && <span style={styles.senderName}>{m.sender_name}</span>}
                        <p style={styles.bubbleText}>{m.content}</p>
                        <span style={styles.time}>{fmtTime(m.created_at)}</span>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={bottomRef} />
            </div>

            <form onSubmit={send} style={styles.inputRow}>
              <input value={text} onChange={(e) => setText(e.target.value)}
                placeholder="Type a message..." style={styles.input} />
              <button type="submit" style={styles.sendBtn}>Send</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

const fmtTime = (d) => new Date(d).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

const styles = {
  page: { background: '#EDEEF5', minHeight: '100vh', fontFamily: "'Inter', sans-serif" },
  container: { maxWidth: '700px', margin: '0 auto', padding: '8rem 1.5rem 1.5rem' },
  back: { color: '#3B82F6', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500' },
  message: { color: '#888', textAlign: 'center', padding: '3rem' },
  chatBox: {
    background: '#fff', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '16px',
    marginTop: '1rem', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
    display: 'flex', flexDirection: 'column', height: '70vh',
  },
  chatHeader: { padding: '1.2rem 1.5rem', borderBottom: '1px solid rgba(0,0,0,0.06)' },
  chatTitle: { color: '#14213d', fontSize: '1.1rem', fontWeight: '700', margin: 0 },
  chatSub: { color: '#999', fontSize: '0.8rem', margin: '0.2rem 0 0' },
  messageList: { flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.7rem' },
  empty: { color: '#999', textAlign: 'center', margin: 'auto' },
  bubbleRow: { display: 'flex' },
  bubble: { maxWidth: '70%', borderRadius: '14px', padding: '0.6rem 0.9rem' },
  bubbleMine: { background: '#60A5FA', color: '#fff', borderBottomRightRadius: '4px' },
  bubbleTheirs: { background: '#f0f0f5', color: '#14213d', borderBottomLeftRadius: '4px' },
  senderName: { display: 'block', fontSize: '0.7rem', fontWeight: '600', opacity: 0.7, marginBottom: '0.2rem' },
  bubbleText: { margin: 0, fontSize: '0.9rem', lineHeight: 1.4, wordBreak: 'break-word' },
  time: { display: 'block', fontSize: '0.65rem', opacity: 0.6, marginTop: '0.3rem', textAlign: 'right' },
  inputRow: { display: 'flex', gap: '0.6rem', padding: '1rem 1.5rem', borderTop: '1px solid rgba(0,0,0,0.06)' },
  input: {
    flex: 1, background: '#f7f7fa', border: '1px solid #e0e0e6', borderRadius: '24px',
    padding: '0.7rem 1.1rem', fontSize: '0.9rem', outline: 'none', fontFamily: 'inherit',
  },
  sendBtn: {
    background: '#60A5FA', color: '#fff', border: 'none', borderRadius: '24px',
    padding: '0.7rem 1.4rem', fontSize: '0.9rem', fontWeight: '600', cursor: 'pointer',
  },
};

export default Messages;