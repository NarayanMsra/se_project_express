const router = require("express").Router();
const { NOT_FOUND_STATUS_CODE } = require("../utils/errors");
const clothingItem = require("./clothingItems");

const notFoundStatusCode = NOT_FOUND_STATUS_CODE;
const { getUsers, createUser, getUser } = require("../controllers/users");

router.use("/items", clothingItem);

// User routes
router.get("/users", getUsers);
router.post("/users", createUser);
router.get("/users/:userId", getUser);

router.use((req, res) => {
  res.status(notFoundStatusCode).send({ message: "Route not found" });
});

module.exports = router;
