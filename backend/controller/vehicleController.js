const vehicleModel = require('../model/vehicleModel');

const VALID_TYPES = ['car','motorcycle','suv','van','bus','jeep','electric'];

const createVehicle = async (req, res) => {
  try {
    const {
      title, type, brand, model, year,
      transmission, fuel_type, seats,
      daily_rate, driver_rate, has_driver, driver_only,
      location, description,
    } = req.body;

    if (!title || !type || !brand || !model || !year || !daily_rate || !location) {
      return res.status(400).json({
        success: false,
        message: 'Title, type, brand, model, year, daily rate and location are required'
      });
    }
    if (!VALID_TYPES.includes(type)) {
      return res.status(400).json({
        success: false,
        message: `Type must be one of: ${VALID_TYPES.join(', ')}`
      });
    }
    if (Number(daily_rate) <= 0) {
      return res.status(400).json({ success: false, message: 'Daily rate must be greater than 0' });
    }
    if (Number(year) < 1990 || Number(year) > new Date().getFullYear() + 1) {
      return res.status(400).json({ success: false, message: 'Please enter a valid year' });
    }

    const vehicle = await vehicleModel.createVehicle({
      owner_id: req.user.id,   // comes from auth middleware
      title, type, brand, model, year,
      transmission, fuel_type, seats,
      daily_rate, driver_rate, has_driver, driver_only,
      location, description,
    });

    res.status(201).json({
      success: true,
      message: 'Vehicle listed successfully. It will be visible after admin approval.',
      data: vehicle,
    });

  } catch (err) {
    console.error('Create vehicle error:', err.message);
    res.status(500).json({ success: false, message: 'Server error creating vehicle' });
  }
};

const getVehicles = async (req, res) => {
  try {
    const page  = Math.max(1, parseInt(req.query.page)  || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 12);
    const offset = (page - 1) * limit;

    const filters = {
      type:         req.query.type,
      location:     req.query.location,
      min_price:    req.query.min_price,
      max_price:    req.query.max_price,
      transmission: req.query.transmission,
      fuel_type:    req.query.fuel_type,
      driver_option: req.query.driver_option,
      sort:         req.query.sort,
      limit,
      offset,
    };

    const rows = await vehicleModel.searchVehicles(filters);

    const total = rows.length > 0 ? Number(rows[0].total_count) : 0;
    const vehicles = rows.map(({ total_count, ...v }) => v);

    res.status(200).json({
      success: true,
      data: {
        vehicles,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (err) {
    console.error('Get vehicles error:', err.message);
    res.status(500).json({ success: false, message: 'Server error fetching vehicles' });
  }
};

const getVehicleById = async (req, res) => {
  try {
    const vehicle = await vehicleModel.getVehicleById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }
    res.status(200).json({ success: true, data: vehicle });
  } catch (err) {
    console.error('Get vehicle error:', err.message);
    res.status(500).json({ success: false, message: 'Server error fetching vehicle' });
  }
};

const getMyVehicles = async (req, res) => {
  try {
    const vehicles = await vehicleModel.getVehiclesByOwner(req.user.id);
    res.status(200).json({ success: true, count: vehicles.length, data: vehicles });
  } catch (err) {
    console.error('Get my vehicles error:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
const getAvailability = async (req, res) => {
  try {
    const vehicle = await vehicleModel.getVehicleById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }

    const booked = await vehicleModel.getBookedDates(req.params.id);

    res.status(200).json({
      success: true,
      data: { booked },
    });
  } catch (err) {
    console.error('Get availability error:', err.message);
    res.status(500).json({ success: false, message: 'Server error fetching availability' });
  }
};
module.exports = {
  createVehicle,
  getVehicles,
  getVehicleById,
  getMyVehicles,
  getAvailability
};