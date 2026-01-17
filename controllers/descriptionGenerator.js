const { Client } = require("@gradio/client");
const fetch = require("node-fetch");

const imageCaptionController = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Image is required" });
    }

    // Convert buffer → Blob
    const blob = new Blob([req.file.buffer], {
      type: req.file.mimetype,
    });

    // Connect to your HF Space
    const client = await Client.connect(
      "https://devashar235-image-caption-generator.hf.space/"
    );

    // Call FastAPI / Gradio endpoint
    const result = await client.predict("/generate_caption", {
      image: blob,
    });

    res.status(200).json({
      caption: result.data,
    });
  } catch (error) {
    console.error("HF Space Error:", error);
    res.status(500).json({ error: "Image caption generation failed" });
  }
};

module.exports = { imageCaptionController };
