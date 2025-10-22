const express = require("express");
const mongoose = require("mongoose");
const mainRouter = require("./routes/index");
const { login, getCurrentUser } = require("./controllers/users");
const auth = require("./middlewares/auth");

const app = express();
const { PORT = 3001 } = process.env;
const cors = require("cors");

//Auth routes
app.post("/signin", login);
app.post("/signup", getCurrentUser);
app.use("/items", require("./routes/clothingItems"));

app.use(auth); //Auth middleware

app.use("/", mainRouter); // main Routes

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.error("Connected to MongoDB");
  })
  .catch(console.error);

app.use(express.json());

app.use(cors());
app.listen(PORT, () => {
  console.error(`Server is running on port ${PORT}`);
});
