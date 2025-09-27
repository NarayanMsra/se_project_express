const router = require("express").Router();

const userRouter = require("./users");

router.use("/users", userRouter);

// router.use((req, res) => {
//   res.status(404).send({ message: "Welcome! Requested resource not found" });
// });

module.exports = router;
