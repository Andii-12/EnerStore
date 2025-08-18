const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
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

const importData = async () => {
  try {
    console.log('🔄 Starting data import to MongoDB Atlas...');
    console.log(`🔗 Connected to: ${mongoUri}`);
    
    const exportsDir = path.join(__dirname, 'exports');
    
    // Check if exports directory exists
    if (!fs.existsSync(exportsDir)) {
      console.error('❌ Exports directory not found. Run exportLocalData.js first.');
      return;
    }

    // Clear existing data (optional - comment out if you want to keep existing data)
    console.log('🧹 Clearing existing data...');
    await Promise.all([
      Product.deleteMany({}),
      Category.deleteMany({}),
      Brand.deleteMany({}),
      Company.deleteMany({}),
      CustomerUser.deleteMany({}),
      User.deleteMany({}),
      HeaderMenuItem.deleteMany({}),
      CarouselSlide.deleteMany({})
    ]);
    console.log('✅ Existing data cleared');

    // Import Categories first (no dependencies)
    console.log('🏷️ Importing categories...');
    if (fs.existsSync(path.join(exportsDir, 'categories.json'))) {
      const categoriesData = JSON.parse(fs.readFileSync(path.join(exportsDir, 'categories.json'), 'utf8'));
      const categories = await Category.insertMany(categoriesData);
      console.log(`✅ Imported ${categories.length} categories`);
    }

    // Import Brands (no dependencies)
    console.log('🏭 Importing brands...');
    if (fs.existsSync(path.join(exportsDir, 'brands.json'))) {
      const brandsData = JSON.parse(fs.readFileSync(path.join(exportsDir, 'brands.json'), 'utf8'));
      const brands = await Brand.insertMany(brandsData);
      console.log(`✅ Imported ${brands.length} brands`);
    }

    // Import Companies (no dependencies)
    console.log('🏢 Importing companies...');
    if (fs.existsSync(path.join(exportsDir, 'companies.json'))) {
      const companiesData = JSON.parse(fs.readFileSync(path.join(exportsDir, 'companies.json'), 'utf8'));
      const companies = await Company.insertMany(companiesData);
      console.log(`✅ Imported ${companies.length} companies`);
    }

    // Import Products (depends on categories, brands, companies)
    console.log('📦 Importing products...');
    if (fs.existsSync(path.join(exportsDir, 'products.json'))) {
      const productsData = JSON.parse(fs.readFileSync(path.join(exportsDir, 'products.json'), 'utf8'));
      
      // Process products to handle ObjectId references
      const processedProducts = productsData.map(product => {
        // Remove _id to let MongoDB generate new ones
        const { _id, ...productData } = product;
        
        // Handle company reference if it exists
        if (product.company && typeof product.company === 'object' && product.company._id) {
          // We'll need to find the new company ID
          // For now, we'll keep the company name as a string
          productData.company = product.company.name || product.company._id;
        }
        
        return productData;
      });
      
      const products = await Product.insertMany(processedProducts);
      console.log(`✅ Imported ${products.length} products`);
    }

    // Import Customer Users
    console.log('👥 Importing customer users...');
    if (fs.existsSync(path.join(exportsDir, 'customerUsers.json'))) {
      const customerUsersData = JSON.parse(fs.readFileSync(path.join(exportsDir, 'customerUsers.json'), 'utf8'));
      const processedCustomerUsers = customerUsersData.map(user => {
        const { _id, ...userData } = user;
        return userData;
      });
      const customerUsers = await CustomerUser.insertMany(processedCustomerUsers);
      console.log(`✅ Imported ${customerUsers.length} customer users`);
    }

    // Import Admin Users
    console.log('👤 Importing admin users...');
    if (fs.existsSync(path.join(exportsDir, 'users.json'))) {
      const usersData = JSON.parse(fs.readFileSync(path.join(exportsDir, 'users.json'), 'utf8'));
      const processedUsers = usersData.map(user => {
        const { _id, ...userData } = user;
        return userData;
      });
      const users = await User.insertMany(processedUsers);
      console.log(`✅ Imported ${users.length} admin users`);
    }

    // Import Header Menu Items
    console.log('📋 Importing header menu items...');
    if (fs.existsSync(path.join(exportsDir, 'headerMenuItems.json'))) {
      const headerMenuItemsData = JSON.parse(fs.readFileSync(path.join(exportsDir, 'headerMenuItems.json'), 'utf8'));
      const processedHeaderMenuItems = headerMenuItemsData.map(item => {
        const { _id, ...itemData } = item;
        return itemData;
      });
      const headerMenuItems = await HeaderMenuItem.insertMany(processedHeaderMenuItems);
      console.log(`✅ Imported ${headerMenuItems.length} header menu items`);
    }

    // Import Carousel Slides
    console.log('🖼️ Importing carousel slides...');
    if (fs.existsSync(path.join(exportsDir, 'carouselSlides.json'))) {
      const carouselSlidesData = JSON.parse(fs.readFileSync(path.join(exportsDir, 'carouselSlides.json'), 'utf8'));
      const processedCarouselSlides = carouselSlidesData.map(slide => {
        const { _id, ...slideData } = slide;
        return slideData;
      });
      const carouselSlides = await CarouselSlide.insertMany(processedCarouselSlides);
      console.log(`✅ Imported ${carouselSlides.length} carousel slides`);
    }

    console.log('\n🎉 Data import completed successfully!');
    
    // Display summary
    const summary = await Promise.all([
      Product.countDocuments(),
      Category.countDocuments(),
      Brand.countDocuments(),
      Company.countDocuments(),
      CustomerUser.countDocuments(),
      User.countDocuments(),
      HeaderMenuItem.countDocuments(),
      CarouselSlide.countDocuments()
    ]);

    console.log('\n📊 Import Summary:');
    console.log(`Products: ${summary[0]}`);
    console.log(`Categories: ${summary[1]}`);
    console.log(`Brands: ${summary[2]}`);
    console.log(`Companies: ${summary[3]}`);
    console.log(`Customer Users: ${summary[4]}`);
    console.log(`Admin Users: ${summary[5]}`);
    console.log(`Header Menu Items: ${summary[6]}`);
    console.log(`Carousel Slides: ${summary[7]}`);

  } catch (error) {
    console.error('❌ Import failed:', error);
  } finally {
    mongoose.connection.close();
    console.log('🔌 Disconnected from MongoDB Atlas');
  }
};

// Run the import
importData(); 