const express = require('express');
const router = express.Router();
const Brand = require('../models/Brand');

// Get all brands
router.get('/', async (req, res) => {
  try {
    const brands = await Brand.find();
    res.json(brands);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new brand
router.post('/', async (req, res) => {
  try {
    const { name, logo, description } = req.body;
    const brand = new Brand({ name, logo, description });
    await brand.save();
    res.status(201).json(brand);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a brand
router.put('/:id', async (req, res) => {
  try {
    const { name, logo, description } = req.body;
    const brand = await Brand.findByIdAndUpdate(
      req.params.id,
      { name, logo, description },
      { new: true }
    );
    if (!brand) return res.status(404).json({ error: 'Brand not found' });
    res.json(brand);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a brand
router.delete('/:id', async (req, res) => {
  try {
    await Brand.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 