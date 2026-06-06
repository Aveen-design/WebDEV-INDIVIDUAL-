const db = require('../database/db');

const createMessage = async ({ booking_id, sender_id, recipient_id, content }) => {
  const result = await db.query(
    `INSERT INTO messages (booking_id, sender_id, recipient_id, content)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [booking_id, sender_id, recipient_id, content]
  );
  return result.rows[0];
};

const getMessagesByBooking = async (bookingId) => {
  const result = await db.query(
    `SELECT m.*, u.full_name AS sender_name
     FROM messages m
     JOIN users u ON u.id = m.sender_id
     WHERE m.booking_id = $1
     ORDER BY m.created_at ASC`,
    [bookingId]
  );
  return result.rows;
};

const markMessagesRead = async (bookingId, recipientId) => {
  await db.query(
    'UPDATE messages SET is_read = true WHERE booking_id = $1 AND recipient_id = $2 AND is_read = false',
    [bookingId, recipientId]
  );
};

const getConversations = async (userId) => {
  const result = await db.query(
    `SELECT DISTINCT ON (m.booking_id)
            m.booking_id, m.content AS last_message, m.created_at,
            b.reference_code, v.title AS vehicle_title,
            CASE WHEN b.customer_id = $1 THEN own.full_name ELSE cust.full_name END AS other_party,
            (SELECT COUNT(*) FROM messages
             WHERE booking_id = m.booking_id AND recipient_id = $1 AND is_read = false) AS unread_count
     FROM messages m
     JOIN bookings b ON b.id = m.booking_id
     JOIN vehicles v ON v.id = b.vehicle_id
     JOIN users cust ON cust.id = b.customer_id
     JOIN users own  ON own.id = b.owner_id
     WHERE m.sender_id = $1 OR m.recipient_id = $1
     ORDER BY m.booking_id, m.created_at DESC`,
    [userId]
  );
  return result.rows;
};

module.exports = { createMessage, getMessagesByBooking, markMessagesRead, getConversations };