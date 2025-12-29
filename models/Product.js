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

    profilePhoto: {
      type: String,
      default:
        "https://firebasestorage.googleapis.com/v0/b/image-to-url-converter-9483c.appspot.com/o/test%40gmail.com%20%2B%201767014856794?alt=media&token=6337cf43-7e51-44cb-a5a9-05e9706afe1f",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
