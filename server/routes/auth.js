const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const sendEmail = require("../utils/SendEmail");
const { registrationEmailTemplate } = require("../utils/templates");
const router = express.Router();
require("dotenv").config();

const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({ name, email, password: hashedPassword });
    await user.save();

    const subject = "Welcome to Next-Step!";
    const html = registrationEmailTemplate(name);
    await sendEmail(email, subject, html);

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      },
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    // console.log(user);

    const isMatch = await bcrypt.compare(password, user.password);
    // console.log(isMatch);
    
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user);  
    // console.log(token);

    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      },
      token,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
});

module.exports = router;