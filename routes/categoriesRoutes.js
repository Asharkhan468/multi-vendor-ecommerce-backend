const express = require("express");
const router = express.Router();

const {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoriesController");

// Create
router.post("/create", createCategory);

// Get All
router.get("/all", getAllCategories);

// Update
router.put("/update/:id", updateCategory);

// Delete
router.delete("/delete/:id", deleteCategory);

module.exports = router;
