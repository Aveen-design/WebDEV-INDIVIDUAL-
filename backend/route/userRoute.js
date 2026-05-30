const express = require('express');
const router  = express.Router();

const { register, login, getMe } = require('../controller/userController');
const { protect } = require('../middleware/authMiddleware');

router.post('/auth/register', register);

router.post('/auth/login', login);

router.get('/auth/me', protect, getMe);

module.exports = router;