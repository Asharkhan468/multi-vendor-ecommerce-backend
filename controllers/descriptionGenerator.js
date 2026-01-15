const imageToTextController = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "Image is required" });

    // Cloudinary URL
    const imageUrl = req.file.path || req.file.url;

    const response = await fetch(
      "https://router.huggingface.co/models/Salesforce/blip-image-captioning-base",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs: imageUrl }),
      }
    );

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
    });
  } catch (err) {
    console.error("HF ERROR:", err);
    return res.status(500).json({ error: "AI processing failed" });
  }
};

module.exports = { imageToTextController };
