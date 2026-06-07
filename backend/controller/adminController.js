const adminModel = require('../model/adminModel');
const notificationModel = require('../model/notificationModel');

const getStats = async (req, res) => {
  try {
    const stats = await adminModel.getStats();
    res.status(200).json({ success: true, data: stats });
  } catch (err) {
    console.error('Admin stats error:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const getPendingVehicles = async (req, res) => {
  try {
    const vehicles = await adminModel.getPendingVehicles();
    res.status(200).json({ success: true, data: vehicles });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const reviewVehicle = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Status must be approved or rejected' });
    }

    const owner = await adminModel.getVehicleOwnerId(req.params.id);
    if (!owner) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }

    const vehicle = await adminModel.setVehicleStatus(req.params.id, status);

    await notificationModel.createNotification({
      user_id: owner.owner_id,
      type: 'verification',
      title: `Listing ${status}`,
      body: `Your vehicle "${vehicle.title}" has been ${status}.`,
    }).catch(() => {});

    res.status(200).json({ success: true, message: `Vehicle ${status}`, data: vehicle });
  } catch (err) {
    console.error('Review vehicle error:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await adminModel.getAllUsers();
    res.status(200).json({ success: true, data: users });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const toggleUser = async (req, res) => {
  try {
    const { is_active } = req.body;
    const user = await adminModel.setUserActive(req.params.id, is_active);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const getBookings = async (req, res) => {
  try {
    const bookings = await adminModel.getAllBookings();
    res.status(200).json({ success: true, data: bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = {
  getStats, getPendingVehicles, reviewVehicle,
  getUsers, toggleUser, getBookings,
};