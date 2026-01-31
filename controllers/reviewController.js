const Product = require("../models/Product");

exports.addReview = async (req, res) => {
  const { id } = req.params; 
  const { comment, rating } = req.body; 

  try {
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const review = {
      userName: req.user.name, 
      userPhoto: req.user.photo, 
      rating,
      comment,
    };

    product.reviews.push(review); 
    await product.save();

    res.status(200).json({ message: "Review added successfully", review });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getReviews = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    res.status(200).json({ reviews: product.reviews });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
