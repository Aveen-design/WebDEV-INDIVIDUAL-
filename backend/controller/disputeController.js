const disputeModel = require('../model/disputeModel');
const bookingModel = require('../model/bookingModel');

const raiseDispute = async (req, res) => {
  try {
    const { booking_id, reason } = req.body;
    if (!booking_id || !reason?.trim()) {
      return res.status(400).json({ success: false, message: 'Booking and reason are required' });
    }

    const booking = await bookingModel.getBookingById(booking_id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    if (booking.customer_id !== req.user.id && booking.owner_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not part of this booking' });
    }

    const existing = await disputeModel.getDisputeByBooking(booking_id);
    if (existing) {
      return res.status(409).json({ success: false, message: 'A dispute already exists for this booking' });
    }

    const dispute = await disputeModel.createDispute({
      booking_id, raised_by: req.user.id, reason: reason.trim(),
    });
    res.status(201).json({ success: true, message: 'Dispute submitted for review', data: dispute });
  } catch (err) {
    console.error('Raise dispute error:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const getAllDisputes = async (req, res) => {
  try {
    const disputes = await disputeModel.getAllDisputes();
    res.status(200).json({ success: true, data: disputes });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const resolveDispute = async (req, res) => {
  try {
    const { resolution, status } = req.body;
    if (!resolution || !['resolved', 'closed'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Resolution text and valid status required' });
    }
    const dispute = await disputeModel.resolveDispute(req.params.id, resolution, status);
    if (!dispute) return res.status(404).json({ success: false, message: 'Dispute not found' });
    res.status(200).json({ success: true, message: 'Dispute resolved', data: dispute });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { raiseDispute, getAllDisputes, resolveDispute };