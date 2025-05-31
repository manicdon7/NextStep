const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    default: () => uuidv4().replace(/-/g, '').substring(0, 8),
    unique: true,
  },
  name: {
    type: String,
    required: false, // Optional
    trim: true,
  },
  role: { type: String, enum: ['user', 'admin'], default: 'user', required:false },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
  },
  title: {
    type: String,
    required: false, // Optional
    trim: true,
  },
  location: {
    type: String,
    required: false, // Optional
    trim: true,
  },
  phone: {
    type: String,
    required: false, // Optional
    trim: true,
  },
  bio: {
    type: String,
    required: false, // Optional
    trim: true,
  },
  skills: {
    type: [String],
    required: false, // Optional
    default: [],
  },
  experience: [
    {
      title: {
        type: String,
        required: false, // Optional
        trim: true,
      },
      company: {
        type: String,
        required: false, // Optional
        trim: true,
      },
      period: {
        type: String,
        required: false, // Optional
        trim: true,
      },
      description: {
        type: String,
        required: false, // Optional
        trim: true,
      },
    },
  ],
  education: [
    {
      degree: {
        type: String,
        required: false, // Optional
        trim: true,
      },
      school: {
        type: String,
        required: false, // Optional
        trim: true,
      },
      period: {
        type: String,
        required: false, // Optional
        trim: true,
      },
    },
  ],
  certifications: {
    type: [String],
    required: false, // Optional
    default: [],
  },
  socialLinks: {
    github: {
      type: String,
      required: false, // Optional
      trim: true,
      default: '',
    },
    linkedin: {
      type: String,
      required: false, // Optional
      trim: true,
      default: '',
    },
    portfolio: {
      type: String,
      required: false, // Optional
      trim: true,
      default: '',
    },
  },
  learningStreaks: {
    type: Date,
    required: false, // Optional
    default: Date.now,
  },
});

module.exports = mongoose.model('User', userSchema);