const Product = require("../models/Product");

// Add review controller
exports.addReview = async (req, res) => {
  const { id } = req.params;       // Product ID
  const { comment, rating } = req.body;  // User input

  try {
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const review = {
      userName: req.user.name,      // Current logged-in user
      userPhoto: req.user.photo,    // Current user photo
      rating,
      comment
    };

    product.reviews.push(review);   // Add review
    await product.save();

    res.status(200).json({ message: "Review added successfully", review });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
