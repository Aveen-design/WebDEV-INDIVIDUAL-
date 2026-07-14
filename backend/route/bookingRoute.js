const express = require('express');
const router  = express.Router();

const {
  createBooking,
  getMyBookings,
  getBooking,
  getOwnerBookings,
  updateStatus,
  downloadAgreement,
} = require('../controller/bookingController');

const { protect, requireRole } = require('../middleware/authMiddleware');

router.post('/', protect, requireRole('customer'), createBooking);
router.get('/my', protect, getMyBookings);
router.get('/owner', protect, requireRole('owner'), getOwnerBookings);
router.patch('/:id/status', protect, updateStatus);
router.get('/:id/agreement', protect, downloadAgreement);
router.get('/:id', protect, getBooking);

module.exports = router;