const express = require('express');
const router  = express.Router();

const {
  createBooking,
  getMyBookings,
  getBooking,
} = require('../controller/bookingController');

const { protect, requireRole } = require('../middleware/authMiddleware');

router.post('/', protect, requireRole('customer'), createBooking);
router.get('/my', protect, getMyBookings);
router.get('/:id', protect, getBooking);

module.exports = router;