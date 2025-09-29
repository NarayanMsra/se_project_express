const router = require("express").Router();
const {
  createItem,
  getItems,
  updateItem,
  deleteItem,
} = require("../controllers/clothingItems");

//CRUD

//create
router.post("/", createItem);

//read
router.get("/", getItems);

//update
router.patch("/:itemId", updateItem);

//delete
router.delete("/:itemId", deleteItem);

module.exports = router;
