const express = require("express");
const router = express.Router();
const {
  createOrder,
  getSellerOrders,
  updateOrderStatus,
  getAllOrders,
  getUserOrders,
} = require("../controllers/orderController");
const auth = require("../middleware/auth");

// Create Order
router.post("/create", auth, createOrder);

router.get("/seller", auth, getSellerOrders);

router.get("/getCurrentUser", auth, getUserOrders);

router.get("/allOrders", auth, getAllOrders);

router.put("/updateStatus/:id", auth, updateOrderStatus);

module.exports = router;
