const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    customer: {
      fullName: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
    },

    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        title: String,
        price: Number,
        quantity: Number,
      },
    ],

    paymentMethod: {
      type: String,
      enum: ["cod"],
      required: true,
    },

    shippingAmount: {
      type: Number,
      required: true,
    },

    totalAmount: {
      type: Number,
      required: true,
    },

    orderDate: {
      type: Date,
      default: Date.now,
    },

    status: {
      type: String,
      default: "pending",
    },
     user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", 
  },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
