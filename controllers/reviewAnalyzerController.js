const Product = require("../models/Product");
const analyzeReviews = require("../utils/reviewAnalyzer");

exports.analyzeProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId).select("reviews");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (!product.reviews || product.reviews.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No reviews found for this product",
      });
    }

    const result = analyzeReviews(product.reviews);

    res.status(200).json({
      success: true,
      data: result,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Review analysis failed",
    });
  }
};
