const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const adminRoutes = require('./routes/admin');
const resourceRoutes = require('./routes/resources');
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
const port = process.env.PORT || 5000;
const dbURI = process.env.MONGODBURI;

mongoose
  .connect(dbURI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err.message));

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");

app.use("/api/auth", authRoutes);
app.use("/api", userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', resourceRoutes);


app.get("/", (req, res) => {
  const serverStatus = {
    status: "Server is running smoothly 🚀",
    uptime: process.uptime(),
    timestamp: new Date().toLocaleString(),
    message: "Welcome to the NEXT-STEP career guidance Platform API 🎉",
  };

  res.status(200).json(serverStatus);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});