const mongoose = require('mongoose');

const userProgressSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // Email from localStorage
  completedSubResources: [{ type: mongoose.Schema.Types.ObjectId, ref: 'DetailedResource' }],
  completedResources: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Resource' }],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('UserProgress', userProgressSchema);