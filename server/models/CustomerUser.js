const mongoose = require('mongoose');
const CustomerUserSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  address: {
    street: String,
    city: String,
    district: String,
    zipCode: String
  },
  isActive: { type: Boolean, default: true },
  lastLogin: Date
}, { timestamps: true });

module.exports = mongoose.model('CustomerUser', CustomerUserSchema); 