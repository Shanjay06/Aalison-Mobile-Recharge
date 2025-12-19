const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

router.post('/signup', async (req, res) => {
  try {
    const { name, email, phoneNumber, password } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ success: false, message: 'Email already exists' });

    const user = await User.create({ name, email, phoneNumber, password });
    const token = generateToken(user._id);
    
    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      data: { user: { id: user._id, name, email, role: user.role }, token }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password, role = 'user' } = req.body;
    
    const user = await User.findOne({ email, role });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);
    res.json({
      success: true,
      message: 'Login successful',
      data: { user: { id: user._id, name: user.name, email, role: user.role }, token }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/me', auth, (req, res) => {
  res.json({ success: true, data: { user: req.user } });
});

module.exports = router;