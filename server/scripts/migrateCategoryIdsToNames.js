const mongoose = require('mongoose');
const Product = require('../models/Product');
const Category = require('../models/Category');

mongoose.connect('mongodb://localhost:27017/enerstore', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function migrateCategoryIdsToNames() {
  // Build a map of categoryId -> name
  const categories = await Category.find();
  const idToName = {};
  categories.forEach(cat => {
    idToName[cat._id.toString()] = cat.name;
  });

  // Update all products
  const products = await Product.find();
  for (const product of products) {
    if (Array.isArray(product.categories)) {
      const newCategories = product.categories.map(id => idToName[id.toString()] || id);
      product.categories = newCategories;
      await product.save();
    }
    // Optionally update legacy 'category' field if present
    if (product.category && idToName[product.category.toString()]) {
      product.category = idToName[product.category.toString()];
      await product.save();
    }
  }
  console.log('Migration complete!');
  mongoose.disconnect();
}

migrateCategoryIdsToNames(); 