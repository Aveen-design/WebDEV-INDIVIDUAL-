const db = require('../database/db');

const createPayment = async ({ booking_id, customer_id, amount, method, status, transaction_id }) => {
  const result = await db.query(
    `INSERT INTO payments (booking_id, customer_id, amount, method, status, transaction_id)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [booking_id, customer_id, amount, method, status, transaction_id]
  );
  return result.rows[0];
};

const getPaymentByBookingId = async (bookingId) => {
  const result = await db.query(
    'SELECT * FROM payments WHERE booking_id = $1 ORDER BY created_at DESC LIMIT 1',
    [bookingId]
  );
  return result.rows[0];
};

const getPaymentByTransactionId = async (transactionId) => {
  const result = await db.query(
    'SELECT * FROM payments WHERE transaction_id = $1 LIMIT 1',
    [transactionId]
  );
  return result.rows[0];
};

const updateTransactionId = async (id, transaction_id) => {
  const result = await db.query(
    'UPDATE payments SET transaction_id = $1 WHERE id = $2 RETURNING *',
    [transaction_id, id]
  );
  return result.rows[0];
};

const updatePayment = async (id, { status, paid_at }) => {
  const result = await db.query(
    `UPDATE payments SET status = $1, paid_at = $2 WHERE id = $3 RETURNING *`,
    [status, paid_at || null, id]
  );
  return result.rows[0];
};

module.exports = { createPayment, getPaymentByBookingId, getPaymentByTransactionId, updatePayment, updateTransactionId };
