const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const parser = require("../config/multer");
const auth = require("../middleware/auth");

// Routes
router.post("/",  auth , parser.single("image"), productController.createProduct); // Create with image
router.get("/", auth,  productController.getAllProducts);                          // Get all
router.get("/:id", productController.getProductById);                       // Get single
router.put("/:id", parser.single("image"), productController.updateProduct);// Update with optional image
router.delete("/:id", productController.deleteProduct);                     // Delete

module.exports = router;
