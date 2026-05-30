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

module.exports = { findUserByEmail, findUserById, createUser };