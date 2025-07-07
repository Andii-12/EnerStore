const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Brand = require('../models/Brand');
const mongoose = require('mongoose');

// Get all products (with optional category filter and sorting)
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.category) {
      const categories = req.query.category.split(',');
      // Match by category name only
      filter.$or = [
        { categories: { $in: categories } },
        { category: { $in: categories } }
      ];
    }
    if (req.query.brand) {
      filter.brand = req.query.brand;
    }
    if (req.query.company) {
      filter.company = req.query.company;
    }
    let sort = { createdAt: -1 };
    if (req.query.sort === 'price-asc') sort = { price: 1 };
    if (req.query.sort === 'price-desc') sort = { price: -1 };
    if (req.query.sort === 'newest') sort = { createdAt: -1 };
    const products = await Product.find(filter).populate('company', 'name logo').populate('brand', 'name logo').sort(sort);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new product
router.post('/', async (req, res) => {
  try {
    const { name, price, description, specifications, thumbnail, images, categories, companyId, soldCount, piece, brand } = req.body;
    let brandName = brand;
    if (brand && mongoose.Types.ObjectId.isValid(brand)) {
      const brandDoc = await Brand.findById(brand);
      if (brandDoc) brandName = brandDoc.name;
    }
    const product = new Product({
      name,
      price,
      description,
      specifications,
      image: thumbnail || '', // Always set image field for frontend
      thumbnail,
      images,
      categories,
      company: companyId,
      soldCount: soldCount || 0,
      piece: piece || 0,
      brand: brandName || ''
    });
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Increment soldCount for a product
router.post('/sell', async (req, res) => {
  const { productId, quantity } = req.body;
  if (!productId || !quantity) return res.status(400).json({ error: 'productId and quantity required' });
  try {
    const product = await Product.findByIdAndUpdate(
      productId,
      { $inc: { soldCount: quantity } },
      { new: true }
    );
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a product by id
router.put('/:id', async (req, res) => {
  try {
    const { name, price, description, specifications, thumbnail, images, categories, companyId, saleEnd, originalPrice, piece, brand } = req.body;
    const update = {
      name,
      price,
      description,
      specifications,
      image: thumbnail || '', // Always set image field for frontend
      thumbnail,
      images,
      categories,
    };
    let brandNameUpdate = brand;
    if (brand && mongoose.Types.ObjectId.isValid(brand)) {
      const brandDoc = await Brand.findById(brand);
      if (brandDoc) brandNameUpdate = brandDoc.name;
    }
    if (brand !== undefined) update.brand = brandNameUpdate || '';
    if (companyId) update.company = companyId;
    if (saleEnd !== undefined) update.saleEnd = saleEnd;
    if (originalPrice !== undefined) update.originalPrice = originalPrice;
    if (piece !== undefined) update.piece = piece;
    const product = await Product.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a product by id
router.delete('/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get products for a specific company
router.get('/company/:companyId', async (req, res) => {
  try {
    const products = await Product.find({ company: req.params.companyId }).populate('brand', 'name logo');
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a single product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('company', 'name logo address contact email')
      .populate('brand', 'name logo description');
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 