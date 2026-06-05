const express = require('express');
const router  = express.Router();

const { register, login, getMe } = require('../controller/userController');
const { protect } = require('../middleware/authMiddleware');
const { requestReset, verifyOtp, resetPassword } = require('../controller/authController');

router.post('/auth/register', register);
router.post('/auth/login', login);
router.get('/auth/me', protect, getMe);
router.post('/auth/forgot-password', requestReset);
router.post('/auth/verify-otp', verifyOtp);
router.post('/auth/reset-password', resetPassword);

module.exports = router;