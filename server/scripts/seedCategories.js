const mongoose = require('mongoose');
const Category = require('../models/Category');

mongoose.connect('mongodb://localhost:27017/enerstore', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const categories = [
  { name: 'Бүх бараа', image: 'https://via.placeholder.com/60?text=Бүх+бараа' },
  { name: 'All in One', image: 'https://via.placeholder.com/60?text=All+in+One' },
  { name: 'Суурин Компьютер', image: 'https://via.placeholder.com/60?text=Суурин+Компьютер' },
  { name: 'Зөөврийн Компьютер', image: 'https://via.placeholder.com/60?text=Зөөврийн+Компьютер' },
  { name: 'Ухаалаг дэлгэц | Зурагт', image: 'https://via.placeholder.com/60?text=Ухаалаг+дэлгэц' },
  { name: 'Принтер', image: 'https://via.placeholder.com/60?text=Принтер' },
  { name: 'Гар утас', image: 'https://via.placeholder.com/60?text=Гар+утас' },
  { name: 'Хяналтын камер', image: 'https://via.placeholder.com/60?text=Камер' },
  { name: 'Хадгалах төхөөрөмж', image: 'https://via.placeholder.com/60?text=Хадгалах' },
  { name: 'Дэлгэц | Monitor', image: 'https://via.placeholder.com/60?text=Monitor' },
  { name: 'Wireless Router', image: 'https://via.placeholder.com/60?text=Router' },
  { name: 'Switch', image: 'https://via.placeholder.com/60?text=Switch' },
  { name: 'Чихэвч / Headphone', image: 'https://via.placeholder.com/60?text=Headphone' },
];

async function seed() {
  await Category.deleteMany({});
  await Category.insertMany(categories);
  console.log('Sample categories inserted!');
  mongoose.disconnect();
}

seed(); 