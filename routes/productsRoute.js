const express = require("express");
const router = express.Router();
const {
  createProduct,
  getVendorProducts,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const parser = require("../config/multer");
const auth = require("../middleware/auth");

// Routes
router.post("/", auth, parser.single("image"), createProduct);
router.get("/", getAllProducts);
router.get("/vendorProducts", auth, getVendorProducts);
router.put("/:id", auth, parser.single("image"), updateProduct);
router.delete("/:id", auth, deleteProduct);

module.exports = router;
