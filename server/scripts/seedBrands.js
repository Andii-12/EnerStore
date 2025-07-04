const mongoose = require('mongoose');
const Brand = require('../models/Brand');

mongoose.connect('mongodb://localhost:27017/enerstore', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const brands = [
  { name: 'Dell', logo: '', description: 'Computer & Server brand' },
  { name: 'HP', logo: '', description: 'Computer & Server brand' },
  { name: 'Lenovo', logo: '', description: 'Computer brand' },
  { name: 'Supermicro', logo: '', description: 'Server brand' },
  { name: 'Hikvision', logo: '', description: 'Camera brand' },
  { name: 'Dahua', logo: '', description: 'Camera brand' },
  { name: 'Axis', logo: '', description: 'Camera brand' },
  { name: 'ASUS', logo: '', description: 'Computer brand' },
  { name: 'Acer', logo: '', description: 'Computer brand' },
];

async function seed() {
  await Brand.deleteMany({});
  await Brand.insertMany(brands);
  console.log('Sample brands inserted!');
  mongoose.disconnect();
}

seed(); 