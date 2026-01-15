const express = require("express");
const parser = require("../config/multer.js");
const { imageToText } = require("../controllers/descriptionGenerator.js");

const router = express.Router();

router.post("/imageToText", parser.single("image"), imageToText);

module.exports = router;
