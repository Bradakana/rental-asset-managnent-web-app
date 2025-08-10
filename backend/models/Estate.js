const mongoose = require('mongoose');

const estateSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true
  },
  size: {
    type: Number,
    required: [true, 'Size is required'],
    min: [10, 'Minimum size is 10 square meters']
  },
  rooms: {
    type: Number,
    required: [true, 'Number of rooms is required'],
    min: [1, 'Minimum 1 room']
  },
  bathrooms: {
    type: Number,
    default: 1,
    min: [1, 'Minimum 1 bathroom']
  },
  floor: {
    type: Number,
    min: [0, 'Floor cannot be negative']
  },
  totalFloors: {
    type: Number,
    min: [1, 'Building must have at least 1 floor']
  },
  furnished: {
    type: Boolean,
    default: false
  },
  petsAllowed: {
    type: Boolean,
    default: false
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
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  propertyType: {
    type: String,
    required: [true, 'Property type is required'],
    enum: ['Apartment', 'House', 'Studio', 'Room', 'Commercial']
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
estateSchema.index({ propertyType: 1 });
estateSchema.index({ price: 1 });
estateSchema.index({ rooms: 1 });
estateSchema.index({ location: 1 });
estateSchema.index({ vendorId: 1 });

module.exports = mongoose.model('Estate', estateSchema);