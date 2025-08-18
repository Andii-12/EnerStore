const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Import your models
const Product = require('../models/Product');
const Category = require('../models/Category');
const Brand = require('../models/Brand');
const Company = require('../models/Company');
const CustomerUser = require('../models/CustomerUser');
const User = require('../models/User');
const HeaderMenuItem = require('../models/HeaderMenuItem');
const CarouselSlide = require('../models/CarouselSlide');

// Connect to local MongoDB
mongoose.connect('mongodb://localhost:27017/enerstore', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const exportData = async () => {
  try {
    console.log('🔄 Starting data export from local database...');
    
    // Create exports directory
    const exportsDir = path.join(__dirname, 'exports');
    if (!fs.existsSync(exportsDir)) {
      fs.mkdirSync(exportsDir);
    }

    // Export Products
    console.log('📦 Exporting products...');
    const products = await Product.find({});
    fs.writeFileSync(
      path.join(exportsDir, 'products.json'),
      JSON.stringify(products, null, 2)
    );
    console.log(`✅ Exported ${products.length} products`);

    // Export Categories
    console.log('🏷️ Exporting categories...');
    const categories = await Category.find({});
    fs.writeFileSync(
      path.join(exportsDir, 'categories.json'),
      JSON.stringify(categories, null, 2)
    );
    console.log(`✅ Exported ${categories.length} categories`);

    // Export Brands
    console.log('🏭 Exporting brands...');
    const brands = await Brand.find({});
    fs.writeFileSync(
      path.join(exportsDir, 'brands.json'),
      JSON.stringify(brands, null, 2)
    );
    console.log(`✅ Exported ${brands.length} brands`);

    // Export Companies
    console.log('🏢 Exporting companies...');
    const companies = await Company.find({});
    fs.writeFileSync(
      path.join(exportsDir, 'companies.json'),
      JSON.stringify(companies, null, 2)
    );
    console.log(`✅ Exported ${companies.length} companies`);

    // Export Customer Users
    console.log('👥 Exporting customer users...');
    const customerUsers = await CustomerUser.find({});
    fs.writeFileSync(
      path.join(exportsDir, 'customerUsers.json'),
      JSON.stringify(customerUsers, null, 2)
    );
    console.log(`✅ Exported ${customerUsers.length} customer users`);

    // Export Admin Users
    console.log('👤 Exporting admin users...');
    const users = await User.find({});
    fs.writeFileSync(
      path.join(exportsDir, 'users.json'),
      JSON.stringify(users, null, 2)
    );
    console.log(`✅ Exported ${users.length} admin users`);

    // Export Header Menu Items
    console.log('📋 Exporting header menu items...');
    const headerMenuItems = await HeaderMenuItem.find({});
    fs.writeFileSync(
      path.join(exportsDir, 'headerMenuItems.json'),
      JSON.stringify(headerMenuItems, null, 2)
    );
    console.log(`✅ Exported ${headerMenuItems.length} header menu items`);

    // Export Carousel Slides
    console.log('🖼️ Exporting carousel slides...');
    const carouselSlides = await CarouselSlide.find({});
    fs.writeFileSync(
      path.join(exportsDir, 'carouselSlides.json'),
      JSON.stringify(carouselSlides, null, 2)
    );
    console.log(`✅ Exported ${carouselSlides.length} carousel slides`);

    console.log('\n🎉 Data export completed successfully!');
    console.log(`📁 Exports saved to: ${exportsDir}`);
    
    // Display summary
    console.log('\n📊 Export Summary:');
    console.log(`Products: ${products.length}`);
    console.log(`Categories: ${categories.length}`);
    console.log(`Brands: ${brands.length}`);
    console.log(`Companies: ${companies.length}`);
    console.log(`Customer Users: ${customerUsers.length}`);
    console.log(`Admin Users: ${users.length}`);
    console.log(`Header Menu Items: ${headerMenuItems.length}`);
    console.log(`Carousel Slides: ${carouselSlides.length}`);

  } catch (error) {
    console.error('❌ Export failed:', error);
  } finally {
    mongoose.connection.close();
    console.log('🔌 Disconnected from local database');
  }
};

// Run the export
exportData(); 