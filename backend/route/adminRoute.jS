const express = require('express');
const router  = express.Router();

const {
  getStats, getPendingVehicles, reviewVehicle,
  getUsers, toggleUser, getBookings,
} = require('../controller/adminController');

const { protect, requireRole } = require('../middleware/authMiddleware');

router.use(protect, requireRole('admin'));

router.get('/stats', getStats);
router.get('/vehicles/pending', getPendingVehicles);
router.patch('/vehicles/:id/review', reviewVehicle);
router.get('/users', getUsers);
router.patch('/users/:id/toggle', toggleUser);
router.get('/bookings', getBookings);

module.exports = router;