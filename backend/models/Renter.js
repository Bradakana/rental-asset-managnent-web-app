const mongoose = require('mongoose');

const renterSchema = new mongoose.Schema({
  firstName: { 
    type: String, 
    required: [true, 'First name is required'],
    trim: true
  },
  lastName: { 
    type: String, 
    required: [true, 'Last name is required'],
    trim: true
  },
  email: { 
    type: String, 
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true
  },
  phone: { 
    type: String, 
    required: [true, 'Phone number is required'],
    trim: true
  },
  address: { 
    type: String, 
    trim: true 
  },
  licenseNumber: { 
    type: String, 
    trim: true 
  },
  passportNumber: { 
    type: String, 
    trim: true 
  },
  status: { 
    type: String, 
    enum: ['active', 'inactive', 'suspended'], 
    default: 'active' 
  },
  verified: { 
    type: Boolean, 
    default: false 
  },
  avatar: { 
    type: String 
  },
  totalRentals: { 
    type: Number, 
    default: 0 
  },
  totalSpent: { 
    type: Number, 
    default: 0 
  },
  rating: { 
    type: Number, 
    default: 0,
    min: 0,
    max: 5
  },
  vendorId: { 
    type: String, 
    required: true 
  },
  notes: { 
    type: String, 
    trim: true 
  },
  documents: [{
    type: { type: String, enum: ['license', 'passport', 'contract', 'other'] },
    filename: String,
    url: String,
    uploadedAt: { type: Date, default: Date.now },
    expiresAt: Date
  }]
}, { 
  timestamps: true 
});

// Index for better query performance
renterSchema.index({ vendorId: 1, email: 1 });

module.exports = mongoose.model('Renter', renterSchema);