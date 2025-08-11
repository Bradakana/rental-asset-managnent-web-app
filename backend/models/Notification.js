const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // System notifications may not have a sender
  },
  type: {
    type: String,
    enum: [
      'subscription_created',
      'subscription_cancelled', 
      'asset_available',
      'price_changed',
      'new_message',
      'rental_request',
      'system_alert'
    ],
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  relatedId: {
    type: mongoose.Schema.Types.ObjectId,
    required: false // Can reference subscription, asset, rental, etc.
  },
  relatedType: {
    type: String,
    enum: ['subscription', 'asset', 'rental', 'user', 'car', 'estate'],
    required: false
  },
  isRead: {
    type: Boolean,
    default: false
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  actionUrl: {
    type: String,
    trim: true
  },
  vendorId: {
    type: String,
    required: false
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

// Index for better query performance
notificationSchema.index({ recipientId: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ vendorId: 1, type: 1, createdAt: -1 });
notificationSchema.index({ type: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
