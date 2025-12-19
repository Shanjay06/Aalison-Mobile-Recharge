const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// File-based storage (simulates database)
const dataFile = path.join(__dirname, 'data.json');

// Initialize data file
if (!fs.existsSync(dataFile)) {
  fs.writeFileSync(dataFile, JSON.stringify({ users: [], plans: [] }));
}

function readData() {
  return JSON.parse(fs.readFileSync(dataFile, 'utf8'));
}

function writeData(data) {
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
}

// Routes
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server working with file storage!' });
});

// User registration
app.post('/api/auth/register', (req, res) => {
  try {
    const { name, email, phoneNumber, password } = req.body;
    const data = readData();
    
    // Check if user exists
    const existingUser = data.users.find(u => u.email === email);
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
      role: 'user',
      createdAt: new Date()
    };
    
    data.users.push(user);
    writeData(data);
    
    console.log('User registered and saved to file:', { name, email, phoneNumber });
    res.status(201).json({ 
      message: 'Registration successful - saved to database!',
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
    const data = readData();
    const user = data.users.find(u => u.email === email && u.password === password);
    
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
app.get('/api/plans', (req, res) => {
  const data = readData();
  res.json(data.plans);
});

app.get('/api/admin/plans', (req, res) => {
  const data = readData();
  res.json(data.plans);
});

app.post('/api/admin/plans', (req, res) => {
  try {
    const data = readData();
    const plan = { _id: Date.now().toString(), ...req.body, createdAt: new Date() };
    data.plans.push(plan);
    writeData(data);
    
    console.log('Plan saved to file:', plan);
    res.json(plan);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.put('/api/admin/plans/:id', (req, res) => {
  try {
    const data = readData();
    const index = data.plans.findIndex(p => p._id === req.params.id);
    if (index !== -1) {
      data.plans[index] = { ...data.plans[index], ...req.body };
      writeData(data);
      res.json(data.plans[index]);
    } else {
      res.status(404).json({ message: 'Plan not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete('/api/admin/plans/:id', (req, res) => {
  try {
    const data = readData();
    data.plans = data.plans.filter(p => p._id !== req.params.id);
    writeData(data);
    res.json({ message: 'Plan deleted' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Users for admin
app.get('/api/admin/users', (req, res) => {
  const data = readData();
  const users = data.users.map(u => ({ ...u, password: undefined }));
  res.json(users);
});

app.delete('/api/admin/users/:id', (req, res) => {
  try {
    const data = readData();
    data.users = data.users.filter(u => u._id !== req.params.id);
    writeData(data);
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.listen(8000, () => {
  console.log('Working server running on port 8000');
  console.log('Using file-based storage (data.json)');
});