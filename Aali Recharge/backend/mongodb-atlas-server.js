require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://127.0.0.1:5173', 'http://127.0.0.1:5174'],
  credentials: true
}));
app.use(express.json());

// MongoDB connection with retry logic
let isConnected = false;

const connectWithRetry = async () => {
  try {
    console.log('🔄 Connecting to MongoDB Atlas...');
    
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 75000,
    });
    
    isConnected = true;
    console.log('✅ MongoDB Atlas Connected Successfully');
    return true;
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    console.log('🔄 Retrying in 5 seconds...');
    setTimeout(connectWithRetry, 5000);
    return false;
  }
};

// Schemas
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' }
}, { timestamps: true });

const planSchema = new mongoose.Schema({
  operator: { type: String, default: 'All' },
  amount: { type: Number, required: true },
  validity: { type: String, required: true },
  data: { type: String, required: true },
  description: { type: String, required: true }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
const Plan = mongoose.model('Plan', planSchema);

// Middleware to check DB connection
const checkDB = (req, res, next) => {
  if (!isConnected || mongoose.connection.readyState !== 1) {
    return res.status(503).json({ 
      message: 'Database connection unavailable. Please try again in a moment.' 
    });
  }
  next();
};

// Routes
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Server working!', 
    database: isConnected ? 'connected' : 'disconnected' 
  });
});

// User registration
app.post('/api/auth/register', checkDB, async (req, res) => {
  try {
    const { name, email, phoneNumber, password } = req.body;
    console.log('📝 Registration attempt:', { name, email, phoneNumber });
    
    // Check if user exists
    const existingUser = await User.findOne({ email }).maxTimeMS(10000);
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    
    // Create user
    const user = new User({ name, email, phoneNumber, password });
    const savedUser = await user.save();
    
    console.log('✅ User saved to MongoDB Atlas:', savedUser._id);
    res.status(201).json({ 
      message: 'Registration successful - saved to MongoDB Atlas!',
      user: { id: savedUser._id, name, email, phoneNumber }
    });
  } catch (error) {
    console.error('❌ Registration error:', error);
    if (error.code === 11000) {
      res.status(400).json({ message: 'Email already exists' });
    } else {
      res.status(500).json({ message: 'Registration failed. Please try again.' });
    }
  }
});

// User login
app.post('/api/auth/login', checkDB, async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('🔐 Login attempt:', email);
    
    const user = await User.findOne({ email, password }).maxTimeMS(10000);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    console.log('✅ User logged in:', user.email);
    res.json({ 
      message: 'Login successful',
      token: 'user-token-' + user._id,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ message: 'Login failed. Please try again.' });
  }
});

// Admin login
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;
  if (password === 'admin123') {
    console.log('✅ Admin logged in');
    res.json({ token: 'admin-token', message: 'Admin login successful' });
  } else {
    res.status(401).json({ message: 'Invalid admin password' });
  }
});

// Plans
app.get('/api/plans', checkDB, async (req, res) => {
  try {
    const plans = await Plan.find().maxTimeMS(10000);
    res.json(plans);
  } catch (error) {
    console.error('❌ Error fetching plans:', error);
    res.status(500).json({ message: 'Failed to fetch plans' });
  }
});

app.get('/api/admin/plans', checkDB, async (req, res) => {
  try {
    const plans = await Plan.find().maxTimeMS(10000);
    res.json(plans);
  } catch (error) {
    console.error('❌ Error fetching plans:', error);
    res.status(500).json({ message: 'Failed to fetch plans' });
  }
});

app.post('/api/admin/plans', checkDB, async (req, res) => {
  try {
    console.log('📝 Creating plan:', req.body);
    const plan = new Plan(req.body);
    const savedPlan = await plan.save();
    
    console.log('✅ Plan saved to MongoDB Atlas:', savedPlan._id);
    res.json(savedPlan);
  } catch (error) {
    console.error('❌ Error creating plan:', error);
    res.status(400).json({ message: 'Failed to create plan' });
  }
});

app.put('/api/admin/plans/:id', checkDB, async (req, res) => {
  try {
    const plan = await Plan.findByIdAndUpdate(req.params.id, req.body, { new: true });
    console.log('✅ Plan updated:', plan._id);
    res.json(plan);
  } catch (error) {
    console.error('❌ Error updating plan:', error);
    res.status(400).json({ message: 'Failed to update plan' });
  }
});

app.delete('/api/admin/plans/:id', checkDB, async (req, res) => {
  try {
    await Plan.findByIdAndDelete(req.params.id);
    console.log('✅ Plan deleted');
    res.json({ message: 'Plan deleted' });
  } catch (error) {
    console.error('❌ Error deleting plan:', error);
    res.status(400).json({ message: 'Failed to delete plan' });
  }
});

// Users for admin
app.get('/api/admin/users', checkDB, async (req, res) => {
  try {
    const users = await User.find().select('-password').maxTimeMS(10000);
    res.json(users);
  } catch (error) {
    console.error('❌ Error fetching users:', error);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

app.delete('/api/admin/users/:id', checkDB, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    console.log('✅ User deleted');
    res.json({ message: 'User deleted' });
  } catch (error) {
    console.error('❌ Error deleting user:', error);
    res.status(400).json({ message: 'Failed to delete user' });
  }
});

// Start server
const startServer = async () => {
  console.log('🚀 Starting MongoDB Atlas Server...');
  
  // Connect to MongoDB first
  await connectWithRetry();
  
  app.listen(8000, () => {
    console.log('🎉 Server running on port 8000');
    console.log('🌐 Ready for signup/login with MongoDB Atlas');
  });
};

startServer();