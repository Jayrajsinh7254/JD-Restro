const mongoose = require('mongoose');

const galleryItemSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
    },
    category: {
        type: String,
        enum: ['food', 'drinks', 'ambiance', 'events'],
        required: [true, 'Please provide a category'],
    },
    imageUrl: {
        type: String,
        required: [true, 'Please provide an image URL'],
    },
    cloudinaryId: {
        type: String,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('GalleryItem', galleryItemSchema);
