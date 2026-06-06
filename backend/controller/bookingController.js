const bookingModel = require('../model/bookingModel');

const PLATFORM_FEE_PERCENT = parseFloat(process.env.PLATFORM_FEE_PERCENT) || 5;

const generateReference = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'DN-';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

const daysBetween = (start, end) => {
  const s = new Date(start);
  const e = new Date(end);
  const diff = Math.round((e - s) / (1000 * 60 * 60 * 24)) + 1;
  return diff;
};

const createBooking = async (req, res) => {
  try {
    const {
      vehicle_id, start_date, end_date,
      driver_required, pickup_location, customer_note,
    } = req.body;

    if (!vehicle_id || !start_date || !end_date) {
      return res.status(400).json({
        success: false,
        message: 'Vehicle, start date and end date are required',
      });
    }

    const start = new Date(start_date);
    const end   = new Date(end_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (isNaN(start) || isNaN(end)) {
      return res.status(400).json({ success: false, message: 'Invalid date format' });
    }
    if (start < today) {
      return res.status(400).json({ success: false, message: 'Start date cannot be in the past' });
    }
    if (end < start) {
      return res.status(400).json({ success: false, message: 'End date must be after start date' });
    }

    const vehicle = await bookingModel.getVehicleForBooking(vehicle_id);
    if (!vehicle || !vehicle.is_active) {
      return res.status(404).json({ success: false, message: 'Vehicle not available' });
    }

    if (vehicle.owner_id === req.user.id) {
      return res.status(400).json({ success: false, message: 'You cannot book your own vehicle' });
    }

    if (driver_required && !vehicle.has_driver) {
      return res.status(400).json({ success: false, message: 'This vehicle does not offer a driver' });
    }
    if (!driver_required && vehicle.driver_only) {
      return res.status(400).json({ success: false, message: 'This vehicle is only available with a driver' });
    }

    const conflict = await bookingModel.checkConflict(vehicle_id, start_date, end_date);
    if (conflict) {
      return res.status(409).json({
        success: false,
        message: 'This vehicle is already booked for the selected dates',
      });
    }

    const total_days  = daysBetween(start_date, end_date);
    const daily_rate  = Number(vehicle.daily_rate);
    const driver_rate = driver_required ? Number(vehicle.driver_rate) : 0;
    const subtotal    = (daily_rate + driver_rate) * total_days;
    const platform_fee = Math.round(subtotal * (PLATFORM_FEE_PERCENT / 100));
    const total_amount = subtotal + platform_fee;

    const booking = await bookingModel.createBooking({
      vehicle_id,
      customer_id: req.user.id,
      owner_id:    vehicle.owner_id,
      start_date, end_date, total_days, daily_rate,
      driver_required: !!driver_required,
      driver_rate, subtotal, platform_fee, total_amount,
      pickup_location, customer_note,
      reference_code: generateReference(),
    });

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: booking,
    });
  } catch (err) {
    console.error('Create booking error:', err.message);
    res.status(500).json({ success: false, message: 'Server error creating booking' });
  }
};

const getMyBookings = async (req, res) => {
  try {
    const bookings = await bookingModel.getBookingsByCustomer(req.user.id);
    res.status(200).json({ success: true, count: bookings.length, data: bookings });
  } catch (err) {
    console.error('Get my bookings error:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const getBooking = async (req, res) => {
  try {
    const booking = await bookingModel.getBookingById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    const isOwner    = booking.owner_id === req.user.id;
    const isCustomer = booking.customer_id === req.user.id;
    const isAdmin    = req.user.role === 'admin';

    if (!isOwner && !isCustomer && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Not authorised to view this booking' });
    }

    res.status(200).json({ success: true, data: booking });
  } catch (err) {
    console.error('Get booking error:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const getOwnerBookings = async (req, res) => {
  try {
    const bookings = await bookingModel.getBookingsByOwner(req.user.id);
    res.status(200).json({ success: true, count: bookings.length, data: bookings });
  } catch (err) {
    console.error('Get owner bookings error:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const OWNER_ALLOWED = {
  pending:     ['confirmed', 'rejected'],
  confirmed:   ['handed_over', 'cancelled'],
  handed_over: ['returned'],
  returned:    ['completed'],
};

const CUSTOMER_ALLOWED = {
  pending:   ['cancelled'],
  confirmed: ['cancelled'],
};

const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ success: false, message: 'Status is required' });
    }

    const booking = await bookingModel.getBookingOwnerAndCustomer(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    const isOwner    = booking.owner_id === req.user.id;
    const isCustomer = booking.customer_id === req.user.id;

    if (!isOwner && !isCustomer) {
      return res.status(403).json({ success: false, message: 'Not authorised' });
    }

    const allowedMap = isOwner ? OWNER_ALLOWED : CUSTOMER_ALLOWED;
    const allowedNext = allowedMap[booking.status] || [];

    if (!allowedNext.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot change status from '${booking.status}' to '${status}'`,
      });
    }

    const updated = await bookingModel.updateBookingStatus(req.params.id, status);
    res.status(200).json({ success: true, message: 'Status updated', data: updated });
  } catch (err) {
    console.error('Update status error:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { createBooking,
  getMyBookings,
  getBooking,
  getOwnerBookings,
  updateStatus,
 };