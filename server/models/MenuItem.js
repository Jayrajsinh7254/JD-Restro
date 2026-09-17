const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a menu item name'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
  },
  category: {
    type: String,
    enum: ['starter', 'main', 'vegan', 'seafood', 'dessert', 'drink'],
    required: [true, 'Please select a category for this item'],
  },
  price: {
    type: Number,
    required: [true, 'Please provide item price'],
    min: [0, 'Price must be positive'],
  },
  tags: [
    {
      type: String,
      trim: true,
    },
  ],
  image: {
    type: String,
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('MenuItem', menuItemSchema);
