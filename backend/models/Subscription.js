const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assetId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  assetType: {
    type: String,
    enum: ['car', 'estate', 'asset'],
    required: true
  },
  vendorId: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'cancelled', 'expired'],
    default: 'active'
  },
  subscribedAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    default: function() {
      // Default to 30 days from now
      return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    }
  },
  preferences: {
    emailNotifications: { type: Boolean, default: true },
    smsNotifications: { type: Boolean, default: false },
    priceAlerts: { type: Boolean, default: true },
    availabilityAlerts: { type: Boolean, default: true }
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Index for better query performance
subscriptionSchema.index({ userId: 1, assetId: 1, assetType: 1 });
subscriptionSchema.index({ vendorId: 1, status: 1 });
subscriptionSchema.index({ expiresAt: 1 });

// Prevent duplicate subscriptions
subscriptionSchema.index(
  { userId: 1, assetId: 1, assetType: 1 }, 
  { unique: true }
);

module.exports = mongoose.model('Subscription', subscriptionSchema);
