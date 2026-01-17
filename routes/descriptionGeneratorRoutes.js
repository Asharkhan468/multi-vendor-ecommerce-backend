const express = require("express");
const parser = require("../config/multer");
const { imageCaptionController } = require("../controllers/descriptionGenerator");

const router = express.Router();

router.post(
  "/imageToText",
  parser.single("image"),
  imageCaptionController
);

module.exports = router;
