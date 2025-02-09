const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    default: () => uuidv4().replace(/-/g, '').substring(0, 8),
    unique: true,
  },
  name: { type: String },
  email: { type: String, required: true, unique: true },
  password:{type: String, required: true, unique: true},
  badgeLevel: { type: String},
  skills: { type: [String], default: [] },
  github: { type: String, default: "" },
  socialLinks: { type: [String], default: [] },
  bio: { type: String, default: "" },
  learningStreaks: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", userSchema);
