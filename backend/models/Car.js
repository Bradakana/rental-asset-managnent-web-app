const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  brand: {
    type: String,
    required: [true, 'Brand is required'],
    trim: true
  },
  model: {
    type: String,
    required: [true, 'Model is required'],
    trim: true
  },
  year: {
    type: Number,
    required: [true, 'Year is required'],
    min: [1990, 'Year must be after 1990'],
    max: [new Date().getFullYear() + 1, 'Year cannot be in the future']
  },
  fuel: {
    type: String,
    required: [true, 'Fuel type is required'],
    enum: ['Gasoline', 'Diesel', 'Hybrid', 'Electric', 'Gas']
  },
  seats: {
    type: Number,
    required: [true, 'Number of seats is required'],
    min: [2, 'Minimum 2 seats'],
    max: [9, 'Maximum 9 seats']
  },
  transmission: {
    type: String,
    required: [true, 'Transmission type is required'],
    enum: ['Manual', 'Automatic']
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price must be positive']
  },
  image: {
    type: String,
    required: [true, 'Image URL is required']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  vendorId: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Create indexes for better query performance
carSchema.index({ brand: 1, model: 1 });
carSchema.index({ price: 1 });
carSchema.index({ year: 1 });
carSchema.index({ vendorId: 1 });

module.exports = mongoose.model('Car', carSchema);