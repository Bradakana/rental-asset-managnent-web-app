const express = require('express');
const { body, validationResult } = require('express-validator');
const Renter = require('../models/Renter');
// const upload = require('../middleware/upload');

const router = express.Router();

// Get all renters for vendor
router.get('/', async (req, res) => {
  try {
    const { status, search, page = 1, limit = 10 } = req.query;
    
    // const query = { vendorId: req.vendorId };
    const query = {};
    
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;
    
    const renters = await Renter.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Renter.countDocuments(query);

    res.json({
      success: true,
      data: renters,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get renters error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Server error' 
    });
  }
});

// Get single renter
router.get('/:id', async (req, res) => {
  try {
    const renter = await Renter.findOne({ 
      _id: req.params.id, 
      vendorId: req.vendorId 
    });

    if (!renter) {
      return res.status(404).json({ 
        success: false, 
        error: 'Renter not found' 
      });
    }

    res.json({
      success: true,
      data: renter
    });
  } catch (error) {
    console.error('Get renter error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Server error' 
    });
  }
});

// Create new renter
router.post('/', [
  body('firstName').notEmpty().trim().withMessage('First name is required'),
  body('lastName').notEmpty().trim().withMessage('Last name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('phone').notEmpty().trim().withMessage('Phone number is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        error: errors.array()[0].msg 
      });
    }

    const { 
      firstName, 
      lastName, 
      email, 
      phone, 
      address, 
      licenseNumber, 
      passportNumber, 
      notes 
    } = req.body;

    // Check if renter with same email already exists
    const existingRenter = await Renter.findOne({ 
      email, 
      vendorId: req.vendorId 
    });
    
    if (existingRenter) {
      return res.status(400).json({ 
        success: false, 
        error: 'Renter with this email already exists' 
      });
    }

    const renterData = {
      firstName,
      lastName,
      email,
      phone,
      address,
      licenseNumber,
      passportNumber,
      notes,
      vendorId: req.vendorId
    };

    const renter = new Renter(renterData);
    await renter.save();

    res.status(201).json({
      success: true,
      data: renter
    });
  } catch (error) {
    console.error('Create renter error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Server error' 
    });
  }
});

// Update renter
router.put('/:id', [
  body('firstName').optional().notEmpty().trim().withMessage('First name cannot be empty'),
  body('lastName').optional().notEmpty().trim().withMessage('Last name cannot be empty'),
  body('email').optional().isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('phone').optional().notEmpty().trim().withMessage('Phone number cannot be empty')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        error: errors.array()[0].msg 
      });
    }

    const renter = await Renter.findOneAndUpdate(
      { _id: req.params.id, vendorId: req.vendorId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!renter) {
      return res.status(404).json({ 
        success: false, 
        error: 'Renter not found' 
      });
    }

    res.json({
      success: true,
      data: renter
    });
  } catch (error) {
    console.error('Update renter error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Server error' 
    });
  }
});

// Delete renter
router.delete('/:id', async (req, res) => {
  try {
    const renter = await Renter.findOneAndDelete({ 
      _id: req.params.id, 
      vendorId: req.vendorId 
    });

    if (!renter) {
      return res.status(404).json({ 
        success: false, 
        error: 'Renter not found' 
      });
    }

    res.json({
      success: true,
      message: 'Renter deleted successfully'
    });
  } catch (error) {
    console.error('Delete renter error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Server error' 
    });
  }
});

// router.post('/:id/documents', auth, async (req, res) => {
//   try {
//     const { type, expiresAt, documents } = req.body;

//     if (!documents || !Array.isArray(documents) || documents.length === 0) {
//       return res.status(400).json({ 
//         success: false, 
//         error: 'No documents provided' 
//       });
//     }

//     const renter = await Renter.findOne({ 
//       _id: req.params.id, 
//       vendorId: req.vendorId 
//     });

//     if (!renter) {
//       return res.status(404).json({ 
//         success: false, 
//         error: 'Renter not found' 
//       });
//     }

//     const newDocuments = documents.map(url => ({
//       type: type || 'other',
//       url,
//       uploadedAt: new Date(),
//       expiresAt: expiresAt ? new Date(expiresAt) : null
//     }));

//     renter.documents.push(...newDocuments);
//     await renter.save();

//     res.json({
//       success: true,
//       data: renter.documents
//     });
//   } catch (error) {
//     console.error('Upload documents error:', error);
//     res.status(500).json({ 
//       success: false, 
//       error: 'Server error' 
//     });
//   }
// });


// Delete renter document
router.delete('/:id/documents/:documentId', async (req, res) => {
  try {
    const renter = await Renter.findOne({ 
      _id: req.params.id, 
      vendorId: req.vendorId 
    });

    if (!renter) {
      return res.status(404).json({ 
        success: false, 
        error: 'Renter not found' 
      });
    }

    renter.documents = renter.documents.filter(
      doc => doc._id.toString() !== req.params.documentId
    );
    await renter.save();

    res.json({
      success: true,
      message: 'Document deleted successfully'
    });
  } catch (error) {
    console.error('Delete document error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Server error' 
    });
  }
});

// Update renter status
router.patch('/:id/status', [
  body('status').isIn(['active', 'inactive', 'suspended']).withMessage('Invalid status'),
  body('verified').optional().isBoolean().withMessage('Verified must be a boolean')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        error: errors.array()[0].msg 
      });
    }

    const renter = await Renter.findOneAndUpdate(
      { _id: req.params.id, vendorId: req.vendorId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!renter) {
      return res.status(404).json({ 
        success: false, 
        error: 'Renter not found' 
      });
    }

    res.json({
      success: true,
      data: renter
    });
  } catch (error) {
    console.error('Update renter status error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Server error' 
    });
  }
});

// Get renter statistics
router.get('/stats/overview', async (req, res) => {
  try {
    const totalRenters = await Renter.countDocuments({ vendorId: req.vendorId });
    const activeRenters = await Renter.countDocuments({ 
      vendorId: req.vendorId, 
      status: 'active' 
    });
    const verifiedRenters = await Renter.countDocuments({ 
      vendorId: req.vendorId, 
      verified: true 
    });
    const suspendedRenters = await Renter.countDocuments({ 
      vendorId: req.vendorId, 
      status: 'suspended' 
    });

    const topRenters = await Renter.find({ vendorId: req.vendorId })
      .sort({ totalSpent: -1 })
      .limit(5)
      .select('firstName lastName totalSpent totalRentals rating');

    res.json({
      success: true,
      data: {
        totalRenters,
        activeRenters,
        verifiedRenters,
        suspendedRenters,
        topRenters
      }
    });
  } catch (error) {
    console.error('Get renter stats error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Server error' 
    });
  }
});

module.exports = router; 