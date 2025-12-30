const express = require("express");
const { blockUser } = require("../controllers/accountBlock");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.put("/blockUser/:userId", protect, blockUser);

module.exports = router;
