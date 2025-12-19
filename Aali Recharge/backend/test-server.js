require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

// Connect to MongoDB with proper configuration
const connectDB = async () => {
  try {
    mongoose.set('bufferCommands', false); // Disable buffering
    
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      minPoolSize: 5,
    });
    
    // Wait for connection to be ready
    await new Promise((resolve) => {
      if (mongoose.connection.readyState === 1) {
        resolve();
      } else {
        mongoose.connection.once('open', resolve);
      }
    });
    
    console.log('✅ MongoDB Connected and Ready');
    return true;
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    throw error;
  }
};

// Connection state middleware
const requireDB = (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ 
      message: 'Database not ready. Please try again.' 
    });
  }
  next();
};

// Plan Schema
const planSchema = new mongoose.Schema({
  operator: { type: String, default: 'All' },
  amount: { type: Number, required: true },
  validity: { type: String, required: true },
  data: { type: String, required: true },
  description: { type: String, required: true }
}, { timestamps: true });

const Plan = mongoose.model('Plan', planSchema);

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

app.use(cors());
app.use(express.json());

// Apply DB check to all database routes
app.use('/api/auth', requireDB);
app.use('/api/admin/users', requireDB);
app.use('/api/admin/plans', requireDB);
app.use('/api/plans', requireDB);

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is working!' });
});

// Admin login
app.post('/api/admin/login', (req, res) => {
  res.json({ token: 'test-token', message: 'Login successful' });
});

// User registration
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, phoneNumber, password } = req.body;
    
    // Check if DB is ready
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ message: 'Database not ready' });
    }
    
    const user = new User({ name, email, phoneNumber, password });
    const savedUser = await user.save();
    
    console.log('User registered:', { name, email, phoneNumber });
    res.status(201).json({ 
      message: 'Registration successful - saved to MongoDB!',
      user: { id: savedUser._id, name, email, phoneNumber }
    });
  } catch (error) {
    console.error('Registration error:', error);
    if (error.code === 11000) {
      res.status(400).json({ message: 'Email already exists' });
    } else {
      res.status(400).json({ message: error.message });
    }
  }
});

// User login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check if DB is ready
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ message: 'Database not ready' });
    }
    
    const user = await User.findOne({ email, password });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    res.json({ 
      message: 'Login successful',
      token: 'user-token-' + user._id,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(400).json({ message: error.message });
  }
});

// Get users for admin
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

// Admin plans
app.post('/api/admin/plans', async (req, res) => {
  try {
    console.log('Received plan:', req.body);
    
    // Check if DB is ready
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ message: 'Database not ready' });
    }
    
    const plan = new Plan(req.body);
    const savedPlan = await plan.save();
    console.log('Plan saved to MongoDB:', savedPlan);
    res.json(savedPlan);
  } catch (error) {
    console.error('Error saving plan:', error);
    res.status(400).json({ message: error.message });
  }
});

app.get('/api/admin/plans', async (req, res) => {
  try {
    // Check if DB is ready
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ message: 'Database not ready' });
    }
    
    const plans = await Plan.find();
    res.json(plans);
  } catch (error) {
    console.error('Error fetching plans:', error);
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/plans', async (req, res) => {
  try {
    // Check if DB is ready
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ message: 'Database not ready' });
    }
    
    const plans = await Plan.find();
    res.json(plans);
  } catch (error) {
    console.error('Error fetching plans:', error);
    res.status(500).json({ message: error.message });
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

// Start server only after DB connection
const startServer = async () => {
  try {
    console.log('🚀 Starting server...');
    await connectDB();
    
    app.listen(8000, () => {
      console.log('🎉 Test server running on port 8000');
      console.log('✅ Database ready for operations');
    });
  } catch (error) {
    console.error('💥 Server startup failed:', error.message);
    process.exit(1);
  }
};

startServer();