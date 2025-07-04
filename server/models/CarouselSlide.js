const mongoose = require('mongoose');

const CarouselSlideSchema = new mongoose.Schema({
  image: String,
  title: String,
  subtitle: String,
  link: String
});

module.exports = mongoose.model('CarouselSlide', CarouselSlideSchema); 