const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const logSchema = new mongoose.Schema({
  logId: {
    type: String,
    default: () => uuidv4().replace(/-/g, '').substring(0, 8),
    unique: true,
  },
  action: { type: String, required: true },
  description: { type: String, required: true },
  userId: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Logs", logSchema);
