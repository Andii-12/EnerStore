const mongoose = require('mongoose');
require('dotenv').config();

// Import your models
const Product = require('../models/Product');
const Category = require('../models/Category');
const Brand = require('../models/Brand');
const Company = require('../models/Company');
const CustomerUser = require('../models/CustomerUser');
const User = require('../models/User');
const HeaderMenuItem = require('../models/HeaderMenuItem');
const CarouselSlide = require('../models/CarouselSlide');

// Connect to MongoDB Atlas
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/enerstore';
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const validateData = async () => {
  try {
    console.log('🔍 Starting data validation in MongoDB Atlas...');
    console.log(`🔗 Connected to: ${mongoUri}`);
    
    // Count all documents
    const counts = await Promise.all([
      Product.countDocuments(),
      Category.countDocuments(),
      Brand.countDocuments(),
      Company.countDocuments(),
      CustomerUser.countDocuments(),
      User.countDocuments(),
      HeaderMenuItem.countDocuments(),
      CarouselSlide.countDocuments()
    ]);

    console.log('\n📊 Document Counts:');
    console.log(`Products: ${counts[0]}`);
    console.log(`Categories: ${counts[1]}`);
    console.log(`Brands: ${counts[2]}`);
    console.log(`Companies: ${counts[3]}`);
    console.log(`Customer Users: ${counts[4]}`);
    console.log(`Admin Users: ${counts[5]}`);
    console.log(`Header Menu Items: ${counts[6]}`);
    console.log(`Carousel Slides: ${counts[7]}`);

    // Sample data validation
    console.log('\n🔍 Sample Data Validation:');
    
    // Check if we have sample data
    if (counts[0] > 0) {
      const sampleProduct = await Product.findOne();
      console.log('📦 Sample Product:', {
        name: sampleProduct.name,
        price: sampleProduct.price,
        category: sampleProduct.category,
        brand: sampleProduct.brand
      });
    }

    if (counts[1] > 0) {
      const sampleCategory = await Category.findOne();
      console.log('🏷️ Sample Category:', {
        name: sampleCategory.name,
        image: sampleCategory.image ? 'Has image' : 'No image'
      });
    }

    if (counts[2] > 0) {
      const sampleBrand = await Brand.findOne();
      console.log('🏭 Sample Brand:', {
        name: sampleBrand.name,
        description: sampleBrand.description || 'No description'
      });
    }

    if (counts[3] > 0) {
      const sampleCompany = await Company.findOne();
      console.log('🏢 Sample Company:', {
        name: sampleCompany.name,
        email: sampleCompany.email,
        hasLogo: !!sampleCompany.logo
      });
    }

    // Check for data integrity issues
    console.log('\n🔍 Data Integrity Checks:');
    
    // Check products without categories
    const productsWithoutCategory = await Product.countDocuments({ category: { $exists: false } });
    if (productsWithoutCategory > 0) {
      console.log(`⚠️  ${productsWithoutCategory} products without category`);
    } else {
      console.log('✅ All products have categories');
    }

    // Check products without prices
    const productsWithoutPrice = await Product.countDocuments({ price: { $exists: false } });
    if (productsWithoutPrice > 0) {
      console.log(`⚠️  ${productsWithoutPrice} products without price`);
    } else {
      console.log('✅ All products have prices');
    }

    // Check for duplicate product names
    const duplicateNames = await Product.aggregate([
      { $group: { _id: '$name', count: { $sum: 1 } } },
      { $match: { count: { $gt: 1 } } }
    ]);
    
    if (duplicateNames.length > 0) {
      console.log(`⚠️  Found ${duplicateNames.length} duplicate product names`);
      duplicateNames.forEach(dup => {
        console.log(`   - "${dup._id}" appears ${dup.count} times`);
      });
    } else {
      console.log('✅ No duplicate product names found');
    }

    // Check for products with invalid prices
    const invalidPrices = await Product.countDocuments({
      $or: [
        { price: { $lt: 0 } },
        { price: { $type: 'string' } }
      ]
    });
    
    if (invalidPrices > 0) {
      console.log(`⚠️  ${invalidPrices} products with invalid prices`);
    } else {
      console.log('✅ All product prices are valid');
    }

    // Check image URLs
    const productsWithImages = await Product.countDocuments({
      $or: [
        { image: { $exists: true, $ne: '' } },
        { thumbnail: { $exists: true, $ne: '' } }
      ]
    });
    console.log(`📸 ${productsWithImages} products have images`);

    // Check for orphaned references
    console.log('\n🔍 Reference Integrity:');
    
    // Check if all product categories exist
    const productCategories = await Product.distinct('category');
    const existingCategories = await Category.distinct('name');
    const missingCategories = productCategories.filter(cat => !existingCategories.includes(cat));
    
    if (missingCategories.length > 0) {
      console.log(`⚠️  Products reference ${missingCategories.length} missing categories:`, missingCategories);
    } else {
      console.log('✅ All product categories exist');
    }

    // Check if all product brands exist
    const productBrands = await Product.distinct('brand');
    const existingBrands = await Brand.distinct('name');
    const missingBrands = productBrands.filter(brand => !existingBrands.includes(brand));
    
    if (missingBrands.length > 0) {
      console.log(`⚠️  Products reference ${missingBrands.length} missing brands:`, missingBrands);
    } else {
      console.log('✅ All product brands exist');
    }

    console.log('\n🎉 Data validation completed!');
    
    // Overall health score
    const totalIssues = (productsWithoutCategory + productsWithoutPrice + duplicateNames.length + invalidPrices + missingCategories.length + missingBrands.length);
    const healthScore = Math.max(0, 100 - (totalIssues * 10));
    
    console.log(`\n🏥 Database Health Score: ${healthScore}/100`);
    if (healthScore >= 90) {
      console.log('🟢 Excellent - Database is in great condition!');
    } else if (healthScore >= 70) {
      console.log('🟡 Good - Minor issues detected');
    } else if (healthScore >= 50) {
      console.log('🟠 Fair - Several issues need attention');
    } else {
      console.log('🔴 Poor - Many issues detected, review needed');
    }

  } catch (error) {
    console.error('❌ Validation failed:', error);
  } finally {
    mongoose.connection.close();
    console.log('🔌 Disconnected from MongoDB Atlas');
  }
};

// Run the validation
validateData(); 