const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  domain: {
    type: String,
    required: true,
    enum: [
      'cs', 'data', 'pm', 'content', 'engineering', 'psychology', 'writing',
      'design', 'art', 'finance', 'science', 'teaching', 'entrepreneur',
      'journalism', 'architecture', 'gamedesign', 'math', 'anthropology',
      'crafts', 'philosophy',
    ],
  },
  level: {
    type: String,
    required: true,
    enum: ['beginner', 'intermediate', 'advanced'],
  },
  type: {
    type: String,
    required: true,
    enum: ['video', 'blog', 'pdf'],
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  estimatedTime: {
    type: String,
    required: true,
  },
  unlockRequirement: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resource',
    default: null,
  },
});

module.exports = mongoose.model('Resource', resourceSchema);