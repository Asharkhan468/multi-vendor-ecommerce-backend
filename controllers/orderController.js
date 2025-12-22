// const Order = require("../models/Order");
// const Product = require("../models/Product");
// const mongoose = require("mongoose");

// const createOrder = async (req, res) => {
//   try {
//     const {
//       customer,
//       products,
//       paymentMethod,
//       shippingAmount,
//       totalAmount,
//       vendor,
//       orderDate,
//     } = req.body;

//     // basic validation
//     if (!customer || !products || products.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: "Customer and products are required",
//       });
//     }

//     const productsWithVendor = await Promise.all(
//       products.map(async (p) => {
//         if (!p.productId) throw new Error("ProductId is missing");

//         const product = await Product.findById(p.productId);

//         if (!product) throw new Error(`Product not found: ${p.productId}`);

//         return {
//           productId: product._id,
//           title: product.title,
//           price: product.price,
//           quantity: p.quantity || 1,
//           vendor: product.createdBy,
//         };
//       })
//     );

//     const order = await Order.create({
//       customer,
//       products: productsWithVendor,
//       paymentMethod,
//       shippingAmount,
//       totalAmount,
//       orderDate,
//       user: req.user._id,
//     });

//     res.status(201).json({
//       success: true,
//       message: "Order created successfully",
//       order,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Order not created",
//       error: error.message,
//     });
//   }
// };

// const getSellerOrders = async (req, res) => {
//   try {
//     const vendorId = req.user._id;

//     const orders = await Order.find({
//       "products.vendor": vendorId,
//     }).populate("products.productId");

//     const filteredOrders = orders.map((order) => {
//       const vendorProducts = order.products.filter(
//         (p) => p.vendor.toString() === vendorId.toString()
//       );
//       return {
//         ...order.toObject(),
//         products: vendorProducts,
//       };
//     });

//     res.status(200).json({
//       success: true,
//       orders: filteredOrders,
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// module.exports = {
//   createOrder,
//   getSellerOrders,
// };



const Order = require("../models/Order");
const Product = require("../models/Product");
const mongoose = require("mongoose");

// helper: unique order id
const generateOrderId = () => {
  return "ORD-" + Date.now() + "-" + Math.floor(1000 + Math.random() * 9000);
};

const createOrder = async (req, res) => {
  try {
    const {
      customer,
      products,
      paymentMethod,
      shippingAmount,
    } = req.body;

    if (!customer || !products || products.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Customer and products are required",
      });
    }

    // 🔹 Step 1: Fetch products & group by vendor
    const vendorMap = {};

    for (let p of products) {
      const product = await Product.findById(p.productId);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      const vendorId = product.createdBy.toString();

      if (!vendorMap[vendorId]) {
        vendorMap[vendorId] = [];
      }

      vendorMap[vendorId].push({
        productId: product._id,
        title: product.title,
        price: product.price,
        quantity: p.quantity || 1,
      });
    }

    // 🔹 Step 2: Create order per vendor
    const createdOrders = [];

    for (const vendorId in vendorMap) {
      const vendorProducts = vendorMap[vendorId];

      const totalAmount = vendorProducts.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
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


module.exports = {
  createOrder,
  getSellerOrders,
};