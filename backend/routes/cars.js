const express = require('express');
const { body, validationResult } = require('express-validator');
const Car = require('../models/Car');

console.log('Car model loaded:', !!Car); // Debug log

const router = express.Router();

// Middleware to extract vendorId from token (simplified for now)
const extractVendor = (req, res, next) => {
  // TODO: Implement proper JWT verification
  // For now, we'll use a default vendorId or get it from headers
  req.vendorId = req.headers['vendor-id'] || 'default-vendor';
  next();
};

// GET /api/cars - Get all cars (public)
router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      brand, 
      fuel, 
      minPrice, 
      maxPrice,
      transmission,
      minYear,
      maxYear
    } = req.query;

    // Build filter object
    const filter = { isAvailable: true };
    
    if (brand) filter.brand = new RegExp(brand, 'i');
    if (fuel) filter.fuel = fuel;
    if (transmission) filter.transmission = transmission;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (minYear || maxYear) {
      filter.year = {};
      if (minYear) filter.year.$gte = Number(minYear);
      if (maxYear) filter.year.$lte = Number(maxYear);
    }

    const cars = await Car.find(filter)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await Car.countDocuments(filter);

    res.json({
      success: true,
      cars,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
        totalItems: total,
        hasNext: Number(page) < Math.ceil(total / Number(limit)),
        hasPrev: Number(page) > 1
      }
    });
  } catch (error) {
    console.error('Get cars error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// GET /api/cars/:id - Get single car
router.get('/:id', async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    
    if (!car) {
      return res.status(404).json({ success: false, error: 'Car not found' });
    }

    res.json({ success: true, car });
  } catch (error) {
    console.error('Get car error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// POST /api/cars - Create new car (admin only)
router.post('/', extractVendor, [
  body('brand').notEmpty().trim().withMessage('Brand is required'),
  body('model').notEmpty().trim().withMessage('Model is required'),
  body('year').isNumeric().custom(value => {
    const year = parseInt(value);
    if (year < 1990 || year > new Date().getFullYear() + 1) {
      throw new Error('Year must be between 1990 and current year');
    }
    return true;
  }),
  body('fuel').isIn(['Gasoline', 'Diesel', 'Hybrid', 'Electric', 'Gas']).withMessage('Invalid fuel type'),
  body('seats').isNumeric().custom(value => {
    const seats = parseInt(value);
    if (seats < 2 || seats > 9) {
      throw new Error('Seats must be between 2 and 9');
    }
    return true;
  }),
  body('transmission').isIn(['Manual', 'Automatic']).withMessage('Invalid transmission type'),
  body('location').notEmpty().trim().withMessage('Location is required'),
  body('price').isNumeric().custom(value => {
    const price = parseFloat(value);
    if (price <= 0) {
      throw new Error('Price must be positive');
    }
    return true;
  }),
  body('image').isURL().withMessage('Valid image URL is required'),
  body('description').notEmpty().trim().isLength({ max: 1000 }).withMessage('Description is required and max 1000 chars')
], async (req, res) => {
  try {
    console.log('POST /api/cars called with body:', req.body); // Debug log
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array()); // Debug log
      return res.status(400).json({ 
        success: false, 
        error: errors.array()[0].msg 
      });
    }

    const carData = {
      ...req.body,
      vendorId: req.vendorId
    };

    console.log('Creating car with data:', carData); // Debug log

    const car = new Car(carData);
    await car.save();

    console.log('Car created successfully:', car._id); // Debug log
    res.status(201).json({ success: true, car });
  } catch (error) {
    console.error('Create car error:', error);
    res.status(500).json({ success: false, error: 'Server error: ' + error.message });
  }
});

// PUT /api/cars/:id - Update car (admin only)
router.put('/:id', extractVendor, [
  body('brand').optional().notEmpty().trim(),
  body('model').optional().notEmpty().trim(),
  body('year').optional().isNumeric().custom(value => {
    if (value) {
      const year = parseInt(value);
      if (year < 1990 || year > new Date().getFullYear() + 1) {
        throw new Error('Year must be between 1990 and current year');
      }
    }
    return true;
  }),
  body('fuel').optional().isIn(['Gasoline', 'Diesel', 'Hybrid', 'Electric', 'Gas']),
  body('seats').optional().isNumeric().custom(value => {
    if (value) {
      const seats = parseInt(value);
      if (seats < 2 || seats > 9) {
        throw new Error('Seats must be between 2 and 9');
      }
    }
    return true;
  }),
  body('transmission').optional().isIn(['Manual', 'Automatic']),
  body('location').optional().notEmpty().trim(),
  body('price').optional().isNumeric().custom(value => {
    if (value) {
      const price = parseFloat(value);
      if (price <= 0) {
        throw new Error('Price must be positive');
      }
    }
    return true;
  }),
  body('image').optional().isURL(),
  body('description').optional().notEmpty().trim().isLength({ max: 1000 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        error: errors.array()[0].msg 
      });
    }

    const car = await Car.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!car) {
      return res.status(404).json({ success: false, error: 'Car not found' });
    }

    res.json({ success: true, car });
  } catch (error) {
    console.error('Update car error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// DELETE /api/cars/:id - Delete car (admin only)
router.delete('/:id', extractVendor, async (req, res) => {
  try {
    const car = await Car.findByIdAndDelete(req.params.id);
    
    if (!car) {
      return res.status(404).json({ success: false, error: 'Car not found' });
    }

    res.json({ success: true, message: 'Car deleted successfully' });
  } catch (error) {
    console.error('Delete car error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

module.exports = router;