const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      required: [true, "Title is required"],
      type: String,
    },
    description: {
      required: [true, "Description is required"],
      type: String,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
    },
    image: {
      url: { type: String, required: true },
      public_id: { type: String, required: true },
    },
    stock: {
      type: Number,
      required: [true, "Stock is required"],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
