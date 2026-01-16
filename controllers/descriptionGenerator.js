const dotenv = require("dotenv");
dotenv.config();

const imageToTextController = async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ success: false, error: "Image is required" });

    const imageUrl = req.file.path || req.file.url;
    if (!imageUrl)
      return res.status(400).json({ success: false, error: "Cloudinary URL not found" });

    const response = await fetch(
      "https://api-inference.huggingface.co/models/Salesforce/blip-image-captioning-base",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: imageUrl,
          options: { wait_for_model: true },
        }),
      }
    );

    // If Hugging Face returns a non-JSON response, catch it
    let data;
    try {
      data = await response.json();
    } catch {
      const text = await response.text();
      return res.status(response.status).json({
        success: false,
        error: text,
      });
    }

    console.log("HF Response:", data);

    if (data.error) {
      return res.status(503).json({
        success: false,
        message: data.error,
        wait: data.estimated_time || 10,
      });
    }

    return res.status(200).json({
      success: true,
      caption: data[0]?.generated_text || "No caption generated",
      imageUrl,
    });
  } catch (err) {
    console.error("HF ERROR:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = { imageToTextController };
