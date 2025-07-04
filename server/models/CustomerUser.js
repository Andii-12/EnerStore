const mongoose = require('mongoose');
const CustomerUserSchema = new mongoose.Schema({
  username: String,
  password: String,
  email: String
});
module.exports = mongoose.model('CustomerUser', CustomerUserSchema); 