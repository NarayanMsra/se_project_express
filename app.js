require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const mainRouter = require("./routes/index");
const auth = require("./middlewares/auth");

const app = express();
const { PORT = 3001 } = process.env;

app.use(cors()); // CORS middleware
app.use(express.json()); // JSON bodies before routes

// Connect to MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then()
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Public routes
app.use("/", mainRouter); // includes /signin and /signup

app.use(auth); // Auth middleware (protects routes below)

// Protected routes
app.use("/users", require("./routes/users"));

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
