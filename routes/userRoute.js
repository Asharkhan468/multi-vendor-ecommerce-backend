const express = require("express");
const { getAllUsers, getAllVendors } = require("../controllers/userController");

const router = express.Router();

router.get("/users", getAllUsers);
router.get("/vendors", getAllVendors);

module.exports = router;
