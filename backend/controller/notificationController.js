const notificationModel = require('../model/notificationModel');

const getNotifications = async (req, res) => {
  try {
    const notifications = await notificationModel.getByUser(req.user.id);
    const unread = await notificationModel.getUnreadCount(req.user.id);
    res.status(200).json({ success: true, data: { notifications, unread } });
  } catch (err) {
    console.error('Get notifications error:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const readOne = async (req, res) => {
  try {
    await notificationModel.markRead(req.params.id, req.user.id);
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const readAll = async (req, res) => {
  try {
    await notificationModel.markAllRead(req.user.id);
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { getNotifications, readOne, readAll };