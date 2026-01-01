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

// POST /users(Signup)
const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  if (!name || !avatar || !email || !password) {
    return res
      .status(badRequestStatusCode)
      .send({ message: "All fields are required" });
  }
  // Hash the password before saving to the database

  return bcrypt
    .hash(password, 10)
    .then((hash) => User.create({ name, avatar, email, password: hash }))
    .then((user) => {
      const userData = user.toObject();
      delete userData.password;
      return res.status(createdStatusCode).send(userData);
    })
    .catch((err) => {
      console.error(err);
      if (err.code === 11000) {
        // Duplicate key error
        return res
          .status(conflictStatusCode)
          .send({ message: "Email already exists" });
      }
      if (err.name === "ValidationError") {
        return res
          .status(badRequestStatusCode)
          .send({ message: "Invalid data" });
      }
      return res
        .status(internalServerStatusCode)
        .send({ message: "Server error" });
    });
};

// Login controller to generate JWT
const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(badRequestStatusCode)
      .send({ message: "Email and password are required" });
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      return res.status(okStatusCode).send({ token });
    })
    .catch((err) => {
      console.error(err);
      if (err.message === "Incorrect email or password") {
        return res
          .status(unauthorizedStatusCode)
          .send({ message: "Incorrect email or password" });
      }
      return res
        .status(internalServerStatusCode)
        .send({ message: "An error occurred during login" });
    });
};

const logout = (req, res) =>
  res.status(okStatusCode).send({ message: "Logged out successfully" });

// GET /users/:_id
const getUser = (req, res) => {
  const { _id } = req.user;

  User.findById(_id)
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
  const { _id } = req.user;
  const { name, avatar } = req.body;

  User.findByIdAndUpdate(
    _id,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .orFail()
    .then((updated) => res.status(okStatusCode).send(updated))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(notFoundStatusCode)
          .send({ message: "User not found" });
      }
      if (err.name === "ValidationError") {
        return res
          .status(badRequestStatusCode)
          .send({ message: "Invalid input data" });
      }
      return res
        .status(internalServerStatusCode)
        .send({ message: "An error occurred while updating user" });
    });
};

module.exports = {
  createUser,
  login,
  logout,
  getUser,
  updateUser,
};
