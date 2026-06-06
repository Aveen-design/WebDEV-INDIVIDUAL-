const db = require('../database/db');

const checkConflict = async (vehicleId, startDate, endDate) => {
  const result = await db.query(
    `SELECT id FROM bookings
     WHERE vehicle_id = $1
       AND status NOT IN ('cancelled', 'rejected')
       AND start_date <= $3
       AND end_date >= $2`,
    [vehicleId, startDate, endDate]
  );
  return result.rows.length > 0;
};

const createBooking = async (data) => {
  const {
    vehicle_id, customer_id, owner_id, start_date, end_date,
    total_days, daily_rate, driver_required, driver_rate,
    subtotal, platform_fee, total_amount, pickup_location,
    customer_note, reference_code,
  } = data;

  const result = await db.query(
    `INSERT INTO bookings
       (vehicle_id, customer_id, owner_id, start_date, end_date,
        total_days, daily_rate, driver_required, driver_rate,
        subtotal, platform_fee, total_amount, pickup_location,
        customer_note, reference_code)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
     RETURNING *`,
    [vehicle_id, customer_id, owner_id, start_date, end_date,
     total_days, daily_rate, driver_required, driver_rate,
     subtotal, platform_fee, total_amount, pickup_location || null,
     customer_note || null, reference_code]
  );
  return result.rows[0];
};

const getBookingsByCustomer = async (customerId) => {
  const result = await db.query(
    `SELECT b.*, v.title AS vehicle_title, v.brand, v.location,
            v.type AS vehicle_type,
            (SELECT url FROM vehicle_photos WHERE vehicle_id = v.id AND is_primary = true LIMIT 1) AS vehicle_photo
     FROM bookings b
     JOIN vehicles v ON v.id = b.vehicle_id
     WHERE b.customer_id = $1
     ORDER BY b.created_at DESC`,
    [customerId]
  );
  return result.rows;
};

const getBookingById = async (id) => {
  const result = await db.query(
    `SELECT b.*, v.title AS vehicle_title, v.brand, v.model, v.location,
            v.type AS vehicle_type,
            cust.full_name AS customer_name, cust.phone AS customer_phone,
            own.full_name  AS owner_name,    own.phone  AS owner_phone
     FROM bookings b
     JOIN vehicles v ON v.id = b.vehicle_id
     JOIN users cust ON cust.id = b.customer_id
     JOIN users own  ON own.id  = b.owner_id
     WHERE b.id = $1`,
    [id]
  );
  return result.rows[0];
};

const getVehicleForBooking = async (vehicleId) => {
  const result = await db.query(
    `SELECT id, owner_id, daily_rate, driver_rate, has_driver, driver_only, is_active
     FROM vehicles WHERE id = $1`,
    [vehicleId]
  );
  return result.rows[0];
};

const getBookingsByOwner = async (ownerId) => {
  const result = await db.query(
    `SELECT b.*, v.title AS vehicle_title, v.type AS vehicle_type,
            cust.full_name AS customer_name, cust.phone AS customer_phone
     FROM bookings b
     JOIN vehicles v ON v.id = b.vehicle_id
     JOIN users cust ON cust.id = b.customer_id
     WHERE b.owner_id = $1
     ORDER BY b.created_at DESC`,
    [ownerId]
  );
  return result.rows;
};

const updateBookingStatus = async (id, status) => {
  const result = await db.query(
    `UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *`,
    [status, id]
  );
  return result.rows[0];
};

const getBookingOwnerAndCustomer = async (id) => {
  const result = await db.query(
    'SELECT owner_id, customer_id, status FROM bookings WHERE id = $1',
    [id]
  );
  return result.rows[0];
};

module.exports = {
  checkConflict,
  createBooking,
  getBookingsByCustomer,
  getBookingById,
  getVehicleForBooking,
  getBookingsByOwner,
  updateBookingStatus,
  getBookingOwnerAndCustomer,
};