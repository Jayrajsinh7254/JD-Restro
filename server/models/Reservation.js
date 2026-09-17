const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'Please provide first name'],
        trim: true,
    },
    lastName: {
        type: String,
        required: [true, 'Please provide last name'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Please provide an email address'],
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email',
        ],
    },
    phone: {
        type: String,
        required: [true, 'Please provide a phone number'],
    },
    date: {
        type: Date,
        required: [true, 'Please select a date'],
    },
    time: {
        type: String,
        required: [true, 'Please select a time'],
    },
    partySize: {
        type: Number,
        required: [true, 'Please provide party size'],
        min: [1, 'Party must be at least 1 person'],
    },
    occasion: {
        type: String,
        enum: ['Birthday', 'Anniversary', 'Business', 'Proposal', 'Other', 'None'],
        default: 'None',
    },
    specialRequests: {
        type: String,
        maxLength: [500, 'Special requests cannot be more than 500 characters'],
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled'],
        default: 'pending',
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Reservation', reservationSchema);
