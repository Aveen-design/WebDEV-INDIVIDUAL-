const express = require('express');
const router  = express.Router();

const { sendMessage, getConversation, listConversations } = require('../controller/messageController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, sendMessage);
router.get('/conversations', protect, listConversations);
router.get('/booking/:bookingId', protect, getConversation);

module.exports = router;