const express = require('express');
const Asset = require('../models/Asset');
const router = express.Router();

// Бүх asset-уудыг авах
router.get('/', async (req, res) => {
  try {
    const assets = await Asset.find();
    res.json({ success: true, assets });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Asset нэмэх
router.post('/', async (req, res) => {
  try {
    const asset = new Asset(req.body);
    await asset.save();
    res.status(201).json({ success: true, asset });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Нэг asset авах
router.get('/:id', async (req, res) => {
  try {
    const asset = await Asset.findById(req.params.id);
    if (!asset) return res.status(404).json({ success: false, error: 'Not found' });
    res.json({ success: true, asset });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Asset засах
router.put('/:id', async (req, res) => {
  try {
    const asset = await Asset.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!asset) return res.status(404).json({ success: false, error: 'Not found' });
    res.json({ success: true, asset });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Asset устгах
router.delete('/:id', async (req, res) => {
  try {
    const asset = await Asset.findByIdAndDelete(req.params.id);
    if (!asset) return res.status(404).json({ success: false, error: 'Not found' });
    res.json({ success: true, message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

module.exports = router; 