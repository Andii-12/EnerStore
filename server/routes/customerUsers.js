const express = require('express');
const router = express.Router();
const CustomerUser = require('../models/CustomerUser');

// Get all users
router.get('/', async (req, res) => {
  const users = await CustomerUser.find();
  res.json(users);
});

// Add user
router.post('/', async (req, res) => {
  const user = new CustomerUser(req.body);
  await user.save();
  res.json(user);
});

// Delete user
router.delete('/:id', async (req, res) => {
  await CustomerUser.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// Update user
router.put('/:id', async (req, res) => {
  const user = await CustomerUser.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(user);
});

module.exports = router; 