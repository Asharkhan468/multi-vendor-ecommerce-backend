const Order = require("../models/Order");

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

module.exports = {
  createOrder,
};
