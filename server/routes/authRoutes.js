const express = require('express');
const router = express.Router();
const { login, getMe, updatePassword } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');

// Anti-brute force rate limiting applied to login
router.post('/login', authLimiter, login);
router.get('/me', protect, getMe);
router.put('/update-password', protect, updatePassword);

module.exports = router;
