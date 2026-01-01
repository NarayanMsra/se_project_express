const router = require("express").Router();
const { NOT_FOUND_STATUS_CODE } = require("../utils/errors");
const { createUser, login } = require("../controllers/users");

const clothingItem = require("./clothingItems");
const user = require("./users");

const notFoundStatusCode = NOT_FOUND_STATUS_CODE;

// sign in // sign up
router.post("/signin", login); // POST /login
router.post("/signup", createUser); // POST /signup

// use auth midlleware for all routes below
router.use("/items", clothingItem);
router.use("/users", user);

// Catch-all for undefined routes
router.use((req, res) => {
  res.status(notFoundStatusCode).send({ message: "Route not found" });
});

module.exports = router;
