require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { createServer } = require('http');
const { Server } = require('socket.io');

// Routes
const authRoutes = require('./routes/auth');
const assetRoutes = require('./routes/assets');
const carRoutes = require('./routes/cars');
const estateRoutes = require('./routes/estates');
const subscriptionRoutes = require('./routes/subscriptions');
const renterRoutes = require('./routes/renters');
const rentalRoutes = require('./routes/rentals');

const app = express();
const server = createServer(app);

// Socket.io setup for real-time communication
const io = new Server(server, {
  cors: {
    origin: [
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      process.env.CLIENT_URL || 'http://localhost:3000'
    ],
    credentials: true,
    methods: ['GET', 'POST']
  }
});

// Store io instance in app for use in routes
app.set('io', io);

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Join vendor room for real-time updates
  socket.on('join_vendor_room', (vendorId) => {
    if (vendorId) {
      socket.join(`vendor_${vendorId}`);
      console.log(`Socket ${socket.id} joined vendor room: vendor_${vendorId}`);
    }
  });

  // Leave vendor room
  socket.on('leave_vendor_room', (vendorId) => {
    if (vendorId) {
      socket.leave(`vendor_${vendorId}`);
      console.log(`Socket ${socket.id} left vendor room: vendor_${vendorId}`);
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Database холболт
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/rental-management')
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    process.env.CLIENT_URL || 'http://localhost:3000'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/assets', assetRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/estates', estateRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/renters', renterRoutes);
app.use('/api/rentals', rentalRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Rental Asset Management API is running', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ success: false, error: 'Server error' });
});

// Server start
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Socket.io enabled for real-time updates`);
});