// const express = require("express");
// const router = express.Router();
// const {
//   createProduct,
//   getVendorProducts,
//   updateProduct,
//   deleteProduct,
//   getAllProducts,
// } = require("../controllers/productController");
// const parser = require("../config/multer");
// const auth = require("../middleware/auth");

// // Routes
// router.post("/", auth, parser.single("image"), createProduct);
// router.get("/", getAllProducts);
// router.get("/vendorProducts", auth, getVendorProducts);
// router.put("/:id", auth, parser.single("image"), updateProduct);
// router.delete("/:id", auth, deleteProduct);

// module.exports = router;


// productsRoute.js - Test version
const express = require("express");
const router = express.Router();

// Test routes (imports ko hatao)
router.post("/", (req, res) => {
  res.json({ message: "POST /api/products working" });
});

router.get("/", (req, res) => {
  res.json({ message: "GET /api/products working" });
});

router.get("/vendorProducts", (req, res) => {
  res.json({ message: "GET /api/products/vendorProducts working" });
});

router.put("/:id", (req, res) => {
  res.json({ message: "PUT /api/products/:id working" });
});

router.delete("/:id", (req, res) => {
  res.json({ message: "DELETE /api/products/:id working" });
});

module.exports = router;