const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Vendor = require('../models/Vendor');

const router = express.Router();

// Register
router.post('/register', [
  body('firstName').notEmpty().trim(),
  body('lastName').notEmpty().trim(),
  body('email').isEmail().normalizeEmail(),
  body('username').isLength({ min: 3 }).trim(),
  body('password').isLength({ min: 8 }),
  body('vendorName').notEmpty().trim(),
  body('vendorType').isIn(['car', 'real-estate', 'both'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, error: errors.array()[0].msg });
    }
    const { firstName, lastName, email, username, password, vendorName, vendorType } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ success: false, error: 'User with this email or username already exists' });
    }

    // 1. User-ийг эхэлж үүсгэнэ
    const user = new User({
      firstName, lastName, email, username, password,
      role: 'admin'
    });
    await user.save();

    // 2. Vendor-ийг user._id-тай үүсгэнэ
    const vendor = new Vendor({
      name: vendorName,
      type: vendorType,
      ownerId: user._id
    });
    await vendor.save();

    // 3. User-ийн vendorId-г update хийнэ
    user.vendorId = vendor._id.toString();
    await user.save();

    // Generate token
    const token = jwt.sign(
      { userId: user._id, vendorId: user.vendorId },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
        vendorId: user.vendorId,
        role: user.role
      },
      vendor: {
        id: vendor._id,
        name: vendor.name,
        type: vendor.type
      },
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, error: 'Server error during registration' });
  }
});

// Simple User Registration (no vendor required)
router.post('/register-user', [
  body('firstName').notEmpty().trim().withMessage('First name is required'),
  body('lastName').notEmpty().trim().withMessage('Last name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('username').isLength({ min: 3 }).trim().withMessage('Username must be at least 3 characters'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
], async (req, res) => {
  try {
    console.log('User registration attempt:', req.body);
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({ success: false, error: errors.array()[0].msg });
    }
    
    const { firstName, lastName, email, username, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      console.log('User already exists:', existingUser.email);
      return res.status(400).json({ success: false, error: 'User with this email or username already exists' });
    }

    // Create user with 'user' role
    const user = new User({
      firstName, 
      lastName, 
      email, 
      username, 
      password,
      role: 'user'
    });
    
    console.log('Saving new user:', { firstName, lastName, email, username, role: 'user' });
    await user.save();
    console.log('User saved successfully:', user._id);

    // Generate token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    console.log('Registration successful for user:', user.email);
    res.status(201).json({
      success: true,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
        role: user.role
      },
      token
    });
  } catch (error) {
    console.error('User registration error:', error);
    res.status(500).json({ success: false, error: 'Server error during registration: ' + error.message });
  }
});

// Login
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, error: errors.array()[0].msg });
    }
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !user.isActive) {
      return res.status(400).json({ success: false, error: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ success: false, error: 'Invalid credentials' });
    }

    user.lastLogin = new Date();
    await user.save();

    const token = jwt.sign(
      { userId: user._id, vendorId: user.vendorId },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
        vendorId: user.vendorId,
        role: user.role
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, error: 'Server error during login' });
  }
});

module.exports = router; 