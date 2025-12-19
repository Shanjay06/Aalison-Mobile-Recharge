const express = require('express');
const Transaction = require('../models/Transaction');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/recharge', auth, async (req, res) => {
  try {
    const { phoneNumber, operator, amount, planType } = req.body;
    const transactionId = 'TXN' + Date.now();
    
    const transaction = await Transaction.create({
      userId: req.user._id,
      phoneNumber,
      operator,
      amount,
      planType,
      transactionId,
      status: 'success'
    });

    res.status(201).json({
      success: true,
      message: 'Recharge successful',
      data: { transaction }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/history/:userId', auth, async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json({ success: true, data: { transactions } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;