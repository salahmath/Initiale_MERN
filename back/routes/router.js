const express = require('express');
const router = express.Router();
const { registerUser, LoginUser, getauser, facebook } = require('../controllers/user');
const { authMiddleware, authMiddleware2 } = require('../authmidelware/authmidelwaire');
const { LoginUser_google, getauser_google } = require('../controllers/user_googlr');

// @route   POST /api/register
// @desc    Register user
// @access  Public
router.post('/register', registerUser);
router.post('/login', LoginUser);
router.post('/login_google', LoginUser_google);
router.post('/user',authMiddleware, getauser);
router.post('/facebook',facebook);
router.get('/user_google',authMiddleware2, getauser_google);

module.exports = router;
