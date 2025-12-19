const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// In-memory storage
let users = [];
let plans = [
  { _id: '1', operator: 'All', amount: 99, validity: '28 days', data: '1.5GB/day', description: 'Basic Plan' },
  { _id: '2', operator: 'All', amount: 199, validity: '56 days', data: '2GB/day', description: 'Popular Plan' },
  { _id: '3', operator: 'All', amount: 399, validity: '84 days', data: '3GB/day', description: 'Premium Plan' }
];

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is working!' });
});

// Admin login
app.post('/api/admin/login', (req, res) => {
  res.json({ token: 'admin-token', message: 'Login successful' });
});

// User registration
app.post('/api/auth/register', (req, res) => {
  try {
    const { name, email, phoneNumber, password } = req.body;
    
    // Check if user exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    
    // Create user
    const user = {
      _id: Date.now().toString(),
      name,
      email,
      phoneNumber,
      password,
      role: 'user'
    };
    users.push(user);
    
    console.log('User registered:', { name, email, phoneNumber });
    console.log('Total users:', users.length);
    
    res.status(201).json({ 
      message: 'Registration successful',
      user: { id: user._id, name, email, phoneNumber }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({ message: error.message });
  }
});

// User login
app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = users.find(u => u.email === email && u.password === password);
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

// Plans
app.get('/api/plans', (req, res) => {
  res.json(plans);
});

app.get('/api/admin/plans', (req, res) => {
  res.json(plans);
});

app.post('/api/admin/plans', (req, res) => {
  const plan = { _id: Date.now().toString(), ...req.body };
  plans.push(plan);
  console.log('Plan created:', plan);
  res.json(plan);
});

app.put('/api/admin/plans/:id', (req, res) => {
  const index = plans.findIndex(p => p._id === req.params.id);
  if (index !== -1) {
    plans[index] = { ...plans[index], ...req.body };
    res.json(plans[index]);
  } else {
    res.status(404).json({ message: 'Plan not found' });
  }
});

app.delete('/api/admin/plans/:id', (req, res) => {
  plans = plans.filter(p => p._id !== req.params.id);
  res.json({ message: 'Plan deleted' });
});

// Users for admin
app.get('/api/admin/users', (req, res) => {
  res.json(users.map(u => ({ ...u, password: undefined })));
});

app.delete('/api/admin/users/:id', (req, res) => {
  users = users.filter(u => u._id !== req.params.id);
  res.json({ message: 'User deleted' });
});

app.listen(8000, () => {
  console.log('Simple server running on port 8000');
  console.log('No MongoDB - using in-memory storage');
});