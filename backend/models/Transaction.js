const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  phoneNumber: { type: String, required: true },
  operator: { type: String, required: true },
  amount: { type: Number, required: true },
  planType: { type: String },
  status: { type: String, enum: ['pending', 'success', 'failed'], default: 'success' },
  transactionId: { type: String, unique: true, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);