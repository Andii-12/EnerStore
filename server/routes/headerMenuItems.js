const express = require('express');
const router = express.Router();
const HeaderMenuItem = require('../models/HeaderMenuItem');

// Get all menu items (sorted by order)
router.get('/', async (req, res) => {
  const items = await HeaderMenuItem.find().sort({ order: 1 });
  res.json(items);
});

// Add menu item
router.post('/', async (req, res) => {
  const item = new HeaderMenuItem(req.body);
  await item.save();
  res.json(item);
});

// Delete menu item
router.delete('/:id', async (req, res) => {
  await HeaderMenuItem.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// Update menu item
router.put('/:id', async (req, res) => {
  const item = await HeaderMenuItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(item);
});

module.exports = router; 