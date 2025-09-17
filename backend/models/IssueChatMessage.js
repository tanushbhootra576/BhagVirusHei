const mongoose = require('mongoose');

const issueChatMessageSchema = new mongoose.Schema({
  issue: { type: mongoose.Schema.Types.ObjectId, ref: 'Issue', required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true, trim: true, maxlength: 2000 },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

issueChatMessageSchema.index({ issue: 1, createdAt: -1 });

module.exports = mongoose.model('IssueChatMessage', issueChatMessageSchema);
