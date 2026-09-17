const express = require('express');
const { authUser, registerUser, logoutUser } = require('../controllers/authController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/login', authUser);
router.post('/register', protect, admin, registerUser);
router.post('/logout', logoutUser);

module.exports = router;
