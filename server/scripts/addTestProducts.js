const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const Product = require('../models/Product');
const Category = require('../models/Category');
const Company = require('../models/Company');
const Brand = require('../models/Brand');

// Connect to MongoDB
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/enerstore';
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

async function addTestProducts() {
  try {
    console.log('🔧 Adding test products...');
    
    // First, let's check what categories exist
    const categories = await Category.find({});
    console.log('🏷️ Existing categories:', categories.map(c => c.name));
    
    // Check what companies exist
    const companies = await Company.find({});
    console.log('🏢 Existing companies:', companies.map(c => c.name));
    
    // Check what brands exist
    const brands = await Brand.find({});
    console.log('🏭 Existing brands:', brands.map(b => b.name));
    
    if (categories.length === 0) {
      console.log('❌ No categories found. Please create categories first.');
      return;
    }
    
    if (companies.length === 0) {
      console.log('❌ No companies found. Please create companies first.');
      return;
    }
    
    // Create test products with proper category associations
    const testProducts = [
      {
        name: 'Дотор камер / 4MP 2.8mm Turret Camera POE /Colorvu/ UNIVIEW',
        description: 'Дотор хэрэглээний 4MP камер',
        specifications: 'Үзүүлэлт\nЗориулалт: Дотор\nНягтрал: 4 мегапиксель',
        price: 250000,
        image: 'https://via.placeholder.com/300x200?text=Indoor+Camera',
        categories: ['Дотор камер'],
        category: 'Дотор камер',
        company: companies[0]._id,
        brand: 'UNIVIEW',
        piece: 10
      },
      {
        name: 'Гадаа камер / 2MP 2.8MM HD Wifi Bullet Network Camera UNIVIEW',
        description: 'Гадаа хэрэглээний 2MP камер',
        specifications: 'Үзүүлэлт\nЗориулалт: Гадаа\nНягтрал: 2 мегапиксель',
        price: 180000,
        image: 'https://via.placeholder.com/300x200?text=Outdoor+Camera',
        categories: ['Гадна камер'],
        category: 'Гадна камер',
        company: companies[0]._id,
        brand: 'UNIVIEW',
        piece: 5
      },
      {
        name: 'Сүлжээний кабел CAT5e UTP',
        description: 'Сүлжээний холболтын кабел',
        specifications: 'Урт: 305.0 m (1000 ft)/carton UTP CAT6',
        price: 50000,
        image: 'https://via.placeholder.com/300x200?text=Network+Cable',
        categories: ['Сүлжээний кабел'],
        category: 'Сүлжээний кабел',
        company: companies[0]._id,
        brand: 'Generic',
        piece: 20
      }
    ];
    
    // Add products
    for (const productData of testProducts) {
      const product = new Product(productData);
      await product.save();
      console.log(`✅ Added product: ${product.name}`);
    }
    
    console.log('🎉 Test products added successfully!');
    
  } catch (error) {
    console.error('❌ Error adding test products:', error);
  } finally {
    mongoose.connection.close();
  }
}

// Run the script
addTestProducts();
