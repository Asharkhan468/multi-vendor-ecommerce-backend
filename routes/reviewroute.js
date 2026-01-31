const express = require("express");
const router = express.Router();
const { addReview , getReviews} = require("../controllers/reviewController");
const auth = require("../middleware/auth");

router.post("/products/:id/review", auth, addReview);
router.get("/product/:id/reviews", getReviews);


module.exports = router;
