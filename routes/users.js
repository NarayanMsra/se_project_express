const router = require("express").Router();
const auth = require("../middlewares/auth");
const {
  getCurrentUser,
  getUser,
  updateUser,
  login,
  logout,
} = require("../controllers/users");

router.get("/me", auth, getUser); // GET /users/
router.post("/me", getCurrentUser); // POST /users/me

router.get("/:userId", getUser); // GET /users/:userId
router.patch("/me", updateUser); // PATCH /users/me
router.post("/login", login); // POST /users/login
router.post("/logout", logout); // POST /users/logout

module.exports = router;
