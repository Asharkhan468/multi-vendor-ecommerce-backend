const express = require("express");
const router = express.Router();
const {
  analyzeProductReviews
} = require("../controllers/reviewAnalyzerController");

// AI Review Analyzer
router.get("/analyze/:productId", analyzeProductReviews);

module.exports = router;
