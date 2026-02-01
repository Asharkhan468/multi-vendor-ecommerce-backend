const Review = require("../models/Product");
const analyzeReviews = require("../utils/reviewAnalyzer");

exports.analyzeProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await Review.find({ productId });

    if (!reviews.length) {
      return res.status(404).json({ message: "No reviews found" });
    }

    const result = analyzeReviews(reviews);

    res.status(200).json({
      success: true,
      data: result
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Review analysis failed"
    });
  }
};
