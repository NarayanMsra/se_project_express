const {
  OK_STATUS_CODE,
  CREATED_STATUS_CODE,
  BAD_REQUEST_STATUS_CODE,
  NOT_FOUND_STATUS_CODE,
  INTERNAL_SERVER_ERROR_STATUS_CODE,
} = require("../utils/errors");

const okStatusCode = OK_STATUS_CODE;
const createdStatusCode = CREATED_STATUS_CODE;
const badRequestStatusCode = BAD_REQUEST_STATUS_CODE;
const notFoundStatusCode = NOT_FOUND_STATUS_CODE;
const internalServerStatusCode = INTERNAL_SERVER_ERROR_STATUS_CODE;

const ClothingItem = require("../models/clothingItem");

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => res.status(createdStatusCode).send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(badRequestStatusCode).send({ message: err.message });
      }
      return res
        .status(internalServerStatusCode)
        .send({ message: "An error occurred while creating item" });
    });
};

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.status(okStatusCode).send(items))
    .catch((err) => {
      console.error(err);
      return res
        .status(internalServerStatusCode)
        .send({ message: "An error occurred while fetching items" });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findByIdAndDelete(itemId)
    .orFail()
    .then((item) => res.status(okStatusCode).send({ data: item }))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(notFoundStatusCode)
          .send({ message: "Item not found" });
      }
      if (err.name === "CastError") {
        return res
          .status(badRequestStatusCode)
          .send({ message: "Invalid item ID" });
      }
      return res
        .status(internalServerStatusCode)
        .send({ message: "An error occurred while deleting item" });
    });
};

const likeItem = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => res.status(okStatusCode).send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(notFoundStatusCode)
          .send({ message: "Item not found" });
      }
      if (err.name === "CastError") {
        return res
          .status(badRequestStatusCode)
          .send({ message: "Invalid item ID" });
      }
      return res
        .status(internalServerStatusCode)
        .send({ message: "An error occurred while liking item" });
    });
};

const dislikeItem = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => res.status(okStatusCode).send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(notFoundStatusCode)
          .send({ message: "Item not found" });
      }
      if (err.name === "CastError") {
        return res
          .status(badRequestStatusCode)
          .send({ message: "Invalid item ID" });
      }
      return res
        .status(internalServerStatusCode)
        .send({ message: "An error occurred while disliking item" });
    });
};

module.exports = { createItem, getItems, deleteItem, likeItem, dislikeItem };
