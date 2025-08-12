const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to verify JWT token and extract user info
const verifyToken = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ success: false, error: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.userId = decoded.userId;
    req.vendorId = decoded.vendorId; // Extract vendorId from token
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(400).json({ success: false, error: 'Invalid token.' });
  }
};

// Middleware to extract vendorId from token for admin routes
const extractVendor = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      // For development, allow fallback to header
      req.vendorId = req.headers['vendor-id'] || 'default-vendor';
      console.warn('No token provided, using fallback vendorId:', req.vendorId);
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.userId = decoded.userId;
    req.vendorId = decoded.vendorId;
    
    if (!req.vendorId) {
      return res.status(403).json({ success: false, error: 'Vendor access required.' });
    }
    
    next();
  } catch (error) {
    console.error('Vendor extraction error:', error);
    // Fallback for development
    req.vendorId = req.headers['vendor-id'] || 'default-vendor';
    console.warn('Token verification failed, using fallback vendorId:', req.vendorId);
    next();
  }
};

// Middleware to check if user has admin/manager role
const requireAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user || !['admin', 'manager'].includes(user.role)) {
      return res.status(403).json({ success: false, error: 'Admin access required.' });
    }
    next();
  } catch (error) {
    console.error('Admin check error:', error);
    res.status(500).json({ success: false, error: 'Server error.' });
  }
};

module.exports = {
  verifyToken,
  extractVendor,
  requireAdmin
};
