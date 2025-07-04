const mongoose = require('mongoose');
const CompanySchema = new mongoose.Schema({
  name: String,
  logo: String,
  address: String,
  contact: String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});
module.exports = mongoose.model('Company', CompanySchema); 