const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['car', 'real-estate'], required: true },
  description: String,
  value: Number,
  vendorId: { type: String, required: true },
  imageUrl: { type: String }, // Зураг зөвхөн линк хэлбэрээр хадгална
  // бусад талбарууд нэмэх бол энд бичиж болно
}, { timestamps: true });

module.exports = mongoose.model('Asset', assetSchema); 