const express = require('express');
const router  = express.Router();

const { register } = require('../controller/userController');

router.post('/auth/register', register);

const express = require('express');
const router  = express.Router();

const { register, login } = require('../controller/userController');

router.post('/auth/register', register);

router.post('/auth/login', login);

const { register, login, getMe } = require('../controller/userController');

router.get('/auth/me', getMe);


module.exports = router;