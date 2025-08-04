const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Vendor name is required'],
    trim: true
  },
  type: { 
    type: String, 
    enum: ['car', 'real-estate', 'both'], 
    required: [true, 'Vendor type is required']
  },
  description: { 
    type: String, 
    trim: true 
  },
  ownerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  contactInfo: {
    email: String,
    phone: String,
    address: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  settings: {
    currency: { type: String, default: 'USD' },
    timezone: { type: String, default: 'UTC' },
    language: { type: String, default: 'en' }
  }
}, { 
  timestamps: true 
});

module.exports = mongoose.model('Vendor', vendorSchema);