const db = require('../database/db');


const createVehicle = async (data) => {
  const {
    owner_id, title, type, brand, model, year, transmission, fuel_type,
    seats, daily_rate, driver_rate, has_driver, driver_only,
    location, description,
  } = data;

  const result = await db.query(
    `INSERT INTO vehicles
       (owner_id, title, type, brand, model, year, transmission, fuel_type,
        seats, daily_rate, driver_rate, has_driver, driver_only,
        location, description)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
     RETURNING *`,
    [owner_id, title, type, brand, model, year, transmission, fuel_type,
     seats, daily_rate, driver_rate || 0, has_driver || false, driver_only || false,
     location, description || null]
  );
  return result.rows[0];
};


const getAllVehicles = async () => {
  const result = await db.query(
    `SELECT v.*, u.full_name AS owner_name
     FROM vehicles v
     JOIN users u ON u.id = v.owner_id
     WHERE v.is_active = true
     ORDER BY v.created_at DESC`
  );
  return result.rows;
};


const getVehicleById = async (id) => {
  const result = await db.query(
    `SELECT v.*, u.full_name AS owner_name, u.phone AS owner_phone
     FROM vehicles v
     JOIN users u ON u.id = v.owner_id
     WHERE v.id = $1 AND v.is_active = true`,
    [id]
  );
  return result.rows[0];
};


const getVehiclesByOwner = async (ownerId) => {
  const result = await db.query(
    `SELECT * FROM vehicles
     WHERE owner_id = $1 AND is_active = true
     ORDER BY created_at DESC`,
    [ownerId]
  );
  return result.rows;
};


const getVehicleOwner = async (id) => {
  const result = await db.query('SELECT owner_id FROM vehicles WHERE id = $1', [id]);
  return result.rows[0];
};

module.exports = {
  createVehicle,
  getAllVehicles,
  getVehicleById,
  getVehiclesByOwner,
  getVehicleOwner,
};