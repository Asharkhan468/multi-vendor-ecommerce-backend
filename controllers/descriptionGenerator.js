const dotenv = require("dotenv");
dotenv.config();

// Controller function
const imageToTextController = async (req, res) => {
  try {
    if (!req.file)
      return res
        .status(400)
        .json({ success: false, error: "Image is required" });

    // Cloudinary URL of uploaded image
    const imageUrl = req.file.path || req.file.url;
    if (!imageUrl)
      return res
        .status(400)
        .json({ success: false, error: "Cloudinary URL not found" });

    // Hugging Face Router API call
    const response = await fetch("https://router.huggingface.co/inference", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.HF_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "Salesforce/blip-image-captioning-base",
        inputs: imageUrl,
        options: { wait_for_model: true },
      }),
    });

    const data = await response.json();
    console.log("HF Router Response:", data);

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
    return res
      .status(500)
      .json({ success: false, error:err });
  }
};

module.exports = { imageToTextController };
