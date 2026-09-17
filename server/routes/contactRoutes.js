const express = require('express');
const {
    createContactMessage,
    getContactMessages,
} = require('../controllers/contactController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
    .post(createContactMessage)
    .get(protect, admin, getContactMessages);

module.exports = router;
