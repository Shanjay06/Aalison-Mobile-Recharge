const express = require('express');
const Plan = require('../models/Plan');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const plans = await Plan.find({ isActive: true });
    res.json({ success: true, data: { plans } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/', auth, admin, async (req, res) => {
  try {
    const plan = await Plan.create(req.body);
    res.status(201).json({ success: true, data: { plan } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;