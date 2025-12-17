const Order = require("../models/Order");
const Product = require("../models/Product");

const createOrder = async (req, res) => {
  try {
    const {
      customer,
      products,
      paymentMethod,
      shippingAmount,
      totalAmount,
      orderDate,
    } = req.body;

    // basic validation
    if (!customer || !products || products.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Customer and products are required",
      });
    }

    const order = await Order.create({
      customer,
      products,
      paymentMethod,
      shippingAmount,
      totalAmount,
      orderDate,
      user:req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Order not created",
      error: error.message,
    });
  }
};



const getSellerOrders = async (req, res) => {
  try {
    // find all orders
    const orders = await Order.find()
      .populate({
        path: "products.productId",
        model: "Product",
        match: { createdBy: req.user._id }, // only seller's products
      })
      .populate("customer"); // optional: populate customer details

    // remove orders that have no products of this seller
    const sellerOrders = orders.filter(
      (order) => order.products.length > 0
    );

    res.status(200).json({
      success: true,
      orders: sellerOrders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
};


module.exports = {
  createOrder,
  getSellerOrders,
};
