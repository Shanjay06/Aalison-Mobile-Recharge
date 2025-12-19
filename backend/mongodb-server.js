require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB with better settings
mongoose.connect('mongodb+srv://Shanjay33:Shanjay%4033@cluster0.hlxleaa.mongodb.net/mobile-recharge', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})
.then(() => console.log('MongoDB Connected Successfully'))
.catch(err => {
  console.error('MongoDB connection failed:', err.message);
  console.log('Server will continue without MongoDB');
});

// User Schema
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  phoneNumber: String,
  password: String,
  role: { type: String, default: 'user' }
}, { timestamps: true });

// Plan Schema  
const planSchema = new mongoose.Schema({
  operator: { type: String, default: 'All' },
  amount: Number,
  validity: String,
  data: String,
  description: String
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
const Plan = mongoose.model('Plan', planSchema);

// Routes
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server working!', mongodb: mongoose.connection.readyState === 1 });
});

// User registration
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, phoneNumber, password } = req.body;
    console.log('Registration attempt:', { name, email, phoneNumber });
    
    const user = new User({ name, email, phoneNumber, password });
    const savedUser = await user.save();
    
    console.log('User saved to MongoDB:', savedUser._id);
    res.status(201).json({ 
      message: 'Registration successful - saved to MongoDB!',
      user: { id: savedUser._id, name, email, phoneNumber }
    });
  } catch (error) {
    console.error('Registration error:', error);
    if (error.code === 11000) {
      res.status(400).json({ message: 'Email already exists' });
    } else {
      res.status(400).json({ message: 'Registration failed: ' + error.message });
    }
  }
});

// User login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
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
    res.status(400).json({ message: error.message });
  }
});

// Admin login
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;
  if (password === 'admin123') {
    res.json({ token: 'admin-token', message: 'Admin login successful' });
  } else {
    res.status(401).json({ message: 'Invalid admin password' });
  }
});

// Plans
app.get('/api/plans', async (req, res) => {
  try {
    const plans = await Plan.find();
    res.json(plans);
  } catch (error) {
    res.json([]);
  }
});

app.get('/api/admin/plans', async (req, res) => {
  try {
    const plans = await Plan.find();
    res.json(plans);
  } catch (error) {
    res.json([]);
  }
});

app.post('/api/admin/plans', async (req, res) => {
  try {
    const plan = new Plan(req.body);
    const savedPlan = await plan.save();
    console.log('Plan saved to MongoDB:', savedPlan);
    res.json(savedPlan);
  } catch (error) {
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

// Users for admin
app.get('/api/admin/users', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.json([]);
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

app.listen(8000, () => {
  console.log('MongoDB server running on port 8000');
});