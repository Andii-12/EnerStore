const express = require('express');
const router = express.Router();
const CarouselSlide = require('../models/CarouselSlide');

// Get all slides
router.get('/', async (req, res) => {
  const slides = await CarouselSlide.find();
  res.json(slides);
});

// Add a new slide
router.post('/', async (req, res) => {
  const slide = new CarouselSlide(req.body);
  await slide.save();
  res.json(slide);
});

// Delete a slide by id
router.delete('/:id', async (req, res) => {
  await CarouselSlide.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// Edit a slide by id
router.put('/:id', async (req, res) => {
  const slide = await CarouselSlide.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(slide);
});

module.exports = router; 