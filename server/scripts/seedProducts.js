const mongoose = require('mongoose');
const Product = require('../models/Product');

mongoose.connect('mongodb://localhost:27017/enerstore', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const products = [
  {
    name: 'All in One',
    description: 'All in one desktop computer',
    price: 2500000,
    image: 'https://via.placeholder.com/120?text=All+in+One',
    category: 'Компьютер',
  },
  {
    name: 'Суурин Компьютер',
    description: 'Суурин компьютер',
    price: 1800000,
    image: 'https://via.placeholder.com/120?text=Суурин+Компьютер',
    category: 'Компьютер',
  },
  {
    name: 'Зөөврийн Компьютер',
    description: 'Зөөврийн компьютер',
    price: 3200000,
    image: 'https://via.placeholder.com/120?text=Зөөврийн+Компьютер',
    category: 'Компьютер',
  },
  {
    name: 'Ухаалаг дэлгэц | Зурагт',
    description: 'Ухаалаг дэлгэц болон зурагт',
    price: 2100000,
    image: 'https://via.placeholder.com/120?text=Ухаалаг+дэлгэц',
    category: 'Дэлгэц',
  },
  {
    name: 'Принтер',
    description: 'Өндөр чанартай принтер',
    price: 600000,
    image: 'https://via.placeholder.com/120?text=Принтер',
    category: 'Принтер',
  },
  {
    name: 'Гар утас',
    description: 'Шинэ загварын гар утас',
    price: 1500000,
    image: 'https://via.placeholder.com/120?text=Гар+утас',
    category: 'Гар утас',
  },
];

async function seed() {
  await Product.deleteMany({});
  await Product.insertMany(products);
  console.log('Sample products inserted!');
  mongoose.disconnect();
}

seed(); 