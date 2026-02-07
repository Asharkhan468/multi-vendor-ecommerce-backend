const Order = require("../models/Order");
const Product = require("../models/Product");
const mongoose = require("mongoose");

const generateOrderId = () => {
  const randomNum = Math.floor(100 + Math.random() * 900);
  return `#ORD-${randomNum}`;
};

const createOrder = async (req, res) => {
  try {
    const { customer, products, paymentMethod, shippingAmount } = req.body;

    if (!customer || !products || products.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Customer and products are required",
      });
    }

    const vendorMap = {};

    // for (let p of products) {
    //   const product = await Product.findById(p.productId);

    //   if (!product) {
    //     return res.status(404).json({
    //       success: false,
    //       message: "Product not found",
    //     });
    //   }

    //   const vendorId = product.createdBy.toString();

    //   if (!vendorMap[vendorId]) {
    //     vendorMap[vendorId] = [];
    //   }

    //   vendorMap[vendorId].push({
    //     productId: product._id,
    //     title: product.title,
    //     price: product.price,
    //     quantity: p.quantity || 1,
    //   });
    // }

    // 🔹 Step 2: Create order per vendor

    for (let p of products) {
      const product = await Product.findOneAndUpdate(
        {
          _id: p.productId,
          stock: { $gte: quantity }, // stock check inside query
        },
        {
          $inc: { stock: -quantity }, // decrement stock
        },
        { new: true },
      );

      if (!product) {
        return res.status(400).json({
          success: false,
          message: "Product out of stock",
        });
      }
    }

    const createdOrders = [];

    for (const vendorId in vendorMap) {
      const vendorProducts = vendorMap[vendorId];

      const totalAmount = vendorProducts.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      );

      const order = await Order.create({
        orderId: generateOrderId(),
        user: req.user._id,
        vendor: vendorId,
        customer,
        products: vendorProducts,
        paymentMethod,
        shippingAmount,
        totalAmount: totalAmount + shippingAmount,
      });

      createdOrders.push(order);
    }

    res.status(201).json({
      success: true,
      message: "Orders created successfully",
      orders: createdOrders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getSellerOrders = async (req, res) => {
  try {
    const vendorId = req.user._id;

    const orders = await Order.find({ vendor: vendorId })
      .populate("products.productId")
      .populate("user", "fullName email");

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatus = ["Preparing", "Shipped", "Delivered"];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status",
      });
    }

    const order = await Order.findOneAndUpdate(
      {
        _id: id,
        vendor: req.user._id,
      },
      { status },
      { new: true },
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found or unauthorized",
      });
    }

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("products.productId")
      .populate("user", "fullName email");

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getUserOrders = async (req, res) => {
  try {
    const userId = req.user._id;

    const orders = await Order.find({ user: userId })
      .populate("products.productId")
      .populate("vendor", "fullName email");

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createOrder,
  getSellerOrders,
  updateOrderStatus,
  getAllOrders,
  getUserOrders,
};
