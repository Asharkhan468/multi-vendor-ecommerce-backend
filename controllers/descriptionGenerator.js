require("dotenv").config();
const fs = require("fs");

const imageToTextController = async (req, res) => {
  try {
    if (!req.file || !req.file.path) {
      return res.status(400).json({ error: "Image upload failed" });
    }

    const imagePath = req.file.path;

    // 🔥 Read file as buffer
    const buffer = fs.readFileSync(imagePath);

    // 🔥 Buffer → Blob
    const blob = new Blob([buffer], { type: req.file.mimetype });

    // 🔥 Native FormData
    const formData = new FormData();
    formData.append("file", blob, req.file.originalname);

    const response = await fetch("http://127.0.0.1:8000/upload-image", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`FastAPI error: ${response.status}`);
    }

    const data = await response.json();

    fs.unlinkSync(imagePath);

    return res.status(200).json({
      success: true,
      title: data.title,
      description: data.description,
    });

  } catch (error) {
    console.error("Fetch Error:", error);
    return res.status(500).json({ error: error.message });
  }
};

module.exports = { imageToTextController };
