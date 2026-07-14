const express = require('express');
const router  = express.Router();
const { initiateESewa, verifyESewa, getPaymentStatus } = require('../controller/paymentController');
const { protect } = require('../middleware/authMiddleware');

router.post('/esewa/initiate', protect, initiateESewa);
router.get('/esewa/verify',    verifyESewa);
router.get('/booking/:bookingId', protect, getPaymentStatus);

module.exports = router;
