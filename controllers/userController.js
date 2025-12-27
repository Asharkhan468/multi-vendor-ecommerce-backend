const User = require("../models/User");

// 🔹 Get All Customers (Users)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "customer" }).select("-password");

    res.status(200).json({
      success: true,
      totalUsers: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 🔹 Get All Vendors
exports.getAllVendors = async (req, res) => {
  try {
    const vendors = await User.find({ role: "vendor" }).select("-password");

    res.status(200).json({
      success: true,
      totalVendors: vendors.length,
      vendors,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
