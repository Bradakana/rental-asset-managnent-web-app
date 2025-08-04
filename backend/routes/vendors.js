const express = require('express');
const { body, validationResult } = require('express-validator');
const Vendor = require('../models/Vendor');
const User = require('../models/User');

const router = express.Router();

// Get vendor information
router.get('/', async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ 
      _id: req.vendorId 
    }).populate('ownerId', 'firstName lastName email');

    if (!vendor) {
      return res.status(404).json({ 
        success: false, 
        error: 'Vendor not found' 
      });
    }

    res.json({
      success: true,
      data: vendor
    });
  } catch (error) {
    console.error('Get vendor error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Server error' 
    });
  }
});

// Update vendor information
router.put('/', [
  body('name').optional().notEmpty().trim().withMessage('Vendor name cannot be empty'),
  body('description').optional().trim(),
  body('contactInfo.email').optional().isEmail().withMessage('Valid email is required'),
  body('contactInfo.phone').optional().trim(),
  body('contactInfo.address').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        error: errors.array()[0].msg 
      });
    }

    const vendor = await Vendor.findOneAndUpdate(
      { _id: req.vendorId },
      req.body,
      { new: true, runValidators: true }
    ).populate('ownerId', 'firstName lastName email');

    if (!vendor) {
      return res.status(404).json({ 
        success: false, 
        error: 'Vendor not found' 
      });
    }

    res.json({
      success: true,
      data: vendor
    });
  } catch (error) {
    console.error('Update vendor error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Server error' 
    });
  }
});

// Update vendor settings
router.patch('/settings', [
  body('settings.currency').optional().isLength({ min: 3, max: 3 }).withMessage('Currency must be 3 characters'),
  body('settings.timezone').optional().trim(),
  body('settings.language').optional().isLength({ min: 2, max: 2 }).withMessage('Language must be 2 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        error: errors.array()[0].msg 
      });
    }

    const vendor = await Vendor.findOneAndUpdate(
      { _id: req.vendorId },
      { $set: { settings: req.body.settings } },
      { new: true, runValidators: true }
    ).populate('ownerId', 'firstName lastName email');

    if (!vendor) {
      return res.status(404).json({ 
        success: false, 
        error: 'Vendor not found' 
      });
    }

    res.json({
      success: true,
      data: vendor
    });
  } catch (error) {
    console.error('Update vendor settings error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Server error' 
    });
  }
});

// Get vendor statistics
router.get('/stats', async (req, res) => {
  try {
    const Asset = require('../models/Asset');
    const Rental = require('../models/Rental');
    const Renter = require('../models/Renter');

    const [
      totalAssets,
      availableAssets,
      rentedAssets,
      totalRentals,
      activeRentals,
      totalRenters,
      activeRenters,
      totalRevenue
    ] = await Promise.all([
      Asset.countDocuments({ vendorId: req.vendorId }),
      Asset.countDocuments({ vendorId: req.vendorId, status: 'available' }),
      Asset.countDocuments({ vendorId: req.vendorId, status: 'rented' }),
      Rental.countDocuments({ vendorId: req.vendorId }),
      Rental.countDocuments({ vendorId: req.vendorId, status: 'active' }),
      Renter.countDocuments({ vendorId: req.vendorId }),
      Renter.countDocuments({ vendorId: req.vendorId, status: 'active' }),
      Rental.aggregate([
        { $match: { vendorId: req.vendorId, status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ])
    ]);

    // Monthly revenue for last 6 months
    const monthlyRevenue = await Rental.aggregate([
      {
        $match: {
          vendorId: req.vendorId,
          status: 'completed',
          actualReturnDate: {
            $gte: new Date(new Date().getFullYear(), new Date().getMonth() - 5, 1)
          }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$actualReturnDate' },
            month: { $month: '$actualReturnDate' }
          },
          revenue: { $sum: '$totalAmount' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Asset type distribution
    const assetTypeDistribution = await Asset.aggregate([
      { $match: { vendorId: req.vendorId } },
      { $group: { _id: '$type', count: { $sum: 1 } } }
    ]);

    res.json({
      success: true,
      data: {
        assets: {
          total: totalAssets,
          available: availableAssets,
          rented: rentedAssets
        },
        rentals: {
          total: totalRentals,
          active: activeRentals
        },
        renters: {
          total: totalRenters,
          active: activeRenters
        },
        revenue: {
          total: totalRevenue[0]?.total || 0,
          monthly: monthlyRevenue
        },
        assetTypeDistribution
      }
    });
  } catch (error) {
    console.error('Get vendor stats error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Server error' 
    });
  }
});

// Get vendor users (if multi-user support is needed)
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({ 
      vendorId: req.vendorId 
    }).select('-password');

    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error('Get vendor users error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Server error' 
    });
  }
});

module.exports = router; 