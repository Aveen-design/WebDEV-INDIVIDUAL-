const db = require('../database/db');

const createReview = async (data) => {
  const { booking_id, vehicle_id, reviewer_id, owner_id, rating, comment } = data;
  const result = await db.query(
    `INSERT INTO reviews (booking_id, vehicle_id, reviewer_id, owner_id, rating, comment)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [booking_id, vehicle_id, reviewer_id, owner_id, rating, comment || null]
  );
  return result.rows[0];
};

const getReviewsByVehicle = async (vehicleId) => {
  const result = await db.query(
    `SELECT r.*, u.full_name AS reviewer_name
     FROM reviews r
     JOIN users u ON u.id = r.reviewer_id
     WHERE r.vehicle_id = $1
     ORDER BY r.created_at DESC`,
    [vehicleId]
  );
  return result.rows;
};

const getReviewByBooking = async (bookingId, reviewerId) => {
  const result = await db.query(
    'SELECT * FROM reviews WHERE booking_id = $1 AND reviewer_id = $2',
    [bookingId, reviewerId]
  );
  return result.rows[0];
};

const getReviewById = async (id) => {
  const result = await db.query('SELECT * FROM reviews WHERE id = $1', [id]);
  return result.rows[0];
};

const addOwnerReply = async (id, reply) => {
  const result = await db.query(
    'UPDATE reviews SET owner_reply = $1, replied_at = NOW() WHERE id = $2 RETURNING *',
    [reply, id]
  );
  return result.rows[0];
};

module.exports = {
  createReview,
  getReviewsByVehicle,
  getReviewByBooking,
  getReviewById,
  addOwnerReply,
};