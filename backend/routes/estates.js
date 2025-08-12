const express = require('express');
const { body, validationResult } = require('express-validator');
const Estate = require('../models/Estate');
const { extractVendor } = require('../middleware/auth');

const router = express.Router();

// GET /api/estates - Get all estates (public)
router.get('/', async (req, res) => {
  try {
    console.log('GET /api/estates called'); // Debug log
    
    const { 
      page = 1, 
      limit = 10, 
      propertyType, 
      minPrice, 
      maxPrice,
      minRooms,
      maxRooms,
      location,
      furnished,
      petsAllowed
    } = req.query;

    // Build filter object
    const filter = { isAvailable: true };
    
    if (propertyType) filter.propertyType = propertyType;
    if (location) filter.location = new RegExp(location, 'i');
    if (furnished !== undefined) filter.furnished = furnished === 'true';
    if (petsAllowed !== undefined) filter.petsAllowed = petsAllowed === 'true';
    
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    
    if (minRooms || maxRooms) {
      filter.rooms = {};
      if (minRooms) filter.rooms.$gte = Number(minRooms);
      if (maxRooms) filter.rooms.$lte = Number(maxRooms);
    }

    console.log('Filter object:', filter); // Debug log
    
    const estates = await Estate.find(filter)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    console.log('Found estates:', estates.length); // Debug log
    const total = await Estate.countDocuments(filter);

    res.json({
      success: true,
      estates,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
        totalItems: total,
        hasNext: Number(page) < Math.ceil(total / Number(limit)),
        hasPrev: Number(page) > 1
      }
    });
  } catch (error) {
    console.error('Get estates error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// GET /api/estates/:id - Get single estate
router.get('/:id', async (req, res) => {
  try {
    const estate = await Estate.findById(req.params.id);
    
    if (!estate) {
      return res.status(404).json({ success: false, error: 'Estate not found' });
    }

    res.json({ success: true, estate });
  } catch (error) {
    console.error('Get estate error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// POST /api/estates - Create new estate (admin only)
router.post('/', extractVendor, [
  body('title').notEmpty().trim().isLength({ max: 200 }).withMessage('Title is required and max 200 chars'),
  body('location').notEmpty().trim().withMessage('Location is required'),
  body('size').isFloat({ min: 10 }).withMessage('Size must be at least 10 square meters'),
  body('rooms').isInt({ min: 1 }).withMessage('Must have at least 1 room'),
  body('bathrooms').optional().isInt({ min: 1 }).withMessage('Must have at least 1 bathroom'),
  body('floor').optional().isInt({ min: 0 }).withMessage('Floor cannot be negative'),
  body('totalFloors').optional().isInt({ min: 1 }).withMessage('Building must have at least 1 floor'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be positive'),
  body('image').isURL().withMessage('Valid image URL is required'),
  body('description').notEmpty().trim().isLength({ max: 2000 }).withMessage('Description is required and max 2000 chars'),
  body('propertyType').isIn(['Apartment', 'House', 'Studio', 'Room', 'Commercial']).withMessage('Invalid property type')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        error: errors.array()[0].msg 
      });
    }

    const estateData = {
      ...req.body,
      vendorId: req.vendorId
    };

    const estate = new Estate(estateData);
    await estate.save();

    res.status(201).json({ success: true, estate });
  } catch (error) {
    console.error('Create estate error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// PUT /api/estates/:id - Update estate (admin only)
router.put('/:id', extractVendor, [
  body('title').optional().notEmpty().trim().isLength({ max: 200 }),
  body('location').optional().notEmpty().trim(),
  body('size').optional().isFloat({ min: 10 }),
  body('rooms').optional().isInt({ min: 1 }),
  body('bathrooms').optional().isInt({ min: 1 }),
  body('floor').optional().isInt({ min: 0 }),
  body('totalFloors').optional().isInt({ min: 1 }),
  body('price').optional().isFloat({ min: 0 }),
  body('image').optional().isURL(),
  body('description').optional().notEmpty().trim().isLength({ max: 2000 }),
  body('propertyType').optional().isIn(['Apartment', 'House', 'Studio', 'Room', 'Commercial'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        error: errors.array()[0].msg 
      });
    }

    const estate = await Estate.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!estate) {
      return res.status(404).json({ success: false, error: 'Estate not found' });
    }

    res.json({ success: true, estate });
  } catch (error) {
    console.error('Update estate error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// DELETE /api/estates/:id - Delete estate (admin only)
router.delete('/:id', extractVendor, async (req, res) => {
  try {
    const estate = await Estate.findByIdAndDelete(req.params.id);
    
    if (!estate) {
      return res.status(404).json({ success: false, error: 'Estate not found' });
    }

    res.json({ success: true, message: 'Estate deleted successfully' });
  } catch (error) {
    console.error('Delete estate error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

module.exports = router;