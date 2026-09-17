const mongoose = require('mongoose');

const blogPostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide a title'],
        trim: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
    },
    category: {
        type: String,
        enum: ['Recipe', 'Sustainability', 'Wine & Dine', 'Behind the Scenes', 'Events'],
        required: [true, 'Please provide a category'],
    },
    excerpt: {
        type: String,
        required: [true, 'Please provide an excerpt'],
    },
    content: {
        type: String,
        required: [true, 'Please provide blog content'],
    },
    headerImage: {
        type: String,
        required: [true, 'Please provide a header image'],
    },
    author: {
        type: String,
        default: 'Drizzle Team',
    },
    isPublished: {
        type: Boolean,
        default: true,
    },
    publishedAt: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('BlogPost', blogPostSchema);
