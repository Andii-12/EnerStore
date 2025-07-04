const mongoose = require('mongoose');
const Product = require('../models/Product');
const Brand = require('../models/Brand');

mongoose.connect('mongodb://localhost:27017/enerstore', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function migrateBrands() {
  const brands = await Brand.find();
  const idToName = {};
  brands.forEach(b => { idToName[b._id.toString()] = b.name; });

  const products = await Product.find();
  for (const product of products) {
    if (product.brand && idToName[product.brand.toString()]) {
      product.brand = idToName[product.brand.toString()];
      await product.save();
    }
  }
  console.log('Migrated product brands to names!');
  mongoose.disconnect();
}

migrateBrands(); 