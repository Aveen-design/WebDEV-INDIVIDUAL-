const db = require('../database/db');

const getPendingVehicles = async () => {
  const result = await db.query(
    `SELECT v.*, u.full_name AS owner_name, u.email AS owner_email
     FROM vehicles v
     JOIN users u ON u.id = v.owner_id
     WHERE v.verification_status = 'pending' AND v.is_active = true
     ORDER BY v.created_at ASC`
  );
  return result.rows;
};

const setVehicleStatus = async (id, status) => {
  const result = await db.query(
    'UPDATE vehicles SET verification_status = $1 WHERE id = $2 RETURNING *',
    [status, id]
  );
  return result.rows[0];
};

const getVehicleOwnerId = async (id) => {
  const result = await db.query('SELECT owner_id FROM vehicles WHERE id = $1', [id]);
  return result.rows[0];
};

const getAllUsers = async () => {
  const result = await db.query(
    `SELECT id, full_name, email, role, phone, is_active, is_verified, created_at
     FROM users WHERE role != 'admin' ORDER BY created_at DESC`
  );
  return result.rows;
};

const setUserActive = async (id, isActive) => {
  const result = await db.query(
    'UPDATE users SET is_active = $1 WHERE id = $2 RETURNING id, full_name, is_active',
    [isActive, id]
  );
  return result.rows[0];
};

const getStats = async () => {
  const users    = await db.query("SELECT COUNT(*) FROM users WHERE role != 'admin'");
  const vehicles = await db.query('SELECT COUNT(*) FROM vehicles WHERE is_active = true');
  const pending  = await db.query("SELECT COUNT(*) FROM vehicles WHERE verification_status = 'pending' AND is_active = true");
  const bookings = await db.query('SELECT COUNT(*) FROM bookings');
  const revenue  = await db.query("SELECT COALESCE(SUM(platform_fee), 0) AS total FROM bookings WHERE status = 'completed'");

  return {
    users:    Number(users.rows[0].count),
    vehicles: Number(vehicles.rows[0].count),
    pending:  Number(pending.rows[0].count),
    bookings: Number(bookings.rows[0].count),
    revenue:  Number(revenue.rows[0].total),
  };
};

const getAllBookings = async () => {
  const result = await db.query(
    `SELECT b.id, b.reference_code, b.status, b.total_amount, b.start_date, b.end_date,
            v.title AS vehicle_title, cust.full_name AS customer_name, own.full_name AS owner_name
     FROM bookings b
     JOIN vehicles v ON v.id = b.vehicle_id
     JOIN users cust ON cust.id = b.customer_id
     JOIN users own  ON own.id  = b.owner_id
     ORDER BY b.created_at DESC LIMIT 50`
  );
  return result.rows;
};

module.exports = {
  getPendingVehicles, setVehicleStatus, getVehicleOwnerId,
  getAllUsers, setUserActive, getStats, getAllBookings,
};