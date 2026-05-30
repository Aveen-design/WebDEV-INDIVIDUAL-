const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user:     process.env.DB_USER,
  password: process.env.DB_PASS,
  port:     process.env.DB_PORT,
  database: process.env.DB_NAME,
  host:     process.env.DB_HOST,
});

pool.connect((err, client, release) => {
  if (err) {
    console.error('Database connection failed:', err.message);
  } else {
    console.log('PostgreSQL connected successfully');
    release();
  }
});

const query = (text, params) => pool.query(text, params);

module.exports = { pool, query };