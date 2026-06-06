const db = require('../database/db');

const createNotification = async ({ user_id, type, title, body }) => {
  const result = await db.query(
    `INSERT INTO notifications (user_id, type, title, body)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [user_id, type, title, body || null]
  );
  return result.rows[0];
};

const getByUser = async (userId) => {
  const result = await db.query(
    `SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC LIMIT 30`,
    [userId]
  );
  return result.rows;
};

const getUnreadCount = async (userId) => {
  const result = await db.query(
    'SELECT COUNT(*) FROM notifications WHERE user_id = $1 AND is_read = false',
    [userId]
  );
  return Number(result.rows[0].count);
};

const markRead = async (id, userId) => {
  await db.query('UPDATE notifications SET is_read = true WHERE id = $1 AND user_id = $2', [id, userId]);
};

const markAllRead = async (userId) => {
  await db.query('UPDATE notifications SET is_read = true WHERE user_id = $1', [userId]);
};

module.exports = { createNotification, getByUser, getUnreadCount, markRead, markAllRead };