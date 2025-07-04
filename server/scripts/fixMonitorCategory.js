const mongoose = require('mongoose');
const Product = require('../models/Product');

mongoose.connect('mongodb://localhost:27017/enerstore', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function fixMonitorCategory() {
  try {
    const result = await Product.updateMany(
      { category: 'Дэлгэц' },
      { $set: { category: 'Дэлгэц | Monitor', categories: ['Дэлгэц | Monitor'] } }
    );
    console.log(`Updated ${result.nModified || result.modifiedCount} products.`);
  } catch (err) {
    console.error('Error updating products:', err);
  } finally {
    mongoose.disconnect();
  }
}

fixMonitorCategory(); 