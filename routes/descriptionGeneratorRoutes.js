// routes/descriptionRoutes.js
const express = require("express");
const parser = require("../config/multer");
const { imageToTextController } = require("../controllers/descriptionGenerator");

const router = express.Router();

// Single image upload, field name: "image"
router.post("/imageToText", parser.single("image"), imageToTextController);

module.exports = router;
