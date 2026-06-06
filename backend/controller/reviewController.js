const reviewModel  = require('../model/reviewModel');
const bookingModel = require('../model/bookingModel');

const createReview = async (req, res) => {
  try {
    const { booking_id, rating, comment } = req.body;

    if (!booking_id || !rating) {
      return res.status(400).json({ success: false, message: 'Booking and rating are required' });
    }
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5' });
    }

    const booking = await bookingModel.getBookingById(booking_id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    if (booking.customer_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'You can only review your own bookings' });
    }
    if (booking.status !== 'completed') {
      return res.status(400).json({ success: false, message: 'You can only review completed rentals' });
    }

    const existing = await reviewModel.getReviewByBooking(booking_id, req.user.id);
    if (existing) {
      return res.status(409).json({ success: false, message: 'You have already reviewed this rental' });
    }

    const review = await reviewModel.createReview({
      booking_id,
      vehicle_id:  booking.vehicle_id,
      reviewer_id: req.user.id,
      owner_id:    booking.owner_id,
      rating,
      comment,
    });

    res.status(201).json({ success: true, message: 'Review submitted', data: review });
  } catch (err) {
    console.error('Create review error:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const getVehicleReviews = async (req, res) => {
  try {
    const reviews = await reviewModel.getReviewsByVehicle(req.params.id);
    res.status(200).json({ success: true, count: reviews.length, data: reviews });
  } catch (err) {
    console.error('Get reviews error:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const replyToReview = async (req, res) => {
  try {
    const { reply } = req.body;
    if (!reply) {
      return res.status(400).json({ success: false, message: 'Reply text is required' });
    }

    const review = await reviewModel.getReviewById(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }
    if (review.owner_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'You can only reply to reviews on your vehicles' });
    }

    const updated = await reviewModel.addOwnerReply(req.params.id, reply);
    res.status(200).json({ success: true, message: 'Reply added', data: updated });
  } catch (err) {
    console.error('Reply review error:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { createReview, getVehicleReviews, replyToReview };