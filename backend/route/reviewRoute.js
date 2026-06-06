const express = require('express');
const router  = express.Router();

const { createReview, getVehicleReviews, replyToReview } = require('../controller/reviewController');
const { protect, requireRole } = require('../middleware/authMiddleware');

router.post('/', protect, requireRole('customer'), createReview);
router.get('/vehicle/:id', getVehicleReviews);
router.post('/:id/reply', protect, requireRole('owner'), replyToReview);

module.exports = router;