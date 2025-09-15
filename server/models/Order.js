const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  productName: {
    type: String,
    required: true
  },
  productImage: {
    type: String,
    default: ''
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0
  }
});

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true,
    required: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CustomerUser',
    required: true
  },
  customerInfo: {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    postalCode: {
      type: String,
      default: ''
    }
  },
  items: [orderItemSchema],
  subtotal: {
    type: Number,
    required: true,
    min: 0
  },
  shippingCost: {
    type: Number,
    default: 0,
    min: 0
  },
  tax: {
    type: Number,
    default: 0,
    min: 0
  },
  total: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'bank_transfer', 'online'],
    default: 'cash'
  },
  notes: {
    type: String,
    default: ''
  },
  adminNotes: {
    type: String,
    default: ''
  },
  shippingInfo: {
    trackingNumber: {
      type: String,
      default: ''
    },
    carrier: {
      type: String,
      default: ''
    },
    estimatedDelivery: {
      type: Date
    },
    actualDelivery: {
      type: Date
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
orderSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Generate order number before saving
orderSchema.pre('save', async function(next) {
  if (this.isNew && !this.orderNumber) {
    const count = await mongoose.model('Order').countDocuments();
    this.orderNumber = `ORD-${Date.now()}-${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

// Virtual for order status display
orderSchema.virtual('statusDisplay').get(function() {
  const statusMap = {
    pending: 'Хүлээгдэж буй',
    confirmed: 'Баталгаажсан',
    processing: 'Бэлтгэгдэж буй',
    shipped: 'Хүргэгдсэн',
    delivered: 'Хүргэгдсэн',
    cancelled: 'Цуцлагдсан',
    refunded: 'Буцаан олгосон'
  };
  return statusMap[this.status] || this.status;
});

// Virtual for payment status display
orderSchema.virtual('paymentStatusDisplay').get(function() {
  const statusMap = {
    pending: 'Хүлээгдэж буй',
    paid: 'Төлбөр төлөгдсөн',
    failed: 'Төлбөр амжилтгүй',
    refunded: 'Буцаан олгосон'
  };
  return statusMap[this.paymentStatus] || this.paymentStatus;
});

module.exports = mongoose.model('Order', orderSchema);
