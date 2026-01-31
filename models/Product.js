const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  userPhoto: { type: String },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

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
    reviews: [reviewSchema],
  },
  { timestamps: true },
);

module.exports = mongoose.model("Product", productSchema);
