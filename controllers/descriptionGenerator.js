require("dotenv").config();
const fs = require("fs");

const imageToTextController = async (req, res) => {
  try {
    if (!req.file || !req.file.path) {
      return res.status(400).json({ error: "Image upload failed" });
    }

    const imagePath = req.file.path;

    // Native FormData (Node 22)
    const formData = new FormData();
    formData.append(
      "file",
      fs.createReadStream(imagePath)
    );

    const response = await fetch("http://127.0.0.1:8000/upload-image", {
      method: "POST",
      body: formData, // headers ki zarurat nahi
    });

    if (!response.ok) {
      throw new Error(`FastAPI error: ${response.status}`);
    }

    const data = await response.json();

    // temp file delete
    fs.unlinkSync(imagePath);

    return res.status(200).json({
      success: true,
      title: data.title,
      description: data.description,
    });

  } catch (error) {
    console.error("AI API Error:", error.message);
    return res.status(500).json({ error: error.message });
  }
};

module.exports = { imageToTextController };
