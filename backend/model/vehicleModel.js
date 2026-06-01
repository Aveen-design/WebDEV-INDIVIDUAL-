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


const searchVehicles = async (filters) => {
  const {
    type, location, min_price, max_price,
    transmission, fuel_type, has_driver,
    sort, limit, offset,
  } = filters;

  const params = [];
  const where  = ['v.is_active = true'];

  if (type) {
    params.push(type);
    where.push(`v.type = $${params.length}`);
  }
  if (location) {
    params.push(`%${location}%`);
    where.push(`v.location ILIKE $${params.length}`);
  }
  if (min_price) {
    params.push(Number(min_price));
    where.push(`v.daily_rate >= $${params.length}`);
  }
  if (max_price) {
    params.push(Number(max_price));
    where.push(`v.daily_rate <= $${params.length}`);
  }
  if (transmission) {
    params.push(transmission);
    where.push(`v.transmission = $${params.length}`);
  }
  if (fuel_type) {
    params.push(fuel_type);
    where.push(`v.fuel_type = $${params.length}`);
  }
  if (has_driver === 'true') {
    where.push('v.has_driver = true');
  }

  const sortMap = {
    price_asc:  'v.daily_rate ASC',
    price_desc: 'v.daily_rate DESC',
    newest:     'v.created_at DESC',
    rating:     'v.average_rating DESC',
  };
  const orderBy = sortMap[sort] || 'v.created_at DESC';

  params.push(limit);
  const limitIdx = params.length;
  params.push(offset);
  const offsetIdx = params.length;

  const sql = `
    SELECT v.*, u.full_name AS owner_name,
           COUNT(*) OVER() AS total_count
    FROM vehicles v
    JOIN users u ON u.id = v.owner_id
    WHERE ${where.join(' AND ')}
    ORDER BY ${orderBy}
    LIMIT $${limitIdx} OFFSET $${offsetIdx}
  `;

  const result = await db.query(sql, params);
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
  searchVehicles,
  getVehicleById,
  getVehiclesByOwner,
  getVehicleOwner,
};