const express = require('express');
const { body, validationResult } = require('express-validator');
const Rental = require('../models/Rental');
const Asset = require('../models/Asset');
const Renter = require('../models/Renter');
// const upload = require('../middleware/upload');

const router = express.Router();

// Get all rentals for vendor
router.get('/', async (req, res) => {
  try {
    const { status, assetId, renterId, page = 1, limit = 10 } = req.query;
    
    const query = { vendorId: req.vendorId };
    
    if (status) query.status = status;
    if (assetId) query.assetId = assetId;
    if (renterId) query.renterId = renterId;

    const skip = (page - 1) * limit;
    
    const rentals = await Rental.find(query)
      .populate('assetId', 'name type')
      .populate('renterId', 'firstName lastName email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Rental.countDocuments(query);

    res.json({
      success: true,
      data: rentals,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get rentals error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Server error' 
    });
  }
});

// Get single rental
router.get('/:id', async (req, res) => {
  try {
    const rental = await Rental.findOne({ 
      _id: req.params.id, 
      vendorId: req.vendorId 
    })
    .populate('assetId')
    .populate('renterId');

    if (!rental) {
      return res.status(404).json({ 
        success: false, 
        error: 'Rental not found' 
      });
    }

    res.json({
      success: true,
      data: rental
    });
  } catch (error) {
    console.error('Get rental error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Server error' 
    });
  }
});

// Create new rental
router.post('/', [
  body('assetId').isMongoId().withMessage('Valid asset ID is required'),
  body('renterId').isMongoId().withMessage('Valid renter ID is required'),
  body('startDate').isISO8601().withMessage('Valid start date is required'),
  body('endDate').isISO8601().withMessage('Valid end date is required'),
  body('dailyRate').isNumeric().withMessage('Daily rate must be a number'),
  body('totalAmount').isNumeric().withMessage('Total amount must be a number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        error: errors.array()[0].msg 
      });
    }

    const { assetId, renterId, startDate, endDate, dailyRate, totalAmount, deposit, notes } = req.body;

    // Check if asset exists and is available
    const asset = await Asset.findOne({ 
      _id: assetId, 
      vendorId: req.vendorId 
    });

    if (!asset) {
      return res.status(404).json({ 
        success: false, 
        error: 'Asset not found' 
      });
    }

    if (asset.status !== 'available') {
      return res.status(400).json({ 
        success: false, 
        error: 'Asset is not available for rental' 
      });
    }

    // Check if renter exists
    const renter = await Renter.findOne({ 
      _id: renterId, 
      vendorId: req.vendorId 
    });

    if (!renter) {
      return res.status(404).json({ 
        success: false, 
        error: 'Renter not found' 
      });
    }

    // Check for date conflicts
    const conflictingRental = await Rental.findOne({
      assetId,
      status: { $in: ['active', 'overdue'] },
      $or: [
        {
          startDate: { $lte: new Date(endDate) },
          endDate: { $gte: new Date(startDate) }
        }
      ]
    });

    if (conflictingRental) {
      return res.status(400).json({ 
        success: false, 
        error: 'Asset is already rented for these dates' 
      });
    }

    const rentalData = {
      assetId,
      renterId,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      dailyRate: parseFloat(dailyRate),
      totalAmount: parseFloat(totalAmount),
      deposit: deposit ? parseFloat(deposit) : 0,
      notes,
      vendorId: req.vendorId
    };

    const rental = new Rental(rentalData);
    await rental.save();

    // Update asset status
    asset.status = 'rented';
    asset.lastRental = new Date();
    await asset.save();

    // Update renter stats
    renter.totalRentals += 1;
    renter.totalSpent += parseFloat(totalAmount);
    await renter.save();

    const populatedRental = await Rental.findById(rental._id)
      .populate('assetId', 'name type')
      .populate('renterId', 'firstName lastName email phone');

    res.status(201).json({
      success: true,
      data: populatedRental
    });
  } catch (error) {
    console.error('Create rental error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Server error' 
    });
  }
});

// Update rental
router.put('/:id', [
  body('startDate').optional().isISO8601().withMessage('Valid start date is required'),
  body('endDate').optional().isISO8601().withMessage('Valid end date is required'),
  body('dailyRate').optional().isNumeric().withMessage('Daily rate must be a number'),
  body('totalAmount').optional().isNumeric().withMessage('Total amount must be a number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        error: errors.array()[0].msg 
      });
    }

    const rental = await Rental.findOneAndUpdate(
      { _id: req.params.id, vendorId: req.vendorId },
      req.body,
      { new: true, runValidators: true }
    )
    .populate('assetId', 'name type')
    .populate('renterId', 'firstName lastName email phone');

    if (!rental) {
      return res.status(404).json({ 
        success: false, 
        error: 'Rental not found' 
      });
    }

    res.json({
      success: true,
      data: rental
    });
  } catch (error) {
    console.error('Update rental error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Server error' 
    });
  }
});

// Mark rental as returned
router.patch('/:id/return', [
  body('returnCondition').optional().trim(),
  body('actualReturnDate').optional().isISO8601().withMessage('Valid return date is required'),
  body('lateFees').optional().isNumeric().withMessage('Late fees must be a number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        error: errors.array()[0].msg 
      });
    }

    const rental = await Rental.findOne({ 
      _id: req.params.id, 
      vendorId: req.vendorId 
    });

    if (!rental) {
      return res.status(404).json({ 
        success: false, 
        error: 'Rental not found' 
      });
    }

    if (rental.status === 'completed') {
      return res.status(400).json({ 
        success: false, 
        error: 'Rental is already completed' 
      });
    }

    // Update rental
    rental.status = 'completed';
    rental.actualReturnDate = req.body.actualReturnDate ? new Date(req.body.actualReturnDate) : new Date();
    rental.returnCondition = req.body.returnCondition || rental.returnCondition;
    rental.lateFees = req.body.lateFees ? parseFloat(req.body.lateFees) : rental.lateFees;
    await rental.save();

    // Update asset status
    const asset = await Asset.findById(rental.assetId);
    if (asset) {
      asset.status = 'available';
      await asset.save();
    }

    const populatedRental = await Rental.findById(rental._id)
      .populate('assetId', 'name type')
      .populate('renterId', 'firstName lastName email phone');

    res.json({
      success: true,
      data: populatedRental
    });
  } catch (error) {
    console.error('Return rental error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Server error' 
    });
  }
});

// Upload rental images
router.post('/:id/images', async (req, res) => {
  try {
    const { type, images } = req.body; // images: string[] - URL array

    if (!images || !Array.isArray(images) || images.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No image URLs provided'
      });
    }

    const rental = await Rental.findOne({
      _id: req.params.id,
      vendorId: req.vendorId
    });

    if (!rental) {
      return res.status(404).json({
        success: false,
        error: 'Rental not found'
      });
    }

    const newImages = images.map(url => ({
      url,
      uploadedAt: new Date()
    }));

    if (type === 'return') {
      rental.returnImages.push(...newImages);
    } else {
      rental.pickupImages.push(...newImages);
    }

    await rental.save();

    res.json({
      success: true,
      data: type === 'return' ? rental.returnImages : rental.pickupImages
    });
  } catch (error) {
    console.error('Upload image URLs error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});


// Get rental statistics
router.get('/stats/overview', async (req, res) => {
  try {
    const totalRentals = await Rental.countDocuments({ vendorId: req.vendorId });
    const activeRentals = await Rental.countDocuments({ 
      vendorId: req.vendorId, 
      status: 'active' 
    });
    const completedRentals = await Rental.countDocuments({ 
      vendorId: req.vendorId, 
      status: 'completed' 
    });
    const overdueRentals = await Rental.countDocuments({ 
      vendorId: req.vendorId, 
      status: 'overdue' 
    });

    const totalRevenue = await Rental.aggregate([
      { $match: { vendorId: req.vendorId, status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    const monthlyRevenue = await Rental.aggregate([
      { 
        $match: { 
          vendorId: req.vendorId, 
          status: 'completed',
          actualReturnDate: { 
            $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) 
          }
        } 
      },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    res.json({
      success: true,
      data: {
        totalRentals,
        activeRentals,
        completedRentals,
        overdueRentals,
        totalRevenue: totalRevenue[0]?.total || 0,
        monthlyRevenue: monthlyRevenue[0]?.total || 0
      }
    });
  } catch (error) {
    console.error('Get rental stats error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Server error' 
    });
  }
});

module.exports = router;