const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: String,
  description: String,
  specifications: String, // Add specifications field
  price: Number,
  image: String, // main image
  images: [String], // additional images
  category: String, // legacy single category
  categories: [String], // multiple categories
  piece: { type: Number, default: 0 }, // how many pieces in stock
  soldCount: { type: Number, default: 0 },
  brand: String,
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
  saleEnd: Date, // when the sale ends
  originalPrice: Number, // to restore after sale
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema); 