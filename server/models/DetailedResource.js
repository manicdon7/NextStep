const mongoose = require('mongoose');

const detailedResourceSchema = new mongoose.Schema({
  domain: { type: String, required: true },
  level: { type: String, required: true },
  type: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  url: { type: String, required: true },
  estimatedTime: { type: String, required: true },
  resourceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Resource', required: true },
  unlockRequirement: { type: mongoose.Schema.Types.ObjectId, refPath: 'unlockModel' }, // Dynamic reference
  unlockModel: { type: String, enum: ['Resource', 'DetailedResource'], default: 'DetailedResource' },
});

module.exports = mongoose.model('DetailedResource', detailedResourceSchema);