const mongoose = require('mongoose');

const rentalSchema = new mongoose.Schema({
  assetId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Asset',
    required: true
  },
  renterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Renter',
    required: true
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required']
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  dailyRate: {
    type: Number,
    required: true,
    min: 0
  },
  deposit: {
    type: Number,
    default: 0,
    min: 0
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'overdue', 'cancelled'],
    default: 'active'
  },
  notes: {
    type: String,
    trim: true
  },
  contractUrl: {
    type: String
  },
  pickupCondition: {
    type: String,
    trim: true
  },
  returnCondition: {
    type: String,
    trim: true
  },
  pickupImages: [{
    url: String,
    filename: String,
    uploadedAt: { type: Date, default: Date.now }
  }],
  returnImages: [{
    url: String,
    filename: String,
    uploadedAt: { type: Date, default: Date.now }
  }],
  vendorId: {
    type: String,
    required: true
  },
  actualReturnDate: {
    type: Date
  },
  lateFees: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for better query performance
rentalSchema.index({ vendorId: 1, status: 1, startDate: 1 });

// Virtual for calculating duration
rentalSchema.virtual('duration').get(function() {
  return Math.ceil((this.endDate - this.startDate) / (1000 * 60 * 60 * 24));
});

// Ensure virtuals are serialized
rentalSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Rental', rentalSchema);