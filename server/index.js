const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server, { cors: { origin: '*' } });

let viewerCount = 0;
io.on('connection', (socket) => {
  viewerCount++;
  io.emit('viewerCount', viewerCount);
  socket.on('disconnect', () => {
    viewerCount = Math.max(0, viewerCount - 1);
    io.emit('viewerCount', viewerCount);
  });
});

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/enerstore', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Test route
app.get('/', (req, res) => {
  res.send('API Running');
});

const productRoutes = require('./routes/products');
app.use('/api/products', productRoutes);

const categoryRoutes = require('./routes/categories');
app.use('/api/categories', categoryRoutes);

const adminRoutes = require('./routes/admin');
app.use('/api/admin', adminRoutes);

const companyRoutes = require('./routes/companies');
app.use('/api/companies', companyRoutes);

const customerUserRoutes = require('./routes/customerUsers');
app.use('/api/customer-users', customerUserRoutes);

const headerMenuItemRoutes = require('./routes/headerMenuItems');
app.use('/api/header-menu-items', headerMenuItemRoutes);

const carouselRoutes = require('./routes/carousel');
app.use('/api/carousel', carouselRoutes);

const brandRoutes = require('./routes/brands');
app.use('/api/brands', brandRoutes);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server started on port ${PORT}`)); 