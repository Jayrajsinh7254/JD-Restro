const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    items: [
        {
            menuItem: {
                type: mongoose.Schema.ObjectId,
                ref: 'MenuItem',
                required: true,
            },
            name: {
                type: String,
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
                min: 1,
            },
            price: {
                type: Number,
                required: true,
            },
            image: {
                type: String,
            }
        },
    ],
    totalAmount: {
        type: Number,
        required: true,
    },
    customerName: {
        type: String,
        required: [true, 'Please provide customer name'],
    },
    customerEmail: {
        type: String,
        required: [true, 'Please provide customer email'],
    },
    customerPhone: {
        type: String,
        required: [true, 'Please provide customer phone number'],
    },
    deliveryAddress: {
        type: String,
    },
    status: {
        type: String,
        enum: ['pending', 'preparing', 'delivered'],
        default: 'pending',
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Order', orderSchema);
