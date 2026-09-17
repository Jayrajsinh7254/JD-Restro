const express = require('express');
const {
    createOrder,
    getOrders,
    updateOrderStatus,
    deleteOrder,
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
    .get(protect, admin, getOrders)
    .post(createOrder);

router.route('/:id')
    .put(protect, admin, updateOrderStatus)
    .delete(protect, admin, deleteOrder);

module.exports = router;
