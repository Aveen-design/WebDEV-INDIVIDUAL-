const express = require('express');
const router  = express.Router();

const { register, login, getMe } = require('../controller/userController');
const { protect } = require('../middleware/authMiddleware');
const passport = require('../middleware/passport');
const { requestReset, verifyOtp, resetPassword, googleCallback,completeGoogleSignup  } = require('../controller/authController');

router.post('/auth/register', register);
router.post('/auth/login', login);
router.get('/auth/me', protect, getMe);
router.post('/auth/forgot-password', requestReset);
router.post('/auth/verify-otp', verifyOtp);
router.post('/auth/reset-password', resetPassword);
router.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })
);

router.get('/auth/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  googleCallback
);

router.post('/auth/google/complete', completeGoogleSignup);

module.exports = router;