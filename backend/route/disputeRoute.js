const express = require('express');
const router  = express.Router();

const { raiseDispute, getAllDisputes, resolveDispute } = require('../controller/disputeController');
const { protect, requireRole } = require('../middleware/authMiddleware');

router.post('/', protect, raiseDispute);
router.get('/', protect, requireRole('admin'), getAllDisputes);
router.patch('/:id/resolve', protect, requireRole('admin'), resolveDispute);

module.exports = router;