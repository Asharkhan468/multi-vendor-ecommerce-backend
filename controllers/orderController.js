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
      vendor,
      orderDate,
    } = req.body;

    // basic validation
    if (!customer || !products || products.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Customer and products are required",
      });
    }

    const productsWithVendor = await Promise.all(
      products.map(async (p) => {
        const product = await Product.findById(p._id); // ya p.productId agar aap frontend se ye bhej rahe hain
        if (!product) throw new Error("Product not found");

        return {
          productId: product._id,
          title: product.title,
          price: product.price,
          quantity: p.quantity, // frontend se quantity bhejna
          vendor: product.createdBy, // vendor id set ho gaya
        };
      })
    );

    const order = await Order.create({
      customer,
      products: productsWithVendor,
      paymentMethod,
      shippingAmount,
      totalAmount,
      orderDate,
      user: req.user._id,
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

// const getSellerOrders = async (vendorId) => {
//   try {
//     const orders = await Order.find({
//       "products.vendor": mongoose.Types.ObjectId(vendorId),
//     }).populate("products.productId"); // optional, to get full product info

//     // Now filter each order to include only the vendor's products
//     const filteredOrders = orders.map((order) => {
//       const vendorProducts = order.products.filter(
//         (p) => p.vendor.toString() === vendorId
//       );
//       return {
//         ...order.toObject(),
//         products: vendorProducts,
//       };
//     });

//     return filteredOrders;
//   } catch (error) {
//     console.error(error);
//     return [];
//   }
// };

const getSellerOrders = async (req, res) => {
  try {
    const vendorId = req.user._id;

    const orders = await Order.find({
      "products.vendor": vendorId,
    }).populate("products.productId");

    const filteredOrders = orders.map((order) => {
      const vendorProducts = order.products.filter(
        (p) => p.vendor.toString() === vendorId.toString()
      );
      return {
        ...order.toObject(),
        products: vendorProducts,
      };
    });

    res.status(200).json({
      success: true,
      orders: filteredOrders,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


module.exports = {
  createOrder,
  getSellerOrders,
};
