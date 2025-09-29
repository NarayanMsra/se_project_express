const router = require("express").Router();
const clothingItem = require("./clothingItems");

const { getUsers, createUser, getUser } = require("../controllers/users");

router.use("/items", clothingItem);

// User routes
router.get("/users", getUsers);
router.post("/users", createUser);
router.get("/users/:userId", getUser);

router.use((req, res) => {
  res.status(404).send({ message: "Route not found" });
});

module.exports = router;
