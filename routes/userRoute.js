const express = require("express");
const {
  getAllUsers,
  getAllVendors,
} = require("../controllers/userController");

const router = express.Router();

router.get("/users", getAllUsers);      // Customers
router.get("/vendors", getAllVendors);  // Vendors

module.exports = router;
