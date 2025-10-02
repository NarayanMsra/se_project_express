const router = require("express").Router();
const { getUsers, createUser, getUser } = require("../controllers/users");

router.get("/", getUsers); // GET /users
router.get("/:userId", getUser); // GET /users/:userId
router.post("/", createUser); // POST /users

module.exports = router;
