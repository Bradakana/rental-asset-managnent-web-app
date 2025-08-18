const express = require('express');
const { body, validationResult } = require('express-validator');
const Subscription = require('../models/Subscription');
const Notification = require('../models/Notification');
const User = require('../models/User');
const Car = require('../models/Car');
const Estate = require('../models/Estate');
const Asset = require('../models/Asset');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// Get asset details by type and ID
const getAssetDetails = async (assetType, assetId) => {
  let asset = null;
  switch (assetType) {
    case 'car':
      asset = await Car.findById(assetId);
      break;
    case 'estate':
      asset = await Estate.findById(assetId);
      break;
    case 'asset':
      asset = await Asset.findById(assetId);
      break;
    default:
      throw new Error('Invalid asset type');
  }
  return asset;
};

// Create subscription
router.post('/', [
  verifyToken,
  body('assetId').isMongoId().withMessage('Valid asset ID is required'),
  body('assetType').isIn(['car', 'estate', 'asset']).withMessage('Valid asset type is required'),
  body('preferences.emailNotifications').optional().isBoolean(),
  body('preferences.smsNotifications').optional().isBoolean(),
  body('preferences.priceAlerts').optional().isBoolean(),
  body('preferences.availabilityAlerts').optional().isBoolean()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, error: errors.array()[0].msg });
    }

    const { assetId, assetType, preferences = {}, notes } = req.body;

    // Check if asset exists
    const asset = await getAssetDetails(assetType, assetId);
    console.log('📋 Asset found for subscription:', asset ? `${asset.name || asset.model || asset.title} (vendorId: ${asset.vendorId})` : 'null');
    
    if (!asset) {
      return res.status(404).json({ success: false, error: 'Asset not found' });
    }
    
    if (!asset.vendorId) {
      console.error('❌ Asset has no vendorId:', asset);
      return res.status(400).json({ success: false, error: 'Asset has no vendor assigned' });
    }

    // Check if user already subscribed to this asset
    const existingSubscription = await Subscription.findOne({
      userId: req.userId,
      assetId,
      assetType,
      status: 'active'
    });

    if (existingSubscription) {
      return res.status(400).json({ success: false, error: 'You are already subscribed to this asset' });
    }

    // Create subscription
    const subscription = new Subscription({
      userId: req.userId,
      assetId,
      assetType,
      vendorId: asset.vendorId,
      preferences: {
        emailNotifications: preferences.emailNotifications ?? true,
        smsNotifications: preferences.smsNotifications ?? false,
        priceAlerts: preferences.priceAlerts ?? true,
        availabilityAlerts: preferences.availabilityAlerts ?? true
      },
      notes
    });

    await subscription.save();
    console.log('✅ Subscription created successfully:', subscription._id, 'for vendorId:', asset.vendorId);

    // Get user details for notification
    const user = await User.findById(req.userId);
    
    // *** AUTOMATIC RENTER CREATION ***
    // Check if user already exists as a renter for this vendor
    const Renter = require('../models/Renter');
    let existingRenter = await Renter.findOne({
      email: user.email,
      vendorId: asset.vendorId
    });

    // If user is not already a renter for this vendor, create renter profile automatically
    if (!existingRenter && asset.vendorId) {
      try {
        const newRenter = new Renter({
          firstName: user.firstName || 'N/A',
          lastName: user.lastName || 'N/A',
          email: user.email,
          phone: user.phone || 'N/A',
          address: user.address || '',
          vendorId: asset.vendorId,
          status: 'active',
          verified: false,
          notes: `Auto-created from subscription to ${asset.name || asset.model || asset.title}`
        });
        
        await newRenter.save();
        console.log(`Auto-created renter profile for ${user.email} with vendor ${asset.vendorId}`);
        
        // Emit real-time update for new renter
        try {
          const io = req.app.get('io');
          if (io && asset.vendorId) {
            io.to(`vendor_${asset.vendorId}`).emit('renter_created', {
              type: 'renter_created',
              data: {
                renter: newRenter,
                source: 'subscription'
              },
              timestamp: new Date()
            });
            console.log(`Real-time renter creation update sent for vendor ${asset.vendorId}`);
          }
        } catch (realtimeError) {
          console.error('Failed to send renter creation update:', realtimeError);
        }
      } catch (renterError) {
        console.error('Failed to create renter profile:', renterError);
        // Continue execution even if renter creation fails
      }
    }
    
    // Create notification for vendor/agent
    if (asset.vendorId) {
      const vendorUser = await User.findOne({ vendorId: asset.vendorId });
      if (vendorUser) {
        const notification = new Notification({
          recipientId: vendorUser._id,
          senderId: req.userId,
          type: 'subscription_created',
          title: 'New Subscription Alert',
          message: `${user.firstName} ${user.lastName} subscribed to your ${assetType}: ${asset.name || asset.model || asset.title}`,
          relatedId: subscription._id,
          relatedType: 'subscription',
          vendorId: asset.vendorId,
          actionUrl: `/admin/subscriptions/${subscription._id}`,
          metadata: {
            assetName: asset.name || asset.model || asset.title,
            assetType,
            userEmail: user.email,
            userName: `${user.firstName} ${user.lastName}`
          }
        });
        await notification.save();
      }
    }

    // *** REAL-TIME DASHBOARD UPDATE ***
    // Broadcast subscription creation to admin dashboard for real-time updates
    try {
      const io = req.app.get('io'); // Socket.io instance
      if (io && asset.vendorId) {
        // Calculate updated statistics
        const totalSubscriptions = await Subscription.countDocuments({ vendorId: asset.vendorId });
        const activeSubscriptions = await Subscription.countDocuments({ 
          vendorId: asset.vendorId, 
          status: 'active' 
        });
        const newSubscriptionsThisMonth = await Subscription.countDocuments({
          vendorId: asset.vendorId,
          createdAt: { 
            $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) 
          }
        });

        // Emit real-time update to admin dashboard
        io.to(`vendor_${asset.vendorId}`).emit('dashboard_update', {
          type: 'subscription_created',
          data: {
            subscription: {
              _id: subscription._id,
              userId: req.userId,
              assetId,
              assetType,
              status: 'active',
              subscribedAt: subscription.subscribedAt,
              user: {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email
              },
              asset: {
                name: asset.name || asset.model || asset.title,
                type: assetType
              }
            },
            stats: {
              totalSubscriptions,
              activeSubscriptions,
              newSubscriptions: newSubscriptionsThisMonth
            }
          },
          timestamp: new Date()
        });

        console.log(`Real-time dashboard update sent for vendor ${asset.vendorId}`);
      }
    } catch (realtimeError) {
      console.error('Failed to send real-time update:', realtimeError);
      // Continue execution even if real-time update fails
    }

    // Populate the subscription for response
    const populatedSubscription = await Subscription.findById(subscription._id)
      .populate('userId', 'firstName lastName email');

    res.status(201).json({
      success: true,
      data: populatedSubscription,
      message: 'Successfully subscribed to asset'
    });

  } catch (error) {
    console.error('Create subscription error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Get user's subscriptions
router.get('/my-subscriptions', verifyToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, status = 'active' } = req.query;
    
    const subscriptions = await Subscription.find({
      userId: req.userId,
      ...(status && { status })
    })
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .populate('userId', 'username firstName lastName email');

    // Populate asset details
    const subscriptionsWithAssets = await Promise.all(
      subscriptions.map(async (sub) => {
        try {
          const asset = await getAssetDetails(sub.assetType, sub.assetId);
          return {
            ...sub.toObject(),
            asset: asset ? {
              id: asset._id,
              name: asset.name || asset.model || asset.title,
              type: sub.assetType,
              price: asset.price || asset.dailyRate,
              image: asset.images?.[0]?.url || asset.image,
              status: asset.status,
              location: asset.location
            } : null
          };
        } catch (err) {
          return {
            ...sub.toObject(),
            asset: null
          };
        }
      })
    );

    const total = await Subscription.countDocuments({
      userId: req.userId,
      ...(status && { status })
    });

    res.json({
      success: true,
      data: subscriptionsWithAssets,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        count: subscriptionsWithAssets.length,
        totalItems: total
      }
    });

  } catch (error) {
    console.error('Get subscriptions error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Get vendor's subscriptions (for admin management)
router.get('/vendor-subscriptions', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user || !user.vendorId) {
      return res.status(403).json({ success: false, error: 'Access denied. Vendor access required.' });
    }

    const { page = 1, limit = 20, status, assetType, search } = req.query;
    
    const filter = {
      vendorId: user.vendorId,
      ...(status && { status }),
      ...(assetType && { assetType })
    };

    let subscriptions = await Subscription.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('userId', 'username firstName lastName email phone');

    // Get asset details for each subscription
    const subscriptionsWithAssets = await Promise.all(
      subscriptions.map(async (sub) => {
        try {
          const asset = await getAssetDetails(sub.assetType, sub.assetId);
          return {
            ...sub.toObject(),
            asset: asset ? {
              id: asset._id,
              name: asset.name || asset.model || asset.title,
              type: sub.assetType,
              price: asset.price || asset.dailyRate,
              image: asset.images?.[0]?.url || asset.image,
              status: asset.status,
              location: asset.location
            } : null
          };
        } catch (err) {
          return {
            ...sub.toObject(),
            asset: null
          };
        }
      })
    );

    // Filter by search if provided
    let filteredSubscriptions = subscriptionsWithAssets;
    if (search) {
      filteredSubscriptions = subscriptionsWithAssets.filter(sub => 
        sub.userId?.firstName?.toLowerCase().includes(search.toLowerCase()) ||
        sub.userId?.lastName?.toLowerCase().includes(search.toLowerCase()) ||
        sub.userId?.email?.toLowerCase().includes(search.toLowerCase()) ||
        sub.asset?.name?.toLowerCase().includes(search.toLowerCase())
      );
    }

    const total = await Subscription.countDocuments(filter);

    res.json({
      success: true,
      data: filteredSubscriptions,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        count: filteredSubscriptions.length,
        totalItems: total
      }
    });

  } catch (error) {
    console.error('Get vendor subscriptions error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Get vendor's subscription notifications (for admin dashboard)
router.get('/vendor-notifications', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user || !user.vendorId) {
      return res.status(403).json({ success: false, error: 'Access denied. Vendor access required.' });
    }

    const { page = 1, limit = 10, type, isRead } = req.query;
    
    const filter = {
      vendorId: user.vendorId,
      ...(type && { type }),
      ...(isRead !== undefined && { isRead: isRead === 'true' })
    };

    const notifications = await Notification.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('senderId', 'firstName lastName email')
      .populate('recipientId', 'firstName lastName email');

    const total = await Notification.countDocuments(filter);
    const unreadCount = await Notification.countDocuments({
      vendorId: user.vendorId,
      isRead: false
    });

    res.json({
      success: true,
      data: notifications,
      unreadCount,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        count: notifications.length,
        totalItems: total
      }
    });

  } catch (error) {
    console.error('Get vendor notifications error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Cancel subscription
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const subscription = await Subscription.findOne({
      _id: req.params.id,
      userId: req.userId
    });

    if (!subscription) {
      return res.status(404).json({ success: false, error: 'Subscription not found' });
    }

    subscription.status = 'cancelled';
    await subscription.save();

    // Create notification for vendor
    const user = await User.findById(req.userId);
    if (subscription.vendorId) {
      const vendorUser = await User.findOne({ vendorId: subscription.vendorId });
      if (vendorUser) {
        const asset = await getAssetDetails(subscription.assetType, subscription.assetId);
        const notification = new Notification({
          recipientId: vendorUser._id,
          senderId: req.userId,
          type: 'subscription_cancelled',
          title: 'Subscription Cancelled',
          message: `${user.firstName} ${user.lastName} cancelled subscription to ${asset?.name || asset?.model || asset?.title || 'asset'}`,
          relatedId: subscription._id,
          relatedType: 'subscription',
          vendorId: subscription.vendorId,
          metadata: {
            assetName: asset?.name || asset?.model || asset?.title,
            assetType: subscription.assetType,
            userEmail: user.email,
            userName: `${user.firstName} ${user.lastName}`
          }
        });
        await notification.save();
      }
    }

    res.json({
      success: true,
      message: 'Subscription cancelled successfully'
    });

  } catch (error) {
    console.error('Cancel subscription error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Mark notification as read
router.patch('/notifications/:id/read', verifyToken, async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ success: false, error: 'Notification not found' });
    }

    res.json({
      success: true,
      data: notification
    });

  } catch (error) {
    console.error('Mark notification as read error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Get subscription analytics for vendor dashboard
router.get('/analytics', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user || !user.vendorId) {
      return res.status(403).json({ success: false, error: 'Access denied. Vendor access required.' });
    }

    const { timeRange = '30d' } = req.query;
    
    // Calculate date range
    const now = new Date();
    let startDate;
    switch (timeRange) {
      case '7d':
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case '30d':
        startDate = new Date(now.setDate(now.getDate() - 30));
        break;
      case '90d':
        startDate = new Date(now.setDate(now.getDate() - 90));
        break;
      default:
        startDate = new Date(now.setDate(now.getDate() - 30));
    }

    // Get subscription statistics
    const totalSubscriptions = await Subscription.countDocuments({
      vendorId: user.vendorId
    });

    const activeSubscriptions = await Subscription.countDocuments({
      vendorId: user.vendorId,
      status: 'active'
    });

    const newSubscriptions = await Subscription.countDocuments({
      vendorId: user.vendorId,
      createdAt: { $gte: startDate }
    });

    const cancelledSubscriptions = await Subscription.countDocuments({
      vendorId: user.vendorId,
      status: 'cancelled',
      updatedAt: { $gte: startDate }
    });

    // Get subscription breakdown by asset type
    const subscriptionsByType = await Subscription.aggregate([
      { $match: { vendorId: user.vendorId, status: 'active' } },
      { $group: { _id: '$assetType', count: { $sum: 1 } } }
    ]);

    res.json({
      success: true,
      data: {
        overview: {
          totalSubscriptions,
          activeSubscriptions,
          newSubscriptions,
          cancelledSubscriptions
        },
        byAssetType: subscriptionsByType,
        timeRange
      }
    });

  } catch (error) {
    console.error('Get subscription analytics error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Convert subscription to rental
router.post('/:id/convert-to-rental', verifyToken, async (req, res) => {
  try {
    const { startDate, endDate, dailyRate, deposit = 0, notes = '' } = req.body;
    
    const subscription = await Subscription.findById(req.params.id);
    if (!subscription) {
      return res.status(404).json({ success: false, error: 'Subscription not found' });
    }

    // Check if user has permission
    const user = await User.findById(req.userId);
    if (!user || (!user.vendorId || user.vendorId !== subscription.vendorId)) {
      return res.status(403).json({ success: false, error: 'Access denied' });
    }

    // Get asset details
    const asset = await getAssetDetails(subscription.assetType, subscription.assetId);
    if (!asset) {
      return res.status(404).json({ success: false, error: 'Asset not found' });
    }

    // Check if asset is available
    if (asset.status === 'rented') {
      return res.status(400).json({ success: false, error: 'Asset is currently rented' });
    }

    // Calculate total amount
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    const totalAmount = days * parseFloat(dailyRate);

    // Create rental
    const Rental = require('../models/Rental');
    const rental = new Rental({
      assetId: subscription.assetId,
      renterId: subscription.userId, // Use subscription user as renter
      startDate: start,
      endDate: end,
      dailyRate: parseFloat(dailyRate),
      totalAmount,
      deposit: parseFloat(deposit),
      notes,
      vendorId: subscription.vendorId,
      status: 'active'
    });

    await rental.save();

    // Update asset status
    asset.status = 'rented';
    asset.lastRental = new Date();
    await asset.save();

    // Update subscription status
    subscription.status = 'completed';
    await subscription.save();

    // Create notification for customer
    const notification = new Notification({
      recipientId: subscription.userId,
      senderId: req.userId,
      type: 'rental_request',
      title: 'Rental Agreement Created',
      message: `Your subscription has been converted to a rental agreement for ${asset.name || asset.model || asset.title}`,
      relatedId: rental._id,
      relatedType: 'rental',
      vendorId: subscription.vendorId,
      actionUrl: `/rentals/${rental._id}`,
      metadata: {
        assetName: asset.name || asset.model || asset.title,
        startDate,
        endDate,
        totalAmount
      }
    });
    await notification.save();

    res.json({
      success: true,
      rental,
      message: 'Subscription converted to rental successfully'
    });

  } catch (error) {
    console.error('Convert subscription to rental error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Get subscription details with user info for admin
router.get('/:id/details', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user || !user.vendorId) {
      return res.status(403).json({ success: false, error: 'Access denied' });
    }

    const subscription = await Subscription.findById(req.params.id)
      .populate('userId', 'firstName lastName email phone');

    if (!subscription || subscription.vendorId !== user.vendorId) {
      return res.status(404).json({ success: false, error: 'Subscription not found' });
    }

    // Get asset details
    const asset = await getAssetDetails(subscription.assetType, subscription.assetId);

    res.json({
      success: true,
      data: {
        ...subscription.toObject(),
        asset: asset ? {
          id: asset._id,
          name: asset.name || asset.model || asset.title,
          type: subscription.assetType,
          price: asset.price || asset.dailyRate,
          image: asset.images?.[0]?.url || asset.image,
          status: asset.status,
          location: asset.location
        } : null
      }
    });

  } catch (error) {
    console.error('Get subscription details error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

module.exports = router;
