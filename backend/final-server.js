require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true
}));
app.use(express.json());

// MongoDB Connection
let dbReady = false;

const connectDB = async () => {
  try {
    console.log('🔄 Connecting to MongoDB Atlas...');
    
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 45000,
    });
    
    // Wait for connection to be fully ready
    mongoose.connection.once('open', () => {
      dbReady = true;
      console.log('✅ MongoDB Atlas Connected and Ready');
    });
    
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB error:', err);
      dbReady = false;
    });
    
    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB disconnected');
      dbReady = false;
    });
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    throw error;
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

// DB Ready Check Middleware
const requireDB = (req, res, next) => {
  if (!dbReady || mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      message: 'Database not ready. Please try again in a moment.'
    });
  }
  next();
};

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'Aalison Recharge API Server',
    version: '1.0.0',
    database: dbReady ? 'connected' : 'connecting...'
  });
});

app.get('/api/test', (req, res) => {
  res.json({
    message: 'API Working!',
    database: dbReady,
    timestamp: new Date()
  });
});

// Auth Routes
app.post('/api/auth/register', requireDB, async (req, res) => {
  try {
    const { name, email, phoneNumber, password } = req.body;
    
    console.log('📝 Registration:', { name, email, phoneNumber });
    
    // Check existing user
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    
    // Create user
    const user = new User({ name, email, phoneNumber, password });
    const saved = await user.save();
    
    console.log('✅ User saved to MongoDB:', saved._id);
    
    res.status(201).json({
      message: 'Registration successful!',
      user: { id: saved._id, name, email, phoneNumber }
    });
    
  } catch (error) {
    console.error('❌ Registration error:', error);
    res.status(500).json({ message: 'Registration failed' });
  }
});

app.post('/api/auth/login', requireDB, async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log('🔐 Login attempt:', email);
    
    const user = await User.findOne({ email, password });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    console.log('✅ Login successful:', email);
    
    res.json({
      message: 'Login successful',
      token: 'user-token-' + user._id,
      user: { id: user._id, name: user.name, email: user.email }
    });
    
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ message: 'Login failed' });
  }
});

// Admin Routes
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;
  if (password === 'admin123') {
    console.log('✅ Admin login');
    res.json({ token: 'admin-token', message: 'Admin login successful' });
  } else {
    res.status(401).json({ message: 'Invalid admin password' });
  }
});

app.get('/api/admin/users', requireDB, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    console.error('❌ Error fetching users:', error);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

app.delete('/api/admin/users/:id', requireDB, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    console.log('✅ User deleted');
    res.json({ message: 'User deleted' });
  } catch (error) {
    console.error('❌ Error deleting user:', error);
    res.status(400).json({ message: 'Failed to delete user' });
  }
});

// Plan Routes
app.get('/api/plans', requireDB, async (req, res) => {
  try {
    const plans = await Plan.find();
    res.json(plans);
  } catch (error) {
    console.error('❌ Error fetching plans:', error);
    res.json([]);
  }
});

app.get('/api/admin/plans', requireDB, async (req, res) => {
  try {
    const plans = await Plan.find();
    res.json(plans);
  } catch (error) {
    console.error('❌ Error fetching plans:', error);
    res.json([]);
  }
});

app.post('/api/admin/plans', requireDB, async (req, res) => {
  try {
    console.log('📝 Creating plan:', req.body);
    
    const plan = new Plan(req.body);
    const saved = await plan.save();
    
    console.log('✅ Plan saved:', saved._id);
    res.json(saved);
    
  } catch (error) {
    console.error('❌ Error creating plan:', error);
    res.status(400).json({ message: 'Failed to create plan' });
  }
});

app.put('/api/admin/plans/:id', requireDB, async (req, res) => {
  try {
    const plan = await Plan.findByIdAndUpdate(req.params.id, req.body, { new: true });
    console.log('✅ Plan updated');
    res.json(plan);
  } catch (error) {
    console.error('❌ Error updating plan:', error);
    res.status(400).json({ message: 'Failed to update plan' });
  }
});

app.delete('/api/admin/plans/:id', requireDB, async (req, res) => {
  try {
    await Plan.findByIdAndDelete(req.params.id);
    console.log('✅ Plan deleted');
    res.json({ message: 'Plan deleted' });
  } catch (error) {
    console.error('❌ Error deleting plan:', error);
    res.status(400).json({ message: 'Failed to delete plan' });
  }
});

// Server Startup
const startServer = async () => {
  try {
    console.log('🚀 Starting Aalison Recharge Server...');
    
    // Connect to MongoDB first
    await connectDB();
    
    // Wait a moment for connection to stabilize
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Start server
    const PORT = process.env.PORT || 8000;
    app.listen(PORT, () => {
      console.log(`🎉 Server running on port ${PORT}`);
      console.log('🌐 API: http://localhost:' + PORT);
      console.log('✅ Ready for signup/login');
    });
    
  } catch (error) {
    console.error('💥 Server startup failed:', error.message);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('🛑 Shutting down...');
  mongoose.connection.close();
  process.exit(0);
});

// Start the server
startServer();