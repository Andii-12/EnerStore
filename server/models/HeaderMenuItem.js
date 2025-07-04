const mongoose = require('mongoose');
const HeaderMenuItemSchema = new mongoose.Schema({
  label: String,
  link: String,
  order: Number
});
module.exports = mongoose.model('HeaderMenuItem', HeaderMenuItemSchema); 