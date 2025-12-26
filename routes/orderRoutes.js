const express = require("express");
const router = express.Router();
const {
  createOrder,
  getSellerOrders,
  updateOrderStatus
} = require("../controllers/orderController");
const auth = require("../middleware/auth");

// Create Order
router.post("/create", auth, createOrder);

router.get("/seller", auth, getSellerOrders);

router.put("/updateStatus/:id" , auth , updateOrderStatus)

module.exports = router;
