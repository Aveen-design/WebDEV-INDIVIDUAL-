import { useState, useEffect, useRef } from 'react';
import api from '../utils/api';

const NotificationBell = () => {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [unread, setUnread] = useState(0);
  const ref = useRef(null);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      setItems(res.data.data.notifications);
      setUnread(res.data.data.unread);
    } catch {}
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const toggle = async () => {
    setOpen(!open);
    if (!open && unread > 0) {
      await api.patch('/notifications/read-all').catch(() => {});
      setUnread(0);
    }
  };

  return (
    <div style={styles.wrap} ref={ref}>
      <button onClick={toggle} style={styles.bell}>
        🔔
        {unread > 0 && <span style={styles.badge}>{unread > 9 ? '9+' : unread}</span>}
      </button>

      {open && (
        <div style={styles.dropdown}>
          <div style={styles.header}>Notifications</div>
          {items.length === 0 ? (
            <p style={styles.empty}>No notifications yet</p>
          ) : (
            items.map((n) => (
              <div key={n.id} style={{ ...styles.item, background: n.is_read ? '#fff' : '#f0f7ff' }}>
                <p style={styles.itemTitle}>{n.title}</p>
                {n.body && <p style={styles.itemBody}>{n.body}</p>}
                <span style={styles.itemTime}>{fmt(n.created_at)}</span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

const fmt = (d) => {
  const diff = (Date.now() - new Date(d)) / 1000;
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
};

const styles = {
  wrap: { position: 'relative' },
  bell: {
    background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.2rem',
    position: 'relative', padding: '0.3rem',
  },
  badge: {
    position: 'absolute', top: 0, right: 0, background: '#cf1322', color: '#fff',
    fontSize: '0.6rem', fontWeight: '700', borderRadius: '10px', padding: '0.1rem 0.35rem', minWidth: '16px',
  },
  dropdown: {
    position: 'absolute', top: '120%', right: 0, width: '300px', maxHeight: '400px',
    overflowY: 'auto', background: '#fff', border: '1px solid rgba(0,0,0,0.1)',
    borderRadius: '12px', boxShadow: '0 10px 40px rgba(0,0,0,0.15)', zIndex: 200,
  },
  header: { padding: '0.9rem 1rem', fontWeight: '700', color: '#14213d', borderBottom: '1px solid rgba(0,0,0,0.06)' },
  empty: { padding: '2rem 1rem', textAlign: 'center', color: '#999', fontSize: '0.85rem' },
  item: { padding: '0.8rem 1rem', borderBottom: '1px solid rgba(0,0,0,0.04)' },
  itemTitle: { margin: 0, fontSize: '0.85rem', fontWeight: '600', color: '#14213d' },
  itemBody: { margin: '0.2rem 0 0', fontSize: '0.78rem', color: '#666' },
  itemTime: { fontSize: '0.7rem', color: '#aaa', marginTop: '0.3rem', display: 'block' },
};

export default NotificationBell;