const messageModel = require('../model/messageModel');
const bookingModel = require('../model/bookingModel');
const notificationModel = require('../model/notificationModel');

const sendMessage = async (req, res) => {
  try {
    const { booking_id, content } = req.body;
    if (!booking_id || !content?.trim()) {
      return res.status(400).json({ success: false, message: 'Message content is required' });
    }

    const booking = await bookingModel.getBookingById(booking_id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    const isCustomer = booking.customer_id === req.user.id;
    const isOwner    = booking.owner_id === req.user.id;
    if (!isCustomer && !isOwner) {
      return res.status(403).json({ success: false, message: 'Not part of this booking' });
    }

    const recipient_id = isCustomer ? booking.owner_id : booking.customer_id;

    const message = await messageModel.createMessage({
      booking_id, sender_id: req.user.id, recipient_id, content: content.trim(),
    });

    await notificationModel.createNotification({
      user_id: recipient_id,
      type: 'message',
      title: 'New message',
      body: 'You have a new message about a booking.',
    }).catch(() => {});

    res.status(201).json({ success: true, data: message });
  } catch (err) {
    console.error('Send message error:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const getConversation = async (req, res) => {
  try {
    const booking = await bookingModel.getBookingById(req.params.bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    if (booking.customer_id !== req.user.id && booking.owner_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorised' });
    }

    const messages = await messageModel.getMessagesByBooking(req.params.bookingId);
    await messageModel.markMessagesRead(req.params.bookingId, req.user.id);

    res.status(200).json({
      success: true,
      data: {
        messages,
        booking: {
          reference_code: booking.reference_code,
          vehicle_title:  booking.vehicle_title,
          other_party:    booking.customer_id === req.user.id ? booking.owner_name : booking.customer_name,
        },
      },
    });
  } catch (err) {
    console.error('Get conversation error:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const listConversations = async (req, res) => {
  try {
    const conversations = await messageModel.getConversations(req.user.id);
    res.status(200).json({ success: true, data: conversations });
  } catch (err) {
    console.error('List conversations error:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { sendMessage, getConversation, listConversations };