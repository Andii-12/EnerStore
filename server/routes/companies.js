const express = require('express');
const router = express.Router();
const Company = require('../models/Company');

// Get all companies
router.get('/', async (req, res) => {
  const companies = await Company.find();
  res.json(companies);
});

// Add company
router.post('/', async (req, res) => {
  const company = new Company(req.body);
  await company.save();
  res.json(company);
});

// Delete company
router.delete('/:id', async (req, res) => {
  await Company.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// Update company
router.put('/:id', async (req, res) => {
  const company = await Company.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(company);
});

// Company login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
  const company = await Company.findOne({ email, password });
  if (!company) return res.status(401).json({ error: 'Invalid credentials' });
  res.json({ type: 'company', company });
});

module.exports = router; 