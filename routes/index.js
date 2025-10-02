const router = require("express").Router();
const { NOT_FOUND_STATUS_CODE } = require("../utils/errors");

const clothingItem = require("./clothingItems");
const user = require("./users");

const notFoundStatusCode = NOT_FOUND_STATUS_CODE;

router.use("/items", clothingItem);
router.use("/users", user);

// Catch-all for undefined routes
router.use((req, res) => {
  res.status(notFoundStatusCode).send({ message: "Route not found" });
});

module.exports = router;
