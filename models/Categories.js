const mongoose = require("mongoose");

const categoriesSchema = new mongoose.Schema(
  {
    name: {
      required: [true, "Category name is required"],
      type: String,
    },
    
  },
  { timestamps: true }
);

module.exports = mongoose.model("Categories", categoriesSchema);
