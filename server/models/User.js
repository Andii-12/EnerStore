const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
  username: String,
  password: String // In production, hash passwords!
});
module.exports = mongoose.model('User', UserSchema); 