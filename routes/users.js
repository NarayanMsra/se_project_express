const router = require("express").Router();
const auth = require("../middlewares/auth");
const {
  createUser,
  updateUser,
  login,
  getUser,
} = require("../controllers/users");

// signup
router.post("/", createUser);

// Login
router.post("/login", login);

// Get current user info and auth
router.get("/me", auth, getUser);

// Update current user info and auth
router.patch("/me", auth, updateUser);

module.exports = router;
