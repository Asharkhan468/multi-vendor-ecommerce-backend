const fetch = require("node-fetch");

const imageToTextController = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Image is required" });
    }

    // Convert image buffer → base64
    const base64Image = req.file.buffer.toString("base64");

    const response = await fetch(
      "https://devashar235-image-caption-generator.hf.space/run/predict",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: [
            `data:${req.file.mimetype};base64,${base64Image}`
          ]
        }),
      }
    );

    const result = await response.json();

    // Gradio response format
    res.status(200).json({
      caption: result.data[0],
    });

  } catch (error) {
    console.error("Gradio call error:", error);
    res.status(500).json({ error: "Image caption failed" });
  }
};

module.exports = { imageToTextController };
