const express = require('express');
const {
    joinLoyalty,
    getLoyaltyMember,
    earnPoints,
    redeemPoints,
} = require('../controllers/loyaltyController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/join', joinLoyalty);
router.get('/:email', getLoyaltyMember);
router.post('/earn', protect, admin, earnPoints);
router.post('/redeem', protect, admin, redeemPoints);

module.exports = router;
