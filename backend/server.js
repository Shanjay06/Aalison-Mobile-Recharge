require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const User = require('./models/User');
const Plan = require('./models/Plan');

const app = express();

// Connect Database
connectDB();

// Middleware
app.use(cors({ 
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true
}));
app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Aalison Recharge API Server is running!', version: '1.0.0' });
});

// Test admin route
app.get('/api/admin/test', (req, res) => {
  res.json({ message: 'Admin API is working!' });
});

// Routes - load individually to catch errors
try {
  app.use('/api/auth', require('./routes/auth'));
  console.log('Auth routes loaded');
} catch (error) {
  console.error('Error loading auth routes:', error);
}

try {
  app.use('/api/users', require('./routes/users'));
  console.log('User routes loaded');
} catch (error) {
  console.error('Error loading user routes:', error);
}

try {
  app.use('/api/transactions', require('./routes/transactions'));
  console.log('Transaction routes loaded');
} catch (error) {
  console.error('Error loading transaction routes:', error);
}

try {
  app.use('/api/plans', require('./routes/plans'));
  console.log('Plan routes loaded');
} catch (error) {
  console.error('Error loading plan routes:', error);
}

try {
  app.use('/api/admin', require('./routes/admin'));
  console.log('Admin routes loaded');
} catch (error) {
  console.error('Error loading admin routes:', error);
}

// Debug route
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!', timestamp: new Date() });
});

// Initialize default data
const initializeData = async () => {
  try {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const adminExists = await User.findOne({ role: 'admin' });
    if (!adminExists) {
      await User.create({
        name: 'Administrator',
        email: 'admin@aalison.com',
        password: 'admin123',
        role: 'admin'
      });
      console.log('Default admin created');
    }

    const plansCount = await Plan.countDocuments();
    if (plansCount === 0) {
      await Plan.insertMany([
        { operator: 'All', amount: 99, validity: '28 days', data: '1.5GB/day', description: 'Basic Plan' },
        { operator: 'All', amount: 199, validity: '56 days', data: '2GB/day', description: 'Popular Plan' },
        { operator: 'All', amount: 399, validity: '84 days', data: '3GB/day', description: 'Premium Plan' },
        { operator: 'All', amount: 599, validity: '365 days', data: '2GB/day', description: 'Annual Plan' }
      ]);
      console.log('Default plans created');
    }
    console.log('Database ready!');
  } catch (error) {
    console.error('Database initialization failed:', error.message);
  }
};

setTimeout(initializeData, 3000);

const PORT = process.env.PORT || 7000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Waiting for MongoDB connection...');
});