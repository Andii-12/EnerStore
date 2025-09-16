const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const CustomerUser = require('../models/CustomerUser');

// Get all orders (with optional filtering and sorting)
router.get('/', async (req, res) => {
  try {
    const filter = {};
    
    // Filter by status
    if (req.query.status) {
      filter.status = req.query.status;
    }
    
    // Filter by payment status
    if (req.query.paymentStatus) {
      filter.paymentStatus = req.query.paymentStatus;
    }
    
    // Filter by date range
    if (req.query.startDate || req.query.endDate) {
      filter.createdAt = {};
      if (req.query.startDate) {
        filter.createdAt.$gte = new Date(req.query.startDate);
      }
      if (req.query.endDate) {
        filter.createdAt.$lte = new Date(req.query.endDate);
      }
    }
    
    // Filter by customer
    if (req.query.customer) {
      filter.customer = req.query.customer;
    }
    
    // Filter by order number
    if (req.query.orderNumber) {
      filter.orderNumber = { $regex: req.query.orderNumber, $options: 'i' };
    }
    
    // Sorting
    let sort = { createdAt: -1 }; // Default: newest first
    if (req.query.sort === 'oldest') sort = { createdAt: 1 };
    if (req.query.sort === 'total-asc') sort = { total: 1 };
    if (req.query.sort === 'total-desc') sort = { total: -1 };
    if (req.query.sort === 'status') sort = { status: 1 };
    
    const orders = await Order.find(filter)
      .populate('customer', 'name email phone')
      .populate('items.product', 'name image price')
      .sort(sort);
    
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a single order by ID
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('customer', 'name email phone address')
      .populate('items.product', 'name image price description');
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new order
router.post('/', async (req, res) => {
  try {
    console.log('📦 Order creation request received:', JSON.stringify(req.body, null, 2));
    
    const {
      orderNumber,
      customer,
      customerInfo,
      items,
      subtotal,
      shippingCost = 0,
      tax = 0,
      paymentMethod = 'cash',
      notes = '',
      adminNotes = ''
    } = req.body;
    
    // Validate required fields
    if (!orderNumber) {
      return res.status(400).json({ error: 'Order number is required' });
    }
    
    // Check if order number already exists
    const existingOrder = await Order.findOne({ orderNumber });
    if (existingOrder) {
      console.log('❌ Order number already exists:', orderNumber);
      return res.status(400).json({ error: 'Order number already exists. Please try again.' });
    }
    
    if (!customer) {
      return res.status(400).json({ error: 'Customer ID is required' });
    }
    
    // Validate customer exists
    console.log('🔍 Looking for customer with ID:', customer);
    const customerExists = await CustomerUser.findById(customer);
    if (!customerExists) {
      console.log('❌ Customer not found with ID:', customer);
      return res.status(400).json({ error: 'Customer not found' });
    }
    console.log('✅ Customer found:', customerExists.firstName, customerExists.lastName);
    
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Items array is required and must not be empty' });
    }
    
    // Calculate total
    const total = subtotal + shippingCost + tax;
    
    // Validate items and calculate totals
    let calculatedSubtotal = 0;
    const validatedItems = [];
    
    for (const item of items) {
      console.log('🔍 Processing item:', item);
      
      if (!item.product) {
        return res.status(400).json({ error: 'Product ID is required for each item' });
      }
      
      if (!item.quantity || item.quantity < 1) {
        return res.status(400).json({ error: 'Valid quantity is required for each item' });
      }
      
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(400).json({ error: `Product ${item.product} not found` });
      }
      
      const itemTotal = product.price * item.quantity;
      calculatedSubtotal += itemTotal;
      
      validatedItems.push({
        product: product._id,
        productName: product.name,
        productImage: product.image || product.thumbnail || '',
        quantity: item.quantity,
        price: product.price,
        totalPrice: itemTotal
      });
    }
    
    // Verify subtotal matches
    if (Math.abs(calculatedSubtotal - subtotal) > 0.01) {
      return res.status(400).json({ 
        error: 'Subtotal mismatch', 
        calculated: calculatedSubtotal, 
        provided: subtotal 
      });
    }
    
    const order = new Order({
      orderNumber,
      customer,
      customerInfo,
      items: validatedItems,
      subtotal: calculatedSubtotal,
      shippingCost,
      tax,
      total: calculatedSubtotal + shippingCost + tax,
      paymentMethod,
      notes,
      adminNotes
    });
    
    console.log('💾 Saving order to database...');
    await order.save();
    console.log('✅ Order saved successfully with ID:', order._id);
    
    // Populate the response
    const populatedOrder = await Order.findById(order._id)
      .populate('customer', 'firstName lastName email phone')
      .populate('items.product', 'name image price');
    
    console.log('📤 Sending response to client');
    res.status(201).json(populatedOrder);
  } catch (err) {
    console.error('❌ Error creating order:', err);
    console.error('❌ Error stack:', err.stack);
    res.status(500).json({ 
      error: 'Internal server error while creating order',
      details: process.env.NODE_ENV === 'development' ? err.message : 'Please try again later'
    });
  }
});

// Update an order
router.put('/:id', async (req, res) => {
  try {
    const {
      status,
      paymentStatus,
      adminNotes,
      shippingInfo,
      notes
    } = req.body;
    
    const updateData = {};
    if (status) updateData.status = status;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;
    if (adminNotes !== undefined) updateData.adminNotes = adminNotes;
    if (shippingInfo) updateData.shippingInfo = shippingInfo;
    if (notes !== undefined) updateData.notes = notes;
    
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate('customer', 'name email phone')
     .populate('items.product', 'name image price');
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete an order
router.delete('/:id', async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get order statistics
router.get('/stats/overview', async (req, res) => {
  try {
    const stats = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: '$total' },
          averageOrderValue: { $avg: '$total' }
        }
      }
    ]);
    
    const statusStats = await Order.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);
    
    const paymentStats = await Order.aggregate([
      {
        $group: {
          _id: '$paymentStatus',
          count: { $sum: 1 }
        }
      }
    ]);
    
    const recentOrders = await Order.find()
      .populate('customer', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);
    
    res.json({
      overview: stats[0] || { totalOrders: 0, totalRevenue: 0, averageOrderValue: 0 },
      statusBreakdown: statusStats,
      paymentBreakdown: paymentStats,
      recentOrders
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
