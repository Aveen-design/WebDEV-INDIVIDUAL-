const express = require('express');
const router  = express.Router();

const { getNotifications, readOne, readAll } = require('../controller/notificationController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getNotifications);
router.patch('/read-all', protect, readAll);
router.patch('/:id/read', protect, readOne);

module.exports = router;