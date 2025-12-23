const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const parser = require("../config/multer");
const auth = require("../middleware/auth");

// Routes
router.post("/", auth, parser.single("image"), productController.createProduct);
router.get("/", auth, productController.getAllProducts);
router.put("/:id", auth, parser.single("image"), productController.updateProduct);
router.delete("/:id", auth , productController.deleteProduct);

module.exports = router;
