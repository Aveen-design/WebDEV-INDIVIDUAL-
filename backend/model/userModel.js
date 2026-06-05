const db = require('../database/db');

const findUserByEmail = async (email) => {
  const result = await db.query(
    'SELECT * FROM users WHERE email = $1',
    [email]
  );
  return result.rows[0];
};


const findUserById = async (id) => {
  const result = await db.query(
    'SELECT id, full_name, email, phone, role, avatar_url, is_verified, is_active, created_at FROM users WHERE id = $1',
    [id]
  );
  return result.rows[0];
};


const createUser = async ({ full_name, email, password_hash, role, phone }) => {
  const result = await db.query(
    `INSERT INTO users (full_name, email, password_hash, role, phone)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, full_name, email, role, phone, is_verified, created_at`,
    [full_name, email, password_hash, role || 'customer', phone || null]
  );
  return result.rows[0];
};

const saveOtp = async (email, otp, expiresAt) => {
  await db.query(
    'UPDATE password_resets SET used = true WHERE email = $1 AND used = false',
    [email]
  );
  await db.query(
    'INSERT INTO password_resets (email, otp, expires_at) VALUES ($1, $2, $3)',
    [email, otp, expiresAt]
  );
};

const findValidOtp = async (email, otp) => {
  const result = await db.query(
    `SELECT * FROM password_resets
     WHERE email = $1 AND otp = $2 AND used = false AND expires_at > NOW()
     ORDER BY created_at DESC LIMIT 1`,
    [email, otp]
  );
  return result.rows[0];
};

const markOtpUsed = async (id) => {
  await db.query('UPDATE password_resets SET used = true WHERE id = $1', [id]);
};

const updatePassword = async (email, passwordHash) => {
  await db.query(
    'UPDATE users SET password_hash = $1 WHERE email = $2',
    [passwordHash, email]
  );
};

module.exports = { findUserByEmail, findUserById, createUser,saveOtp,
  findValidOtp,
  markOtpUsed,
  updatePassword, };