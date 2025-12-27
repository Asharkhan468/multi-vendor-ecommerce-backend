const express = require("express");
const { getAllUsers, getAllVendors } = require("../controllers/userController");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/users", auth, getAllUsers);
router.get("/vendors", auth, getAllVendors);

module.exports = router;
