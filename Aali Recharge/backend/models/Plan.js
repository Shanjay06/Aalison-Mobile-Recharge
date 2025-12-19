const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
  operator: { type: String, required: true },
  amount: { type: Number, required: true },
  validity: { type: String, required: true },
  data: { type: String, required: true },
  description: { type: String, required: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Plan', planSchema);