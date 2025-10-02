const express = require("express");
const mongoose = require("mongoose");
const mainRouter = require("./routes/index");

const app = express();
const { PORT = 3001 } = process.env;

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.error("Connected to MongoDB");
  })
  .catch(console.error);

app.use(express.json());

// Temporary auth middleware (test user)
app.use((req, res, next) => {
  req.user = { _id: "652c2ae2f5f2a2eabc123456" }; // Example user ID
  next();
});

// Routes
app.use("/", mainRouter);

app.listen(PORT, () => {
  console.error(`Server is running on port ${PORT}`);
});
