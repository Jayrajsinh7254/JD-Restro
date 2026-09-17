const mongoose = require('mongoose');

const loyaltyMemberSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide your name'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email',
        ],
    },
    phone: {
        type: String,
    },
    points: {
        type: Number,
        default: 0,
    },
    tier: {
        type: String,
        enum: ['silver', 'gold', 'platinum'],
        default: 'silver',
    },
    joinedAt: {
        type: Date,
        default: Date.now,
    },
    lastVisit: {
        type: Date,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('LoyaltyMember', loyaltyMemberSchema);
