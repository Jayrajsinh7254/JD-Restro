const express = require('express');
const {
    createReservation,
    getReservations,
    getReservationById,
    updateReservationStatus,
    deleteReservation,
} = require('../controllers/reservationController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
    .get(protect, admin, getReservations)
    .post(createReservation);

router.route('/:id')
    .get(protect, admin, getReservationById)
    .put(protect, admin, updateReservationStatus)
    .delete(protect, admin, deleteReservation);

module.exports = router;
