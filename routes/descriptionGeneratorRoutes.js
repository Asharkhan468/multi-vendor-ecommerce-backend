// // routes/descriptionRoutes.js
// const express = require("express");
// const parser = require("../config/multer"); // Cloudinary Multer setup
// const { imageToTextController } = require("../controllers/descriptionGenerator");

// const router = express.Router();

// // POST /api/imageToText
// router.post("/imageToText", parser.single("image"), imageToTextController);

// module.exports = router;

const express = require("express");
const multer = require("multer");
const parser = require("../config/multer"); // Cloudinary Multer setup

const {
  imageToTextController,
} = require("../controllers/descriptionGenerator");

const router = express.Router();



// POST /api/image-to-text
router.post("/image-to-text", parser.single("image"), imageToTextController);

module.exports= router
