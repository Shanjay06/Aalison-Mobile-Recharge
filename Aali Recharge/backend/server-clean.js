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
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

// Debug middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Aalison Recharge API Server is running!', version: '1.0.0' });
});

// Simple admin login
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;
  if (password === 'admin123') {
    res.json({ token: 'admin-token-123', message: 'Admin login successful' });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// Plan routes
app.get('/api/plans', async (req, res) => {
  try {
    const plans = await Plan.find();
    res.json(plans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/admin/plans', async (req, res) => {
  try {
    const plans = await Plan.find();
    res.json(plans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/admin/plans', async (req, res) => {
  console.log('POST /api/admin/plans called with:', req.body);
  try {
    const plan = new Plan(req.body);
    await plan.save();
    console.log('Plan saved:', plan);
    res.status(201).json(plan);
  } catch (error) {
    console.log('Error saving plan:', error.message);
    res.status(400).json({ message: error.message });
  }
});

app.put('/api/admin/plans/:id', async (req, res) => {
  try {
    const plan = await Plan.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(plan);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete('/api/admin/plans/:id', async (req, res) => {
  try {
    await Plan.findByIdAndDelete(req.params.id);
    res.json({ message: 'Plan deleted' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// User routes
app.get('/api/admin/users', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete('/api/admin/users/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
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
  console.log('All routes loaded successfully');
});