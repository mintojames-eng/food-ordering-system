const mongoose = require('mongoose');

const FoodSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: [true, 'Food item name is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Food category is required'],
    enum: ['Pizza', 'Biryani', 'Burgers', 'Asian', 'North Indian', 'South Indian', 'Desserts', 'Beverages', 'Other'],
    default: 'Other'
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  image: {
    type: String,
    default: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80'
  },
  isVeg: {
    type: Boolean,
    default: true
  },
  rating: {
    type: Number,
    default: 4.5,
    min: 0,
    max: 5
  },
  prepTime: {
    type: String,
    default: '20-25 mins'
  },
  available: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Food', FoodSchema);
