const mongoose = require('mongoose');
const BrandSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  logo: String, // URL or base64
  description: String,
});
module.exports = mongoose.model('Brand', BrandSchema); 