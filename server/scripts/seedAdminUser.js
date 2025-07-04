const mongoose = require('mongoose');
const User = require('../models/User');

mongoose.connect('mongodb://localhost:27017/enerstore', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function seed() {
  await User.deleteMany({ username: 'admin' });
  await User.create({ username: 'admin', password: 'admin123' }); // In production, hash this!
  console.log('Admin user created!');
  mongoose.disconnect();
}

seed(); 