const express = require('express');
const router = express.Router();
const CustomerUser = require('../models/CustomerUser');

// Get all users
router.get('/', async (req, res) => {
  try {
    const users = await CustomerUser.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, phone, password, address } = req.body;
    
    // Check if user already exists
    const existingUser = await CustomerUser.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Энэ имэйл хаяг бүртгэлтэй байна.' });
    }

    // Create new user
    const user = new CustomerUser({
      firstName,
      lastName,
      email,
      phone,
      password, // In production, hash this password!
      address
    });
    
    await user.save();
    
    // Return user without password
    const userResponse = user.toObject();
    delete userResponse.password;
    
    res.status(201).json(userResponse);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user by email
    const user = await CustomerUser.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Имэйл эсвэл нууц үг буруу байна.' });
    }
    
    // Check password (in production, use bcrypt to compare hashed passwords)
    if (user.password !== password) {
      return res.status(400).json({ error: 'Имэйл эсвэл нууц үг буруу байна.' });
    }
    
    // Update last login
    user.lastLogin = new Date();
    await user.save();
    
    // Return user without password
    const userResponse = user.toObject();
    delete userResponse.password;
    
    res.json(userResponse);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Change password
router.put('/:id/change-password', async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await CustomerUser.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ error: 'Хэрэглэгч олдсонгүй.' });
    }
    
    // Check current password (in production, use bcrypt to compare hashed passwords)
    if (user.password !== currentPassword) {
      return res.status(400).json({ error: 'Одоогийн нууц үг буруу байна.' });
    }
    
    // Update password
    user.password = newPassword; // In production, hash this password!
    await user.save();
    
    res.json({ success: true, message: 'Нууц үг амжилттай өөрчлөгдлөө.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get user by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await CustomerUser.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'Хэрэглэгч олдсонгүй.' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update user
router.put('/:id', async (req, res) => {
  try {
    const { password, ...updateData } = req.body;
    const user = await CustomerUser.findByIdAndUpdate(req.params.id, updateData, { new: true }).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'Хэрэглэгч олдсонгүй.' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete user
router.delete('/:id', async (req, res) => {
  try {
    const user = await CustomerUser.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'Хэрэглэгч олдсонгүй.' });
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 