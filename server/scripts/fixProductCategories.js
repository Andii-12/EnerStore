const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const Product = require('../models/Product');
const Category = require('../models/Category');

// Connect to MongoDB
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/enerstore';
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

async function fixProductCategories() {
  try {
    console.log('🔧 Starting product category fix...');
    
    // Get all products
    const products = await Product.find({});
    console.log(`📦 Found ${products.length} products to process`);
    
    // Get all categories
    const categories = await Category.find({});
    console.log(`🏷️ Found ${categories.length} categories`);
    
    let updatedCount = 0;
    
    for (const product of products) {
      let needsUpdate = false;
      const updateData = {};
      
      // If product has categories array but no legacy category field
      if (product.categories && product.categories.length > 0 && !product.category) {
        updateData.category = product.categories[0];
        needsUpdate = true;
      }
      
      // If product has legacy category but no categories array
      if (product.category && (!product.categories || product.categories.length === 0)) {
        updateData.categories = [product.category];
        needsUpdate = true;
      }
      
      // If product has category IDs instead of names, convert them
      if (product.categories && product.categories.length > 0) {
        const categoryNames = [];
        for (const cat of product.categories) {
          if (mongoose.Types.ObjectId.isValid(cat)) {
            const categoryDoc = categories.find(c => c._id.toString() === cat.toString());
            if (categoryDoc) {
              categoryNames.push(categoryDoc.name);
            }
          } else {
            categoryNames.push(cat);
          }
        }
        if (JSON.stringify(categoryNames) !== JSON.stringify(product.categories)) {
          updateData.categories = categoryNames;
          updateData.category = categoryNames[0] || '';
          needsUpdate = true;
        }
      }
      
      if (needsUpdate) {
        await Product.findByIdAndUpdate(product._id, updateData);
        updatedCount++;
        console.log(`✅ Updated product: ${product.name}`);
      }
    }
    
    console.log(`🎉 Fixed ${updatedCount} products`);
    
    // Verify the fix
    const productsWithCategories = await Product.find({
      $or: [
        { categories: { $exists: true, $ne: [] } },
        { category: { $exists: true, $ne: '' } }
      ]
    });
    
    console.log(`📊 Products with categories: ${productsWithCategories.length}/${products.length}`);
    
  } catch (error) {
    console.error('❌ Error fixing product categories:', error);
  } finally {
    mongoose.connection.close();
  }
}

// Run the fix
fixProductCategories();
