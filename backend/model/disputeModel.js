const db = require('../database/db');

const createDispute = async ({ booking_id, raised_by, reason }) => {
  const result = await db.query(
    `INSERT INTO disputes (booking_id, raised_by, reason)
     VALUES ($1, $2, $3) RETURNING *`,
    [booking_id, raised_by, reason]
  );
  return result.rows[0];
};

const getDisputeByBooking = async (bookingId) => {
  const result = await db.query('SELECT * FROM disputes WHERE booking_id = $1', [bookingId]);
  return result.rows[0];
};

const getAllDisputes = async () => {
  const result = await db.query(
    `SELECT d.*, b.reference_code, v.title AS vehicle_title,
            u.full_name AS raised_by_name
     FROM disputes d
     JOIN bookings b ON b.id = d.booking_id
     JOIN vehicles v ON v.id = b.vehicle_id
     JOIN users u ON u.id = d.raised_by
     ORDER BY d.created_at DESC`
  );
  return result.rows;
};

const resolveDispute = async (id, resolution, status) => {
  const result = await db.query(
    `UPDATE disputes SET resolution = $1, status = $2, resolved_at = NOW()
     WHERE id = $3 RETURNING *`,
    [resolution, status, id]
  );
  return result.rows[0];
};

module.exports = { createDispute, getDisputeByBooking, getAllDisputes, resolveDispute };