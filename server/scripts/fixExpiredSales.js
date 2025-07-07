const mongoose = require('mongoose');
const Product = require('../models/Product');

mongoose.connect('mongodb://localhost:27017/enerstore', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function fixExpiredSales() {
  const now = new Date();
  const expired = await Product.find({
    saleEnd: { $exists: true, $ne: null, $lt: now },
    originalPrice: { $exists: true, $ne: null },
  });
  for (const product of expired) {
    product.price = product.originalPrice;
    product.originalPrice = undefined;
    product.saleEnd = undefined;
    await product.save();
    console.log(`Restored price for product: ${product.name}`);
  }
  console.log('Expired sales fixed.');
  mongoose.disconnect();
}

fixExpiredSales(); 