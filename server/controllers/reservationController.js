const Reservation = require('../models/Reservation');
const sendEmail = require('../utils/sendEmail');

// In-memory store for MOCK_DATABASE=true
const now = new Date();
const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
const dayAfter = new Date(now.getTime() + 48 * 60 * 60 * 1000).toISOString().split('T')[0];

let MOCK_RESERVATIONS_STORE = [
    {
        _id: 'r1',
        firstName: 'Alice',
        lastName: 'Johnson',
        email: 'alice.johnson@example.com',
        phone: '+1 (212) 555-0199',
        date: tomorrow,
        time: '19:00',
        partySize: 4,
        occasion: 'Anniversary',
        specialRequests: 'Window booth preferred for anniversary celebration',
        status: 'confirmed',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
    },
    {
        _id: 'r2',
        firstName: 'Robert',
        lastName: 'Wilson',
        email: 'robert.w@example.com',
        phone: '+1 (212) 555-0144',
        date: dayAfter,
        time: '20:30',
        partySize: 2,
        occasion: 'Birthday',
        specialRequests: 'Quiet corner table, gluten allergy',
        status: 'pending',
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000)
    },
    {
        _id: 'r3',
        firstName: 'Sophia',
        lastName: 'Laurent',
        email: 'sophia.laurent@paris.com',
        phone: '+1 (212) 555-0188',
        date: tomorrow,
        time: '18:30',
        partySize: 6,
        occasion: 'Business',
        specialRequests: 'Private salon table, sommelier pairing recommended',
        status: 'confirmed',
        createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000)
    }
];

// @desc    Create new reservation
// @route   POST /api/reservations
// @access  Public / Admin
const createReservation = async (req, res, next) => {
    try {
        const {
            name,
            firstName,
            lastName,
            email,
            phone,
            date,
            time,
            guests,
            partySize,
            occasion,
            specialRequests,
            status
        } = req.body;

        // Parse first & last name
        let finalFirst = firstName;
        let finalLast = lastName;
        if (!finalFirst && name) {
            const parts = name.trim().split(' ');
            finalFirst = parts[0] || 'Guest';
            finalLast = parts.slice(1).join(' ') || 'Patron';
        }
        if (!finalFirst) finalFirst = 'Guest';
        if (!finalLast) finalLast = 'Patron';

        const finalParty = parseInt(partySize || guests || 2, 10);
        const finalOccasion = occasion || 'None';
        const finalDate = date ? (typeof date === 'string' ? date.split('T')[0] : new Date(date).toISOString().split('T')[0]) : new Date().toISOString().split('T')[0];
        const finalStatus = status || 'pending';

        if (process.env.MOCK_DATABASE === 'true') {
            const newRes = {
                _id: 'r_' + Date.now().toString(),
                firstName: finalFirst,
                lastName: finalLast,
                email: email || 'guest@example.com',
                phone: phone || '+1 (555) 000-0000',
                date: finalDate,
                time: time || '19:00',
                partySize: finalParty,
                occasion: finalOccasion,
                specialRequests: specialRequests || '',
                status: finalStatus,
                createdAt: new Date(),
                updatedAt: new Date()
            };
            MOCK_RESERVATIONS_STORE.unshift(newRes);
            return res.status(201).json({
                success: true,
                data: newRes,
                message: 'Reservation request submitted successfully',
            });
        }

        const reservation = await Reservation.create({
            firstName: finalFirst,
            lastName: finalLast,
            email,
            phone,
            date: new Date(finalDate),
            time,
            partySize: finalParty,
            occasion: finalOccasion,
            specialRequests,
            status: finalStatus
        });

        // Send non-blocking confirmation email in background
        if (reservation.email) {
            sendEmail({
                email: reservation.email,
                subject: 'Reservation Request Received - Drizzle Restaurant',
                message: `Dear ${reservation.firstName},\n\nYour reservation request for ${reservation.partySize} guests on ${finalDate} at ${reservation.time} has been registered.\n\nBest regards,\nDrizzle Restaurant`,
            }).catch(err => console.log('Background email error:', err.message));
        }

        res.status(201).json({
            success: true,
            data: reservation,
            message: 'Reservation request sent successfully',
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all reservations
// @route   GET /api/reservations
// @access  Private/Admin
const getReservations = async (req, res, next) => {
    try {
        if (process.env.MOCK_DATABASE === 'true') {
            return res.json({ success: true, count: MOCK_RESERVATIONS_STORE.length, data: MOCK_RESERVATIONS_STORE });
        }
        const reservations = await Reservation.find({}).sort({ date: -1, time: 1 });
        res.json({ success: true, count: reservations.length, data: reservations });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single reservation
// @route   GET /api/reservations/:id
// @access  Private/Admin
const getReservationById = async (req, res, next) => {
    try {
        if (process.env.MOCK_DATABASE === 'true') {
            const resItem = MOCK_RESERVATIONS_STORE.find(r => r._id === req.params.id);
            if (!resItem) {
                return res.status(404).json({ success: false, message: 'Reservation not found' });
            }
            return res.json({ success: true, data: resItem });
        }

        const reservation = await Reservation.findById(req.params.id);
        if (!reservation) {
            res.status(404);
            throw new Error('Reservation not found');
        }

        res.json({ success: true, data: reservation });
    } catch (error) {
        next(error);
    }
};

// @desc    Update reservation status / details
// @route   PUT /api/reservations/:id
// @access  Private/Admin
const updateReservationStatus = async (req, res, next) => {
    try {
        const { status, partySize, time, date, specialRequests } = req.body;

        if (process.env.MOCK_DATABASE === 'true') {
            const index = MOCK_RESERVATIONS_STORE.findIndex(r => r._id === req.params.id);
            if (index !== -1) {
                if (status) MOCK_RESERVATIONS_STORE[index].status = status;
                if (partySize) MOCK_RESERVATIONS_STORE[index].partySize = parseInt(partySize, 10);
                if (time) MOCK_RESERVATIONS_STORE[index].time = time;
                if (date) MOCK_RESERVATIONS_STORE[index].date = typeof date === 'string' ? date.split('T')[0] : date;
                if (specialRequests !== undefined) MOCK_RESERVATIONS_STORE[index].specialRequests = specialRequests;
                MOCK_RESERVATIONS_STORE[index].updatedAt = new Date();
                return res.json({ success: true, data: MOCK_RESERVATIONS_STORE[index] });
            }
            return res.status(404).json({ success: false, message: 'Reservation not found' });
        }

        let reservation = await Reservation.findById(req.params.id);

        if (!reservation) {
            res.status(404);
            throw new Error('Reservation not found');
        }

        if (status) reservation.status = status;
        if (partySize) reservation.partySize = parseInt(partySize, 10);
        if (time) reservation.time = time;
        if (date) reservation.date = new Date(date);
        if (specialRequests !== undefined) reservation.specialRequests = specialRequests;

        await reservation.save();

        res.json({ success: true, data: reservation });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete reservation
// @route   DELETE /api/reservations/:id
// @access  Private/Admin
const deleteReservation = async (req, res, next) => {
    try {
        if (process.env.MOCK_DATABASE === 'true') {
            const index = MOCK_RESERVATIONS_STORE.findIndex(r => r._id === req.params.id);
            if (index === -1) {
                return res.status(404).json({ success: false, message: 'Reservation not found' });
            }
            MOCK_RESERVATIONS_STORE.splice(index, 1);
            return res.json({ success: true, data: {} });
        }

        const reservation = await Reservation.findById(req.params.id);

        if (!reservation) {
            res.status(404);
            throw new Error('Reservation not found');
        }

        await reservation.deleteOne();
        res.json({ success: true, data: {} });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createReservation,
    getReservations,
    getReservationById,
    updateReservationStatus,
    deleteReservation,
};
