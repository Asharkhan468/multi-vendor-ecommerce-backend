const express = require("express");
const multer = require("multer");
const parser = require("../config/multer");
const { imageToText } = require("../controllers/descriptionGenerator"); 


const router = express.Router();

router.post("/imageToText", parser.single("image"), imageToText);

module.exports = router;

