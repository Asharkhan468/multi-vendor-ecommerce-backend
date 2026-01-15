const express = require("express");
const multer = require("multer");
const { imageToText } = require("../controllers/descriptionGenerator"); 

const router = express.Router();
const upload = multer({ dest: "images/" });

router.post("/imageToText", upload.single("image"), imageToText);

module.exports = router;
