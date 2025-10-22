const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");

const {
  OK_STATUS_CODE,
  CREATED_STATUS_CODE,
  BAD_REQUEST_STATUS_CODE,
  UNAUTHORIZED_STATUS_CODE,
  NOT_FOUND_STATUS_CODE,
  CONFLICT_STATUS_CODE,
  INTERNAL_SERVER_ERROR_STATUS_CODE,
} = require("../utils/errors");

const okStatusCode = OK_STATUS_CODE;
const createdStatusCode = CREATED_STATUS_CODE;
const badRequestStatusCode = BAD_REQUEST_STATUS_CODE;
const unauthorizedStatusCode = UNAUTHORIZED_STATUS_CODE;
const notFoundStatusCode = NOT_FOUND_STATUS_CODE;
const conflictStatusCode = CONFLICT_STATUS_CODE;
const internalServerStatusCode = INTERNAL_SERVER_ERROR_STATUS_CODE;

// GET /users
const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(okStatusCode).send(users))
    .catch((err) => {
      console.error(err);
      return res
        .status(internalServerStatusCode)
        .send({ message: "An error occurred while fetching users" });
    });
};

// POST /users(Signup)
const getCurrentUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  if (!name || !avatar || !email || !password) {
    return res
      .status(badRequestStatusCode)
      .send({ message: "All fields are required" });
  }

  //Hash the password before saving to the database
  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({ name, avatar, email, password: hash }))
    .then((user) => {
      const userData = user.toObject();
      delete userData.password;
      res.status(createdStatusCode).send(userData);
    })
    .catch((err) => {
      console.error(err);
      if (err.code === 11000) {
        //Duplicate key error
        return res
          .status(conflictStatusCode)
          .send({ message: "Email already exists" });
      }
      if (err.name === "ValidationError") {
        return res.status(badRequestStatusCode).send({ message: err.message });
      }
      return res
        .status(internalServerStatusCode)
        .send({ message: "An error occurred while creating user" });
    });
};

//Login controller to generate JWT
const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(badRequestStatusCode)
      .send({ message: "Email and password are required" });
  }

  User.findUserByCredentials(email, password)

    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch((err) => {
      console.error(err);
      return res
        .status(unauthorizedStatusCode)
        .send({ message: "Invalid email or password" });
    });
};

const logout = (req, res) => {
  return res.status(okStatusCode).send({ message: "Logged out successfully" });
};

// GET /users/:userId
const getUser = (req, res) => {
  const { userId } = req.user._id;

  User.findById(userId)
    .orFail()
    .then((user) => res.status(okStatusCode).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(notFoundStatusCode)
          .send({ message: "User not found" });
      }
      if (err.name === "CastError") {
        return res
          .status(badRequestStatusCode)
          .send({ message: "Invalid user ID" });
      }
      return res
        .status(internalServerStatusCode)
        .send({ message: "An error occurred while fetching user" });
    });
};

const updateUser = (req, res) => {
  const UserId = req.user._id;
  const { name, avatar } = req.body;

  User.findByIdAndUpdate(
    UserId,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .orFail()
    .then((updateUser) => res.status(okStatusCode).send(updateUser))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(notFoundStatusCode)
          .send({ message: "User not found" });
      }
      if (err.name === "ValidationError") {
        return res.status(badRequestStatusCode).send({ message: err.message });
      }
      return res
        .status(internalServerStatusCode)
        .send({ message: "An error occurred while updating user" });
    });
};

module.exports = {
  getUsers,
  getCurrentUser,
  login,
  logout,
  getUser,
  updateUser,
};
