const express = require("express");
const blockUser  = require("../controllers/accountBlock");
const auth = require("../middleware/auth");

const router = express.Router();

router.put("/blockUser/:userId", auth, blockUser);

module.exports = router;
